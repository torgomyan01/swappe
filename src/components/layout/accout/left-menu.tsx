"use client";

import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

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

  return (
    <div className="profile-menu-wrap sticky top-4">
      <div className="top">
        <div className="img-wrap">
          <img src="/img/avatar.png" alt="profile-avatar" />
          <div className="premium w-[110px]">
            <img src="/img/premium-icon.svg" alt="premium-icon" />
            <span>Премиум</span>
          </div>
        </div>
      </div>
      <span className="name">Название Компании</span>
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
          <a href={SITE_URL.ACCOUNT_TARIFFS_BONUSES}>
            <img src="/img/subscription.svg" alt="subscription" />
            <span className="green">Тариф и бонусы</span>
          </a>
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
