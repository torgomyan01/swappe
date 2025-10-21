"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { Spinner } from "@heroui/react";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionGetMyCompanyReview } from "@/app/actions/company_reviews/get-my";
import ReviewItem from "@/app/account/reviews/components/review-item";
import EmptyRes from "@/components/common/empty-res/empty-res";

function Profile() {
  const router = useRouter();

  const [reviews, setReviews] = useState<IReview[] | null>(null);

  useEffect(() => {
    ActionGetMyCompanyReview().then(({ data }) => {
      setReviews(data as IReview[]);
    });
  }, []);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Отзывы</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Отзывы</b>
          </div>
          <div className="info">
            <LeftMenu />

            <div className="profile review-account">
              {reviews ? (
                reviews.length ? (
                  <div className="review-items">
                    {reviews.map((item, index) => (
                      <ReviewItem key={`review-item-${index}`} review={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyRes title="У вас пока нет отзывов" />
                )
              ) : (
                <div className="w-full h-[400px] flex-jc-c">
                  <Spinner color="secondary" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
