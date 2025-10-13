"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Chip,
  Image,
} from "@heroui/react";
import { fileHostUpload, fileHost } from "@/utils/consts";
import { ActionAdminCreateChatNews } from "@/app/actions/chat-news/create";
import { ActionAdminUpdateChatNews } from "@/app/actions/chat-news/update";
import axios from "axios";

function isValidVideoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes("youtube.com") || host === "youtu.be") return true;
    if (host.includes("rutube")) return true;
    return false;
  } catch {
    return false;
  }
}

export default function ChatNewsForm({
  onSuccess,
  item,
}: {
  onSuccess?: () => void;
  item?: IChatNews;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [content, setContent] = useState(item?.content || "");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [images, setImages] = useState<string[]>(item?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = useMemo(() => {
    const okTitle = title.trim().length >= 3;
    const okContent = content.trim().length >= 3;
    const okVideo = !videoUrl || isValidVideoUrl(videoUrl);
    const okImages = images.length <= 3;
    return (
      okTitle && okContent && okVideo && okImages && !uploading && !submitting
    );
  }, [title, content, videoUrl, images, uploading, submitting]);

  async function handlePickImages(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(ev.target.files || []);
    if (!files.length) return;
    const remaining = 3 - images.length;
    const toUpload = files.slice(0, remaining);
    if (!toUpload.length) return;

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(fileHostUpload, formData);
        // Expecting server returns path or URL. Follow existing patterns: use "path".
        const path =
          res?.data?.path || res?.data?.image_path || res?.data?.url || "";
        if (path) uploaded.push(path);
      }
      setImages((prev) => [...prev, ...uploaded].slice(0, 3));
    } finally {
      setUploading(false);
      ev.target.value = "";
    }
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    const res = item
      ? await ActionAdminUpdateChatNews({
          id: item.id,
          title: title.trim(),
          content: content.trim(),
          image_paths: images,
          video_url: videoUrl.trim() || null,
        })
      : await ActionAdminCreateChatNews({
          title: title.trim(),
          content: content.trim(),
          image_paths: images,
          video_url: videoUrl.trim() || null,
          status: "published",
        });
    setSubmitting(false);
    if (res.status === "ok") {
      onSuccess?.();
    }
  }

  return (
    <Card shadow="none">
      <CardBody className="space-y-4 px-0">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Заголовок"
            placeholder="Введите заголовок новости"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isRequired
          />
          <Textarea
            label="Содержимое"
            placeholder="Опишите новость..."
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            isRequired
          />
          <Input
            label="Видео (YouTube или RuTube)"
            placeholder="Вставьте ссылку на видео"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            color={
              videoUrl && !isValidVideoUrl(videoUrl) ? "danger" : "default"
            }
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-default-600">Изображения (до 3)</div>
          <div className="flex flex-wrap gap-3">
            {images.map((p, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={`${fileHost}${p}`}
                  alt="preview"
                  width={96}
                  height={96}
                  className="h-24 w-24 object-cover rounded-lg border"
                />
                <Button
                  size="sm"
                  color="default"
                  variant="flat"
                  className="absolute -top-2 -right-2 h-7 min-w-7 px-0 rounded-full z-10"
                  onPress={() =>
                    setImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  <i className="fa-solid fa-xmark" />
                </Button>
              </div>
            ))}
            {images.length < 3 && (
              <label className="h-24 w-24 grid place-items-center rounded-lg border border-dashed text-default-500 cursor-pointer hover:bg-default-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePickImages}
                  multiple
                />
                <div className="text-center text-xs">
                  <i className="fa-solid fa-plus mb-1 block" />
                  Добавить
                </div>
              </label>
            )}
          </div>
          <div className="text-xs text-default-400">
            До 3 изображений. Загрузка идёт на ваш файловый сервер.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Chip color="default" variant="flat">
            {images.length}/3
          </Chip>
          <Button
            color="success"
            onPress={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={submitting || uploading}
          >
            {item ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
