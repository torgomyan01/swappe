"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";

function OfferPage() {
  return (
    <MainTemplate>
      <div className="wrapper">
        <div className="breadcrumbs hide-mobile">
          <Link href={SITE_URL.HOME}>
            Главная
            <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <a href="#">
            ВкусВилл Праздник
            <img src="/img/arr-r.svg" alt="arrow" />
          </a>
          <span>Кейтеринг для мероприятий</span>
        </div>
      </div>

      <div className="creating-proposal">
        <div className="wrapper">
          <div className="proposal-info">
            <div className="left-info">
              <div className="swiper main-slider">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img2.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img2.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img.png" alt="" />
                  </div>
                </div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
              </div>
              <div className="swiper thumbs">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img2.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img2.png" alt="" />
                    <span className="icon">
                      <img src="/img/creating-proposal/video-icon.svg" alt="" />
                    </span>
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img.png" alt="" />
                  </div>
                  <div className="swiper-slide">
                    <img src="/img/creating-proposal/slider-img.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="right-info">
              <h1>Кейтеринг для мероприятий</h1>
              <div className="rate">
                <b>ВкусВилл Праздник</b>
                <div className="rate-text">
                  4.5
                  <img src="/img/star.svg" alt="" />
                </div>
                <span>(34)</span>
              </div>
              <b className="price">₽20 000</b>
              <div className="links">
                <a href="#">Доставка</a>
                <a href="#">Кейтеринг</a>
              </div>
              <div className="info-btns">
                <a href="#" className="green-btn">
                  <img src="/img/start-sale.svg" alt="" />
                  Предложить сделку
                </a>
                <a href="#" className="heart-btn">
                  <img src="/img/heart.svg" alt="" />
                </a>
              </div>
              <ul className="list">
                <li>
                  <b>Организатор:</b>
                  <span className="grey">ООО «ВкусВилл Праздник»</span>
                </li>
                <li>
                  <b>Поставщик:</b>
                  <span className="grey">ООО «Фермерский двор»</span>
                </li>
                <li>
                  <b>Срочность исполнения:</b>
                  <span className="grey">2 раб. дня до даты мероприятия</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="texts-wrap">
            <div className="item">
              <b>Интересующие товары и услуги</b>
              <p>
                Кухня. Здесь все время что-то кипит, печется, шкварчит, тушится,
                жарится. Повара знают, как и что красиво оформить, куда и чего
                побольше насыпать. Однако прежде чем подавать фирменное блюдо,
                нужно позвать гостей за ваши столы. Жаль, но аппетитные запахи с
                кухни не доходят до пользователей интернета. К счастью, здесь
                вам на помощь приходят образы, визуализация и эксклюзив.
              </p>
            </div>
            <div className="item">
              <b>Внесение изменений</b>
              <p>
                Вы слышали выражение «Пойдем посидим». В нем заключается вся
                суть хождения по кафе, ресторанам и барам. В первую очередь люди
                ходят туда не вкусно и дешево поесть, а пообщаться – на других
                посмотреть и себя показать. Но при этом кухня всегда должна быть
                на уровне.
              </p>
            </div>
            <div className="item">
              <b>О контрагенте</b>
              <p>
                Условия доставки каждого интернет-магазина отличаются друг от
                друга. Они зависят от политики компании, выбранной стратегии, а
                также объемов продаж. Некоторые сайты включают услугу в
                стоимость продукта, другие — варьируют её в зависимости от
                региона получения покупки или стоимости заказа.
              </p>
            </div>
          </div>
          <div className="title-wrap">
            <h3>Отзывы</h3>
            <div className="stars-info">
              <div className="images">
                <img src="/img/star.svg" alt="" />
                <img src="/img/star.svg" alt="" />
                <img src="/img/star.svg" alt="" />
                <img src="/img/star.svg" alt="" />
                <img src="/img/star-dubl.svg" alt="" />
              </div>
              <span>4.5 / 5.0</span>
            </div>
          </div>
          <div className="review-items">
            <div className="review-item">
              <div className="top">
                <div className="stars">
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star-dubl.svg" alt="" />
                </div>
              </div>
              <p className="text">
                The platform is incredibly user-friendly, allowing me to easily
                manage my inventory, create stunning product listings, and
                process orders seamlessly. The advanced analytics have also
                provided valuable insights into my customers.
              </p>
              <div className="name-wrap">
                <div className="img">
                  <img src="/img/rew-avatar.png" alt="" />
                </div>
                <b>Название компании</b>
                <span>26 Nov 2021</span>
              </div>
            </div>
            <div className="review-item">
              <div className="top">
                <div className="stars">
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star-dubl.svg" alt="" />
                </div>
              </div>
              <p className="text">
                The platform is incredibly user-friendly, allowing me to easily
                manage my inventory, create stunning product listings, and
                process orders seamlessly. The advanced analytics have also
                provided valuable insights into my customers.
              </p>
              <div className="name-wrap">
                <div className="img">
                  <img src="/img/rew-avatar.png" alt="" />
                </div>
                <b>Название компании</b>
                <span>26 Nov 2021</span>
              </div>
            </div>
            <div className="review-item">
              <div className="top">
                <div className="stars">
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star.svg" alt="" />
                  <img src="/img/star-dubl.svg" alt="" />
                </div>
              </div>
              <p className="text">
                The platform is incredibly user-friendly, allowing me to easily
                manage my inventory, create stunning product listings, and
                process orders seamlessly. The advanced analytics have also
                provided valuable insights into my customers.
              </p>
              <div className="name-wrap">
                <div className="img">
                  <img src="/img/rew-avatar.png" alt="" />
                </div>
                <b>Название компании</b>
                <span>26 Nov 2021</span>
              </div>
            </div>
          </div>
          <div className="look-more">
            <h3>Посмотри еще</h3>
            <div className="look-more-items">
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
                <b className="name">Кейтеринг для мероприятия</b>
                <div className="texts">
                  <span>Бартер</span>
                  <b>₽30 000</b>
                </div>
              </div>
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
                <b className="name">Кейтеринг для мероприятия</b>
                <div className="texts">
                  <span>Бартер</span>
                  <b>₽30 000</b>
                </div>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offers-img2.png" alt="" />
                  </a>
                  <div className="favorite"></div>
                </div>
                <div className="text-wrap">
                  <span>Кейтеринг для мероприятия</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <b className="name">Кейтеринг для мероприятия</b>
                <div className="texts">
                  <span>Бартер</span>
                  <b>₽30 000</b>
                </div>
              </div>
            </div>
            <a href="#" className="green-btn">
              Показать больше
            </a>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default OfferPage;
