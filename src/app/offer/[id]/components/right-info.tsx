import { formatPrice, getMapIframeUrl } from "@/utils/helpers";
import ButtonCreateDeal from "@/app/offer/[id]/components/button-create-deal";

interface IThisProps {
  offer: IUserOfferFront;
}

function OfferRightInfo({ offer }: IThisProps) {
  return (
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
        <ButtonCreateDeal offer={offer} />

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
  );
}

export default OfferRightInfo;
