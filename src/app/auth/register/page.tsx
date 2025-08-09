"use client";

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
            <h2>Регистрация</h2>
            <div className="input-wrap">
              <span>Имя*</span>
              <Input
                className="w-full"
                type="text"
                placeholder="Имя"
                variant="bordered"
                errorMessage="Please enter a valid email"
                isInvalid={true}
              />
            </div>
            <div className="input-wrap">
              <span>Почта</span>
              <input type="email" name="email" placeholder="Почта" />
            </div>
            <div className="input-wrap">
              <span>Пароль</span>
              <input type="password" name="password" placeholder="Пароль" />
            </div>
            <div className="input-wrap">
              <span>Подтверди пароль*</span>
              <input
                type="password"
                name="password"
                placeholder="Повтори пароль"
              />
            </div>
            <p>
              Нажимая Продолжить, я принимаю{" "}
              <a href="#">пользовательское соглашение</a>
            </p>
            <button className="green-btn" type="button">
              Продолжить
            </button>
            <div className="account">
              <div className="bottom">
                <span>Уже есть аккаунт?</span>
                <Link href={SITE_URL.LOGIN}>Войти</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
