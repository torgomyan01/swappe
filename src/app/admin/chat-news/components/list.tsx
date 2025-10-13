"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Image,
  Chip,
} from "@heroui/react";
import { fileHost } from "@/utils/consts";
import moment from "moment";
import EditChatNewsModal from "./edit-modal";
import { ActionAdminDeleteChatNews } from "@/app/actions/chat-news/delete";

export default function ChatNewsList({
  initialItems,
}: {
  initialItems: IChatNews[];
}) {
  const [items, setItems] = useState<IChatNews[]>(initialItems);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  useEffect(() => {
    setItems(initialItems);
    setPage(1);
  }, [initialItems]);

  async function handleDelete(id: number) {
    const ok = window.confirm("Удалить новость?");
    if (!ok) return;
    const res = await ActionAdminDeleteChatNews(id);
    if (res.status === "ok") {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageItems.map((n) => (
          <Card key={n.id} shadow="sm">
            <CardHeader className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-semibold truncate">
                  {n.title}
                </div>
                <div className="text-xs text-default-500 whitespace-nowrap">
                  {moment(n.created_at).format("DD.MM.YYYY HH:mm")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {n.videos?.length ? (
                  <Chip size="sm" color="secondary" variant="flat">
                    Видео
                  </Chip>
                ) : null}
                <EditChatNewsModal
                  item={n}
                  onSaved={() => {
                    // naive refresh: request is handled in parent; here we'll just refetch via location reload
                    // but better: do nothing and rely on caller to refresh list; we optimistically keep same item
                  }}
                />
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="min-w-8"
                  onPress={() => handleDelete(n.id)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="text-sm text-default-700 line-clamp-3">
                {n.content}
              </div>
              {!!n.images?.length && (
                <div className="flex gap-2">
                  {n.images.slice(0, 3).map((img, i) => (
                    <Image
                      key={i}
                      src={`${fileHost}${img}`}
                      alt="preview"
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          page={page}
          total={totalPages}
          onChange={(p) => setPage(p)}
          size="sm"
        />
      </div>
    </div>
  );
}
