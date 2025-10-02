"use client";

import { addToast, Spinner } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SITE_URL } from "@/utils/consts";
import { ActionCheckUserVerifyCodeEmail } from "@/app/actions/auth/check-verify-code-email";
import { useSession } from "next-auth/react";

function VerifyUser() {
  const { code, email, old_email } = useParams();
  const router = useRouter();

  const { data: update }: any = useSession();

  useEffect(() => {
    if (
      code &&
      typeof code === "string" &&
      email &&
      typeof email === "string" &&
      old_email &&
      typeof old_email === "string"
    ) {
      ActionCheckUserVerifyCodeEmail(+code, email, old_email).then(
        async (res: any) => {
          if (res.status === "error") {
            addToast({
              title: res.error,
              color: "danger",
            });
          }

          if (res.status === "ok") {
            await update({
              email: res.data.email,
            });

            addToast({
              title: "Спасибо, ваш адрес электронной почты успешно изменён.",
              color: "success",
            });

            router.push(SITE_URL.ACCOUNT);
          }
        },
      );
    }
  }, []);

  return (
    <div className="flex-jc-c w-full h-[400px]">
      <Spinner />
    </div>
  );
}

export default VerifyUser;
