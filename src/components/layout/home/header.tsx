"use client"

import Link from "next/link";
import {motionOptionText, SITE_URL} from "@/utils/consts";
import {motion} from "framer-motion";
import {useSession} from "next-auth/react";

const images = [
  "img/banner-img1.png",
  "img/banner-img2.png",
  "img/banner-img3.png",
  "img/banner-img4.png",
  "img/banner-img5.png",
];

function HomeHeader() {
  const { data: session } = useSession();

  return (
    <>
      <div className="header-main">
        <div className="wrapper">
          <div className="info">
            <img src="/img/head-bg.png" alt="" className="bg"/>
            <Link href={SITE_URL.HOME} className="logo">
              <img src="/img/footer-logo.svg" alt=""/>
            </Link>
            <ul className="main-menu2">
              <li>
                <Link href="#">О сервисе</Link>
              </li>
              <li>
                <Link href="#">Отзывы</Link>
              </li>
              <li>
                <Link href="#">Кто мы</Link>
              </li>
              <li>
                <Link href="#">FAQ</Link>
              </li>
            </ul>
            <div className="drop-menu-main">
              <img src="/img/menu.png.webp" alt=""/>
            </div>
          </div>
          {
            session ? (
              <Link href={SITE_URL.ACCOUNT} className="login-btn">
                <i className="fa-solid fa-user mr-2"></i>
                {session.user?.name}
              </Link>

            ) : (
              <Link href={SITE_URL.LOGIN} className="login-btn">
                <img src="/img/subtract.svg" alt=""/>
                Войти в сервис
              </Link>
            )
          }

          <div className="menu-wrap-main">
            <div className="close-menu">
              <img src="/img/close-menu.svg" alt=""/>
            </div>
            <a href="index.html" className="mob-logo">
              <img src="/img/footer-logo.svg" alt=""/>
            </a>
            <ul className="main-menu-mobile2">
              <li>
                <a href="#">О сервисе</a>
              </li>
              <li>
                <a href="#">Отзывы</a>
              </li>
              <li>
                <a href="#">Кто мы</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
            <a href="#" className="login-btn-mob">
              <img src="img/subtract.svg" alt=""/>
              Войти в сервис
            </a>
          </div>
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
            viewport={{once: true, amount: 0.1}}
            variants={motionOptionText}
          >
            Обменивайтесь услугами, а не деньгами
          </motion.h1>
          <motion.p
            initial="init"
            whileInView="animate"
            transition={{
              duration: 0.9,
            }}
            viewport={{once: true, amount: 0.1}}
            variants={motionOptionText}
          >
            Платформа для роста бизнесов через бартерный обмен и коллаборации
          </motion.p>
          <motion.span
            initial="init"
            whileInView="animate"
            transition={{
              duration: 1,
            }}
            viewport={{once: true, amount: 0.1}}
            variants={motionOptionText}
            className="participate-btn"
          >
            <img src="img/participate.svg" alt=""/>
            Хочу участвовать
          </motion.span>
          <motion.p
            initial="init"
            whileInView="animate"
            transition={{
              duration: 1,
            }}
            viewport={{once: true, amount: 0.1}}
            variants={motionOptionText}
          >
            Запускаемся скоро. Для первых участников — бонусы!
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
                viewport={{once: true, amount: 0.1}}
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
    </>
  );
}

export default HomeHeader;
