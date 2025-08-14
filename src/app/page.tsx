"use client";

import "@/components/layout/home/home.scss";

import HomeHeader from "@/components/layout/home/header";
import WeHelpYour from "@/components/layout/home/we-help-your";
import BussinesBlock from "@/components/layout/home/bussines-block";
import HomeFaq from "@/components/layout/home/home-faq";
import WhyAre from "@/components/layout/home/why-are";

function Page() {
  return (
    <>
      <HomeHeader />
      <WeHelpYour />

      <BussinesBlock />

      <HomeFaq />

      <WhyAre />

      <footer className="footer">
        <div className="wrapper">
          <div className="info">
            <a href="index.html" className="footer-logo">
              <img src="img/footer-logo.svg" alt="" />
            </a>
            <div className="menu-wrap">
              <h4>Разделы</h4>
              <a href="#">Стать ВИП</a>
              <a href="#">Сделки</a>
              <a href="#">Избранное</a>
              <a href="#">Чат</a>
            </div>
            <div className="menu-wrap">
              <h4>О Свопи</h4>
              <a href="#">О компании</a>
              <a href="#">Частые вопросы</a>
              <a href="#">Поддержка</a>
              <a href="#">Solutions</a>
            </div>
            <div className="menu-wrap">
              <h4>Положения и условия</h4>
              <a href="#">Конфиденциальность</a>
              <a href="#">Условия</a>
            </div>
          </div>
          <p className="copyright">
            Swappe - платформа для бартерного обмена и коллабораций. Условия
            пользования. Политика конфиденциальности. Оформляя подписку на
            Swappe, вы принимаете оферту. &copy; 2024 Свопи. Все права защищены.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Page;
