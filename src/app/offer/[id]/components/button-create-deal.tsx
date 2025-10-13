import { useSession } from "next-auth/react";
import Link from "next/link";
import { fileHost, SITE_URL } from "@/utils/consts";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ActionMyOffers } from "@/app/actions/offers/get";
import { truncateString } from "@/utils/helpers";
import Image from "next/image";
import clsx from "clsx";
import { ActionCreateDeals } from "@/app/actions/deals/create";
import { ActionCreateChat } from "@/app/actions/chat/create";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface IThisProps {
  offer: IUserOfferFront;
}

function ButtonCreateDeal({ offer }: IThisProps) {
  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const { data: session }: any = useSession();
  const router = useRouter();

  const [modal, setModal] = useState<boolean>(false);

  const [myOffers, setMyOffers] = useState<IUserOfferFront[] | null>(null);

  useEffect(() => {
    if (modal) {
      ActionMyOffers("active").then(({ data }) => {
        setMyOffers(data as IUserOfferFront[]);
      });
    }
  }, [modal]);

  const [activeId, setActiveId] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  function StartSCreate() {
    if (activeId) {
      setLoading(true);

      addToast({
        description: "Ждите",
        color: "secondary",
      });

      ActionCreateDeals({
        offer_id: activeId,
        client_id: offer.user_id,
        client_offer_id: offer.id,
      }).then(({ data, status, error }: any) => {
        if (status === "error") {
          addToast({
            description: error,
            color: "secondary",
          });
        }

        if (status === "ok") {
          CreateChat(data.id);
        }
      });
    }
  }

  function CreateChat(deal_id: number) {
    ActionCreateChat(offer.name, deal_id)
      .then(({ data }: any) => {
        addToast({
          description: "Готов",
          color: "secondary",
        });

        router.push(`${SITE_URL.CHAT}/${data.id}`);
      })
      .finally(() => setLoading(false));
  }

  function CreateDeep() {
    if (session.user.tariff === "free") {
      addToast({
        description: "Для создания предложения вам необходимо купить тариф.",
        color: "warning",
      });
      return;
    }

    setModal(true);
  }

  return (
    <>
      {session ? (
        offer.user_id !== session.user?.id && (
          <>
            {company ? (
              <Button className="green-btn" onPress={CreateDeep}>
                <img src="/img/icons/start-sale.svg" alt="" className="!mr-0" />
                Предложить сделку
              </Button>
            ) : (
              <Button
                className="green-btn"
                onPress={() =>
                  addToast({
                    description:
                      "Для создания предложения вам необходимо зарегистрировать компанию.",
                    color: "secondary",
                  })
                }
              >
                <img src="/img/icons/start-sale.svg" alt="" className="!mr-0" />
                Предложить сделку
              </Button>
            )}
          </>
        )
      ) : (
        <Link href={SITE_URL.LOGIN} className="green-btn">
          <img src="/img/icons/start-sale.svg" alt="" className="!mr-0" />
          Предложить сделку
        </Link>
      )}

      <Modal size="3xl" isOpen={modal} onClose={() => setModal(false)}>
        <ModalContent className="bg-[#fffcf5]">
          <ModalBody>
            <div className="media-popup-wrap !p-0 !pt-6 !pb-4">
              <b>Ответное предложение</b>
              <span>
                Чтобы предложить контрагенту сделку, выбери ответное предложение
                из активных публикаций
              </span>

              {myOffers ? (
                myOffers?.length ? (
                  <div className="med-items w-full">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={25}
                      slidesPerView={2}
                      pagination={{ clickable: true }}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false, // Keep autoplay on user interaction
                      }}
                      className="!pb-10"
                    >
                      {myOffers.map((_offer: IUserOfferFront, index) => (
                        <SwiperSlide key={`images-product_modal-${index}`}>
                          <div
                            className={clsx("med-item cursor-pointer", {
                              active: activeId === _offer.id,
                            })}
                            onClick={() => setActiveId(_offer.id)}
                          >
                            <div className="img-wrap">
                              <Image
                                src={`${fileHost}${_offer.images[0]}`}
                                alt={_offer.name}
                                width={300}
                                height={500}
                                className="h-[450px] object-cover"
                              />
                            </div>
                            <h5>{truncateString(_offer.name, 25)}</h5>
                            <span>Бартер</span>
                            <b>₽30 000</b>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <div className="w-full flex-jc-c">no offer</div>
                )
              ) : (
                <div className="w-full h-[200px] flex-jc-c">
                  <Spinner color="secondary" />
                </div>
              )}

              <Button
                className={clsx("green-btn", {
                  "disabled cursor-default": !activeId,
                })}
                disabled={!activeId}
                onPress={StartSCreate}
                isLoading={loading}
              >
                Предложить сделку
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ButtonCreateDeal;
