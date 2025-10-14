"use server";

import { prisma } from "@/lib/prisma";

export async function ActionAdminDeleteArticle(id: number) {
  try {
    await prisma.articles.delete({ where: { id } });
    return { status: "ok" } as const;
  } catch (e: any) {
    return {
      status: "error",
      message: e?.message || "Ошибка удаления статьи",
    } as const;
  }
}
