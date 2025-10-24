import Image from "next/image";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { formatPrice, sliceText, UpdateChatInfo } from "@/utils/helpers";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import React, { useState } from "react";
import { ActionChangeStatusDealClient } from "@/app/actions/deals/change-status";
import "./_feedback.scss";
import Rating from "@mui/material/Rating";
import clsx from "clsx";
import { ActionCreateCompanyReview } from "@/app/actions/company_reviews/create-company-review";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ActionCreatePushNotification } from "@/app/actions/push-notification/create";

function SendReview() {
  const { id }: { id: string } = useParams();
  const { data: session }: any = useSession();
  const dispatch: any = useDispatch();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const chat = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  const PrintType =
    chat?.deal.owner.id === session?.user.id ? "owner" : "client";

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [rating, setRating] = React.useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>("");

  const [success, setSuccess] = useState(false);

  function CreateReview() {
    if (rating && chat) {
      addToast({
        description: "Ждите",
        color: "default",
      });

      setLoading(true);

      const companyId =
        PrintType === "owner"
          ? chat.deal.client.company.id
          : chat.deal.owner.company.id;

      const offerId =
        PrintType === "owner"
          ? chat.deal.client_offer_id
          : chat.deal.owner_offer_id;

      if (company) {
        ActionCreateCompanyReview(
          companyId,
          company?.id,
          rating,
          reviewText,
          offerId,
        ).then(({ status }) => {
          if (status === "ok") {
            ChangeStatusConfirmDoc();
          }
        });
      }
    }
  }

  function ChangeStatusConfirmDoc() {
    if (chat) {
      ActionChangeStatusDealClient(chat.deal.id, "completed", PrintType)
        .then(() => {
          addToast({
            description: "Поздравляю с успешным завершением ❤",
            color: "success",
          });

          ActionCreatePushNotification(
            chat.deal.client.id,
            `Отзыв оставлен на компанию ${chat.deal.owner.company.name}. Спасибо за ваш отзыв!`,
            "success",
            chat.deal.client.name,
            `${SITE_URL.CHAT}/${chat.id}`,
            {},
          );

          ActionCreatePushNotification(
            chat.deal.owner.id,
            `Отзыв оставлен на компанию ${chat.deal.client.company.name}. Спасибо за ваш отзыв!`,
            "success",
            chat.deal.owner.name,
            `${SITE_URL.CHAT}/${chat.id}`,
            {},
          );

          dispatch(UpdateChatInfo(id));
        })
        .finally(() => {
          setLoading(false);
          setSuccess(true);
        });
    }
  }

  function getCompanyName() {
    if (chat) {
      return PrintType === "owner"
        ? chat.deal.client.company.name
        : chat.deal.owner.company.name;
    }
  }

  return (
    <>
      {chat && (
        <>
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
              <Button className="white-btn" onPress={() => setModal(true)}>
                Оставить отзыв
              </Button>
            </div>
          </div>

          <Modal isOpen={modal} onClose={() => setModal(false)}>
            <ModalContent className="bg-[#fffcf5]">
              <ModalHeader className="flex flex-col gap-1">
                {!success && `Как прошла сделка с ${getCompanyName()}?`}
              </ModalHeader>
              <ModalBody className="mb-6">
                {success ? (
                  <div className="phone-change-info flex-jc-c flex-col">
                    <img src="/img/icons/img-check.svg" alt="" />
                    <h3>Отзыв сохранен</h3>
                    <p>
                      Он появится в профиле контрагента после успешной модерации
                    </p>
                  </div>
                ) : (
                  <div className="feedback-popup-wrap">
                    <div className="name-transaction">
                      <span className="name">
                        {sliceText(chat.deal.client_offer.name, 15)}
                      </span>
                      <div className="images">
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
                    </div>

                    {!rating ? (
                      <div className="stars-wrap2 flex-jc-c flex-col">
                        <span className="font-bold">Оцени свой опыт</span>
                        <Rating
                          sx={{ fontSize: "40px" }}
                          name="simple-controlled"
                          value={rating}
                          onChange={(_, newValue) => {
                            setRating(newValue);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="stars-wrap-small">
                          <div className="imgs">
                            <Rating
                              name="simple-controlled"
                              value={rating}
                              readOnly
                            />
                            <b>{rating} / 5.0</b>
                          </div>
                        </div>

                        <div className="textarea-details">
                          <span>Поделись деталями</span>
                          <textarea
                            placeholder="Начни писать отзыв"
                            onChange={(e) => setReviewText(e.target.value)}
                          ></textarea>
                        </div>
                      </>
                    )}

                    <div className="buttons">
                      <Button
                        className="cancel"
                        onPress={() => setModal(false)}
                      >
                        Отменить
                      </Button>
                      <Button
                        className={clsx("green-btn", {
                          "!opacity-50 cursor-default": !rating,
                        })}
                        isLoading={loading}
                        disabled={!rating}
                        onPress={CreateReview}
                      >
                        Оставить отзыв
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}

export default SendReview;
