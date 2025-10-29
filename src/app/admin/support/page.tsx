"use server";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { ActionAdminListSupportChats } from "@/app/actions/support/admin-list-chats";
import SupportList from "./components/support-list";

export default async function AdminSupportListPage() {
  const res = await ActionAdminListSupportChats();
  const chats: any[] = res.status === "ok" ? (res.data as any[]) : [];

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN}`}>
      <SupportList
        initialChats={chats.map((c: any) => ({
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
    </AdminMainTemplate>
  );
}
