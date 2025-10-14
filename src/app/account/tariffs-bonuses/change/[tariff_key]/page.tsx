"use client";

import { ActionGetAdminSection } from "@/app/actions/admin/get-section";
import { ActionGetUserBalance } from "@/app/actions/auth/get-user-balance";
import { ActionUpdateUserTariff } from "@/app/actions/auth/update-user-tariff";
import MainTemplate from "@/components/common/main-template/main-template";
import ModalAddBlance from "@/components/common/modals/modal-add-blance";
import { SITE_URL } from "@/utils/consts";
import { addToast, Button, Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ThanksBlock from "./components/thanks-block";
import clsx from "clsx";

function TariffPage() {
  const { tariff_key } = useParams();

  const { data: session, update }: any = useSession();

  const [modalState, setModalState] = useState(false);

  const [tariff, setTariff] = useState<ITariff | null>(null);

  const [userBalance, setUserBalance] = useState<{
    balance: number;
    bonus: number;
  } | null>(null);

  useEffect(() => {
    ActionGetAdminSection("tariff").then(({ data }: any) => {
      const findTariff = data.data.tariffs.find(
        (t: ITariff) => t.name === tariff_key,
      );

      setTariff(findTariff);
    });
    getUserBalance();
  }, [tariff_key]);

  function getUserBalance() {
    ActionGetUserBalance().then((res) => {
      if (res.status === "ok") {
        setUserBalance(
          res.data as unknown as { balance: number; bonus: number },
        );
      }
    });
  }

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChangeTariff(tariff_key: string) {
    if (tariff_key !== session?.user?.tariff) {
      setLoading(true);

      ActionUpdateUserTariff(tariff_key)
        .then(async (res: any) => {
          if (res.status === "ok") {
            addToast({
              title: `Вы успешно подключили тариф ${tariff?.title} актуально до ${new Date(res.data.tariff_end_date).toLocaleDateString()}`,
              color: "success",
            });
            setSuccess(true);
            await update({
              tariff: tariff_key,
              tariff_end_date: res.data.tariff_end_date,
            });
          } else {
            addToast({
              title: res.error,
              color: "danger",
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      addToast({
        title: "Вы уже подключили этот тариф",
        color: "danger",
      });
    }
  }

  return (
    <MainTemplate isEmpty>
      {success && <ThanksBlock />}

      <div className={clsx("main-wrap", { hidden: success })}>
        {tariff && userBalance ? (
          <div className="wrapper">
            <img src="/img/black-logo.svg" alt="" className="logo" />
            <div className="sufficient-funds">
              <div className="top-info">
                <span>Покупка тарифа</span>
                <h3>{tariff.title}</h3>
                <ul className="check-list">
                  {tariff.supportText.map((text) => (
                    <li key={text}>
                      <img src="/img/modals/premium.svg" alt="" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="info-w">
                <div className="prices">
                  <b className="price">{tariff.price} ₽</b>
                </div>

                <div className="payment-method">
                  <span>Способ оплаты</span>
                  <div className="payment-wrap">
                    <div className="icon">
                      <img src="/img/modals/payment-icon.svg" alt="" />
                    </div>
                    <div className="texts">
                      <span className="text">Основной счет</span>
                      <b>{userBalance?.balance} ₽</b>
                    </div>
                  </div>
                </div>
                <Button
                  color="secondary"
                  className="!mb-2 w-full"
                  onPress={() => handleChangeTariff(tariff.name)}
                  isLoading={loading}
                >
                  Подключить
                </Button>
                <Button
                  color="default"
                  className="w-full mb-4"
                  onPress={() => setModalState(true)}
                >
                  Пополнить баланс
                </Button>
                <Link href={SITE_URL.SEARCH} className="back">
                  <img src="/img/back-icon.svg" alt="" />
                  Вернуться на главную страницу
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-jc-c w-full h-[100dvh]">
            <Spinner color="secondary" />
          </div>
        )}
      </div>

      <ModalAddBlance show={modalState} onClose={() => setModalState(false)} />
    </MainTemplate>
  );
}

export default TariffPage;
