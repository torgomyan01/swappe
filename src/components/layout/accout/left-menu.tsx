"use client";

import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Button, Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";

const menuItems = [
  {
    name: "Профиль",
    url: SITE_URL.ACCOUNT,
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
    rightContent: <span className="style">+9</span>,
  },
];

function LeftMenu() {
  const pathname = usePathname();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [loadingCompany, setLoadingCompany] = useState(false);

  useEffect(() => {
    setLoadingCompany(!!company);
  }, [company]);

  return (
    <div className="profile-menu-wrap sticky top-4">
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
                <div className="stars-images flex-js-c gap-1">
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star-dubl.svg" alt="star" />
                </div>
                <span className="num">4.5</span>
              </div>
            </>
          ) : (
            <div>
              <Button color="secondary" className="w-full mb-4">
                Создайте компаний <i className="fa-regular fa-plus"></i>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-jc-c gap-4 flex-col mb-4">
          <Skeleton className="rounded-full w-full h-[120px] w-[120px]" />

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
      <a href="#" className="close">
        <img src="/img/close-Icon.svg" alt="close-Icon" />
        Выйти
      </a>
      <a href="#" className="delete">
        <img src="/img/delete-Icon.svg" alt="delete-Icon" />
        Удалить профиль
      </a>
    </div>
  );
}

export default LeftMenu;
