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

function WaitConfirmDoc() {
  const { id }: { id: string } = useParams();
  const dispatch: any = useDispatch();
  const { data: session }: any = useSession();

  const chat = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  const PrintType =
    chat?.deal.owner.id === session?.user.id ? "owner" : "client";

  const [loading, setLoading] = useState(false);
  const [loadingClose, setLoadingClose] = useState(false);

  function ChangeStatusConfirmDoc() {
    if (chat) {
      setLoading(true);

      addToast({
        description: "Ждите )",
        color: "default",
      });

      ActionChangeStatusDealClient(chat.deal.id, "doc-confirmed", PrintType)
        .then(() => {
          addToast({
            description: "Готов, ждем от вас следующие шаг )",
            color: "success",
          });

          dispatch(UpdateChatInfo(id));
        })
        .finally(() => setLoading(false));
    }
  }

  function ChangeStatusClose() {
    if (chat) {
      setLoadingClose(true);

      addToast({
        description: "Ждите...",
        color: "default",
      });

      ActionChangeStatusDealClient(chat.deal.id, "canceled", "client").then(
        () => {
          ActionChangeStatusDealClient(chat.deal.id, "canceled", "owner")
            .then(() => {
              addToast({
                description: "Отказ успешно сохранено",
                color: "success",
              });
            })
            .finally(() => setLoadingClose(false));
        },
      );
    }
  }
  return (
    <>
      {chat && (
        <div className="top-item">
          <div className="imgs">
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chat?.deal.client_offer.images[0]}`}
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
              className="white-btn"
              isLoading={loadingClose}
              onPress={ChangeStatusClose}
            >
              Отказать
            </Button>
            <Button
              className="green-btn"
              onPress={ChangeStatusConfirmDoc}
              isLoading={loading}
            >
              Заключить договор
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default WaitConfirmDoc;
