"use client";

import "./_notifications.scss";
import "./_search.scss";

import MainTemplate from "@/components/common/main-template/main-template";

import Filter from "@/app/search/components/filter";
import { Button, Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionSearchOffer } from "@/app/actions/search/search";
import OfferCard from "@/app/search/components/offer-card";
import OfferCardLoading from "@/app/search/components/offer-card-loading";
import { RandomKey } from "@/utils/helpers";

const OFFERS_PER_PAGE = 9;

function Search() {
  const searchParams = useSearchParams();

  const search = searchParams.get("value");
  const type = searchParams.get("type") as OfferType | null;
  const vid = searchParams.get("vid") as OfferVid | null;
  const cat = searchParams.get("cat") as string | null;

  const [result, setResult] = useState<IUserOfferFront[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);

  const totalPages = Math.ceil(totalOffers / OFFERS_PER_PAGE);

  useEffect(() => {
    setResult(null);

    let cats = null;

    if (cat) {
      cats = cat?.split(".").map((cat) => +cat);
    }

    console.log(cats, 5555555);

    ActionSearchOffer(
      search || "",
      currentPage,
      OFFERS_PER_PAGE,
      type,
      vid,
      cats,
    ).then(({ data, totalCount }) => {
      setResult(data as IUserOfferFront[]);
      setTotalOffers(totalCount);
    });
  }, [search, currentPage, type, vid, cat]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setResult(null);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setResult(null);
    }
  };

  return (
    <MainTemplate>
      <div className="notifications-wrapper">
        <div className="notifications">
          <div className="top-mob">
            <a href="#" className="back">
              <img src="/img/back-left.svg" alt="" />
            </a>
            <b>Уведомления</b>
          </div>
          <div className="top-line">
            <b>Уведомления</b>
            <div className="new">
              <span>Только новые</span>
              <div className="switch" id="mySwitch">
                <div className="slider"></div>
              </div>
            </div>
          </div>
          <div className="view-all">Пометить все просмотренными (2)</div>
          <a href="#" className="notifications-item">
            <div className="icon">
              <img src="/img/search/notifications-icon1.svg" alt="" />
            </div>
            <div className="texts">
              <b>Новое предложение</b>
              <span>Diamond кейтеринг предлагает сделку</span>
            </div>
            <div className="circle"></div>
          </a>
          <a href="#" className="notifications-item">
            <div className="icon">
              <img src="/img/search/notifications-icon2.svg" alt="" />
            </div>
            <div className="texts">
              <b>Cтатус сделки</b>
              <span>Diamond кейтеринг принял предложение</span>
            </div>
            <div className="circle"></div>
          </a>
          <div className="border"></div>
          <div className="notifications-items">
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon3.svg" alt="" />
              </div>
              <div className="texts">
                <b>Cтатус сделки</b>
                <span>Diamond кейтеринг принял предложение</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon4.svg" alt="" />
              </div>
              <div className="texts">
                <b>Предложение прошло модерацию</b>
                <span>Кейтеринг в день мероприятия с выездом на площадку</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon5.svg" alt="" />
              </div>
              <div className="texts">
                <b>Предложение не прошло модерацию</b>
                <span>Кейтеринг в день мероприятия с выездом на площадку</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
          </div>
          <div className="border"></div>
          <div className="not-info">
            <div className="head">
              <b>Как все прошло?</b>
              <button className="close" type="button">
                <img src="/img/close-pop.svg" alt="" />
              </button>
            </div>
            <p>
              Ваша сделка с Dостаевский завершена. Поделись отзывом и помоги
              другим найти ту самую коллаборацию!
            </p>
            <div className="info">
              <div className="text-wrap">
                <div className="texts">
                  <b>Кейтеринг для мероприятия</b>
                  <span>Dостаевский</span>
                </div>
                <span>26 Nov 2021</span>
              </div>
              <div className="img-wrap">
                <img src="/img/search/not-info-icon.png" alt="" />
              </div>
            </div>
          </div>
          <a href="#" className="leave-feedback">
            <img src="/img/search/rew-icon.svg" alt="" />
            <b>Оставить отзыв</b>
          </a>
        </div>
      </div>
      <div className="search-wrapper">
        <div className="wrapper">
          <div className="mobile-filter-btns">
            <form>
              <button type="button">
                <img src="/img/search-icon.svg" alt="" />
              </button>
              <input type="text" placeholder="Введи запрос" />
            </form>
            <a href="#" className="favorite-btn">
              <img src="/img/heart.svg" alt="" />
            </a>
            <a href="#" className="filter-btn">
              <img src="/img/filter-icon.svg" alt="" />
            </a>
          </div>

          <Filter />

          <div className="search-info-block">
            <div className="info-top">
              <div className="texts">
                <b>{result?.length}</b>
                <span>найдено</span>
              </div>
              <Select
                className="w-[200px] custom-select"
                placeholder="Сортировка"
              >
                <SelectItem key="По Цене Бартера">По Цене Бартера</SelectItem>
                <SelectItem key="По Цене компании">По Цене Компании</SelectItem>
              </Select>
            </div>
            <div className="items">
              {result
                ? result.map((item, i) => (
                    <OfferCard key={`offer-card-${i}`} offer={item} />
                  ))
                : Array.from({ length: 6 }).map(() => (
                    <OfferCardLoading key={RandomKey()} />
                  ))}
            </div>
            <div className="pagination">
              <Button
                type="button"
                onPress={handlePrevPage}
                disabled={currentPage === 1}
              >
                <img src="/img/right.svg" alt="" className="rotate" />
              </Button>
              <span>
                Страница {currentPage} из {totalPages}
              </span>
              <Button
                type="button"
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <img src="/img/right.svg" alt="" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Search;
