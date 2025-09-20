import Image from "next/image";
import { fileHost } from "@/utils/consts";
import { formatPrice, truncateString } from "@/utils/helpers";

interface IThisProps {
  chat: IChatItems;
}

function MessagesStartHero({ chat }: IThisProps) {
  return (
    <div className="info-items">
      <img src="/img/transactions-icon1.svg" alt="" className="style-img" />
      <div className="info-item item1">
        <div className="img-wrap">
          <Image
            src={`${fileHost}${chat.deal.owner_offer.images[0]}`}
            alt={chat.deal.owner_offer.name}
            width={200}
            height={300}
            className="rounded-[14px]"
          />
        </div>
        <div className="top">
          <span>Название контрагента</span>
          <b>
            4.5 <img src="/img/star-small.svg" alt="" />
          </b>
        </div>
        <span className="name">
          {truncateString(chat.deal.owner_offer.name, 25)}
        </span>
        <span className="grey">Бартерная стоимость</span>
        <span className="price">
          {formatPrice(+chat.deal.owner_offer.price)}
        </span>
      </div>
      <div className="info-item item2">
        <div className="img-wrap">
          <Image
            src={`${fileHost}${chat.deal.client_offer.images[0]}`}
            alt={chat.deal.owner_offer.name}
            width={200}
            height={300}
            className="rounded-[14px]"
          />
        </div>
        <div className="top">
          <span>Название контрагента</span>
          <b>
            4.5 <img src="/img/star-small.svg" alt="" />
          </b>
        </div>
        <span className="name">
          {truncateString(chat.deal.client_offer.name, 25)}
        </span>
        <span className="grey">Бартерная стоимость</span>
        <span className="price">
          {formatPrice(+chat.deal.client_offer.price)}
        </span>
      </div>
    </div>
  );
}

export default MessagesStartHero;
