// app/actions/users/create-user.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCheckUserVerifyCode(
  code: number | string,
  email: string,
) {
  try {
    // 1) normalize
    const rawEmail = (email ?? "").toString();
    const vEmail = decodeURIComponent(rawEmail).trim().toLowerCase();

    const vCode =
      typeof code === "string" ? Number.parseInt(code, 10) : Number(code);

    if (!vEmail || !Number.isInteger(vCode)) {
      return {
        status: "error",
        data: [],
        error: "Некорректная ссылка или код.",
      };
    }

    // 2) գտնենք user-ը ըստ email + code
    const user = await prisma.users.findFirst({
      where: { email: vEmail, verification_code: vCode },
      select: { id: true, status: true },
    });

    if (!user) {
      return {
        status: "error",
        data: [],
        error: "Неверный или устаревший код подтверждения.",
      };
    }

    if (user.status === "verified") {
      return {
        status: "error",
        data: [],
        error: "Ваш e-mail уже подтверждён.",
      };
    }

    // 3) update ըստ unique id (խուսափում ենք updateMany-ից)
    const updated = await prisma.users.update({
      where: { id: user.id },
      data: {
        status: "verified",
        // ⬇ եթե verification_code սյունակը NULL թույլ է տալիս և ուզում ես մեկանգամյա դարձնել՝ բացիր սա
        // verification_code: null,
      } as any,
      select: { id: true, email: true, status: true },
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
