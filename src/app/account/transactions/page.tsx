"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

function Profile() {
  const activeTab = ["Активные сделки", "Архив"];
  const [active, setActive] = useState(0);

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
            <a href="profile-mobila.html" className="back">
              <img src="/img/back-icon.svg" alt="" />
            </a>
            <b>Сделки</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile favorite-account">
              <div className="tabs">
                {activeTab.map((item, index) => (
                  <button
                    key={`key-trans-${item}`}
                    className={clsx("tab-button", {
                      "!rounded-[50px] active": active === index,
                    })}
                    onClick={() => setActive(index)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="tab-content-wrap">
                <div
                  className={clsx("tab-content", {
                    active: active === 0,
                  })}
                >
                  <div className="transactions-info">
                    <div className="transactions-item">
                      <div className="info-items">
                        <img
                          src="/img/transactions-icon1.svg"
                          alt=""
                          className="style-img"
                        />
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img1.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img2.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                      </div>
                      <div className="bottom-line">
                        <div className="new">
                          <img src="/img/new-style.svg" alt="" />
                          <span>Новая</span>
                        </div>
                        <div className="chat">
                          <img src="/img/chat-icon.svg" alt="" />
                          Чат
                        </div>
                        <a href="#" className="green-btn">
                          <img src="/img/check-white.svg" alt="" />
                          Подтвердить сделку
                        </a>
                      </div>
                    </div>
                    <div className="transactions-item">
                      <div className="info-items">
                        <img
                          src="/img/transactions-icon2.svg"
                          alt=""
                          className="style-img"
                        />
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img1.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img2.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                      </div>
                      <div className="bottom-line">
                        <div className="new">
                          <img src="/img/new-style2.svg" alt="" />
                          <span>Предложение принято</span>
                        </div>
                        <div className="chat">
                          <img src="/img/chat-icon.svg" alt="" />
                          Чат
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={clsx("tab-content", {
                    active: active === 1,
                  })}
                >
                  <div className="transactions-info">
                    <div className="transactions-item">
                      <div className="info-items">
                        <img
                          src="/img/transactions-icon3.svg"
                          alt=""
                          className="style-img"
                        />
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img1.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img2.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                      </div>
                      <div className="bottom-line">
                        <div className="new">
                          <img src="/img/new-style3.svg" alt="" />
                          <span>Исполненная</span>
                        </div>
                      </div>
                    </div>
                    <div className="transactions-item">
                      <div className="info-items">
                        <img
                          src="/img/transactions-icon4.svg"
                          alt=""
                          className="style-img"
                        />
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img1.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                        <div className="info-item">
                          <div className="img-wrap">
                            <img src="/img/transactions-img2.png" alt="" />
                          </div>
                          <div className="top">
                            <span>Название контрагента</span>
                            <b>
                              4.5 <img src="/img/star-small.svg" alt="" />
                            </b>
                          </div>
                          <span className="name">Название услуги</span>
                          <span className="grey">Бартерная стоимость</span>
                          <span className="price">₽ 30 000</span>
                        </div>
                      </div>
                      <div className="bottom-line">
                        <div className="new">
                          <img src="/img/new-style4.svg" alt="" />
                          <span>Заключен договор</span>
                        </div>
                        <div className="chat">
                          <img src="/img/chat-icon.svg" alt="" />
                          Чат
                        </div>
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
