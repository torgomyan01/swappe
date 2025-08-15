"use client";

import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import DefInput from "@/components/common/input/def-input";
import { useRef, useState } from "react";
import { addToast, Button } from "@heroui/react";
import { signIn } from "next-auth/react";

function Register() {
  const form = useRef<HTMLFormElement | null>(null);

  const [loading, setLoading] = useState(false);

  async function LoginUser(e: any) {
    e.preventDefault();

    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(fd.get("password") || "");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      console.log(res);

      setLoading(false);
    } else {
      addToast({ title: "Неверный e-mail или пароль", color: "danger" });

      setLoading(false);
    }

    // const newFormData = new FormData();
    //
    // newFormData.append("email", email);
    // newFormData.append("password", password);
    //
    // setLoading(true);
    // ActionUserLogin(newFormData)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .finally(() => setLoading(false));
  }

  return (
    <div className="main-wrap">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="form-wrap">
          <img src="/img/sign-in-style.png" alt="" />
          <form ref={form} action="#" onSubmit={LoginUser}>
            <h2>Вход</h2>
            <DefInput
              label="Почта"
              placeholder="Почта"
              required
              name="email"
              formRef={form}
            />

            <DefInput
              label="Пароль"
              placeholder="Пароль"
              required
              name="password"
              formRef={form}
              type="password"
            />

            <Link href={SITE_URL.FORGOT_PASSWORD} className="forgot">
              Забыл пароль?
            </Link>
            <Button
              type="submit"
              className="bg-green text-white mt-4 h-11"
              isLoading={loading}
            >
              Продолжить
            </Button>
            <div className="account">
              <b>или</b>
              {/*<a href="#" className="google">*/}
              {/*  <img src="/img/google-icon.png" alt="" />*/}
              {/*  Вход с аккаунтом Google*/}
              {/*</a>*/}
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
