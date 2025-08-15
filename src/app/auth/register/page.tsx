"use client";

import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import { getPasswordStrength } from "@/utils/helpers";
import { useRef, useState } from "react";
import clsx from "clsx";
import DefInput from "@/components/common/input/def-input";
import { addToast, Button } from "@heroui/react";
import { ActionCreateUser } from "@/app/actions/auth/create-user";

function Register() {
  const form = useRef<HTMLFormElement | null>(null);
  const [password, setPassword] = useState("");

  const strength = getPasswordStrength(password);

  const hasLower = /[a-z]/;
  const hasUpper = /[A-Z]/;
  const hasDigit = /\d/;

  const hasSpecial = /[^A-Za-z0-9]/;
  const noSpaces = (v: string) => !/\s/.test(v);
  const minLength = (n: number) => (v: string) => v.length >= n;

  const [loading, setLoading] = useState<boolean>(false);

  function CreateUser(e: any) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const repead_password = e.target.repead_password.value;

    if (password !== repead_password) {
      addToast({
        title: "Пароль и повторный пароль должны быть одинаковыми.",
        color: "danger",
      });

      return;
    }

    if (name && email && password) {
      setLoading(true);

      ActionCreateUser(name, password, email)
        .then((res) => {
          if (res.status === "error") {
            addToast({
              title: res.error,
              color: "danger",
            });
          }

          if (res.status === "ok") {
            addToast({
              title:
                "Поздравляем, вы успешно зарегистрировались. Осталось только подтвердить адрес электронной почты.",
              color: "success",
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      addToast({
        title: "Пожалуйста, заполните все поля.",
        color: "danger",
      });
    }
  }

  return (
    <div className="main-wrap">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="form-wrap">
          <img src="/img/sign-in-style.png" alt="" />
          <form ref={form} action="#" onSubmit={CreateUser}>
            <h2 className="font-geologica">Регистрация</h2>
            <DefInput
              label="Имя"
              placeholder="Имя"
              required
              name="name"
              formRef={form}
              showAllErrors
              rules={[/^[^!$%@_?*]+$/, (v) => v.trim().length >= 2]}
              messages={[
                "Нельзя использовать символы !$%@_?*",
                "Должно быть не менее 2 символов.",
              ]}
            />
            <DefInput
              label="Почта"
              placeholder="Почта"
              required
              name="email"
              formRef={form}
              showAllErrors
              rules={[/^[^\s@]+@[^\s@]+\.[^\s@]+$/]}
              messages={[
                "Пожалуйста, введите корректный адрес электронной почты",
              ]}
            />

            <DefInput
              label="Пароль"
              placeholder="Пароль"
              type="password"
              name="password"
              required
              formRef={form}
              rules={[
                minLength(8),
                hasLower,
                hasUpper,
                hasDigit,
                hasSpecial,
                noSpaces,
              ]}
              messages={[
                "Пароль должен содержать не менее 8 символов",
                "Должна быть хотя бы одна строчная буква (a–z)",
                "Должна быть хотя бы одна заглавная буква (A–Z)",
                "Должна быть хотя бы одна цифра (0–9)",
                "Должен быть хотя бы один специальный символ (например, !@#$%^&*)",
                "Пробелы использовать нельзя",
              ]}
              onValueChange={(val) => setPassword(val)}
              bottomElements={
                <div className="w-full flex-jsb-c gap-2 mt-2 px-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`strong-pass-${i}`}
                      className={clsx(
                        "w-full h-[4px] bg-green/30 rounded-[4px] transition",
                        {
                          "!bg-green": password && strength >= i,
                        },
                      )}
                    ></div>
                  ))}
                </div>
              }
            />

            <DefInput
              label="Повтори пароль"
              placeholder="Повтори пароль"
              type="password"
              name="repead_password"
              required
              formRef={form}
            />

            <p>
              Нажимая Продолжить, я принимаю{" "}
              <Link href="#">пользовательское соглашение</Link>
            </p>
            <Button
              type="submit"
              className="bg-green text-white mt-4 h-11"
              isLoading={loading}
            >
              Продолжить
            </Button>
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
