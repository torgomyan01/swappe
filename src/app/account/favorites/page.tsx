"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";

function Profile() {
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
                <button className="tab-button active">Компании</button>
                <button className="tab-button">Предложения</button>
              </div>
              <div className="tab-content-wrap">
                <div className="tab-content active">
                  <div className="favorite-items">
                    <div className="favorite-item">
                      <div className="img">
                        <img src="/img/fav-avatar.png" alt="" />
                      </div>
                      <div className="favorite open"></div>
                      <div className="name-wrap">
                        <b>Название Компании</b>
                        <span>
                          4.3
                          <img src="/img/star-small.svg" alt="" />
                        </span>
                      </div>
                      <div className="texts">
                        <div className="text">
                          <span>Город</span>
                          <b>Москва и МО</b>
                        </div>
                        <div className="text">
                          <span>Бартерная стоимость</span>
                          <b>₽ 30 000</b>
                        </div>
                      </div>
                      <div className="tags">
                        <a href="#" className="tag">
                          Кейтеринг
                        </a>
                        <a href="#" className="tag">
                          Доставка
                        </a>
                      </div>
                    </div>
                    <div className="favorite-item">
                      <div className="img">
                        <img src="/img/fav-avatar.png" alt="" />
                      </div>
                      <div className="favorite open"></div>
                      <div className="name-wrap">
                        <b>Название Компании</b>
                        <span>
                          4.3
                          <img src="/img/star-small.svg" alt="" />
                        </span>
                      </div>
                      <div className="texts">
                        <div className="text">
                          <span>Город</span>
                          <b>Москва и МО</b>
                        </div>
                        <div className="text">
                          <span>Бартерная стоимость</span>
                          <b>₽ 30 000</b>
                        </div>
                      </div>
                      <div className="tags">
                        <a href="#" className="tag">
                          Кейтеринг
                        </a>
                        <a href="#" className="tag">
                          Доставка
                        </a>
                      </div>
                    </div>
                    <div className="favorite-item">
                      <div className="img">
                        <img src="/img/fav-avatar.png" alt="" />
                      </div>
                      <div className="favorite open"></div>
                      <div className="name-wrap">
                        <b>Название Компании</b>
                        <span>
                          4.3
                          <img src="/img/star-small.svg" alt="" />
                        </span>
                      </div>
                      <div className="texts">
                        <div className="text">
                          <span>Город</span>
                          <b>Москва и МО</b>
                        </div>
                        <div className="text">
                          <span>Бартерная стоимость</span>
                          <b>₽ 30 000</b>
                        </div>
                      </div>
                      <div className="tags">
                        <a href="#" className="tag">
                          Кейтеринг
                        </a>
                        <a href="#" className="tag">
                          Доставка
                        </a>
                      </div>
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
