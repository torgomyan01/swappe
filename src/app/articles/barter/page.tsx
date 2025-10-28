import MainTemplate from "@/components/common/main-template/main-template";
import Script from "next/script";
import type { Metadata } from "next";

import "@/app/articles/_article.scss";
import { SITE_URL } from "@/utils/consts";

export const metadata: Metadata = {
  title: "Бартер: что нужно знать, чтобы использовать его с выгодой | SWAPPE",
  description:
    "Полное руководство по бартеру: виды сделок, как оформить договор, налоги и чек-лист для легального и выгодного обмена на платформе SWAPPE.",
  keywords: [
    "бартер",
    "бартерные сделки",
    "обмен товарами и услугами",
    "договор мены",
    "смешанный договор",
    "взаимное оказание услуг",
    "бартер налоги",
    "SWAPPE",
  ],
  alternates: { canonical: "/articles/barter" },
  openGraph: {
    type: "article",
    url: "/articles/barter",
    title: "Бартер: что нужно знать, чтобы использовать его с выгодой | SWAPPE",
    description:
      "Разбираем, как использовать бартер с максимальной выгодой: форматы, документы, налоги и практический чек-лист.",
    images: [
      {
        url: "/img/article/result-img1.png",
        width: 1200,
        height: 630,
        alt: "Бартер — современный и законный инструмент для бизнеса",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Бартер: что нужно знать, чтобы использовать его с выгодой | SWAPPE",
    description:
      "Пошаговое руководство по бартеру: виды, договоры, налоги и чек-лист.",
    images: ["/img/article/result-img1.png"],
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
        <div className="wrapper !pt-4">
          <div className="breadcrumbs hide-mobile">
            <a href={SITE_URL.SEARCH}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </a>
            <a href={SITE_URL.ARTICLES}>
              Статьи
              <img src="/img/arr-r.svg" alt="arrow" />
            </a>
            <span>Бартер</span>
          </div>
        </div>

        <div className="barter-banner">
          <h1 itemProp="headline">
            Бартер: что нужно знать, чтобы использовать его с выгодой
          </h1>
          <meta itemProp="author" content="SWAPPE" />
          <meta itemProp="articleSection" content="Бизнес, Бартер" />
          <meta itemProp="inLanguage" content="ru" />
          <meta itemProp="mainEntityOfPage" content="/articles/barter" />
        </div>

        <div className="trend-barter" itemProp="articleBody">
          <div className="wrapper">
            <h3>Почему бартер снова в тренде?</h3>
            <p>
              Зачем тратить деньги, если можно обменяться тем, что у тебя уже
              есть? Например: вы фотограф, а фитнес-клубу нужны яркие снимки для
              соцсетей. Взамен — месячный абонемент. Или ещё лучше: несколько
              компаний объединяются в коллаборацию и проводят совместную
              рекламную кампанию, где каждая получает новых клиентов и внимание
              без бюджета.
            </p>
            <p>
              Именно так работает бартер — старый инструмент, который сегодня
              стал особенно актуален. А с появлением онлайн-платформ вроде{" "}
              <b>SWAPPE</b>
              организовать обмен стало проще простого.
            </p>
            <img
              src="/img/article/barter-trend-img.png"
              alt="Современный бартер: обмен товарами и услугами без денег"
              loading="lazy"
            />
          </div>
        </div>

        <div className="swappe-works">
          <div className="wrapper">
            <h2>Как работает SWAPPE</h2>
            <img
              src="/img/article/arr1.svg"
              alt=""
              className="arr1"
              loading="lazy"
            />
            <img
              src="/img/article/arr2.svg"
              alt=""
              className="arr2"
              loading="lazy"
            />
            <img
              src="/img/article/arr3.svg"
              alt=""
              className="arr3"
              loading="lazy"
            />
            <div className="items">
              <div className="item">
                <img
                  src="/img/article/swappe-works-style1.png"
                  alt="Шаг 1 — регистрация на SWAPPE"
                  loading="lazy"
                />
                <div className="num">1</div>
                <b>Зарегистрируйтесь</b>
                <span>
                  Создайте профиль <br /> на платформе
                </span>
              </div>
              <div className="item">
                <img
                  src="/img/article/swappe-works-style2.png"
                  alt="Шаг 2 — разместите предложение"
                  loading="lazy"
                />
                <div className="num">2</div>
                <b>
                  Разместите <br /> предложение
                </b>
                <span>
                  Товар, услугу или идею <br /> для коллаборации
                </span>
              </div>
              <div className="item">
                <img
                  src="/img/article/swappe-works-style3.png"
                  alt="Шаг 3 — найдите партнера и договоритесь"
                  loading="lazy"
                />
                <div className="num">3</div>
                <b>Найдите партнера</b>
                <span>
                  Договоритесь <br />и обменяйтесь
                </span>
              </div>
              <div className="item">
                <img
                  src="/img/article/swappe-works-style4.png"
                  alt="Шаг 4 — стройте долгосрочные связи"
                  loading="lazy"
                />
                <div className="num">4</div>
                <b>Стройте связи</b>
                <span>
                  Ведь удачные сделки часто перерастают в долгосрочные
                  партнёрства
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="changed-general">
          <div className="wrapper">
            <h2>Что вообще можно менять?</h2>
            <p>Бартер работает почти со всем:</p>
            <div className="changed-general-items">
              <div className="changed-general-item">
                <img
                  src="/img/article/changed-general-img1.svg"
                  alt="Товар на товар"
                  loading="lazy"
                />
                <div className="style">товар на товар</div>
              </div>
              <div className="changed-general-item">
                <img
                  src="/img/article/changed-general-img2.svg"
                  alt="Товар на услугу или работу"
                  loading="lazy"
                />
                <div className="style">товар на услугу или работу</div>
              </div>
              <div className="changed-general-item">
                <img
                  src="/img/article/changed-general-img3.svg"
                  alt="Услуга на услугу"
                  loading="lazy"
                />
                <div className="style">услуга на услугу</div>
              </div>
            </div>
            <h5>Главное — чтобы было взаимовыгодно.</h5>
          </div>
        </div>

        <div className="types-barter">
          <div className="wrapper">
            <h2>Виды бартерных сделок</h2>
            <div className="types-barter-items">
              <div className="types-barter-item">
                <img
                  src="/img/article/types-barter-img1.png"
                  alt="Закрытый бартер"
                  loading="lazy"
                />
                <b>Закрытый бартер</b>
                <span>
                  Классика жанра. Две стороны меняются «один на один» по заранее
                  согласованным условиям: что, когда и в каком объёме.
                </span>
              </div>
              <div className="types-barter-item">
                <img
                  src="/img/article/types-barter-img2.png"
                  alt="Открытый бартер"
                  loading="lazy"
                />
                <b>Открытый бартер</b>
                <span>
                  Более гибкий формат, когда в обмене участвуют три и больше
                  сторон. Сделка растягивается во времени и ближе к
                  коллаборации. <br /> Пример:
                </span>
                <ul>
                  <li>компания А — декор,</li>
                  <li>компания В — одежда,</li>
                  <li>компания С — салон красоты,</li>
                  <li>компания D — организация мероприятий.</li>
                </ul>
                <span>
                  Вместе они создают экосистему лояльности: клиенты каждой
                  компании получают бонусы у остальных.
                </span>
              </div>
              <div className="types-barter-item">
                <img
                  src="/img/article/types-barter-img3.png"
                  alt="Электронный бартер"
                  loading="lazy"
                />
                <b>Электронный бартер</b>
                <span>
                  Размещаете предложение на платформе (например, SWAPPE),
                  находите отклик и обмениваетесь. Удобно и безопасно, но всё же
                  лучше закреплять договоренности письменно.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="draw-contract">
          <div className="wrapper">
            <h2>Как оформить договор</h2>
            <div className="info">
              <div className="text-wrap">
                <div className="list">
                  <span>Бартер можно заключать между:</span>
                  <ul>
                    <li>двумя компаниями,</li>
                    <li>двумя физлицами,</li>
                    <li>компанией и физлицом.</li>
                  </ul>
                </div>
                <h3>Варианты договоров</h3>
                <div className="variant-item">
                  <span className="num">1</span>
                  <div className="var-info">
                    <p>
                      <a href="#">Договор мены</a> — если меняете товар на
                      товар.
                    </p>
                    <ul>
                      <li>Работает по правилам купли-продажи.</li>
                      <li>
                        Предполагается, что товары равноценны (если нет —
                        указываете компенсацию).
                      </li>
                      <li>
                        Важно: нельзя обменивать товар на услугу или товарный
                        знак.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="variant-item">
                  <span className="num">2</span>
                  <div className="var-info">
                    <p>
                      <span>
                        <a href="#">Смешанный договор</a> — если участвуют
                        товары и услуги.
                      </span>
                    </p>
                    <ul>
                      <li>
                        С элементами купли-продажи, подряда или оказания услуг.
                      </li>
                      <li>
                        Разница в том, что работы = результат, услуги = процесс.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="variant-item">
                  <span className="num">1</span>
                  <div className="var-info">
                    <p>
                      <a href="#">Договор взаимного оказания услуг</a> — если
                      стороны обмениваются именно услугами.
                    </p>
                  </div>
                </div>
                <div className="doc-wrap">
                  <img
                    src="/img/article/draw-documents.png"
                    alt="Какие условия обязательно фиксировать в договоре"
                    loading="lazy"
                  />
                  <div className="style-block">
                    <b>В договоре обязательно фиксируйте: </b>
                    <span>
                      Предмет сделки, объём, сроки, требования, стоимость и
                      любые важные нюансы (например, порядок передачи или
                      качество).
                    </span>
                  </div>
                </div>
              </div>
              <div className="img-wrap">
                <img
                  src="/img/article/draw-contract-img.png"
                  alt="Оформление договора при бартере"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="universal-analysis">
          <div className="wrapper">
            <h2>Бартер и налоги: универсальный разбор</h2>
            <h4>Общий принцип</h4>
            <p>
              Бартер = та же самая сделка, что и продажа. Только расчёт идёт не
              деньгами, а товарами или услугами.
            </p>
            <p>Это значит:</p>
            <ul className="list2">
              <li>доход признаётся в натуральной форме (ст. 211 НК РФ),</li>
              <li>его нужно оценить по рынку,</li>
              <li>налоги платятся по вашему налоговому режиму.</li>
            </ul>
            <h4>Налоги по режимам</h4>
            <div className="table-wrap">
              <div className="table-top">
                <span style={{ width: "17%" }}>Режим</span>
                <span style={{ width: "22%" }}>Налоги с бартера</span>
                <span style={{ width: "61%" }}>Особенности</span>
              </div>
              <div className="table-items">
                <div className="table-item">
                  <span style={{ width: "17%" }}>ОСНО (компании/ИП)</span>
                  <span style={{ width: "22%" }}>
                    НДС + налог на прибыль/НДФЛ
                  </span>
                  <span style={{ width: "61%" }}>
                    Цена должна быть рыночной
                  </span>
                </div>
                <div className="table-item">
                  <span style={{ width: "17%" }}>УСН “Доходы”</span>
                  <span style={{ width: "22%" }}>6% с дохода</span>
                  <span style={{ width: "61%" }}>
                    Доход = стоимость переданного
                  </span>
                </div>
                <div className="table-item">
                  <span style={{ width: "17%" }}>УСН “Доходы-расходы”</span>
                  <span style={{ width: "22%" }}>15% с разницы</span>
                  <span style={{ width: "61%" }}>
                    Доход = стоимость переданного, расход = стоимость
                    полученного (если подтверждено документами)
                  </span>
                </div>
                <div className="table-item">
                  <span style={{ width: "17%" }}>НПД (самозанятые)</span>
                  <span style={{ width: "22%" }}>НПД не применяется</span>
                  <span style={{ width: "61%" }}>
                    Доход облагается как у физлица – НДФЛ 13% / 15%
                  </span>
                </div>
                <div className="table-item">
                  <span style={{ width: "17%" }}>ПСН (патент)</span>
                  <span style={{ width: "22%" }}>
                    Без дополнительных налогов
                  </span>
                  <span style={{ width: "61%" }}>
                    Если обмен входит в вид деятельности по патенту
                  </span>
                </div>
                <div className="table-item">
                  <span style={{ width: "17%" }}>ЕСХН</span>
                  <span style={{ width: "22%" }}>ЕСХН + иногда НДС</span>
                  <span style={{ width: "61%" }}>
                    Доход учитывается, расходы – если входят в ст. 346.5 НК
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="barter-green-block">
          <div className="wrapper">
            <div className="info">
              <div className="left">
                <h3>
                  Чек-лист: <br />
                  чтобы бартер был легальным и выгодным
                </h3>
                <img
                  src="/img/article/barter-green-img.png"
                  alt="Чек-лист для легального и выгодного бартера"
                  loading="lazy"
                />
              </div>
              <div className="list-info">
                <div className="list-item">
                  <span className="icon">
                    <img
                      src="/img/article/barter-check.svg"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="text">
                    Определите предмет сделки (товары/услуги)
                  </span>
                </div>
                <div className="list-item">
                  <span className="icon">
                    <img
                      src="/img/article/barter-check.svg"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="text">
                    Выберите подходящий тип договора (мена / смешанный / услуги)
                  </span>
                </div>
                <div className="list-item">
                  <span className="icon">
                    <img
                      src="/img/article/barter-check.svg"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="text">
                    Укажите условия передачи и приёмки
                  </span>
                </div>
                <div className="list-item">
                  <span className="icon">
                    <img
                      src="/img/article/barter-check.svg"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="text">
                    Если обмен неравноценный — зафиксируйте компенсацию
                  </span>
                </div>
                <div className="list-item">
                  <span className="icon">
                    <img
                      src="/img/article/barter-check.svg"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="text">
                    Учтите налоговые последствия в зависимости от режима
                  </span>
                </div>
                <div className="list-item">
                  <span className="icon">
                    <img
                      src="/img/article/barter-check.svg"
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="text">
                    <span>
                      Документально подтвердите сделку (договор + акты)
                    </span>
                  </span>
                </div>
                <div className="list-item">
                  <span className="icon">
                    <img src="/img/article/barter-check.svg" alt="" />
                  </span>
                  <span className="text">
                    Для удобства используйте ЭДО и электронную подпись
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="result-wrap">
          <div className="wrapper">
            <div className="texts">
              <h2>Итог</h2>
              <h5>
                Бартер — это современный и абсолютно легальный инструмент для
                бизнеса. <br /> Он помогает:
              </h5>
              <ul>
                <li>экономить деньги,</li>
                <li>расширять аудиторию,</li>
                <li>находить новых партнёров.</li>
              </ul>
              <p>
                Главное — закреплять условия договором и правильно учитывать
                налоги. Всё остальное зависит от вашей креативности и готовности
                к новым формам сотрудничества.
              </p>
            </div>
            <div className="img">
              <img
                src="/img/article/result-img1.png"
                alt="Преимущества бартера для бизнеса"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <Script id="article-jsonld" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Бартер: что нужно знать, чтобы использовать его с выгодой",
            description:
              "Руководство по бартеру: форматы, оформление договора, налоги и чек-лист для бизнеса.",
            inLanguage: "ru",
            author: { "@type": "Organization", name: "SWAPPE" },
            mainEntityOfPage: "/articles/barter",
            image: ["/img/article/result-img1.png"],
          })}
        </Script>
        <Script id="breadcrumb-jsonld" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: "/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Статьи",
                item: "/articles",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Бартер",
                item: "/articles/barter",
              },
            ],
          })}
        </Script>
      </div>
    </MainTemplate>
  );
}

export default Page;
