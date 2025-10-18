"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionMyOffers } from "@/app/actions/offers/get";
import { useRouter } from "next/navigation";
import OfferCard from "@/app/search/components/offer-card";
import clsx from "clsx";
import EmptyRes from "@/components/common/empty-res/empty-res";

function Profile() {
  const router = useRouter();
  const [offers, setOffers] = useState<IUserOffer[]>([]);

  const [offerStatus, setOfferStatus] = useState<OfferStatus>("active");

  useEffect(() => {
    setOffers([]);
    ActionMyOffers(offerStatus).then(({ data }) => {
      setOffers(data as any);
    });
  }, [offerStatus]);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Мои предложения</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Мои предложения</b>
          </div>
          <div className="info">
            <LeftMenu />
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
                <button
                  className={clsx("tab-button", {
                    active: offerStatus === "moderation",
                  })}
                  onClick={() => setOfferStatus("moderation")}
                >
                  На модерации
                </button>
              </div>
              <div className="tab-content-wrap">
                {offers.length === 0 && offerStatus === "archive" ? (
                  <EmptyRes title="Пока ничего нет" />
                ) : null}

                <div className="tab-content active">
                  <div className="offers-items">
                    {offers.length > 0 &&
                      offers.map((offer: IUserOfferFront, index) => (
                        <OfferCard
                          key={`my-offers-${index}`}
                          offer={offer}
                          onlyTitle
                        />
                      ))}

                    {offerStatus === "active" && (
                      <div className="proposal">
                        <Link href={SITE_URL.ACCOUNT_OFFER_CREATE}>
                          <div className="icon">
                            <img src="/img/plus-white.svg" alt="" />
                          </div>
                          <span>
                            Создать <br /> новое предложение
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
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

export default Profile;
