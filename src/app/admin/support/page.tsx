"use server";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { ActionAdminListSupportChats } from "@/app/actions/support/admin-list-chats";
import SupportTable from "./components/support-table";

export default async function AdminSupportListPage() {
  const res = await ActionAdminListSupportChats();
  const chats: any[] = res.status === "ok" ? (res.data as any[]) : [];

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN}`}>
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Техническая поддержка</h1>
            <p className="text-sm text-gray-500 mt-1">
              Всего чатов:{" "}
              <span className="font-medium text-gray-700">{chats.length}</span>
            </p>
          </div>
        </div>

        <SupportTable
          chats={chats.map((c: any) => ({
            ...c,
            messages:
              c?.messages?.map((m: any) => ({
                ...m,
                created_at: m?.created_at
                  ? new Date(m.created_at).toISOString()
                  : null,
              })) || [],
          }))}
        />
      </div>
    </AdminMainTemplate>
  );
}
