"use client";

import "./_notifications.scss";
import "./_search.scss";

import MainTemplate from "@/components/common/main-template/main-template";

import Filter from "@/app/search/components/filter";
import { Select, SelectItem } from "@heroui/react";

function Search() {
  // const { data: session } = useSession();

  return (
    <MainTemplate>
      <div className="notifications-wrapper">
        <div className="notifications">
          <div className="top-mob">
            <a href="#" className="back">
              <img src="/img/back-left.svg" alt="" />
            </a>
            <b>Уведомления</b>
          </div>
          <div className="top-line">
            <b>Уведомления</b>
            <div className="new">
              <span>Только новые</span>
              <div className="switch" id="mySwitch">
                <div className="slider"></div>
              </div>
            </div>
          </div>
          <div className="view-all">Пометить все просмотренными (2)</div>
          <a href="#" className="notifications-item">
            <div className="icon">
              <img src="/img/search/notifications-icon1.svg" alt="" />
            </div>
            <div className="texts">
              <b>Новое предложение</b>
              <span>Diamond кейтеринг предлагает сделку</span>
            </div>
            <div className="circle"></div>
          </a>
          <a href="#" className="notifications-item">
            <div className="icon">
              <img src="/img/search/notifications-icon2.svg" alt="" />
            </div>
            <div className="texts">
              <b>Cтатус сделки</b>
              <span>Diamond кейтеринг принял предложение</span>
            </div>
            <div className="circle"></div>
          </a>
          <div className="border"></div>
          <div className="notifications-items">
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon3.svg" alt="" />
              </div>
              <div className="texts">
                <b>Cтатус сделки</b>
                <span>Diamond кейтеринг принял предложение</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon4.svg" alt="" />
              </div>
              <div className="texts">
                <b>Предложение прошло модерацию</b>
                <span>Кейтеринг в день мероприятия с выездом на площадку</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon5.svg" alt="" />
              </div>
              <div className="texts">
                <b>Предложение не прошло модерацию</b>
                <span>Кейтеринг в день мероприятия с выездом на площадку</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
          </div>
          <div className="border"></div>
          <div className="not-info">
            <div className="head">
              <b>Как все прошло?</b>
              <button className="close" type="button">
                <img src="/img/close-pop.svg" alt="" />
              </button>
            </div>
            <p>
              Ваша сделка с Dостаевский завершена. Поделись отзывом и помоги
              другим найти ту самую коллаборацию!
            </p>
            <div className="info">
              <div className="text-wrap">
                <div className="texts">
                  <b>Кейтеринг для мероприятия</b>
                  <span>Dостаевский</span>
                </div>
                <span>26 Nov 2021</span>
              </div>
              <div className="img-wrap">
                <img src="/img/search/not-info-icon.png" alt="" />
              </div>
            </div>
          </div>
          <a href="#" className="leave-feedback">
            <img src="/img/search/rew-icon.svg" alt="" />
            <b>Оставить отзыв</b>
          </a>
        </div>
      </div>
      <div className="search-wrapper">
        <div className="wrapper">
          <div className="mobile-filter-btns">
            <form>
              <button type="button">
                <img src="/img/search-icon.svg" alt="" />
              </button>
              <input type="text" placeholder="Введи запрос" />
            </form>
            <a href="#" className="favorite-btn">
              <img src="/img/heart.svg" alt="" />
            </a>
            <a href="#" className="filter-btn">
              <img src="/img/filter-icon.svg" alt="" />
            </a>
          </div>

          <Filter />

          <div className="search-info-block">
            <div className="info-top">
              <div className="texts">
                <b>49</b>
                <span>найдено</span>
              </div>
              <Select
                className="w-[200px] custom-select"
                placeholder="Сортировка"
              >
                <SelectItem key="По Цене Бартера">По Цене Бартера</SelectItem>
                <SelectItem key="По Цене компании">По Цене Компании</SelectItem>
              </Select>
            </div>
            <div className="items">
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img1.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского праздника</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img2.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img3.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского праздника</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img1.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского праздника</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img2.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img3.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского праздника</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img1.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского праздника</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img2.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
              <div className="offer-item">
                <div className="img-wrap">
                  <a href="#" className="img">
                    <img src="/img/offer-img3.png" alt="" />
                  </a>
                  <div className="favorite open"></div>
                </div>
                <div className="text-wrap">
                  <span>ВкусВилл Праздник</span>
                  <b>
                    4.5 <img src="/img/star-small.svg" alt="" />
                  </b>
                </div>
                <p>Кейтеринг для детского праздника</p>
                <span className="barter">Бартер</span>
                <b className="price">₽15 000</b>
              </div>
            </div>
            <div className="pagination">
              <button type="button">
                <img src="/img/right.svg" alt="" className="rotate" />
              </button>
              <span>Страница 1 из 8</span>
              <button type="button">
                <img src="/img/right.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Search;
