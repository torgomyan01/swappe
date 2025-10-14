"use server";

import { prisma } from "@/lib/prisma";

export async function ActionAdminGetAllArticles(take: number = 50) {
  try {
    const items = await prisma.articles.findMany({
      orderBy: { created_at: "desc" },
      take,
    });
    return { status: "ok", data: items } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: [],
      message: e?.message || "Не удалось получить статьи",
    } as const;
  }
}
