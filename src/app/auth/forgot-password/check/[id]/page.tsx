"use client";

import DefInput from "@/components/common/input/def-input";
import { useEffect, useRef, useState } from "react";
import { addToast, Button, Spinner } from "@heroui/react";
import clsx from "clsx";
import { getPasswordStrength } from "@/utils/helpers";
import { useParams } from "next/navigation";
import { ActionGetUserName } from "@/app/actions/auth/get-user-name";
import { ActionUpdateUserPassword } from "@/app/actions/auth/change-user-password";
import Link from "next/link";
import { SITE_URL } from "@/utils/consts";

function ForgotPasswordCheck() {
  const { id } = useParams();

  const [user, setUser] = useState<IUserProfile | null>(null);

  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      ActionGetUserName(id).then((res) => {
        if (res.status === "ok") {
          setUser(res.data as IUserProfile);
        }

        if (res.status === "error") {
          addToast({
            title: res.error,
            color: "danger",
          });
        }
      });
    }
  }, [id]);

  const form = useRef<HTMLFormElement | null>(null);

  const [loading, setLoading] = useState(false);

  const hasLower = /[a-z]/;
  const hasUpper = /[A-Z]/;
  const hasDigit = /\d/;

  const hasSpecial = /[^A-Za-z0-9]/;
  const noSpaces = (v: string) => !/\s/.test(v);
  const minLength = (n: number) => (v: string) => v.length >= n;

  const [password, setPassword] = useState("");

  const [passwordRepeat, setPasswordRepeat] = useState("");

  const strength = getPasswordStrength(password);

  function StartCheckPassword(e: any) {
    e.preventDefault();

    if (password !== passwordRepeat) {
      addToast({
        title: "Пароль и повторный пароль должны быть одинаковыми.",
        color: "danger",
      });
      return;
    }

    if (user) {
      setLoading(true);

      ActionUpdateUserPassword(password, user.id)
        .then((res) => {
          if (res.status === "ok") {
            setSuccess(true);

            addToast({
              title: "Спасибо ваш пароль успешно изменен ",
              color: "success",
            });
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
  }

  return (
    <div className="main-wrap">
      {success ? (
        <div className="wrapper">
          <img src="/img/black-logo.svg" alt="" className="logo" />
          <div className="main-info">
            <img src="/img/changed.png" alt="" />
            <b>Пароль изменен</b>
            <Link href={SITE_URL.LOGIN} className="green-btn">
              Войти
            </Link>
          </div>
          <div className=""></div>
        </div>
      ) : (
        <div className="wrapper">
          <img src="/img/black-logo.svg" alt="" className="logo" />
          <div className="form-wrap">
            <img src="/img/sign-in-style.png" alt="" />

            {user ? (
              <form ref={form} action="#" onSubmit={StartCheckPassword}>
                <h2>Привет, {user.name}</h2>
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

                <div className="mt-4">
                  <DefInput
                    label="Повторить пароль"
                    placeholder="Пароль"
                    type="password"
                    name="password-repeat"
                    required
                    formRef={form}
                    onValueChange={(val) => setPasswordRepeat(val)}
                  />
                </div>
                <Button className="green-btn" type="submit" isLoading={loading}>
                  Восстановить пароль
                </Button>
              </form>
            ) : (
              <div className="w-full h-[250px] flex-jc-c">
                <Spinner color="secondary" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordCheck;
