"use client";

import { ActionGetYandexUserInfo } from "@/app/actions/auth/get-yandex-user-info";
import { signIn } from "next-auth/react";
import { addToast, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { SITE_URL } from "@/utils/consts";
import { ActionCreateUserByYandex } from "@/app/actions/auth/create-user";
import { useRouter } from "next/navigation";

function VerifyYandex() {
  const router = useRouter();

  useEffect(() => {
    const url = window.location.href.split("#")[1];
    const params = new URLSearchParams(url);
    const access_token = params.get("access_token");
    if (!access_token) {
      return;
    }

    ActionGetYandexUserInfo(access_token).then(async (res) => {
      if (res.status === "ok") {
        if (res.data) {
          ActionCreateUserByYandex(
            res.data.name,
            res.data.password,
            res.data.email,
          ).then(async (_res) => {
            // If user created or updated successfully, login
            if (_res.status === "ok") {
              const login = await signIn("credentials", {
                redirect: false,
                email: res.data.email || "",
                password: res.data.password || "",
              });

              if (login && login.ok) {
                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage(
                    {
                      type: "yandex-auth-success",
                      redirectTo: SITE_URL.ACCOUNT,
                    },
                    window.location.origin,
                  );
                  // Close the popup
                  window.close();
                } else {
                  // If not a popup, navigate normally
                  router.push(SITE_URL.ACCOUNT);
                }
              } else {
                addToast({
                  title: "Ошибка при входе",
                  color: "danger",
                });
              }
            } else {
              addToast({
                title: _res.error || "Не удалось выполнить операцию",
                color: "danger",
              });
            }
          });
        }
      }
    });
  }, []);

  return (
    <div className="flex-jc-c w-full h-[400px]">
      <Spinner />
    </div>
  );
}
export default VerifyYandex;
