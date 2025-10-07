"use client";

import { ActionGetTariffs } from "@/app/actions/admin/tariff";
import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import { Button, Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Profile() {
  const { data: session } = useSession();
  console.log(session);

  const router = useRouter();

  const [tariffs, setTariffs] = useState<ITariff[] | null>(null);

  useEffect(() => {
    ActionGetTariffs().then((res) => {
      if (res.status === "ok") {
        setTariffs(res.data as unknown as ITariff[]);
      }
    });
  }, []);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <a href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </a>
            <span>Тарифы и бонусы</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Тарифы и бонусы</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile bonuses-account">
              <h3>Тарифы и бонусы</h3>

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

              <div className="flex-jsb-s gap-2 mb-4 items-stretch">
                {tariffs ? (
                  tariffs.map((tariff) => (
                    <div
                      key={`tarif-block-${tariff.name}`}
                      className="level-info border border-gray-200/80"
                    >
                      <h3 className="!mb-0">{tariff.title}</h3>
                      <div className="tab-content-wrap h-full">
                        <div className="tab-content active !flex-jsb-c flex-col h-full">
                          <div>
                            <b className="price">
                              {`${new Intl.NumberFormat("ru-RU").format(
                                tariff.price,
                              )} ₽`}
                            </b>
                            <ul>
                              {tariff.supportText.map((text) => (
                                <li key={`tarif-text-${text}`}>{text}</li>
                              ))}
                            </ul>
                          </div>
                          <Button className="green-btn">Присоединиться</Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-jc-c w-full h-[400px]">
                    <Spinner color="secondary" />
                  </div>
                )}
              </div>

              <hr className="my-8 border-gray-200/80" />

              {/* <div className="bonuses-info-block">
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
              </div> */}

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
