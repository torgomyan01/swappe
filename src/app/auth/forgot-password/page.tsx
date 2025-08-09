import Link from "next/link";
import { SITE_URL } from "@/utils/consts";

function ForgotPassword() {
  return (
    <div className="main-wrap">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="form-wrap">
          <img src="/img/sign-in-style.png" alt="" />
          <form>
            <h2>Восстановление пароля</h2>
            <p className="info-text">
              Введи свою почту, и мы отправим ссылку для восстановления пароля
            </p>
            <div className="input-wrap">
              <span>Почта</span>
              <input type="email" name="email" placeholder="Почта" />
            </div>
            <button className="green-btn" type="button">
              Восстановить пароль
            </button>
            <Link href={SITE_URL.HOME} className="back">
              <img src="/img/back-icon.svg" alt="" />
              <span>Вернуться на главную страницу</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
