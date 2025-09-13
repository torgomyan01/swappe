"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { formatPrice, getMapIframeUrl, truncateString } from "@/utils/helpers";
import { useRef, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";

interface IThisProps {
  offer: IUserOfferFront;
}

function OfferPage({ offer }: IThisProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <MainTemplate>
      <div className="wrapper">
        <div className="breadcrumbs hide-mobile">
          <Link href={SITE_URL.HOME}>
            Главная
            <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <Link href={`${SITE_URL.COMPANY}/${offer.user.company.id}`}>
            {offer.user.company.name}
            <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <span>{truncateString(offer.name)}</span>
        </div>
      </div>

      <div className="creating-proposal">
        <div className="wrapper">
          <div className="proposal-info">
            <div className="left-info">
              <div className="max-w-4xl mx-auto sticky top-5">
                {/* Main Slider */}
                <div className="relative mb-6">
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    spaceBetween={10}
                    navigation={{
                      prevEl: prevRef.current,
                      nextEl: nextRef.current,
                    }}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    className="main-swiper rounded-2xl overflow-hidden shadow-lg"
                    onSlideChange={(swiper) =>
                      setActiveIndex(swiper.activeIndex)
                    }
                    onBeforeInit={(swiper) => {
                      if (typeof swiper.params.navigation !== "boolean") {
                        const navigation = swiper.params.navigation;
                        if (navigation) {
                          navigation.prevEl = prevRef.current;
                          navigation.nextEl = nextRef.current;
                        }
                      }
                    }}
                  >
                    {offer.images.map((slide, index) => (
                      <SwiperSlide key={`images-product-${index}`}>
                        <div className="aspect-[4/3] bg-gray-100">
                          <Image
                            src={`${fileHost}${slide}` || "./default-image.png"}
                            alt={offer.name}
                            className="w-full h-full object-cover"
                            width={800}
                            height={800}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Navigation Buttons */}
                  <button
                    ref={prevRef}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <i className="fa-regular fa-chevron-left text-gray-700"></i>
                  </button>

                  <button
                    ref={nextRef}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <i className="fa-regular fa-chevron-right text-gray-700"></i>
                  </button>
                </div>

                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  className="thumbs-swiper"
                  breakpoints={{
                    640: {
                      slidesPerView: 4,
                      spaceBetween: 16,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                  }}
                >
                  {offer.images.map((slide, index) => (
                    <SwiperSlide
                      key={`thumb-offer__${index}`}
                      className="my-4 px-2"
                    >
                      <div
                        className={`aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                          activeIndex === index
                            ? "ring-3 ring-green ring-offset-2 scale-105"
                            : "hover:ring-2 hover:ring-green/80 hover:scale-102"
                        }`}
                      >
                        <Image
                          src={`${fileHost}${slide}` || "./default-image.png"}
                          alt={offer.name}
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="right-info">
              <h1>{offer.name}</h1>
              <div className="rate">
                <b>{offer.user.company.name}</b>
                <div className="rate-text">
                  4.5
                  <img src="/img/star.svg" alt="" />
                </div>
                <span>(34)</span>
              </div>
              <b className="price">{formatPrice(+offer.price)}</b>
              <div className="links">
                {offer.category.map((item, i) => (
                  <a key={`cat__${i}`} href="#">
                    {item.name}
                  </a>
                ))}
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
                  <span>{offer.user.company.name}</span>
                </li>

                <li>
                  <b>Вид:</b>
                  <span>{offer.vid === "service" ? "Услуга" : "Товар"}</span>
                </li>
                <li>
                  <b>Тип:</b>
                  <span>{offer.type === "online" ? "Онлайн" : "Оффлайн"}</span>
                </li>
              </ul>
              <h4>Регион покрытия:</h4>
              <div className="map w-full !max-w-[100%] h-[300] rounded-[12px] overflow-hidden">
                <iframe
                  src={getMapIframeUrl(offer.coordinates || [0, 0])}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Yandex Map"
                />
              </div>
              <h5>Описание</h5>
              <p className="text">{offer.description}</p>
            </div>
          </div>
          <div className="title-wrap !mt-9">
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
