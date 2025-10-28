"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { truncateString } from "@/utils/helpers";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import OfferRightInfo from "@/app/offer/[id]/components/right-info";
import OfferReviews from "@/app/offer/[id]/components/offer-reviews";
import SeeMoreCommanded from "@/app/offer/[id]/components/see-more-commanded";
import LeftSlider from "@/app/offer/[id]/components/left-slider";

interface IThisProps {
  offer: IUserOfferFront;
}

function OfferPage({ offer }: IThisProps) {
  return (
    <MainTemplate>
      <div className="wrapper">
        <div className="breadcrumbs hide-mobile">
          <Link href={SITE_URL.SEARCH}>
            Главная
            <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <Link href={`${SITE_URL.COMPANY("")}/${offer.user.company.id}`}>
            {offer.user.company.name}
            <img src="/img/arr-r.svg" alt="arrow" />
          </Link>
          <span>{truncateString(offer.name)}</span>
        </div>
      </div>

      <div className="creating-proposal">
        <div className="wrapper">
          <div className="proposal-info">
            <LeftSlider offer={offer} />
            <OfferRightInfo offer={offer} />
          </div>

          <OfferReviews offer={offer} />

          <SeeMoreCommanded />
        </div>
      </div>
    </MainTemplate>
  );
}

export default OfferPage;
