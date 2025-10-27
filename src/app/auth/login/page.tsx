"use client";

import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import DefInput from "@/components/common/input/def-input";
import { useRef, useState, useLayoutEffect } from "react";
import { addToast, Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function Register() {
  const router = useRouter();
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

  useLayoutEffect(() => {
    // Listen for messages from popup window
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "yandex-auth-success") {
        // Navigate to the account page
        window.location.href = event.data.redirectTo;
      }
    };

    window.addEventListener("message", handleMessage);

    // Function to initialize Yandex SDK with retry limit
    let retryCount = 0;
    const MAX_RETRIES = 10;
    let timeoutId: NodeJS.Timeout | null = null;

    const initYandexAuth = () => {
      // Check if SDK is loaded
      if (typeof window !== "undefined" && window.YaAuthSuggest) {
        console.log("Initializing Yandex SDK...");

        window.YaAuthSuggest.init(
          {
            client_id: "14ce52305b2c4418a05a9be702d41ad3",
            response_type: "token",
            redirect_uri: `${window.location.origin}/auth/verify-yandex`,
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
            console.log("Yandex SDK initialized successfully");
            return result.handler();
          })
          .then(function (data: any) {
            console.log("Сообщение с токеном: ", data);
          })
          .catch(function (error: any) {
            console.error("Yandex SDK error: ", error);
          });
      } else {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.warn(
            `YaAuthSuggest SDK not loaded yet, retrying... (${retryCount}/${MAX_RETRIES})`,
          );
          // Retry after a delay if SDK not loaded
          timeoutId = setTimeout(initYandexAuth, 1000);
        } else {
          console.error(
            "YaAuthSuggest SDK failed to load after maximum retries",
          );
        }
      }
    };

    // Start initialization
    timeoutId = setTimeout(initYandexAuth, 100);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router]);

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
              {/* <a
                href="#"
                className="yandex"
                onClick={(e) => {
                  e.preventDefault();
                  signIn("yandex", { callbackUrl: SITE_URL.ACCOUNT });
                }}
              >
                <img src="/img/yandex.png" alt="" />
                Вход с аккаунтом Yandex
              </a> */}
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
