import { calcReviews, formatPrice, sliceText } from "@/utils/helpers";
import Link from "next/link";
import { fileHost, SITE_URL } from "@/utils/consts";
import Image from "next/image";
import { Button } from "@heroui/react";
import { ActionGetDealChat } from "@/app/actions/deals/get-chat-id";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IThisProps {
  item: IDeal;
}

function DealItem({ item }: IThisProps) {
  const router = useRouter();

  const getOwnerReview = calcReviews(item.owner.company.reviews);
  const getClientReview = calcReviews(item.client.company.reviews);

  const [loadingChat, setLoadingChat] = useState(false);

  function OpenChat() {
    setLoadingChat(true);
    ActionGetDealChat(item.id)
      .then(({ data }: any) => {
        router.push(`${SITE_URL.CHAT}/${data.id}`);
      })
      .finally(() => setLoadingChat(false));
  }
  const checkImage = ["canceled", "completed"].some(
    (_s) => item.statue_owner !== _s,
  );

  return (
    <div className="transactions-item">
      <div className="info-items">
        {checkImage && (
          <img src="/img/transactions-icon1.svg" alt="" className="style-img" />
        )}
        <div className="info-item">
          <div className="img-wrap">
            <Image
              src={`${fileHost}${item.owner_offer.images[0]}`}
              alt={item.owner_offer.name}
              width={300}
              height={400}
              className="w-full h-[265px] object-cover rounded-[12px]"
            />
          </div>
          <div className="top">
            <span>Название контрагента</span>
            <b>
              {getOwnerReview} <img src="/img/star-small.svg" alt="" />
            </b>
          </div>
          <Link
            href={`${SITE_URL.OFFER}/${item.owner_offer.id}`}
            target="_blank"
          >
            <span className="name">{sliceText(item.owner_offer.name, 17)}</span>
          </Link>
          <span className="grey">Бартерная стоимость</span>
          <span className="price">{formatPrice(+item.owner_offer.price)}</span>
        </div>
        <div className="info-item">
          <div className="img-wrap">
            <Image
              src={`${fileHost}${item.client_offer.images[0]}`}
              alt={item.client_offer.name}
              width={300}
              height={400}
              className="w-full h-[265px] object-cover rounded-[12px]"
            />
          </div>
          <div className="top">
            <span>Название контрагента</span>
            <b>
              {getClientReview} <img src="/img/star-small.svg" alt="" />
            </b>
          </div>
          <Link
            href={`${SITE_URL.OFFER}/${item.owner_offer.id}`}
            target="_blank"
          >
            <span className="name">
              {sliceText(item.client_offer.name, 17)}
            </span>
          </Link>
          <span className="grey">Бартерная стоимость</span>
          <span className="price">{formatPrice(+item.client_offer.price)}</span>
        </div>
      </div>
      <div className="bottom-line">
        <div className="new">
          <img src="/img/new-style.svg" alt="" />
          <span>Новая</span>
        </div>
        <Button className="chat" onPress={OpenChat} isLoading={loadingChat}>
          <img src="/img/chat-icon.svg" alt="" />
          Чат
        </Button>
        {/*<a href="#" className="green-btn">*/}
        {/*  <img src="/img/check-white.svg" alt="" />*/}
        {/*  Подтвердить сделку*/}
        {/*</a>*/}
      </div>
    </div>
  );
}

export default DealItem;
