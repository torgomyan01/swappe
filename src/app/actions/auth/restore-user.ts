"use server";

import { prisma } from "@/lib/prisma";

export async function ActionRestoreUserByEmail(email: string) {
  try {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      return {
        status: "error" as const,
        data: [],
        error: "Пользователь не найден",
      };
    }

    if (user.status !== "archive") {
      return { status: "ok" as const, data: user, error: "" };
    }

    const updated = await prisma.users.update({
      where: { id: user.id },
      data: { status: "verified" },
    });
    return { status: "ok" as const, data: updated, error: "" };
  } catch (e: any) {
    return {
      status: "error" as const,
      data: [],
      error: e?.message || "Не удалось восстановить аккаунт",
    };
  }
}
