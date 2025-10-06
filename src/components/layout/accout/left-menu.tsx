"use client";

import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Button, Skeleton } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { ActionGetUserCompanyReviews } from "@/app/actions/company/get-user-company-reviews";
import Rating from "@mui/material/Rating";
import { calcReviews } from "@/utils/helpers";

const menuItems = [
  {
    name: "Профиль",
    url: "/account",
  },
  {
    name: "Мои предложения",
    url: SITE_URL.ACCOUNT_SUGGESTIONS,
  },
  {
    name: "Cделки",
    url: SITE_URL.ACCOUNT_TRANSACTIONS,
  },
  {
    name: "Избранное",
    url: SITE_URL.ACCOUNT_FAVORITES,
  },
  {
    name: "Отзывы",
    url: SITE_URL.ACCOUNT_REVIEWS,
    // rightContent: <span className="style">+9</span>,
  },
];

interface IThisProps {
  isMobile?: boolean;
}

function LeftMenu({ isMobile = false }: IThisProps) {
  const pathname = usePathname();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [loadingCompany, setLoadingCompany] = useState(false);

  const [rating, setRating] = useState(0);

  useEffect(() => {
    ActionGetUserCompanyReviews().then(({ data }) => {
      CalcReviews(data as IReview[]);
      setLoadingCompany(true);
    });
  }, [company]);

  function CalcReviews(reviews: IReview[]) {
    setRating(+calcReviews(reviews));
  }

  return (
    <div
      className={clsx("profile-menu-wrap sticky top-4", {
        "!block !w-full !min-w-full": isMobile,
      })}
    >
      {loadingCompany ? (
        <>
          {company ? (
            <>
              <div className="top">
                <div className="img-wrap">
                  <Image
                    src={
                      company?.image_path
                        ? `${fileHost}${company?.image_path}`
                        : "/img/default-company.png"
                    }
                    alt="premium-icon"
                    width={300}
                    height={300}
                    className="bg-crem"
                  />
                  {company?.plan === "premium" ? (
                    <div className="premium w-[110px]">
                      <img src="/img/premium-icon.svg" alt="premium-icon" />
                      <span>Премиум</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="name">{company?.name}</span>
              <div className="stars">
                <Rating
                  name="simple-controlled"
                  value={rating}
                  readOnly
                  precision={0.1}
                  sx={{
                    fontSize: 30,
                  }}
                />
                <span className="num">{rating}</span>
              </div>
            </>
          ) : (
            <Link href={SITE_URL.COMPANY_CREATE}>
              <Button color="secondary" className="w-full mb-4">
                Создайте компаний <i className="fa-regular fa-plus"></i>
              </Button>
            </Link>
          )}
        </>
      ) : (
        <div className="flex-jc-c gap-4 flex-col mb-4">
          <Skeleton className="rounded-full h-[120px] w-[120px]" />

          <Skeleton className="rounded-lg w-[130px] h-[20px]" />

          <Skeleton className="rounded-lg w-[180px] h-[30px] mt-3" />
        </div>
      )}

      <ul className="profile-menu">
        {menuItems.map((item, index) => (
          <li
            key={`profile-left-menu-item-${index}`}
            className={clsx({
              active: pathname === item.url,
            })}
          >
            <Link href={item.url}>
              <span className="icon"></span>
              <span className="text">{item.name}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link href={SITE_URL.ACCOUNT_TARIFFS_BONUSES}>
            <img src="/img/subscription.svg" alt="subscription" />
            <span className="green">Тариф и бонусы</span>
          </Link>
        </li>
      </ul>
      <span className="close cursor-pointer" onClick={() => signOut()}>
        <img src="/img/close-Icon.svg" alt="close-Icon" />
        Выйти
      </span>
      <a href="#" className="delete">
        <img src="/img/delete-Icon.svg" alt="delete-Icon" />
        Удалить профиль
      </a>
    </div>
  );
}

export default LeftMenu;
