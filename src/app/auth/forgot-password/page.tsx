"use client";

import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import DefInput from "@/components/common/input/def-input";
import { useRef, useState } from "react";
import { addToast, Button } from "@heroui/react";
import { ActionForgotPassword } from "@/app/actions/auth/forgot-password";
import clsx from "clsx";

function ForgotPassword() {
  const form = useRef<HTMLFormElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [sendedEmail, setSendEmail] = useState<string>("");

  function StartFindPassword(e: any) {
    e.preventDefault();

    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "")
      .trim()
      .toLowerCase();

    ActionForgotPassword(email)
      .then((res) => {
        if (res.status === "ok") {
          setSendEmail(email);
        }

        if (res.status === "error") {
          addToast({
            title: res.error,
            color: "danger",
          });
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <div
      className={clsx("main-wrap", {
        style2: sendedEmail,
      })}
    >
      {sendedEmail ? (
        <div className="wrapper">
          <img src="/img/black-logo.svg" alt="" className="logo" />
          <div className="main-info">
            <img src="/img/evriting-img.png" alt="" />
            <b>Все готово</b>
            <p>
              Ссылка отправлена на <a href="#">{sendedEmail}</a>
            </p>
            <p>Проверь свою почту и нажми на ссылку, чтобы продолжить</p>
            <span
              className="read cursor-pointer"
              onClick={() => setSendEmail("")}
            >
              <img src="/img/back-icon.svg" alt="" />
              <span>Изменить почту</span>
            </span>
          </div>
          <div className="bottom-text">
            <span>Возникли проблемы?</span>
            <Link href={SITE_URL.CHAT}>Наша поддержка поможет</Link>
          </div>
        </div>
      ) : (
        <div className="wrapper">
          <img src="/img/black-logo.svg" alt="" className="logo" />
          <div className="form-wrap">
            <img src="/img/sign-in-style.png" alt="" />
            <form ref={form} action="#" onSubmit={StartFindPassword}>
              <h2>Восстановление пароля</h2>
              <p className="info-text">
                Введи свою почту, и мы отправим ссылку для восстановления пароля
              </p>
              <DefInput
                label="Почта"
                placeholder="Почта"
                required
                name="email"
                showAllErrors
                rules={[/^[^\s@]+@[^\s@]+\.[^\s@]+$/]}
                messages={[
                  "Пожалуйста, введите корректный адрес электронной почты",
                ]}
                formRef={form}
              />
              <Button className="green-btn" type="submit" isLoading={loading}>
                Восстановить пароль
              </Button>
              <Link href={SITE_URL.LOGIN} className="back">
                <img src="/img/back-icon.svg" alt="" />
                <span>Вернуться на главную страницу</span>
              </Link>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
