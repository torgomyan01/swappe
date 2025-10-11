"use client";

import { ActionGetTariffs } from "@/app/actions/admin/tariff";
import { ActionGetUserBalance } from "@/app/actions/auth/get-user-balance";
import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import { Button, Spinner, Snippet } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TarifBlock from "./components/tarif-block";
import ModalAddBlance from "@/components/common/modals/modal-add-blance";
import { useSession } from "next-auth/react";
import ModalViewMyTariff from "@/components/common/modals/modal-view-my-tariff";
import Link from "next/link";

function Profile() {
  const router = useRouter();

  const { data: session }: any = useSession();
  const [modalState, setModalState] = useState(false);

  const [tariffs, setTariffs] = useState<ITariff[] | null>(null);

  const [myTariff, setMyTariff] = useState<ITariff | null>(null);

  const [userBalance, setUserBalance] = useState<{
    balance: number;
    bonus: number;
  } | null>(null);

  const [modalControl, setModalControl] = useState<boolean>(false);

  useEffect(() => {
    const findTariff = tariffs?.find(
      (tariff) => tariff.name === session.user.tariff,
    );

    console.log(window.location.origin);

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
                    <a href="#" className="yellow-btn">
                      <img src="/img/gift-icon.svg" alt="" />
                      Условия программы
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex-jc-c w-full h-[100px]">
                  <Spinner color="secondary" />
                </div>
              )}

              {session.user.tarif === "free" ? (
                <div className="flex-jsb-s gap-2 mb-4 items-stretch">
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
                        onPress={() => setModalControl(true)}
                      >
                        Управлять
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
                Компания предлагает клиентам посоветовать свой продукт знакомым
                и получить за это вознаграждение: скидку, деньги или баллы на
                бонусный счёт.
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

      <ModalViewMyTariff
        show={modalControl}
        onClose={() => setModalControl(false)}
      />
    </MainTemplate>
  );
}

export default Profile;
