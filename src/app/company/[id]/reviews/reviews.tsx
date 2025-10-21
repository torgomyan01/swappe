"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import CompanyLeftMenu from "@/app/company/components/company-left-menu";
import EmptyRes from "@/components/common/empty-res/empty-res";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { ActionGetCompanyReview } from "@/app/actions/company_reviews/get-company-review";
import ReviewItem from "@/app/account/reviews/components/review-item";

interface IThisProps {
  company: IUserCompany;
}

function CompanyPageReviews({ company }: IThisProps) {
  const [reviews, setReviews] = useState<IReview[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setReviews([]);
    ActionGetCompanyReview(company.id)
      .then(({ data }) => {
        setReviews(data as IReview[]);
      })
      .finally(() => {
        setLoading(false);
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
            <span>{company.name}</span>
          </div>
          <div className="top-mob-line">
            <Link href={SITE_URL.HOME} className="back">
              <img src="/img/back-icon.svg" alt="" />
            </Link>
            <b>{company.name}</b>
          </div>
          <div className="info">
            <CompanyLeftMenu company={company} />
            <div className="profile review-account">
              {loading ? (
                reviews?.length ? (
                  <div className="review-items">
                    {reviews.map((item, index) => (
                      <ReviewItem key={`review-item-${index}`} review={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyRes title="Вам пока нет никакого отзыв" />
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

export default CompanyPageReviews;
