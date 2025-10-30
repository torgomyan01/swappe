import { calcReviews, formatPrice, sliceText } from "@/utils/helpers";
import Link from "next/link";
import { fileHost, SITE_URL } from "@/utils/consts";
import Image from "next/image";
import { Button, Chip } from "@heroui/react";
import { ActionGetDealChat } from "@/app/actions/deals/get-chat-id";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

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

  function CheckStatus(status: DealStatusClient | DealStatusOwner): boolean {
    return item.status_client === status;
  }

  return (
    <div className="transactions-item">
      <div className="info-items">
        {["wait-confirm", "wait-doc-confirm", "doc-confirmed", "completed"].map(
          (status) => (
            <img
              key={status}
              src={`/img/status-${status}.svg`}
              alt=""
              className={clsx("style-img", {
                hidden: !CheckStatus(
                  status as DealStatusClient | DealStatusOwner,
                ),
              })}
            />
          ),
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
        {CheckStatus("wait-confirm") && (
          <Chip color="primary" className="rounded-full cursor-default">
            Новая
          </Chip>
        )}
        {CheckStatus("wait-doc-confirm") && (
          <Chip color="warning" className="rounded-full cursor-default">
            Ожидает подтверждения
          </Chip>
        )}
        {CheckStatus("doc-confirmed") && (
          <Chip color="success" className="rounded-full cursor-default">
            Документы подтверждены
          </Chip>
        )}
        {CheckStatus("completed") && (
          <Chip color="success" className="rounded-full cursor-default">
            Сделка завершена
          </Chip>
        )}
        {CheckStatus("send-review") && (
          <Chip color="warning" className="rounded-full cursor-default">
            Ожидает отзыва
          </Chip>
        )}
        {CheckStatus("canceled") && (
          <Chip color="danger" className="rounded-full cursor-default">
            Сделка отменена
          </Chip>
        )}
        <Button className="chat" onPress={OpenChat} isLoading={loadingChat}>
          <img src="/img/chat-icon.svg" alt="" />
          Чат
        </Button>
      </div>
    </div>
  );
}

export default DealItem;
