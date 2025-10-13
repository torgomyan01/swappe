import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionCheckUserTarifStatus() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: false, error: "logout" };
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        tariff: true,
        tariff_end_date: true,
      },
    });

    if (!user) {
      return { status: "ok", data: false, error: null };
    }

    const now = new Date();
    const hasActivePaidTariff = user.tariff && user.tariff !== "free";
    const withinGracePeriod = user.tariff_end_date
      ? new Date(user.tariff_end_date) > now
      : false;

    const hasAccess = hasActivePaidTariff || withinGracePeriod;

    return { status: "ok", data: hasAccess, tariff: user.tariff, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: false, error: "internal_error" };
  }
}
