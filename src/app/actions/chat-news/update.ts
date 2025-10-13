"use server";

import { prisma } from "@/lib/prisma";

export type UpdateChatNewsInput = {
  id: number;
  title: string;
  content: string;
  image_paths: string[];
  video_url?: string | null;
  status?: string;
};

function parseVideo(url?: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes("youtube.com") || host === "youtu.be") {
      let id = u.searchParams.get("v");
      if (!id && host === "youtu.be") {
        id = u.pathname.replace("/", "");
      }
      if (!id) return null;
      return { provider: "youtube", id, url } as any;
    }
    if (host.includes("rutube")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const vidIndex = parts.findIndex((p) => p === "video");
      const id = vidIndex >= 0 ? parts[vidIndex + 1] : undefined;
      if (!id) return null;
      return { provider: "rutube", id, url } as any;
    }
  } catch {
    return null;
  }
  return null;
}

export async function ActionAdminUpdateChatNews(input: UpdateChatNewsInput) {
  try {
    const title = input.title?.trim();
    const content = input.content?.trim();
    const images = Array.isArray(input.image_paths)
      ? input.image_paths.filter(Boolean).slice(0, 3)
      : [];
    const video = parseVideo(input.video_url || null);

    if (!input.id) return { status: "error", message: "Не указан ID" } as const;
    if (!title || title.length < 3) {
      return {
        status: "error",
        message: "Введите корректный заголовок",
      } as const;
    }
    if (!content || content.length < 3) {
      return {
        status: "error",
        message: "Введите содержимое новости",
      } as const;
    }
    if (images.length > 3) {
      return { status: "error", message: "Не более 3 изображений" } as const;
    }

    const updated = await prisma.chat_news.update({
      where: { id: input.id },
      data: {
        title,
        content,
        images: images as any,
        videos: video ? [video] : [],
        status: input.status || undefined,
      },
    });

    return { status: "ok", data: updated } as const;
  } catch (e: any) {
    return {
      status: "error",
      message: e?.message || "Ошибка обновления",
    } as const;
  }
}
