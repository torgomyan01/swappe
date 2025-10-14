"use server";

import { prisma } from "@/lib/prisma";

export async function ActionAdminUpdateArticle(input: {
  id: number;
  title: string;
  content: string;
  image: string;
}) {
  try {
    if (!input?.id)
      return { status: "error", message: "Не указан ID" } as const;
    const title = input.title?.trim();
    const content = input.content?.trim();
    const image = input.image?.trim();

    if (!title || title.length < 3) {
      return {
        status: "error",
        message: "Введите корректный заголовок",
      } as const;
    }
    if (!content || content.length < 3) {
      return { status: "error", message: "Введите содержимое статьи" } as const;
    }
    if (!image) {
      return {
        status: "error",
        message: "Укажите ссылку на изображение",
      } as const;
    }

    const updated = await prisma.articles.update({
      where: { id: input.id },
      data: { title, content, image },
    });

    return { status: "ok", data: updated } as const;
  } catch (e: any) {
    return {
      status: "error",
      message: e?.message || "Ошибка обновления статьи",
    } as const;
  }
}
