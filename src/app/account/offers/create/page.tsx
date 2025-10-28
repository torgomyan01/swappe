"use client";

import "./_creating-proposal.scss";

import MainTemplate from "@/components/common/main-template/main-template";
import { useRouter } from "next/navigation";
import InfoTab from "@/app/account/offers/create/components/info-tab";
import Preview from "@/app/account/offers/create/components/preview";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import EmptyRes from "@/components/common/empty-res/empty-res";
import { Spinner } from "@heroui/react";

function Profile() {
  const router = useRouter();

  const [steps, setSteps] = useState<number>(0);
  const company = useSelector((state: IUserStore) => state.userInfo.company);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [company]);

  function GoToNext() {
    setSteps(1);
  }

  function GoToBack() {
    setSteps(0);
  }

  return (
    <MainTemplate>
      {loading ? (
        <div className="w-full h-[80dvh] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      ) : (
        <>
          {company ? (
            <div className="creating-proposal">
              <div className="wrapper">
                <div className="top-info">
                  <h4>Создание предложения</h4>
                  <div className="close" onClick={() => router.back()}>
                    <img src="/img/close-pop.svg" alt="" />
                  </div>
                </div>
                <div className="info-texts">
                  <div
                    className={clsx("texts", {
                      green: steps === 0,
                    })}
                  >
                    <span className="num">1</span>
                    <span className="text">Информация о товаре/услуге</span>
                  </div>
                  <div
                    className={clsx("texts", {
                      green: steps === 1,
                    })}
                  >
                    <span className="num">2</span>
                    <span className="text">Предварительный просмотр</span>
                  </div>
                </div>
                <div
                  className={clsx({
                    hidden: steps === 1,
                  })}
                >
                  <InfoTab onNextStep={GoToNext} />
                </div>

                <div
                  className={clsx({
                    hidden: steps === 0,
                  })}
                >
                  <Preview onGoBack={GoToBack} />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[60dvh] pt-[100px] px-4">
              <EmptyRes title="Для создания предложения, необходимо создать компанию" />
            </div>
          )}
        </>
      )}
    </MainTemplate>
  );
}

export default Profile;
