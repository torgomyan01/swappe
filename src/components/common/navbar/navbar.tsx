"use client";

import { useSession } from "next-auth/react";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { sliceText } from "@/utils/helpers";
import { Tooltip } from "@heroui/react";

function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <div className="header-profile">
        <div className="wrapper">
          <Link href={SITE_URL.HOME} className="logo">
            <img src="/img/black-logo.svg" alt="" />
          </Link>
          <form className="search" action={SITE_URL.SEARCH}>
            <input type="text" placeholder="Введи запрос" name="value" />
            <button type="button">
              <img src="/img/search-icon.svg" alt="" />
            </button>
          </form>
          <div className="icons">
            <span className="icon cursor-pointer">
              <img src="/img/menu-icon1.svg" alt="" />
            </span>
            <span className="icon cursor-pointer">
              <span className="circle"></span>
              <img src="/img/menu-icon2.svg" alt="" />
            </span>
            <span className="icon cursor-pointer">
              <img src="/img/menu-icon3.svg" alt="" />
            </span>
            <span className="icon cursor-pointer">
              <img src="/img/menu-icon4.svg" alt="" />
            </span>

            <Tooltip content="Сообщения">
              <span className="icon cursor-pointer">
                <span className="count">+9</span>
                <img src="/img/menu-icon5.svg" alt="" />
              </span>
            </Tooltip>
          </div>
          {session ? (
            <Link href={SITE_URL.ACCOUNT} className="user-in">
              <span>{sliceText(session.user?.name || "", 10, ".")}</span>
              <div className="avatar">
                <img src="/img/header-avatar.png" alt="" />
              </div>
            </Link>
          ) : (
            <Link href={SITE_URL.LOGIN} className="user cursor-pointer">
              <img src="/img/user-icon.svg" alt="user icon" />
            </Link>
          )}
        </div>
      </div>

      <div className="wrapper">
        <div className="mobile-icons">
          <a href="#" className="icon">
            <img src="/img/menu-icon1.svg" alt="" />
          </a>
          <a href="#" className="icon">
            <img src="/img/menu-icon2.svg" alt="" />
          </a>
          <a href="#" className="icon">
            <img src="/img/menu-icon3.svg" alt="" />
          </a>
          <a href="#" className="icon">
            <img src="/img/menu-icon4.svg" alt="" />
          </a>
          <a href="#" className="icon">
            <img src="/img/menu-icon5.svg" alt="" />
          </a>
        </div>
      </div>
    </>
  );
}

export default Navbar;
