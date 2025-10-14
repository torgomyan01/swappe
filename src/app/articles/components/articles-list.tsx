"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import moment from "moment";
import { fileHost, SITE_URL } from "@/utils/consts";

export default function ArticlesList({ data }: { data: IArticle[] }) {
  const [visibleCount, setVisibleCount] = useState(3);

  const canShowMore = visibleCount < data.length;

  return (
    <>
      {data.slice(0, visibleCount).map((article) => (
        <div className="article-item" key={`article-${article.id}`}>
          <div className="texts">
            <span className="date">
              {moment(article.created_at).format("LL")}
            </span>
            <b>{article.title}</b>
            <p
              dangerouslySetInnerHTML={{
                __html: article.content.slice(0, 200) + "...",
              }}
              className="text-article"
            />
            <Link
              href={`${SITE_URL.ARTICLES}/${article.id}`}
              className="green-btn"
            >
              Читать статью
            </Link>
          </div>
          <div className="img">
            <Image
              src={`${fileHost}${article.image}`}
              alt={article.title}
              width={340}
              height={340}
              className="w-full h-auto rounded-4xl"
            />
          </div>
        </div>
      ))}

      {canShowMore ? (
        <button
          className="show-more cursor-pointer"
          onClick={() => setVisibleCount((c) => Math.min(c + 3, data.length))}
        >
          Показать больше
        </button>
      ) : null}
    </>
  );
}
