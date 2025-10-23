import Image from "next/image";
import { fileHost } from "@/utils/consts";
import { formatPrice, truncateString } from "@/utils/helpers";
import { memo, useMemo } from "react";

interface IThisProps {
  chat: IChatItems;
}

const MessagesStartHero = memo(function MessagesStartHero({
  chat,
}: IThisProps) {
  // Memoize formatted prices to prevent unnecessary recalculations
  const ownerPrice = useMemo(() => {
    return formatPrice(+chat.deal.owner_offer.price);
  }, [chat.deal.owner_offer.price]);

  const clientPrice = useMemo(() => {
    return formatPrice(+chat.deal.client_offer.price);
  }, [chat.deal.client_offer.price]);

  // Memoize truncated names to prevent unnecessary recalculations
  const ownerName = useMemo(() => {
    return truncateString(chat.deal.owner_offer.name, 25);
  }, [chat.deal.owner_offer.name]);

  const clientName = useMemo(() => {
    return truncateString(chat.deal.client_offer.name, 25);
  }, [chat.deal.client_offer.name]);

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
            className="rounded-[14px] h-[240px] object-cover"
          />
        </div>
        <div className="top">
          <span>Название контрагента</span>
          <b>
            4.5 <img src="/img/star-small.svg" alt="" />
          </b>
        </div>
        <span className="name">{ownerName}</span>
        <span className="grey">Бартерная стоимость</span>
        <span className="price">{ownerPrice}</span>
      </div>
      <div className="info-item item2 shadow">
        <div className="img-wrap">
          <Image
            src={`${fileHost}${chat.deal.client_offer.images[0]}`}
            alt={chat.deal.owner_offer.name}
            width={200}
            height={300}
            className="rounded-[14px] h-[240px] object-cover"
          />
        </div>
        <div className="top">
          <span>Название контрагента</span>
          <b>
            4.5 <img src="/img/star-small.svg" alt="" />
          </b>
        </div>
        <span className="name">{clientName}</span>
        <span className="grey">Бартерная стоимость</span>
        <span className="price">{clientPrice}</span>
      </div>
    </div>
  );
});

export default MessagesStartHero;
