"use server";

import { prisma } from "@/lib/prisma";

export async function ActionAdminGetAllChatNews(take: number = 10) {
  try {
    const news = await prisma.chat_news.findMany({
      orderBy: { created_at: "desc" },
      take,
    });
    return { status: "ok", data: news };
  } catch (e: any) {
    return {
      status: "error",
      data: [],
      message: e?.message || "Ошибка получения",
    };
  }
}
