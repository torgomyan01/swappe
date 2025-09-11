"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionMyOffers } from "@/app/actions/offers/get";
import Image from "next/image";

function Profile() {
  const [offers, setOffers] = useState<IUserOffer[]>([]);

  useEffect(() => {
    ActionMyOffers().then(({ data }) => {
      setOffers(data as any);
    });
  }, []);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Сделки</span>
          </div>
          <div className="top-mob-line">
            <span className="back">
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Сделки</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile favorite-account">
              <div className="tabs">
                <button className="tab-button active">
                  Активные предложения
                </button>
                <button className="tab-button">Архив</button>
              </div>
              <div className="tab-content-wrap">
                <div className="tab-content active">
                  <div className="offers-items">
                    {offers.map((offer: IUserOfferFront, index) => (
                      <div key={`my-offer-${index}`} className="offer-item">
                        <div className="img-wrap">
                          <Link
                            href={`${SITE_URL.OFFER}/${offer.id}`}
                            className="img"
                          >
                            <Image
                              src={`${fileHost}${offer.images[0]}`}
                              alt=""
                              width={500}
                              height={500}
                              className="w-full h-full rounded-[12px] object-cover"
                            />
                          </Link>
                          <div className="dots-wrap">
                            <div className="dot">
                              <img src="/img/dots-menu.png" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="text-wrap">
                          <Link
                            href={`${SITE_URL.OFFER}/${offer.id}`}
                            className="img"
                          >
                            <span>{offer.name}</span>
                          </Link>
                          <b>
                            4.5 <img src="/img/star-small.svg" alt="" />
                          </b>
                        </div>
                      </div>
                    ))}

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
