"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BCRYPT_ROUNDS = 12;

const Schema = z.object({
  password: z
    .string({ required_error: "Укажите пароль" })
    .min(8, "Пароль должен содержать не менее 8 символов")
    .max(255, "Пароль слишком длинный"),
});

async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function ActionUpdateUserPassword(
  password: string,
  userId: number,
) {
  try {
    const parsed = Schema.safeParse({ password });
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Неверные данные";
      return { status: "error", data: [], error: msg };
    }
    const { password: vPassword } = parsed.data;

    const passwordHash = await hashPassword(vPassword);

    const newUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
      } as any,
    });

    return {
      status: "ok",
      data: newUser,
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
