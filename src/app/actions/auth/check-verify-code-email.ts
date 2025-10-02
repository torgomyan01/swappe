// app/actions/users/create-user.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCheckUserVerifyCodeEmail(
  code: number | string,
  email: string,
  oldEmail: string,
) {
  try {
    const rawEmail = (email ?? "").toString();
    const vEmail = decodeURIComponent(rawEmail).trim().toLowerCase();
    const _oldEmail = decodeURIComponent(oldEmail).trim().toLowerCase();

    const vCode =
      typeof code === "string" ? Number.parseInt(code, 10) : Number(code);

    if (!vEmail || !Number.isInteger(vCode)) {
      return {
        status: "error",
        data: [],
        error: "Некорректная ссылка или код.",
      };
    }

    const user = await prisma.users.findFirst({
      where: { email: _oldEmail, verification_code: vCode },
      select: { id: true, status: true },
    });

    if (!user) {
      return {
        status: "error",
        data: [],
        error: "Неверный или устаревший код подтверждения.",
      };
    }

    const updated = await prisma.users.update({
      where: { id: user.id },
      data: {
        email: vEmail,
      } as any,
      select: { id: true, email: true },
    });

    return { status: "ok", data: updated, error: "" };
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
