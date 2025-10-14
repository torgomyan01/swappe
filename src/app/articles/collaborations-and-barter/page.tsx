import MainTemplate from "@/components/common/main-template/main-template";
import Script from "next/script";
import type { Metadata } from "next";
import Image from "next/image";

import { SITE_URL } from "@/utils/consts";

export const metadata: Metadata = {
  title:
    "Коллаборации и бартер: инструменты, которые меняют маркетинг | SWAPPE",
  description:
    "Как коллаборации и бартер помогают бизнесу: рост охватов, доверия и эффективности. Практические примеры и советы по интеграции в маркетинг.",
  keywords: [
    "коллаборации",
    "бартер",
    "совместные проекты",
    "маркетинг",
    "кросс-промо",
    "партнерства",
    "локальный бизнес",
    "SWAPPE",
  ],
  alternates: { canonical: "/articles/collaborations-and-barter" },
  openGraph: {
    type: "article",
    url: "/articles/collaborations-and-barter",
    title:
      "Коллаборации и бартер: инструменты, которые меняют маркетинг | SWAPPE",
    description:
      "Чем полезны коллаборации и бартер: расширение аудитории, доверие, снижение затрат и новые идеи.",
    images: [
      {
        url: "/img/article/result-img2.png",
        width: 1200,
        height: 630,
        alt: "Коллаборации и бартер — современные инструменты маркетинга",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Коллаборации и бартер: инструменты, которые меняют маркетинг | SWAPPE",
    description:
      "Практическое руководство по внедрению коллабораций и бартера в маркетинг.",
    images: ["/img/article/result-img2.png"],
  },
  robots: { index: true, follow: true },
};

function Page() {
  return (
    <MainTemplate>
      <div
        className="bg-[#F8F2EA]"
        itemScope
        itemType="https://schema.org/Article"
      >
        <Script id="article-collab-jsonld" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Коллаборации и бартер: инструменты, которые меняют маркетинг",
            description:
              "Как коллаборации и бартер помогают бизнесу: рост охватов, доверия и эффективности.",
            inLanguage: "ru",
            author: { "@type": "Organization", name: "SWAPPE" },
            mainEntityOfPage: "/articles/collaborations-and-barter",
            image: ["/img/article/result-img2.png"],
          })}
        </Script>
        <div className="wrapper !pt-4">
          <div className="breadcrumbs hide-mobile">
            <a href={SITE_URL.SEARCH}>
              Главная
              <Image
                src="/img/arr-r.svg"
                alt="arrow"
                width={6}
                height={6}
                className="w-[6px] h-auto"
              />
            </a>
            <a href={SITE_URL.ARTICLES}>
              Статьи
              <Image
                src="/img/arr-r.svg"
                alt="arrow"
                width={6}
                height={6}
                className="w-[6px] h-auto"
              />
            </a>
            <span>Коллаборации и бартер</span>
          </div>
        </div>
        <Script id="breadcrumb-collab-jsonld" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Статьи",
                item: "/articles",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Коллаборации и бартер",
                item: "/articles/collaborations-and-barter",
              },
            ],
          })}
        </Script>

        <div className="barter-banner barter-banner2">
          <h1>Коллаборации и бартер: инструменты, которые меняют маркетинг</h1>
        </div>

        <div className="world-marketing">
          <div className="wrapper">
            <div className="text-wrap">
              <h3>Мир маркетинга меняется</h3>
              <p>
                Рынок сегодня перегружен рекламой, конкуренция усиливается, а
                привлечение внимания аудитории требует всё больше ресурсов.
                Локальному бизнесу становится сложно конкурировать с крупными
                компаниями в привычных каналах продвижения.
              </p>
              <p>
                Именно поэтому всё больше предпринимателей обращают внимание на
                коллаборации и бартер — форматы, которые позволяют не просто
                экономить, но и креативно выделяться.
              </p>
              <div className="img max-w-[535px] w-full">
                <Image
                  src="/img/article/world-marketing-img1.png"
                  alt="Как меняется маркетинг: перегрузка рекламы и рост конкуренции"
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="img-wrap">
              <Image
                src="/img/article/world-marketing-img2.png"
                alt="Иллюстрация: современный маркетинг и коллаборации"
                width={330}
                height={330}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>

        <div className="collaboration">
          <div className="wrapper">
            <p className="subtitle">Что такое коллаборация?</p>
            <h2>
              Коллаборация — это союз двух или нескольких брендов, которые
              объединяют ресурсы, экспертизу и аудитории ради общей цели.
            </h2>
            <p>Это может быть:</p>
            <ul>
              <li>совместная рекламная кампания,</li>
              <li>кросс-промо или спецпроекты в соцсетях,</li>
              <li>создание уникального продукта,</li>
              <li>организация события.</li>
            </ul>
            <p>
              Главное условие: партнёр должен разделять ваши ценности и не быть
              прямым конкурентом. Только в этом случае синергия будет настоящей,
              а результат — взаимовыгодным.
            </p>
            <h3>Зачем бизнесу коллаборации?</h3>
            <div className="items">
              <div className="item">
                <span className="num">01</span>
                <h2>
                  Расширение <br /> аудитории
                </h2>
                <p>
                  Каждый бизнес работает со своей клиентской базой. Объединяясь,
                  компании могут «познакомить» клиентов друг с другом и тем
                  самым выйти на новые сегменты.
                </p>
                <p>
                  <b>Пример:</b> кафе выпускает лимитированные десерты совместно
                  с местным художником. Результат — арт-десерты становятся
                  интересны и клиентам кафе, и подписчикам художника.
                </p>
              </div>
              <div className="item">
                <span className="num">02</span>
                <h2>
                  Рост узнаваемости <br /> и доверия
                </h2>
                <p>
                  Коллаборации помогают бизнесу выглядеть более заметным и
                  авторитетным. Сотрудничество с брендом или экспертом, которому
                  доверяют, усиливает репутацию.
                </p>
                <p>
                  Это особенно ценно для новых компаний, которые только
                  завоёвывают доверие аудитории.
                </p>
              </div>
              <div className="item">
                <span className="num">03</span>
                <h2>
                  Разделение затрат <br /> и рисков
                </h2>
                <p>
                  Вместе проще. Организовать событие, рекламную кампанию или
                  спецпроект вдвоём гораздо дешевле, чем в одиночку.
                </p>
                <p>
                  Вы делите расходы и ответственность, получая больше эффекта
                  при меньших вложениях.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="old-tool">
          <div className="wrapper">
            <h2>
              Бартер: старый инструмент в новой <br /> реальности
            </h2>
            <div className="info1">
              <div className="texts-wrap">
                <h4>
                  Бартер — это обмен товарами или услугами без денежных
                  расчётов.{" "}
                </h4>
                <p>
                  Казалось бы, устаревший формат, но сегодня он снова набирает
                  популярность, особенно среди локального бизнеса.
                </p>
              </div>
              <div className="img max-w-[360px] w-full">
                <Image
                  src="/img/article/collaboration-img1.png"
                  alt="Что такое коллаборации в маркетинге"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="info2">
              <div className="texts-wrap">
                <h2>Преимущества бартера</h2>
                <div className="items">
                  <div className="item">
                    <div className="num">1</div>
                    <div className="texts">
                      <b>Экономия бюджета</b>
                      <span>
                        Можно получить нужный ресурс без затрат. Например,
                        ресторан предоставляет ужины фотографу в обмен на
                        профессиональные фото для соцсетей.
                      </span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="num">2</div>
                    <div className="texts">
                      <b>Рост ценности предложений</b>
                      <span>
                        Обмен позволяет добавить новые «фишки» для клиентов:
                        спа-салон может предложить массаж в обмен на рекламу в
                        местном медиа.
                      </span>
                    </div>
                  </div>
                  <div className="item">
                    <div className="num">3</div>
                    <div className="texts">
                      <b>Творческий импульс</b>
                      <span>
                        Бартер заставляет искать нестандартные решения. Вместе с
                        партнёром можно придумать спецакцию или совместный
                        продукт, который привлечёт внимание.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="img max-w-[560px] w-full">
                <Image
                  src="/img/article/collaboration-img2.png"
                  alt="Преимущества бартера: экономия, ценность, креатив"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="barter-green-block">
          <div className="wrapper">
            <div className="info">
              <div className="left2">
                <h3>Как встроить бартер и коллаборации в маркетинг</h3>
                <Image
                  src="/img/article/barter-green-img.png"
                  alt="Как встроить бартер и коллаборации в маркетинг"
                  width={380}
                  height={300}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="items">
                <div className="item">
                  <b>Оцените ресурсы</b>
                  <span>
                    Что вы можете предложить в обмен? Это может быть продукт,
                    услуга, рекламное пространство или организация мероприятия.
                  </span>
                </div>
                <div className="item">
                  <b>Найдите подходящих партнеров</b>
                  <span>
                    Используйте соцсети, профессиональные сообщества, платформы
                    вроде swappe.ru. Важно, чтобы партнёр разделял ваши ценности
                    и имел близкую целевую аудиторию.
                  </span>
                </div>
                <div className="item">
                  <b>Пропишите условия сделки</b>
                  <span>
                    Что вы можете предложить в обмен? Это может быть продукт,
                    услуга, рекламное пространство или организация мероприятия.
                  </span>
                </div>
                <div className="item">
                  <b>Думайте на перспективу</b>
                  <span>
                    Не ограничивайтесь разовым проектом. Коллаборации и бартер
                    могут стать основой долгосрочных партнёрств, которые
                    приносят ещё больше пользы со временем.
                  </span>
                </div>
                <div className="item">
                  <b>Анализируйте результаты</b>
                  <span>
                    Задайте KPI: рост аудитории, охваты, продажи. Регулярно
                    проверяйте эффективность, чтобы понимать, какие форматы
                    работают лучше.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="result-wrap result-wrap2">
          <div className="wrapper">
            <div className="texts">
              <h2>Итог</h2>
              <h5>
                Коллаборации и бартер — это мощные инструменты для современного
                бизнеса. Они позволяют:
              </h5>
              <ul>
                <li>расширить охват,</li>
                <li>укрепить доверие клиентов,</li>
                <li>снизить затраты,</li>
                <li>найти новые идеи и форматы.</li>
              </ul>
              <p>
                В мире, где традиционная реклама всё чаще тонет в шуме, именно
                партнёрства становятся тем самым секретным ингредиентом, который
                выделяет ваш бизнес. Не упускайте шанс! Ищите партнёров,
                пробуйте новые форматы и вдохновляйтесь. Возможно, следующий
                успешный проект уже ждёт вас на{" "}
                <a href={SITE_URL.HOME}>SWAPPE</a>
              </p>
            </div>
            <div className="img">
              <Image
                src="/img/article/result-img2.png"
                alt="Итоги: коллаборации и бартер помогают бизнесу"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
