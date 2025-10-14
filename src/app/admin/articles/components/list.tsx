"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Pagination } from "@heroui/react";
import { ActionAdminDeleteArticle } from "@/app/actions/articles/delete";
import EditArticleModal from "./modal-edit";
import { fileHost } from "@/utils/consts";

export default function ArticlesList({
  initialItems,
}: {
  initialItems: any[];
}) {
  const [items, setItems] = useState<any[]>(initialItems || []);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setItems(initialItems || []);
    setPage(1);
  }, [initialItems]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  async function handleDelete(id: number) {
    const ok = window.confirm("Удалить статью?");
    if (!ok) return;
    const res = await ActionAdminDeleteArticle(id);
    if (res.status === "ok") {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageItems.map((it) => (
          <Card key={it.id} shadow="sm">
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-semibold truncate">
                  {it.title}
                </div>
                <div className="text-xs text-default-500 whitespace-nowrap">
                  {new Date(it.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditArticleModal
                  item={it}
                  onSaved={(v: any) => {
                    setItems((prev) =>
                      prev.map((x) => (x.id === v.id ? v : x)),
                    );
                  }}
                />
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleDelete(it.id)}
                >
                  <i className="fa-solid fa-trash" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              {it.image ? (
                <img
                  src={`${fileHost}${it.image}`}
                  alt="cover"
                  className="w-full h-40 object-cover rounded"
                />
              ) : null}
              <div
                className="text-sm text-default-600 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: it.content }}
              />
            </CardBody>
          </Card>
        ))}
      </div>

      {items.length > pageSize ? (
        <div className="flex justify-center">
          <Pagination total={totalPages} page={page} onChange={setPage} />
        </div>
      ) : null}
    </div>
  );
}
