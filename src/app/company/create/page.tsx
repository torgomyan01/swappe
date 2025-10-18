"use client";

import InfoCompany from "@/app/company/create/components/info-company";
import { useState } from "react";
import clsx from "clsx";
import SelectCategory from "@/app/company/create/components/select-category";
import SelectAboutAs from "@/app/company/create/components/select-about-as";
import { addToast, Spinner } from "@heroui/react";
import { ActionCreateCompany } from "@/app/actions/company/create-company";
import axios from "axios";
import { fileHostUpload, SITE_URL } from "@/utils/consts";
import { useRouter } from "next/navigation";
import { ActionUpdateUserBonus } from "@/app/actions/auth/update-user-bonus";

function Register() {
  const router = useRouter();

  const contents = [
    <InfoCompany key="content-1" onSubmit={ChangeContent} />,
    <SelectCategory key="select-category" onSubmit={ChangeContent} />,
    <SelectAboutAs key="select-about-as" onSubmit={ChangeContent} />,
  ];

  const [infoCompany, setInfoCompany] = useState<any>([]);

  const [activeContent, setActiveContent] = useState(0);
  const [loading, setLoading] = useState(false);

  function ChangeContent(value: object | string, NextIndex: number) {
    if (NextIndex === 3) {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", infoCompany[0].logo);

      axios.post(fileHostUpload, formData).then(({ data }) => {
        if (data.status === "success") {
          ActionCreateCompany(
            infoCompany[0].company,
            infoCompany[0].inn,
            infoCompany[0].city,
            +infoCompany[0].industry.replace(/ind-/g, ""),
            value as string,
            infoCompany[1],
            infoCompany[0].socials,
            data.url,
            infoCompany[0].phone_number,
            infoCompany[0].is_self_employed,
          )
            .then((res) => {
              if (res.status === "ok") {
                ActionUpdateUserBonus(
                  "increment",
                  50,
                  "Бонус за создание компании",
                ).then((_res) => {
                  if (_res.status === "ok") {
                    addToast({
                      title: "Спасибо вы получили 50 бонусов",
                      color: "success",
                    });

                    setTimeout(() => {
                      router.push(SITE_URL.COMPANY_THANKS);
                    }, 1000);
                  } else {
                    addToast({
                      title: res.error,
                      color: "danger",
                    });
                  }
                });
              }

              if (res.status === "error") {
                addToast({
                  title: res.error,
                  color: "danger",
                });
              }
            })
            .catch((e: any) => {
              console.log(e);
              addToast({
                title: "Ошибка",
                description: "Не удалось создать компанию",
                color: "danger",
              });
            })
            .finally(() => setLoading(false));
        }
      });
    } else {
      setInfoCompany((old: any) => [...old, value]);
      setActiveContent(NextIndex);
    }
  }

  return (
    <div className="main-wrap">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="form-wrap">
          <div className="steps-wrap">
            <img src="/img/onbording-style.png" alt="" />
            <div className="steps-items">
              <span
                className={clsx("num cursor-default", {
                  active: activeContent >= 0,
                })}
              >
                1
              </span>
              <span className="dots"></span>
              <span
                className={clsx("num cursor-default", {
                  active: activeContent >= 1,
                })}
              >
                2
              </span>
              <span className="dots"></span>
              <span
                className={clsx("num cursor-default", {
                  active: activeContent >= 2,
                })}
              >
                3
              </span>
            </div>
          </div>
          {loading ? (
            <div className="w-full h-[200px] flex-jc-c">
              <Spinner color="secondary" />
            </div>
          ) : (
            contents[activeContent]
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
