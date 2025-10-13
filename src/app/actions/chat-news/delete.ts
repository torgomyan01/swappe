"use server";

import { prisma } from "@/lib/prisma";

export async function ActionAdminDeleteChatNews(id: number) {
  try {
    if (!id) return { status: "error", message: "Не указан ID" } as const;
    await prisma.chat_news.delete({ where: { id } });
    return { status: "ok" } as const;
  } catch (e: any) {
    return {
      status: "error",
      message: e?.message || "Ошибка удаления",
    } as const;
  }
}
