"use client";

import "./_notifications.scss";
import "./_search.scss";

import MainTemplate from "@/components/common/main-template/main-template";

import Filter from "@/app/search/components/filter";
import { Button } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionSearchOffer } from "@/app/actions/search/search";
import OfferCard from "@/app/search/components/offer-card";
import OfferCardLoading from "@/app/search/components/offer-card-loading";
import { RandomKey } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";

const OFFERS_PER_PAGE = 9;

function Search() {
  const filterParams = useSelector(
    (state: ISearchFilterStore) => state.searchFilter,
  );

  const searchParams = useSearchParams();

  const search = searchParams.get("value");

  const [mobileFilter, setMobileFilter] = useState(false);

  const [result, setResult] = useState<IUserOfferFront[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);

  const totalPages = Math.ceil(totalOffers / OFFERS_PER_PAGE);

  useEffect(() => {
    setResult(null);

    ActionSearchOffer(
      search || "",
      currentPage,
      OFFERS_PER_PAGE,
      filterParams,
    ).then(({ data, totalCount }) => {
      setResult(data as IUserOfferFront[]);
      setTotalOffers(totalCount);
    });
  }, [search, currentPage, filterParams]);

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
      <div className="search-wrapper">
        <div className="wrapper">
          <div className="mobile-filter-btns">
            <form action={SITE_URL.SEARCH}>
              <button type="button">
                <img src="/img/search-icon.svg" alt="" />
              </button>
              <input
                type="text"
                placeholder="Введи запрос"
                name="value"
                defaultValue={search || ""}
              />
            </form>
            <Link href={SITE_URL.ACCOUNT_FAVORITES} className="favorite-btn">
              <img src="/img/heart.svg" alt="" />
            </Link>
            <Button
              className="filter-btn p-0"
              onPress={() => setMobileFilter(true)}
            >
              <img src="/img/filter-icon.svg" alt="" />
            </Button>
          </div>

          <Filter
            mobileShow={mobileFilter}
            onClose={() => setMobileFilter(false)}
          />

          <div className="search-info-block">
            <div className="info-top">
              <div className="texts">
                <b>{result?.length}</b>
                <span>найдено</span>
              </div>
              {/*<Select*/}
              {/*  className="w-[200px] custom-select"*/}
              {/*  placeholder="Сортировка"*/}
              {/*>*/}
              {/*  <SelectItem key="По Цене Бартера">По Цене Бартера</SelectItem>*/}
              {/*  <SelectItem key="По Цене компании">По Цене Компании</SelectItem>*/}
              {/*</Select>*/}
            </div>
            <div className="items">
              {result ? (
                <>
                  {result.length > 0 ? (
                    result.map((item, i) => (
                      <OfferCard key={`offer-card-${i}`} offer={item} />
                    ))
                  ) : (
                    <div className="col-span-3 flex-jc-c h-[150px]">
                      <h3 className="text-green">Ничего не найдено (</h3>
                    </div>
                  )}
                </>
              ) : (
                Array.from({ length: 6 }).map(() => (
                  <OfferCardLoading key={RandomKey()} />
                ))
              )}
            </div>
            {result && result?.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Search;
