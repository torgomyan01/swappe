"use client";

import "./_creating-proposal.scss";

import MainTemplate from "@/components/common/main-template/main-template";
import { useRouter } from "next/navigation";
import InfoTab from "@/app/account/offers/create/components/info-tab";
import Preview from "@/app/account/offers/create/components/preview";
import { useState } from "react";
import clsx from "clsx";

function Profile() {
  const router = useRouter();

  const [steps, setSteps] = useState<number>(0);

  function GoToNext() {
    setSteps(1);
  }

  function GoToBack() {
    setSteps(0);
  }

  return (
    <MainTemplate>
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
    </MainTemplate>
  );
}

export default Profile;
