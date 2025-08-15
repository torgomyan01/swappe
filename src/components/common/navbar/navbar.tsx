"use client"

import {useSession} from "next-auth/react";
import {SITE_URL} from "@/utils/consts";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();

  console.log(session, "datadatadata");

  return (
    <>
      <div className="header-profile">
        <div className="wrapper">
          <Link href={SITE_URL.HOME} className="logo">
            <img src="/img/black-logo.svg" alt=""/>
          </Link>
          <form className="search">
            <input type="text" placeholder="Введи запрос"/>
            <button type="button">
              <img src="/img/search-icon.svg" alt=""/>
            </button>
          </form>
          <div className="icons">
            <span className="icon cursor-pointer">
              <img src="/img/menu-icon1.svg" alt=""/>
            </span>
            <span className="icon cursor-pointer">
              <span className="circle"></span>
              <img src="/img/menu-icon2.svg" alt=""/>
            </span>
            <span className="icon cursor-pointer">
              <img src="/img/menu-icon3.svg" alt=""/>
            </span>
            <span className="icon cursor-pointer">
              <img src="/img/menu-icon4.svg" alt=""/>
            </span>
            <span className="icon cursor-pointer">
              <span className="count">+9</span>
              <img src="/img/menu-icon5.svg" alt=""/>
            </span>
          </div>
          <span className="user cursor-pointer">
            <img src="/img/user-icon.svg" alt=""/>
          </span>
        </div>
      </div>

      <div className="wrapper">
        <div className="mobile-icons">
          <a href="#" className="icon">
            <img src="img/menu-icon1.svg" alt=""/>
          </a>
          <a href="#" className="icon">
            <img src="img/menu-icon2.svg" alt=""/>
          </a>
          <a href="#" className="icon">
            <img src="img/menu-icon3.svg" alt=""/>
          </a>
          <a href="#" className="icon">
            <img src="img/menu-icon4.svg" alt=""/>
          </a>
          <a href="#" className="icon">
            <img src="img/menu-icon5.svg" alt=""/>
          </a>
        </div>
      </div>

    </>
  )
}


export default Navbar