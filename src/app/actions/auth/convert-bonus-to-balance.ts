"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionConvertBonusToBalance(amount: number) {
  try {
    if (!Number.isFinite(amount)) {
      return {
        status: "error",
        data: [],
        error: "Неверная сумма",
      } as const;
    }

    const roundedAmount = Math.floor(amount);
    if (roundedAmount <= 0) {
      return {
        status: "error",
        data: [],
        error: "Сумма должна быть больше 0",
      } as const;
    }

    const session: any = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { status: "error", data: [], error: "logout" } as const;
    }

    const userId = session.user.id as number;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: { id: userId },
        select: { bonus: true, balance: true },
      });

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      if (user.bonus < roundedAmount) {
        throw new Error("Недостаточно бонусов");
      }

      const result = await tx.users.update({
        where: { id: userId },
        data: {
          bonus: { decrement: roundedAmount },
          balance: { increment: roundedAmount },
        },
        select: { bonus: true, balance: true },
      });

      await tx.bouns_history.create({
        data: {
          order_id: crypto.randomUUID(),
          user_id: userId,
          amount: roundedAmount,
          status: "success",
          description: "Конвертация бонусов в баланс (1:1)",
        },
      });

      return result;
    });

    return { status: "ok", data: updatedUser, error: "" } as const;
  } catch (error: any) {
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Не удалось выполнить операцию. Повторите попытку позже";
    return { status: "error", data: [], error: message } as const;
  }
}
