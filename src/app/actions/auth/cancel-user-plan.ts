"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionCancelUserPlan() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: null, error: "logout" };
    }

    // Fetch user with company
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tariff: true,
        tariff_end_date: true,
      },
    });

    if (!user) {
      return { status: "error", data: null, error: "Пользователь не найден" };
    }

    if (user.tariff !== "free") {
      await prisma.users.update({
        where: { id: user.id },
        data: { tariff: "free" },
      });
    }

    return { status: "ok", data: { companyPlan: "free" }, error: null };
  } catch (error: any) {
    console.error("Error cancelling user plan:", error);
    return {
      status: "error",
      data: null,
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось отменить подписку",
    };
  }
}
