"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetUserName(verificationId: string) {
  try {
    const User = await prisma.users.findFirst({
      where: { password_reset_token: verificationId },
      select: {
        id: true,
        name: true,
      },
    });

    if (User) {
      return {
        status: "ok",
        data: User,
        error: "",
      };
    } else {
      return {
        status: "error",
        data: [],
        error: "Произошла ошибка повторите чуть позже",
      };
    }
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
