"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useState } from "react";
import FavoriteCompany from "@/app/account/favorites/components/favorite-company";
import FavoriteOffer from "@/app/account/favorites/components/favorite-offer";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const itemsFavorite = [
  {
    name: "Компании",
    component: <FavoriteCompany />,
  },
  {
    name: "Предложения",
    component: <FavoriteOffer />,
  },
];

function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Избранное</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT())}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Избранное</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile favorite-account">
              <div className="tabs">
                {itemsFavorite.map((item, i) => (
                  <button
                    key={`itemsFavorite-${i}`}
                    className={clsx("tab-button", {
                      active: activeTab === i,
                    })}
                    onClick={() => setActiveTab(i)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="tab-content-wrap">
                {itemsFavorite[activeTab].component}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
