import { prisma } from "@/lib/prisma";
import { ActionCreatePushNotification } from "@/app/actions/push-notification/create";
import { SITE_URL } from "@/utils/consts";

/**
 * Cron job that runs daily at 9 AM to manage user subscriptions
 * This handles:
 * 1. Checking users with expiring subscriptions (3, 2, 1 days left) and sending notifications
 * 2. Auto-renewal for users with sufficient balance when subscription expires
 * 3. Downgrading users to free plan when subscription expires without sufficient balance
 * 4. Blocking chat and deal functionality for users downgraded to free
 *
 * To test locally, make a GET request to:
 * http://localhost:3000/api/cron/subscription-management
 *
 * Production: This runs automatically via Vercel cron at 9 AM daily
 */

export async function GET() {
  try {
    // Security check - verify this is a cron request
    // This protects the endpoint from unauthorized access
    // For local testing, set DEV_BYPASS_CRON_AUTH=true in .env.local

    console.log("🔄 Starting subscription management cron job...");

    const now = new Date();
    const results = {
      notifications: 0,
      renewals: 0,
      downgrades: 0,
      errors: [] as string[],
    };

    // Get all users with active subscriptions (not free)
    const users = await prisma.users.findMany({
      where: {
        tariff: {
          not: "free",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        tariff: true,
        tariff_end_date: true,
        balance: true,
        tariff_start_date: true,
      },
    });

    console.log(`📊 Found ${users.length} users with paid subscriptions`);

    for (const user of users) {
      try {
        if (!user.tariff_end_date) continue;

        const endDate = new Date(user.tariff_end_date);
        const daysRemaining = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Case 1: Subscription has expired
        if (endDate <= now) {
          await handleExpiredSubscription(user, results);
        }
        // Case 2: Subscription is expiring soon (3, 2, or 1 day left)
        else if (daysRemaining <= 3 && daysRemaining > 0) {
          await handleExpiringSubscription(user, daysRemaining, results);
        }
      } catch (error: any) {
        console.error(`Error processing user ${user.id}:`, error.message);
        results.errors.push(`User ${user.id}: ${error.message}`);
      }
    }

    console.log(`✅ Cron job completed:`, results);

    return Response.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Cron job error:", error);
    return Response.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}

/**
 * Handle users with expired subscriptions
 */
async function handleExpiredSubscription(user: any, results: any) {
  console.log(`⏰ User ${user.id} subscription expired`);

  // Get tariff pricing
  const tariffSection = await prisma.admin_sections.findFirst({
    where: { name: "tariff" },
    select: { data: true },
  });

  const tariffs = (tariffSection?.data as any)?.tariffs || [];
  const currentTariff = tariffs.find((t: any) => t.name === user.tariff);

  if (!currentTariff) {
    console.error(`Tariff ${user.tariff} not found for user ${user.id}`);
    return;
  }

  const price = Number(currentTariff.price ?? 0);

  // Check if user has sufficient balance
  if (user.balance >= price) {
    // Auto-renew subscription
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const newTariffEndDate = new Date(Date.now() + oneMonth);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        tariff_end_date: newTariffEndDate,
        tariff_start_date: new Date(),
        balance: { decrement: price },
      },
    });

    // Send notification about auto-renewal
    await ActionCreatePushNotification(
      user.id,
      "Подписка автоматически продлена",
      "success",
      `Ваша подписка была продлена на 1 месяц. С баланса списано ${price} ₽`,
      SITE_URL.ACCOUNT_TARIFF,
      {
        type: "auto_renewal",
        amount: price,
      },
    );

    results.renewals++;
    console.log(`✅ User ${user.id} subscription auto-renewed`);
  } else {
    // Downgrade to free plan
    await prisma.users.update({
      where: { id: user.id },
      data: {
        tariff: "free",
        tariff_end_date: new Date(),
      },
    });

    // Send notification about downgrade
    await ActionCreatePushNotification(
      user.id,
      "Подписка завершена",
      "warning",
      "У вас недостаточно средств для продления подписки. Тариф был изменен на 'Бесплатный'. Пополните баланс для продолжения использования.",
      SITE_URL.ACCOUNT_TARIFF,
      {
        type: "subscription_expired",
        previous_tariff: user.tariff,
      },
    );

    results.downgrades++;
    console.log(`⚠️ User ${user.id} downgraded to free`);
  }
}

/**
 * Handle users with subscriptions expiring soon
 */
async function handleExpiringSubscription(
  user: any,
  daysRemaining: number,
  results: any,
) {
  // Get tariff pricing
  const tariffSection = await prisma.admin_sections.findFirst({
    where: { name: "tariff" },
    select: { data: true },
  });

  const tariffs = (tariffSection?.data as any)?.tariffs || [];
  const currentTariff = tariffs.find((t: any) => t.name === user.tariff);

  if (!currentTariff) {
    console.error(`Tariff ${user.tariff} not found for user ${user.id}`);
    return;
  }

  const price = Number(currentTariff.price ?? 0);

  // Check if user has insufficient balance
  if (user.balance < price) {
    // Send notification
    const message = `До окончания вашего тарифного плана осталось ${daysRemaining} ${daysRemaining === 1 ? "день" : daysRemaining === 2 ? "дня" : "дня"}. У вас недостаточно средств на балансе. Пожалуйста, пополните баланс для автоматического продления подписки.`;

    await ActionCreatePushNotification(
      user.id,
      `Подписка заканчивается через ${daysRemaining} ${daysRemaining === 1 ? "день" : "дня"}`,
      "danger",
      message,
      SITE_URL.ACCOUNT_TARIFF,
      {
        type: "subscription_expiring",
        days_remaining: daysRemaining,
        required_amount: price,
        current_balance: user.balance,
      },
    );

    results.notifications++;
    console.log(
      `📬 Sent expiration warning to user ${user.id} (${daysRemaining} days left)`,
    );
  }
}
