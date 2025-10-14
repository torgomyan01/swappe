import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import Image from "next/image";
import { ActionAdminGetAllArticles } from "../actions/articles/get-all";
import moment from "moment";
import ArticlesList from "./components/articles-list";

moment.locale("ru");

const ARTICLES = [
  {
    title: "Коллаборации и бартер: инструменты, которые меняют маркетинг",
    description:
      "Как коллаборации и бартер помогают бизнесу: рост охватов, доверия и эффективности.",
    date: "6 апреля 2025",
    image: "/img/article/world-marketing-img1.png",
    link: SITE_URL.ARTICLES_COLLABORATIONS_AND_BARTER,
  },
  {
    title: "Бартер: что нужно знать, чтобы использовать его с выгодой",
    description:
      "Полное руководство по бартеру: виды сделок, как оформить договор, налоги и чек-лист для легального и выгодного обмена на платформе SWAPPE.",
    date: "12 октября 2025",
    image: "/img/article/types-barter-img3.png",
    link: SITE_URL.ARTICLES_BARTER,
  },
];

async function Page() {
  const { data } = await ActionAdminGetAllArticles(500);

  return (
    <MainTemplate>
      <div className="article-info">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <a href={SITE_URL.SEARCH}>
              Главная
              <img src="img/arr-r.svg" alt="arrow" />
            </a>
            <span>Статьи</span>
          </div>
          <h2>Статьи</h2>
          <div className="article-items">
            {ARTICLES.map((article) => (
              <div className="article-item" key={article.link}>
                <div className="texts">
                  <span className="date">{article.date}</span>
                  <b>{article.title}</b>
                  <p>{article.description}</p>
                  <Link href={article.link} className="green-btn">
                    Читать статью
                  </Link>
                </div>
                <div className="img">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={340}
                    height={340}
                    className="w-full h-auto rounded-4xl"
                  />
                </div>
              </div>
            ))}
          </div>

          <ArticlesList data={data as any} />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
