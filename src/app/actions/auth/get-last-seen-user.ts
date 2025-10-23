"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetLastSeenUser(user_id: number) {
  try {
    const user = await prisma.users.findUnique({
      where: { id: user_id },
      select: {
        last_seen: true,
      },
    });

    return {
      status: "ok",
      data: user,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: null,
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}
