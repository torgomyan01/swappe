"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionUpdateUserBonus(
  type: "increment" | "decrement",
  amount: number,
  description: string,
  user_id?: number,
) {
  try {
    const session: any = await getServerSession(authOptions);

    const userId = user_id ? user_id : session.user.id;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        bonus: { [type]: amount },
        referral_request_count: { increment: 1 },
      },
    });

    await prisma.bouns_history.create({
      data: {
        order_id: crypto.randomUUID(),
        user_id: session.user.id,
        amount: amount,
        status: "success",
        description: description,
      },
    });

    // Обновляем session данные
    await updateUserSession(session.user.id, {
      bonus: updatedUser.bonus,
      balance: updatedUser.balance,
    });

    return {
      status: "ok",
      data: updatedUser,
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
