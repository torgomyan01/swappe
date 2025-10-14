"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetRandomArticles(
  take: number = 3,
  excludeId?: number,
) {
  try {
    // Fetch a reasonable pool and then sample randomly
    const poolSize = Math.max(take * 5, 20);
    const pool = await prisma.articles.findMany({
      where: excludeId ? { id: { not: excludeId } } : undefined,
      orderBy: { created_at: "desc" },
      take: poolSize,
    });
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const items = shuffled.slice(0, take);
    return { status: "ok", data: items } as const;
  } catch (e: any) {
    return {
      status: "error",
      message: e?.message || "Не удалось получить статьи",
    } as const;
  }
}
