import { prisma } from "@/lib/prisma";

/**
 * Check if user has active paid subscription
 * Returns true if user has a paid tariff and it hasn't expired
 */
export async function hasActivePaidSubscription(
  userId: number,
): Promise<boolean> {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        tariff: true,
        tariff_end_date: true,
      },
    });

    if (!user) return false;

    // User must have a paid tariff (not "free")
    const hasPaidTariff = user.tariff && user.tariff !== "free";

    // Check if subscription hasn't expired
    if (!user.tariff_end_date) return hasPaidTariff;

    const now = new Date();
    const isNotExpired = new Date(user.tariff_end_date) > now;

    return hasPaidTariff && isNotExpired;
  } catch (error) {
    console.error("Error checking user subscription:", error);
    return false;
  }
}
