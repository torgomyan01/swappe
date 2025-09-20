function SeeMoreCommanded() {
  return (
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
  );
}

export default SeeMoreCommanded;
