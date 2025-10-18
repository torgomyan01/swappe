"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionGetUserBonus() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const bonusHistory = await prisma.bouns_history.findMany({
      where: { user_id: session.user.id },
      orderBy: { created_at: "desc" },
    });

    return {
      status: "ok",
      data: bonusHistory,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}

// Функция для обновления session данных
async function updateUserSession(userId: string, newData: any) {
  try {
    // В NextAuth session автоматически обновляется при следующем запросе
    // Но мы можем принудительно обновить кэш
    console.log("Updating session for user:", userId, "with data:", newData);

    // Здесь можно добавить дополнительную логику для обновления session
    // Например, через cookies или другие методы
  } catch (error) {
    console.error("Error updating user session:", error);
  }
}
