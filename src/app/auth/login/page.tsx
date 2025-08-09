import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import { Input } from "@heroui/react";

function Register() {
  return (
    <div className="main-wrap">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="form-wrap">
          <img src="/img/sign-in-style.png" alt="" />
          <form>
            <h2>Вход</h2>
            <div className="input-wrap">
              <span>Почта</span>
              <Input className="max-w-xs" type="email" variant="bordered" />
            </div>
            <div className="input-wrap">
              <span>Пароль</span>
              <input type="password" name="password" placeholder="Пароль" />
            </div>
            <Link href={SITE_URL.FORGOT_PASSWORD} className="forgot">
              Забыл пароль?
            </Link>
            <button className="green-btn" type="button">
              Продолжить
            </button>
            <div className="account">
              <b>или</b>
              <a href="#" className="google">
                <img src="/img/google-icon.png" alt="" />
                Вход с аккаунтом Google
              </a>
              <a href="#" className="yandex">
                <img src="/img/yandex.png" alt="" />
                Вход с аккаунтом Yandex
              </a>
              <div className="bottom">
                <span>Еще нет аккаунта?</span>
                <Link href={SITE_URL.REGISTER}>Присоединяйся</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
