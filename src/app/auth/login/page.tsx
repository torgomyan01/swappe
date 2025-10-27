"use client";

import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import DefInput from "@/components/common/input/def-input";
import { useRef, useState, useEffect } from "react";
import { addToast, Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();
  const form = useRef<HTMLFormElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [yandexLoading, setYandexLoading] = useState(false);

  useEffect(() => {
    // Handle postMessage from redirect page
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "YANDEX_TOKEN") {
        const token = event.data.token;

        try {
          setYandexLoading(true);

          // Get user info from Yandex
          const userResponse = await fetch(
            `https://login.yandex.ru/info?format=json&oauth_token=${token}`,
          );
          const userData = await userResponse.json();

          console.log("User data from Yandex: ", userData);

          // Sign in with NextAuth
          const result = await signIn("yandex", {
            redirect: false,
            email: userData.email,
            name: userData.real_name || userData.display_name || userData.email,
          });

          if (result?.ok) {
            router.push(SITE_URL.ACCOUNT);
          } else {
            addToast({
              title: "Ошибка авторизации через Yandex",
              color: "danger",
            });
          }
        } catch (error) {
          console.error("Yandex auth error:", error);
          addToast({
            title: "Ошибка авторизации через Yandex",
            color: "danger",
          });
        } finally {
          setYandexLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Initialize Yandex SDK button after component mounts
    const initializeYandexButton = () => {
      if (typeof window !== "undefined" && (window as any).YaAuthSuggest) {
        (window as any).YaAuthSuggest.init(
          {
            client_id: "2badaf5c96cb45c2a4c6498cf188fb47",
            response_type: "token",
            redirect_uri: `${window.location.origin}/suggest/token`,
          },
          window.location.origin,
          {
            view: "button",
            parentId: "yandex-button-container",
            buttonView: "main",
            buttonTheme: "light",
            buttonSize: "m",
            buttonBorderRadius: 20,
          },
        )
          .then(function (result: any) {
            return result.handler();
          })
          .then(async function (data: any) {
            console.log("Сообщение с токеном: ", data);

            if (data.access_token) {
              // Get user info from Yandex
              const userResponse = await fetch(
                `https://login.yandex.ru/info?format=json&oauth_token=${data.access_token}`,
              );
              const userData = await userResponse.json();

              console.log("User data from Yandex: ", userData);

              // Sign in with NextAuth
              const result = await signIn("yandex", {
                redirect: false,
                email: userData.email,
                name:
                  userData.real_name || userData.display_name || userData.email,
              });

              if (result?.ok) {
                router.push(SITE_URL.ACCOUNT);
              } else {
                addToast({
                  title: "Ошибка авторизации через Yandex",
                  color: "danger",
                });
              }
            }
          })
          .catch(function (error: any) {
            console.log("Что-то пошло не так: ", error);
            addToast({
              title: "Ошибка авторизации через Yandex",
              color: "danger",
            });
          });
      }
    };

    // Wait a bit for SDK to load
    const timer = setTimeout(initializeYandexButton, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

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
      router.push(SITE_URL.ACCOUNT);

      setLoading(false);
    } else {
      const code = (res as any)?.error || "";
      if (code === "ARCHIVED_ACCOUNT") {
        addToast({
          title: "Аккаунт удален. Восстановите аккаунт через регистрацию.",
          color: "danger",
        });
      } else if (code === "NOT_VERIFIED") {
        addToast({ title: "Аккаунт не подтвержден", color: "danger" });
      } else {
        addToast({ title: "Неверный e-mail или пароль", color: "danger" });
      }

      setLoading(false);
    }
  }

  return (
    <div className="main-wrap">
      <div className="wrapper">
        <Link href={SITE_URL.SEARCH}>
          <img src="/img/black-logo.svg" alt="" className="logo" />
        </Link>
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
              allowPasswordToggle
            />

            <Link href={SITE_URL.FORGOT_PASSWORD} className="forgot">
              Восстановить пароль
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
              <div id="yandex-button-container"></div>
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
