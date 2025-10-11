"use client";

import { SITE_URL } from "@/utils/consts";
import { useParams } from "next/navigation";

function Thanks() {
  const { email }: { email: string } = useParams();

  return (
    <div className="main-wrap style2">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="main-info">
          <img src="/img/done.png" alt="" />
          <b>Почти готово</b>
          <p>
            Осталось только подтвердить почту. <br />
            Мы отправили ссылку на{" "}
            <a href={`mailto:${email}`}> {decodeURIComponent(email)}</a>
          </p>
        </div>
        <div className="bottom-text">
          <span>Возникли проблемы?</span>
          <a href={SITE_URL.CHAT}>Наша поддержка поможет</a>
        </div>
      </div>
    </div>
  );
}

export default Thanks;
