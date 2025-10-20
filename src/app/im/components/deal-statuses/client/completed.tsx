import Image from "next/image";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { formatPrice, sliceText, UpdateChatInfo } from "@/utils/helpers";
import { addToast, Button } from "@heroui/react";
import { useState } from "react";
import { ActionChangeStatusDealClient } from "@/app/actions/deals/change-status";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ActionChangeOfferStatus } from "@/app/actions/offers/change-offer-status";
import { ActionCreatePushNotification } from "@/app/actions/push-notification/create";

function Completed() {
  const { data: session }: any = useSession();
  const { id }: { id: string } = useParams();
  const dispatch: any = useDispatch();

  const chat = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  const PrintType =
    chat?.deal.owner.id === session?.user.id ? "owner" : "client";

  const [loading, setLoading] = useState(false);
  function ChangeStatusConfirmDoc() {
    if (chat) {
      setLoading(true);

      addToast({
        description: "Ждите )",
        color: "default",
      });

      if (
        PrintType === "client" &&
        chat.deal.statue_owner === "wait-doc-confirm"
      ) {
        addToast({
          description:
            "Давайте подождём, пока противоположная сторона не подтвердит договорённость",
          color: "warning",
        });

        setLoading(false);

        return;
      }

      ActionChangeStatusDealClient(chat.deal.id, "send-review", PrintType)
        .then(() => {
          addToast({
            description: "Готов, ждем от вас следующие шаг )",
            color: "success",
          });

          dispatch(UpdateChatInfo(id));

          ActionChangeOfferStatus(
            [chat.deal.owner_offer_id, chat.deal.client_offer_id],
            "archive",
          );

          ActionCreatePushNotification(
            chat.deal.client.id,
            "Сделка успешно завершена. Оставьте отзыв компании.",
            "success",
            chat.deal.client.name,
            `${SITE_URL.CHAT}/${chat.id}`,
            {},
          );

          ActionCreatePushNotification(
            chat.deal.owner.id,
            "Сделка успешно завершена. Оставьте отзыв компании.",
            "success",
            chat.deal.owner.name,
            `${SITE_URL.CHAT}/${chat.id}`,
            {},
          );
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <>
      {chat && (
        <div className="top-item">
          <div className="imgs">
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chat.deal.client_offer.images[0]}`}
                alt={chat.deal.client.company.name}
                width={100}
                height={100}
                className="object-cover"
              />
              <Link
                href={`${SITE_URL.OFFER}/${chat.deal.client_offer_id}`}
                target="_blank"
                className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
              >
                <i className="fa-light fa-arrow-up-right text-white"></i>
              </Link>
            </div>
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chat.deal.owner_offer.images[0]}`}
                alt={chat.deal.client.company.name}
                width={100}
                height={100}
                className="object-cover"
              />
              <Link
                href={`${SITE_URL.OFFER}/${chat.deal.owner_offer_id}`}
                target="_blank"
                className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
              >
                <i className="fa-light fa-arrow-up-right text-white"></i>
              </Link>
            </div>
          </div>
          <div className="txts">
            <b>
              {sliceText(chat.deal.client_offer.name)},{" "}
              {formatPrice(+chat.deal.client_offer.price)}{" "}
            </b>
            <div className="inf-texts">
              <span className="grey">Предложение принято, </span>
              <Link
                href="/pdf/contract.pdf"
                download={`Contract ${chat.deal.client_offer.name}`}
                target="_blank"
                className="download"
              >
                скачать договор
                <img src="/img/chat/download.svg" alt="" />
              </Link>
            </div>
          </div>
          <div className="btns">
            <Button
              className="green-btn"
              onPress={ChangeStatusConfirmDoc}
              isLoading={loading}
            >
              Завершить сделку
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Completed;
