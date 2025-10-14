"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import RichTextEditor from "./editor";
import { ActionAdminUpdateArticle } from "@/app/actions/articles/update";
import axios from "axios";
import { fileHostUpload, fileHost } from "@/utils/consts";
import { useRouter } from "next/navigation";

export default function EditArticleModal({
  item,
  onSaved,
}: {
  item: any;
  onSaved?: (v: any) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(item.title || "");
  const [image, setImage] = useState(item.image || "");
  const [content, setContent] = useState(item.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handlePickImage(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post(fileHostUpload, formData);
      const path = data?.path || data?.image_path || data?.url || "";
      if (path) setImage(path);
    } finally {
      setUploading(false);
      ev.target.value = "";
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const res = await ActionAdminUpdateArticle({
      id: item.id,
      title,
      content,
      image,
    });
    setLoading(false);
    if (res.status === "ok") {
      onSaved?.(res.data);
      setOpen(false);
      if (!onSaved) router.refresh();
    } else {
      setError((res as any)?.message || "Ошибка");
    }
  }

  return (
    <>
      <Button size="sm" variant="flat" onPress={() => setOpen(true)}>
        <i className="fa-solid fa-pen" />
      </Button>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="3xl"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Редактировать статью
              </ModalHeader>
              <ModalBody className="space-y-3">
                <Input
                  label="Заголовок"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="space-y-2">
                  <div className="text-sm text-default-500">
                    Обложка (1 изображение)
                  </div>
                  <div className="flex items-center gap-3">
                    {image ? (
                      <img
                        src={`${fileHost}${image}`}
                        alt="preview"
                        className="h-20 w-20 object-cover rounded border"
                      />
                    ) : null}
                    <label className="px-3 py-2 border rounded cursor-pointer hover:bg-default-50 text-sm">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePickImage}
                      />
                      Выбрать изображение
                    </label>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-default-500 mb-2">
                    Содержимое
                  </div>
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
                {error ? (
                  <div className="text-sm text-danger-500">{error}</div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  isLoading={loading || uploading}
                  onPress={handleSubmit}
                >
                  Сохранить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
