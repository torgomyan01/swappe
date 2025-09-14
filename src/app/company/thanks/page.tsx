"use client";

import Link from "next/link";
import { SITE_URL } from "@/utils/consts";

function Page() {
  return (
    <div className="main-wrap style2">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="main-info">
          <img src="/img/evriting-img2.png" alt="" />
          <b>Мы уже проверяем</b>
          <p>
            Профиль компании был успешно сформирован и отправлен на модерацию.
            Отследить статус модерации ты можешь в личном кабинете.
          </p>
          <Link href={SITE_URL.ACCOUNT()} className="green-btn">
            Перейти в профиль
          </Link>
        </div>
        <div className="bottom-text">
          <span>Возникли проблемы?</span>
          <a href="#">Наша поддержка поможет</a>
        </div>
      </div>
    </div>
  );
}

export default Page;
