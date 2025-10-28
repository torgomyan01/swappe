"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import CompanyLeftMenu from "@/app/company/components/company-left-menu";
import { useEffect, useState } from "react";
import { ActionCompanyOffers } from "@/app/actions/offers/get-company-offers";
import OfferCard from "@/app/search/components/offer-card";
import clsx from "clsx";
import { Spinner } from "@heroui/react";
import EmptyRes from "@/components/common/empty-res/empty-res";

interface IThisProps {
  company: IUserCompany;
}

function CompanyPageOffers({ company }: IThisProps) {
  const [offers, setOffers] = useState<IUserOffer[]>([]);

  const [loading, setLoading] = useState(true);

  const [offerStatus, setOfferStatus] = useState<OfferStatus>("active");

  useEffect(() => {
    setLoading(true);
    setOffers([]);
    ActionCompanyOffers(+company.user_id, offerStatus)
      .then(({ data }) => {
        setOffers(data as any);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [offerStatus]);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.SEARCH}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>{company.name}</span>
          </div>
          <div className="top-mob-line">
            <Link href={SITE_URL.SEARCH} className="back">
              <img src="/img/back-icon.svg" alt="" />
            </Link>
            <b>{company.name}</b>
          </div>
          <div className="info">
            <CompanyLeftMenu company={company} />
            <div className="profile favorite-account">
              <div className="tabs">
                <button
                  className={clsx("tab-button", {
                    active: offerStatus === "active",
                  })}
                  onClick={() => setOfferStatus("active")}
                >
                  Активные предложения
                </button>
                <button
                  className={clsx("tab-button", {
                    active: offerStatus === "archive",
                  })}
                  onClick={() => setOfferStatus("archive")}
                >
                  Архив
                </button>
              </div>
              <div className="tab-content-wrap">
                {loading ? (
                  <div className="w-full h-[400px] flex-jc-c">
                    <Spinner color="secondary" />
                  </div>
                ) : (
                  <>
                    {offers.length > 0 ? (
                      <div className="tab-content active">
                        <div className="offers-items">
                          {offers.map((offer: IUserOfferFront, index) => (
                            <OfferCard
                              key={`my-offers-${index}`}
                              offer={offer}
                              onlyTitle
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <EmptyRes
                        title={`${offerStatus === "active" ? "Активные предложения" : "Архивные предложения"} не найдены`}
                      />
                    )}
                  </>
                )}

                <div className="tab-content">
                  <div className="offers-items">
                    <div className="offer-item">
                      <div className="img-wrap">
                        <a href="#" className="img">
                          <img src="/img/offers-img2.png" alt="" />
                        </a>
                        <div className="favorite open"></div>
                      </div>
                      <div className="text-wrap">
                        <span>Кейтеринг для мероприятия</span>
                        <b>
                          4.5 <img src="/img/star-small.svg" alt="" />
                        </b>
                      </div>
                    </div>
                    <div className="offer-item">
                      <div className="img-wrap">
                        <a href="#" className="img">
                          <img src="/img/offers-img1.png" alt="" />
                        </a>
                        <div className="favorite open"></div>
                      </div>
                      <div className="text-wrap">
                        <span>Кейтеринг для мероприятия</span>
                        <b>
                          4.3 <img src="/img/star-small.svg" alt="" />
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default CompanyPageOffers;
