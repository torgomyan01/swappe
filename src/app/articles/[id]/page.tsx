import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL, fileHost } from "@/utils/consts";
import Link from "next/link";
import { ActionGetArticle } from "@/app/actions/articles/get-single";
import { notFound } from "next/navigation";
import { ActionGetRandomArticles } from "@/app/actions/articles/get-random";
import moment from "moment";

moment.locale("ru");

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleRes = (await ActionGetArticle(id ? +id : 0)) as {
    status: string;
    data: IArticle | null;
  };
  const article = articleRes?.data;
  if (!article) {
    notFound();
  }

  const latestRes = await ActionGetRandomArticles(3, article.id);
  const latest: IArticle[] =
    latestRes.status === "ok" ? ((latestRes as any).data as IArticle[]) : [];

  return (
    <MainTemplate>
      <div className="wrapper !mb-12">
        <div className="breadcrumbs hide-mobile">
          <Link href={SITE_URL.SEARCH}>
            Главная <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <Link href={SITE_URL.ARTICLES}>
            Статьи <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <span>{article.title}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl font-semibold">{article.title}</h1>
            {article.image ? (
              <img
                src={`${fileHost}${article.image}`}
                alt={article.title}
                className="w-full rounded-lg max-h-[400px] object-cover"
              />
            ) : null}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          <div className="lg:col-span-4">
            <div className="text-lg font-semibold mb-3">Ещё статьи</div>
            <div className="space-y-3">
              {latest.map((it) => (
                <Link
                  key={`${it.id}-${it.title}`}
                  href={`${SITE_URL.ARTICLES}/${it.id}`}
                  className="flex gap-3 items-start p-3 rounded-lg border border-default-200 hover:bg-default-50"
                >
                  {it.image ? (
                    <img
                      src={`${fileHost}${it.image}`}
                      alt={it.title}
                      className="w-full h-50 object-cover rounded mb-3"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded bg-default-100" />
                  )}

                  <div className="min-w-0">
                    <div className="text-sm font-bold line-clamp-2">
                      {it.title}
                    </div>
                    <div
                      className="prose max-w-none text-sm py-2 text-default-500"
                      dangerouslySetInnerHTML={{
                        __html: it.content.slice(0, 100) + "...",
                      }}
                    />
                    <div className="text-xs text-default-500">
                      {moment(it.created_at).format("LL")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
