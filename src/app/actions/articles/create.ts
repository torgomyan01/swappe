"use server";

import { prisma } from "@/lib/prisma";

export async function ActionAdminCreateArticle(input: {
  title: string;
  content: string;
  image: string;
}) {
  try {
    const title = input.title?.trim();
    const content = input.content?.trim();
    const image = input.image?.trim();

    if (!title || title.length < 3) {
      return { status: "error", message: "Введите корректный заголовок" };
    }
    if (!content || content.length < 3) {
      return { status: "error", message: "Введите содержимое статьи" };
    }
    if (!image) {
      return { status: "error", message: "Укажите ссылку на изображение" };
    }

    const created = await prisma.articles.create({
      data: { title, content, image },
    });

    return { status: "ok", data: created } as const;
  } catch (e: any) {
    return {
      status: "error",
      message: e?.message || "Ошибка создания статьи",
    } as const;
  }
}
