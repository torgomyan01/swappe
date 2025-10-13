"use server";

import { prisma } from "@/lib/prisma";

export type CreateChatNewsInput = {
  title: string;
  content: string;
  image_paths: string[]; // already uploaded image paths (max 3)
  video_url?: string | null; // optional, only YouTube or RuTube
  status?: string; // default 'published'
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
      return { provider: "youtube", id, url };
    }
    if (host.includes("rutube")) {
      // RuTube IDs are in pathname, e.g. /video/<id>/
      const parts = u.pathname.split("/").filter(Boolean);
      const vidIndex = parts.findIndex((p) => p === "video");
      const id = vidIndex >= 0 ? parts[vidIndex + 1] : undefined;
      if (!id) return null;
      return { provider: "rutube", id, url };
    }
  } catch {
    return null;
  }
  return null;
}

export async function ActionAdminCreateChatNews(input: CreateChatNewsInput) {
  try {
    const title = input.title?.trim();
    const content = input.content?.trim();
    const images = Array.isArray(input.image_paths)
      ? input.image_paths.filter(Boolean).slice(0, 3)
      : [];
    const video = parseVideo(input.video_url || null);

    if (!title || title.length < 3) {
      return { status: "error", message: "Введите корректный заголовок" };
    }
    if (!content || content.length < 3) {
      return { status: "error", message: "Введите содержимое новости" };
    }
    if (images.length > 3) {
      return { status: "error", message: "Не более 3 изображений" };
    }

    const created = await prisma.chat_news.create({
      data: {
        title,
        content,
        images: images as any,
        videos: video ? [video] : [],
        status: input.status || "published",
      },
    });

    return { status: "ok", data: created };
  } catch (e: any) {
    return { status: "error", message: e?.message || "Ошибка создания" };
  }
}
