"use client";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import ChatNewsList from "./components/list";
import CreateChatNewsModal from "./components/create-modal";
import { useEffect, useState } from "react";
import { ActionAdminGetAllChatNews } from "@/app/actions/chat-news/get-all";

export default function AdminChatNewsPage() {
  const [items, setItems] = useState<IChatNews[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  function fetchItems() {
    ActionAdminGetAllChatNews(1000).then((res) => {
      if (res.status === "ok") {
        setItems(res.data as IChatNews[]);
      }
    });
  }

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_CHAT_NEWS}`}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Чат-новости</h1>
          <p className="text-sm text-default-500 mt-1">
            Добавьте новость для отображения в чатах: заголовок, текст, до 3
            изображений и 1 видео-ссылку (YouTube/RuTube).
          </p>
        </div>
        <div className="flex justify-end">
          {/* Revalidate on client side after add using router.refresh() via onAdded callback */}
          <CreateChatNewsModal onAdded={fetchItems} />
        </div>
        <ChatNewsList initialItems={items} />
      </div>
    </AdminMainTemplate>
  );
}
