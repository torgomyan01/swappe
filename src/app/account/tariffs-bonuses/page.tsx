"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import { useRouter } from "next/navigation";

function Profile() {
  const router = useRouter();

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <a href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </a>
            <span>Тариф и бонусы</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT())}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Тариф и бонусы</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile bonuses-account">
              <h3>Тариф и бонусы</h3>
              <div className="bonuses-info-block">
                <div className="top">
                  <span className="text">Мой тариф</span>
                  <span className="date">До 21.03.2025</span>
                </div>
                <h2>Продвинутый</h2>
                <ul>
                  <li>
                    <img src="/img/premium.png" alt="" />5 открытых в работе
                    сделок
                  </li>
                  <li>
                    <img src="/img/premium.png" alt="" />
                    ПУБЛИЦАЦИЯ 3 ОБЪЯВЛЕНИЙ НА 1 МЕС. ВХОДИТ В ПОДПИСКУ
                  </li>
                  <li>
                    <img src="/img/premium.png" alt="" />
                    КЭШБЭК С КАЖДОГО ДОПОЛНИТЕЛЬНОГО РАЗМЕЩЕНИЯ 10%
                  </li>
                  <li>
                    <img src="/img/premium.png" alt="" />
                    размещение дополнительного объявления вне пакета подписки —
                    370 ₽
                  </li>
                </ul>
                <a href="#" className="manage-btn">
                  Управлять
                </a>
              </div>
              <div className="bonuses-info">
                <div className="bonuses-info-item">
                  <div className="top">
                    <div className="icon green">
                      <img src="/img/bon-icon1.svg" alt="" />
                    </div>
                    <div className="texts">
                      <span>Основной счет</span>
                      <b>30 000,65 ₽</b>
                    </div>
                  </div>
                  <a href="#" className="green-btn">
                    <img src="/img/plus-icon.svg" alt="" />
                    Пополнить
                  </a>
                </div>
                <div className="bonuses-info-item">
                  <div className="top">
                    <div className="icon yellow">
                      <img src="/img/bon-icon2.svg" alt="" />
                    </div>
                    <div className="texts">
                      <span>Накопленные бонусы</span>
                      <b>675</b>
                    </div>
                  </div>
                  <a href="#" className="yellow-btn">
                    <img src="/img/gift-icon.svg" alt="" />
                    Условия программы
                  </a>
                </div>
              </div>
              <h4>Реферальная программа</h4>
              <p>
                Компания предлагает клиентам посоветовать свой продукт знакомым
                и получить за это вознаграждение: скидку, деньги или баллы на
                бонусный счёт.
              </p>
              <div className="referral-link-wrap">
                <span>Твоя реферальная ссылка</span>
                <div className="referral-container">
                  <button className="copy-button">📋</button>
                  <span className="referral-link" id="refLink">
                    https://placeholder_referalprogramSwappe_34CHF12
                  </span>
                </div>
              </div>
              <h4>История активаций</h4>
              <div className="activate">
                <div className="item">
                  <div className="img">
                    <img src="/img/rew-avatar.png" alt="" />
                  </div>
                  <div className="texts">
                    <b>Название компании</b>
                    <span>26 Nov 2021</span>
                  </div>
                </div>
                <div className="item">
                  <div className="img">
                    <img src="/img/rew-avatar.png" alt="" />
                  </div>
                  <div className="texts">
                    <b>Название компании</b>
                    <span>26 Nov 2021</span>
                  </div>
                </div>
                <div className="item">
                  <div className="img">
                    <img src="/img/rew-avatar.png" alt="" />
                  </div>
                  <div className="texts">
                    <b>Название компании</b>
                    <span>26 Nov 2021</span>
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
