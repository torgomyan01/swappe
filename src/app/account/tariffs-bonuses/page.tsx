"use client";

import { ActionGetTariffs } from "@/app/actions/admin/tariff";
import { ActionGetUserBalance } from "@/app/actions/auth/get-user-balance";
import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import {
  Button,
  Spinner,
  Snippet,
  addToast,
  Link,
  ModalBody,
  ModalContent,
  Modal,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TarifBlock from "./components/tarif-block";
import ModalAddBlance from "@/components/common/modals/modal-add-blance";
import { useSession } from "next-auth/react";
import { ActionCancelUserPlan } from "@/app/actions/auth/cancel-user-plan";

function Profile() {
  const router = useRouter();

  const { data: session, update }: any = useSession();
  const [modalState, setModalState] = useState(false);

  const [tariffs, setTariffs] = useState<ITariff[] | null>(null);

  const [myTariff, setMyTariff] = useState<ITariff | null>(null);

  const [userBalance, setUserBalance] = useState<{
    balance: number;
    bonus: number;
  } | null>(null);

  useEffect(() => {
    const findTariff = tariffs?.find(
      (tariff) => tariff.name === session.user.tariff,
    );

    setMyTariff(findTariff || null);
  }, [session.user.tarif, tariffs]);

  useEffect(() => {
    ActionGetTariffs().then((res) => {
      if (res.status === "ok") {
        setTariffs(res.data as unknown as ITariff[]);
      }
    });

    getUserBalance();
  }, []);

  function getUserBalance() {
    ActionGetUserBalance().then((res) => {
      if (res.status === "ok") {
        setUserBalance(
          res.data as unknown as { balance: number; bonus: number },
        );
      }
    });
  }

  const referralLink = `${window.location.origin}${SITE_URL.REGISTER}/${session.user.referral_code}/${session.user.id}`;

  const [loading, setLoading] = useState(false);
  const [moadlCloseTriff, setMoadlCloseTriff] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const res = await ActionCancelUserPlan();
    if (res.status === "ok") {
      await update({
        tariff: "free",
        tariff_end_date: null,
      });

      addToast({
        title: "Подписка успешно отменена",
        color: "success",
      });

      setMoadlCloseTriff(false);
    }

    if (res.status === "error") {
      addToast({
        title: res.error,
        color: "danger",
      });
    }

    setLoading(false);
  }

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.SEARCH}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Тарифы и бонусы</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Тарифы и бонусы</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile bonuses-account">
              <h3>Тарифы и бонусы</h3>

              {userBalance ? (
                <div className="bonuses-info">
                  <div className="bonuses-info-item">
                    <div className="top">
                      <div className="icon green">
                        <img src="/img/bon-icon1.svg" alt="" />
                      </div>
                      <div className="texts">
                        <span>Основной счет</span>
                        <b>{userBalance?.balance} ₽</b>
                      </div>
                    </div>
                    <Button
                      className="green-btn"
                      onPress={() => setModalState(true)}
                    >
                      <img src="/img/plus-icon.svg" alt="" />
                      Пополнить
                    </Button>
                  </div>
                  <div className="bonuses-info-item">
                    <div className="top">
                      <div className="icon yellow">
                        <img src="/img/bon-icon2.svg" alt="" />
                      </div>
                      <div className="texts">
                        <span>Накопленные бонусы</span>
                        <b>{userBalance?.bonus}</b>
                      </div>
                    </div>
                    <Link
                      href={SITE_URL.ACCOUNT_TARIFFS_BONUSES_HISTORY}
                      className="yellow-btn"
                    >
                      <img src="/img/gift-icon.svg" alt="" />
                      История
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex-jc-c w-full h-[100px]">
                  <Spinner color="secondary" />
                </div>
              )}

              {session.user.tariff === "free" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 items-stretch gap-y-6">
                  {tariffs ? (
                    tariffs.map((tariff) => (
                      <TarifBlock
                        key={`tarif-block-${tariff.name}`}
                        tariff={tariff}
                      />
                    ))
                  ) : (
                    <div className="flex-jc-c w-full h-[400px]">
                      <Spinner color="secondary" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {myTariff ? (
                    <div className="bonuses-info-block">
                      <div className="top">
                        <span className="text">Мой тариф</span>
                        <span className="date">
                          До{" "}
                          {new Date(
                            session.user.tariff_end_date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h2>{myTariff?.title}</h2>
                      <ul>
                        {myTariff?.supportText.map((text) => (
                          <li key={`tarif-text-${text}`}>
                            <img src="/img/premium.png" alt="" />
                            {text}
                          </li>
                        ))}
                      </ul>
                      <Button
                        color="secondary"
                        className="w-[150px] rounded-full"
                        onPress={() => setMoadlCloseTriff(true)}
                        isLoading={loading}
                      >
                        Отменить
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-jc-c w-full h-[100px]">
                      <Spinner color="secondary" />
                    </div>
                  )}
                </>
              )}

              <hr className="my-8 border-gray-200/80" />

              <h4>Реферальная программа</h4>
              <p>
                Друзья на Swappe — это новые связи, больше возможностей и 350
                бонусов за каждого!
              </p>
              <div className="referral-link-wrap">
                <span>Твоя реферальная ссылка</span>
                <Snippet>{referralLink}</Snippet>
              </div>
              <h4>История активаций</h4>
              <div className="activate">
                <div className="item">
                  <div className="img">
                    <img src="/img/rew-avatar.png" alt="" />
                  </div>
                  <div className="texts">
                    <b>Название компании</b>
                    <span>26 Nov 2021</span>
                  </div>
                </div>
                <div className="item">
                  <div className="img">
                    <img src="/img/rew-avatar.png" alt="" />
                  </div>
                  <div className="texts">
                    <b>Название компании</b>
                    <span>26 Nov 2021</span>
                  </div>
                </div>
                <div className="item">
                  <div className="img">
                    <img src="/img/rew-avatar.png" alt="" />
                  </div>
                  <div className="texts">
                    <b>Название компании</b>
                    <span>26 Nov 2021</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalAddBlance show={modalState} onClose={() => setModalState(false)} />

      <Modal
        size="xl"
        isOpen={moadlCloseTriff}
        onOpenChange={setMoadlCloseTriff}
        hideCloseButton
      >
        <ModalContent className="p-0">
          {() => (
            <>
              <ModalBody className="p-0">
                <div className="popups-wrap">
                  <div className="global-popup !p-0">
                    <div className="form-wrap !max-w-full">
                      <img src="/img/sign-in-style2.png" alt="" />
                      <div
                        className="popup-close"
                        onClick={() => setMoadlCloseTriff(false)}
                      >
                        <img src="/img/close-pop.svg" alt="" />
                      </div>
                      <form>
                        <h2>Уверены, что хотите отменить подписку?</h2>
                        <p>Все преимущества тарифа будут потеряны</p>
                        <Button
                          onPress={() => setMoadlCloseTriff(false)}
                          disabled={loading}
                          className="green-btn"
                          type="button"
                        >
                          Назад
                        </Button>
                        <Button
                          className="delete-link bg-transparent shadow-none !border-b-white"
                          isLoading={loading}
                          onPress={handleCancel}
                        >
                          Отменить подписку
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </MainTemplate>
  );
}

export default Profile;
