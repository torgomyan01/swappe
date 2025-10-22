"use client";

import "./_creating-proposal.scss";

import MainTemplate from "@/components/common/main-template/main-template";
import { useParams, useRouter } from "next/navigation";
import InfoTab from "@/app/account/offers/change/[id]/components/info-tab";
import Preview from "@/app/account/offers/change/[id]/components/preview";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ActionSingleOffer } from "@/app/actions/offers/get-single";
import { useDispatch } from "react-redux";
import { initializeOffer, resetOffer } from "@/redux/offer-page";

function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [offer, setOffer] = useState<IUserOfferFront | null>(null);

  useEffect(() => {
    ActionSingleOffer(id ? +id : 0).then(({ data }) => {
      const offerData = data as IUserOfferFront;
      setOffer(offerData);
      // Initialize Redux store with offer data
      dispatch(initializeOffer(offerData));
    });

    // Cleanup on unmount
    return () => {
      dispatch(resetOffer());
    };
  }, [id, dispatch]);

  const router = useRouter();

  const [steps, setSteps] = useState<number>(0);

  function GoToNext() {
    setSteps(1);
  }

  function GoToBack() {
    setSteps(0);
  }

  return (
    <MainTemplate loading={!offer}>
      <div className="creating-proposal">
        <div className="wrapper">
          <div className="top-info">
            <h4>Редактирование предложения</h4>
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
            <InfoTab onNextStep={GoToNext} offer={offer as IUserOfferFront} />
          </div>

          <div
            className={clsx({
              hidden: steps === 0,
            })}
          >
            <Preview onGoBack={GoToBack} offerId={offer?.id} />
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
