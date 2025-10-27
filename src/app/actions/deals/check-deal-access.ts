"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

/**
 * Check if user can access/create deals
 * This validates subscription status and prevents free users from accessing deals
 */
export async function ActionCheckDealAccess() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: false, error: "Не авторизован" };
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        tariff: true,
        tariff_end_date: true,
      },
    });

    if (!user) {
      return { status: "error", data: false, error: "Пользователь не найден" };
    }

    // Check if user has active paid subscription
    const hasActiveSubscription =
      user.tariff &&
      user.tariff !== "free" &&
      user.tariff_end_date &&
      new Date(user.tariff_end_date) > new Date();

    return {
      status: "ok",
      data: hasActiveSubscription,
      error: null,
      message: hasActiveSubscription
        ? null
        : "Для работы со сделками необходимо активировать тарифный план",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: false,
      error: error.message || String(error),
    };
  }
}
