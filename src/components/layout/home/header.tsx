"use client";

import Link from "next/link";
import { fileHost, motionOptionText, SITE_URL } from "@/utils/consts";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  User,
  ListboxItem,
  Listbox,
} from "@heroui/react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

const images = [
  "img/banner-img1.png",
  "img/banner-img2.png",
  "img/banner-img3.png",
  "img/banner-img4.png",
  "img/banner-img5.png",
];

function HomeHeader() {
  const { data: session }: any = useSession();

  console.log(session);

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const menuItems = [
    {
      name: "Тарифы",
      url: "#service",
    },
    {
      name: "Для кого",
      url: "#business-size",
    },
    {
      name: "Почему Swappe",
      url: "#why-are",
    },
    {
      name: "FAQ",
      url: "#faq",
    },
    ...(!session
      ? [
          {
            name: "Хочу участвовать",
            url: SITE_URL.REGISTER,
          },
        ]
      : []),
  ];

  const [menuMobile, setMenuMobile] = useState<boolean>(false);

  return (
    <>
      <div className="header-main">
        <div className="wrapper">
          <div className="info">
            <img src="/img/head-bg.png" alt="" className="bg" />
            <Link href={SITE_URL.SEARCH} className="logo">
              <img src="/img/footer-logo.svg" alt="" />
            </Link>
            <ul className="main-menu2">
              <li>
                <Link href="#service">Тарифы </Link>
              </li>
              <li>
                <Link href="#business-size">Для кого</Link>
              </li>
              <li>
                <Link href="#why-are">Почему Swappe</Link>
              </li>
              <li>
                <Link href="#faq">FAQ</Link>
              </li>
            </ul>
            <div className="drop-menu-main">
              <img
                src="/img/menu.png.webp"
                alt="icon burger menu"
                onClick={() => setMenuMobile(true)}
              />
            </div>
          </div>
          {session ? (
            <Link href={SITE_URL.ACCOUNT} className="login-btn">
              <i className="fa-solid fa-user mr-2"></i>
              {session.user?.name}
            </Link>
          ) : (
            <Link href={SITE_URL.LOGIN} className="login-btn">
              <img src="/img/subtract.svg" alt="" />
              Войти в сервис
            </Link>
          )}

          {/* <div
            className={clsx("menu-wrap-main", {
              open: menuMobile,
            })}
          >
            <div className="close-menu">
              <img
                src="/img/close-menu.svg"
                alt="icon close"
                onClick={() => setMenuMobile(false)}
              />
            </div>
            <Link href={SITE_URL.SEARCH} className="mob-logo">
              <img src="/img/footer-logo.svg" alt="" />
            </Link>
            <ul className="main-menu-mobile2">
              <li>
                <a href="#service">О сервисе</a>
              </li>
              <li>
                <a href="#business-size">Отзывы</a>
              </li>
              <li>
                <a href="#why-are">Кто мы</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>

            {session ? (
              <a href={SITE_URL.ACCOUNT} className="login-btn-mob">
                <i className="fa-solid fa-user mr-2"></i>
                {session.user?.name}
              </a>
            ) : (
              <a href={SITE_URL.LOGIN} className="login-btn-mob">
                <img src="/img/subtract.svg" alt="" />
                Войти в сервис
              </a>
            )}
          </div> */}
        </div>
      </div>
      <div className="home-banner">
        <div className="wrapper">
          <motion.h1
            initial="init"
            whileInView="animate"
            transition={{
              duration: 0.5,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={motionOptionText}
          >
            Обменивайтесь идеями, а не деньгами
          </motion.h1>
          <motion.p
            initial="init"
            whileInView="animate"
            transition={{
              duration: 0.9,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={motionOptionText}
          >
            Платформа для роста бизнесов через бартерный обмен и коллаборации
          </motion.p>
          <Link href={SITE_URL.SEARCH}>
            <motion.span
              initial="init"
              whileInView="animate"
              transition={{
                duration: 1,
              }}
              viewport={{ once: true, amount: 0.1 }}
              variants={motionOptionText}
              className="participate-btn"
            >
              <img src="/img/participate.svg" alt="" />
              Хочу участвовать
            </motion.span>
          </Link>
          <motion.p
            initial="init"
            whileInView="animate"
            transition={{
              duration: 1,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={motionOptionText}
          >
            Присоединяйтесь первым — получайте бонусы!
          </motion.p>
          <div className="images">
            {images.map((image, i) => (
              <motion.img
                key={`header-imge-${i}`}
                initial="init"
                whileInView="animate"
                transition={{
                  delay: 0.2 * i,
                  duration: 0.5,
                }}
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  init: {
                    opacity: 0,
                    y: "60px",
                  },
                  animate: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                src={image}
                alt=""
              />
            ))}
          </div>
        </div>
      </div>

      <Drawer
        isOpen={menuMobile}
        onOpenChange={setMenuMobile}
        placement="right"
      >
        <DrawerContent className="rounded-none bg-black/50 backdrop-blur-xl">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-white">
                Меню
              </DrawerHeader>
              <DrawerBody>
                <ul className="flex flex-col gap-4 w-full">
                  {menuItems.map((item: any) => (
                    <li
                      key={item.name}
                      className="w-full"
                      onClick={() => onClose()}
                    >
                      <Link
                        href={item.url}
                        className="text-base w-full border-b border-white/20 pb-2 !flex-jsb-c text-white"
                      >
                        {item.name}
                        <i className="fa-solid fa-chevron-right text-gray-300 text-[12px]"></i>
                      </Link>
                    </li>
                  ))}
                </ul>
              </DrawerBody>
              <DrawerFooter className="justify-center">
                {session ? (
                  <Link
                    href={SITE_URL.ACCOUNT}
                    className="block !shadow-inner px-5 py-2 pt-3 rounded-[20px] bg-white/20"
                  >
                    <User
                      avatarProps={
                        session.user.helper_role ||
                        (company && {
                          src: `${fileHost}${session.user?.helper_role ? session.user?.image_path : company?.image_path || undefined}`,
                        })
                      }
                      name={session.user?.name}
                      description={
                        session.user?.helper_role ? "Менеджер" : "Администратор"
                      }
                      classNames={{
                        name: "text-white",
                        description: "text-white/50",
                      }}
                    />
                  </Link>
                ) : (
                  <a href={SITE_URL.LOGIN} className="login-btn-mob">
                    <img src="/img/subtract.svg" alt="" />
                    Войти в сервис
                  </a>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default HomeHeader;
