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

function WaitConfirm() {
  const { id }: { id: string } = useParams();
  const dispatch: any = useDispatch();

  const { data: session }: any = useSession();

  const chatInfo = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  const PrintType =
    chatInfo?.deal.owner.id === session?.user.id ? "owner" : "client";

  const [loading, setLoading] = useState(false);
  const [loadingClose, setLoadingClose] = useState(false);

  function ChangeStatusConfirmDoc() {
    if (chatInfo) {
      setLoading(true);

      addToast({
        description: "Ждите )",
        color: "default",
      });

      ActionChangeStatusDealClient(
        chatInfo.deal.id,
        "wait-doc-confirm",
        "client",
      )
        .then(() => {
          ActionChangeStatusDealClient(
            chatInfo.deal.id,
            "wait-doc-confirm",
            "owner",
          )
            .then(() => {
              addToast({
                description: "Готов, ждем от вас следующие шаг )",
                color: "success",
              });

              dispatch(UpdateChatInfo(id));
            })
            .finally(() => setLoading(false));
        })
        .finally(() => setLoading(false));
    }
  }

  function ChangeStatusClose() {
    if (chatInfo) {
      setLoadingClose(true);

      addToast({
        description: "Ждите...",
        color: "default",
      });

      ActionChangeStatusDealClient(chatInfo.deal.id, "canceled", "client").then(
        () => {
          ActionChangeStatusDealClient(chatInfo.deal.id, "canceled", "owner")
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
      {chatInfo && (
        <div className="top-item">
          <div className="imgs">
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chatInfo?.deal.client_offer.images[0]}`}
                alt={chatInfo?.deal.client.company.name || ""}
                width={100}
                height={100}
                className="object-cover"
              />
              <Link
                href={`${SITE_URL.OFFER}/${chatInfo.deal.client_offer_id}`}
                target="_blank"
                className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
              >
                <i className="fa-light fa-arrow-up-right text-white"></i>
              </Link>
            </div>
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chatInfo?.deal.owner_offer.images[0]}`}
                alt={chatInfo?.deal.client.company.name || ""}
                width={100}
                height={100}
                className="object-cover"
              />
              <Link
                href={`${SITE_URL.OFFER}/${chatInfo?.deal.owner_offer_id}`}
                target="_blank"
                className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
              >
                <i className="fa-light fa-arrow-up-right text-white"></i>
              </Link>
            </div>
          </div>
          <div className="txts">
            <b>
              {sliceText(chatInfo?.deal.client_offer.name || "")},{" "}
              {formatPrice(
                chatInfo ? +chatInfo?.deal.client_offer.price : 0,
              )}{" "}
            </b>
            <div className="inf-texts">
              {PrintType === "client" ? (
                <span className="grey">
                  Новая сделка, подтвердите или омтените
                </span>
              ) : (
                <span className="grey">Ожидает подтверждения</span>
              )}
            </div>
          </div>

          {PrintType === "client" ? (
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
                Подтвердить
              </Button>
            </div>
          ) : (
            <div className="new">
              <img src="/img/new-style.svg" alt="Wait" />
              <span>Новая</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default WaitConfirm;
