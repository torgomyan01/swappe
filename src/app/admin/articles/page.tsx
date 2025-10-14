"use server";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { ActionAdminGetAllArticles } from "@/app/actions/articles/get-all";
import ArticlesList from "./components/list";
import CreateArticleModal from "./components/modal-create";

export default async function AdminArticlesPage() {
  const res = await ActionAdminGetAllArticles(500);
  const items = res.status === "ok" ? (res.data as any[]) : [];

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN_ARTICLES}`}>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Статьи</h1>
            <p className="text-sm text-default-500 mt-1">
              Управляйте статьями: создавайте, редактируйте и удаляйте.
            </p>
          </div>
          {/* Client revalidation is handled by refetch in client after add via router.refresh alternative; here we reload by forcing navigation if needed */}
          <CreateArticleModal />
        </div>
        <ArticlesList initialItems={items} />
      </div>
    </AdminMainTemplate>
  );
}
