"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetArticle(id: number) {
  try {
    const items = await prisma.articles.findUnique({
      where: { id },
    });
    return { status: "ok", data: items } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: {},
      message: e?.message || "Не удалось получить статью",
    } as const;
  }
}
