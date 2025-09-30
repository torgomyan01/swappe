import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import moment from "moment";

function Footer() {
  return (
    <footer className="footer">
      <div className="wrapper">
        <div className="info">
          <Link href={SITE_URL.HOME} className="footer-logo">
            <img src="/img/footer-logo.svg" alt="" />
          </Link>
          <div className="menu-wrap">
            <h4>Разделы</h4>
            <Link href="#">Стать ВИП</Link>
            <Link href="#">Сделки</Link>
            <Link href="#">Избранное</Link>
            <Link href="#">Чат</Link>
          </div>
          <div className="menu-wrap">
            <h4>О Свопи</h4>
            <Link href="#">О компании</Link>
            <Link href="#">Частые вопросы</Link>
            <Link href="#">Поддержка</Link>
            <Link href="#">Solutions</Link>
          </div>
          <div className="menu-wrap">
            <h4>Положения и условия</h4>
            <Link href={SITE_URL.PRIVACY_POLICY}>Конфиденциальность</Link>
            <Link href="#">Условия</Link>
          </div>
        </div>
        <p className="copyright">
          Swappe - платформа для бартерного обмена и коллабораций. Условия
          пользования. Политика конфиденциальности. Оформляя подписку на Swappe,
          вы принимаете оферту. &copy; {moment().format("YYYY")} Свопи. Все
          права защищены.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
