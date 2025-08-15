"use client";

import { addToast, Spinner } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ActionCheckUserVerifyCode } from "@/app/actions/auth/check-verify-code";
import { SITE_URL } from "@/utils/consts";

function VerifyUser() {
  const { code, email } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (
      code &&
      typeof code === "string" &&
      email &&
      typeof email === "string"
    ) {
      ActionCheckUserVerifyCode(+code, email).then((res) => {
        if (res.status === "error") {
          addToast({
            title: res.error,
            color: "danger",
          });
        }

        if (res.status === "ok") {
          addToast({
            title: "Поздравляем, вы успешно прошли проверку.",
            color: "success",
          });

          router.push(SITE_URL.LOGIN);
        }
      });
    }
  }, [code, email]);

  return (
    <div className="flex-jc-c w-full h-[400px]">
      <Spinner />
    </div>
  );
}

export default VerifyUser;
