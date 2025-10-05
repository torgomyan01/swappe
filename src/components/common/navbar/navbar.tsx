"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { sliceText } from "@/utils/helpers";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";

function Navbar() {
  const { data: session } = useSession();
  const company = useSelector((state: IUserStore) => state.userInfo.company);
  const searchParams = useSearchParams();
  const search = searchParams.get("value");
  const [notifications, setNotifications] = useState<boolean>(false);

  const [showMobileIcons, setShowMobileIcons] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setShowMobileIcons(true);
      } else {
        setShowMobileIcons(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="header-profile">
        <div className="wrapper">
          <Link href={SITE_URL.SEARCH} className="logo">
            <img src="/img/black-logo.svg" alt="" />
          </Link>
          <form className="search" action={SITE_URL.SEARCH}>
            <input
              type="text"
              placeholder="Введи запрос"
              name="value"
              defaultValue={search || ""}
            />
            <button type="button">
              <img src="/img/search-icon.svg" alt="" />
            </button>
          </form>
          <div className="icons">
            <Link href={SITE_URL.ACCOUNT_OFFER_CREATE}>
              <span className="icon cursor-pointer">
                <img src="/img/menu-icon1.svg" alt="" />
              </span>
            </Link>
            <span
              className="icon cursor-pointer"
              onClick={() => setNotifications(!notifications)}
            >
              <span className="circle"></span>
              <img src="/img/menu-icon2.svg" alt="" />
            </span>
            <Link
              href={SITE_URL.ACCOUNT_FAVORITES}
              className="icon cursor-pointer"
            >
              <img src="/img/menu-icon3.svg" alt="" />
            </Link>
            <Link
              href={SITE_URL.ACCOUNT_TRANSACTIONS}
              className="icon cursor-pointer"
            >
              <img src="/img/menu-icon4.svg" alt="" />
            </Link>
            <Tooltip content="Сообщения">
              <Link href={SITE_URL.CHAT} className="icon cursor-pointer">
                {/*<span className="count">+9</span>*/}
                <img src="/img/menu-icon5.svg" alt="" />
              </Link>
            </Tooltip>
          </div>
          {session ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="user-in cursor-pointer">
                  <span>{sliceText(session.user?.name || "", 10, ".")}</span>
                  {company && (
                    <div className="avatar">
                      <img src={`${fileHost}${company.image_path}`} alt="" />
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem href={SITE_URL.ACCOUNT} key="accout">
                  Профиль
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  onPress={() => signOut()}
                  color="danger"
                >
                  Выход
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link href={SITE_URL.LOGIN} className="user cursor-pointer">
              <img src="/img/user-icon.svg" alt="user icon" />
            </Link>
          )}
        </div>
      </div>

      <div className="wrapper">
        <div
          className={clsx("mobile-icons", {
            "hide-on-scroll": !showMobileIcons,
          })}
        >
          <Link href={SITE_URL.ACCOUNT_OFFER_CREATE} className="icon">
            <img src="/img/menu-icon1.svg" alt="" />
          </Link>
          <span
            className="icon"
            onClick={() => setNotifications(!notifications)}
          >
            <img src="/img/menu-icon2.svg" alt="" />
          </span>
          <Link href={SITE_URL.ACCOUNT_FAVORITES} className="icon">
            <img src="/img/menu-icon3.svg" alt="" />
          </Link>
          <Link href={SITE_URL.ACCOUNT_TRANSACTIONS} className="icon">
            <img src="/img/menu-icon4.svg" alt="" />
          </Link>
          <Link href={SITE_URL.CHAT} className="icon">
            <img src="/img/menu-icon5.svg" alt="" />
          </Link>
        </div>
      </div>

      <div className="notifications-wrapper">
        {notifications && (
          <div
            className="fixed top-0 left-0 w-full h-full z-1"
            onClick={() => setNotifications(false)}
          />
        )}
        <div
          className={clsx("notifications", {
            show: notifications,
          })}
        >
          <div className="top-mob">
            <span className="back" onClick={() => setNotifications(false)}>
              <img src="/img/back-left.svg" alt="" />
            </span>
            <b>Уведомления</b>
          </div>
          <div className="top-line">
            <b>Уведомления</b>
            <div className="new">
              <span>Только новые</span>
              <div className="switch" id="mySwitch">
                <div className="slider"></div>
              </div>
            </div>
          </div>
          <div className="view-all">Пометить все просмотренными (2)</div>
          <a href="#" className="notifications-item">
            <div className="icon">
              <img src="/img/search/notifications-icon1.svg" alt="" />
            </div>
            <div className="texts">
              <b>Новое предложение</b>
              <span>Diamond кейтеринг предлагает сделку</span>
            </div>
            <div className="circle"></div>
          </a>
          <a href="#" className="notifications-item">
            <div className="icon">
              <img src="/img/search/notifications-icon2.svg" alt="" />
            </div>
            <div className="texts">
              <b>Cтатус сделки</b>
              <span>Diamond кейтеринг принял предложение</span>
            </div>
            <div className="circle"></div>
          </a>
          <div className="border"></div>
          <div className="notifications-items">
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon3.svg" alt="" />
              </div>
              <div className="texts">
                <b>Cтатус сделки</b>
                <span>Diamond кейтеринг принял предложение</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon4.svg" alt="" />
              </div>
              <div className="texts">
                <b>Предложение прошло модерацию</b>
                <span>Кейтеринг в день мероприятия с выездом на площадку</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
            <a href="#" className="notifications-item">
              <div className="icon">
                <img src="/img/search/notifications-icon5.svg" alt="" />
              </div>
              <div className="texts">
                <b>Предложение не прошло модерацию</b>
                <span>Кейтеринг в день мероприятия с выездом на площадку</span>
              </div>
              <div className="arrow">
                <img src="/img/arr-r.svg" alt="" />
              </div>
            </a>
          </div>
          <div className="border"></div>
          <div className="not-info">
            <div className="head">
              <b>Как все прошло?</b>
              <button className="close" type="button">
                <img src="/img/close-pop.svg" alt="" />
              </button>
            </div>
            <p>
              Ваша сделка с Dостаевский завершена. Поделись отзывом и помоги
              другим найти ту самую коллаборацию!
            </p>
            <div className="info">
              <div className="text-wrap">
                <div className="texts">
                  <b>Кейтеринг для мероприятия</b>
                  <span>Dостаевский</span>
                </div>
                <span>26 Nov 2021</span>
              </div>
              <div className="img-wrap">
                <img src="/img/search/not-info-icon.png" alt="" />
              </div>
            </div>
          </div>
          <a href="#" className="leave-feedback">
            <img src="/img/search/rew-icon.svg" alt="" />
            <b>Оставить отзыв</b>
          </a>
        </div>
      </div>
    </>
  );
}

export default Navbar;
