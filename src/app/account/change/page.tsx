"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { useSession } from "next-auth/react";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import "./_profile-change.scss";
import ModalChangeEmail from "@/app/account/change/componenets/modal-change-email";
import { useState } from "react";
import { Tooltip } from "@heroui/react";
import ChangeCompany from "@/app/account/change/componenets/change-company";

function Profile() {
  const { data: session }: any = useSession();
  const router = useRouter();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [modalChangeEmail, setModalChangeEmail] = useState<boolean>(false);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Профиль</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Профиль</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile profile-account">
              <h3>Аккаунт</h3>
              <p>
                При изменении некоторых данных может потребоваться повторная
                модерация.
              </p>
              <div className="items">
                <div className="item flex-js-s flex-col">
                  <b>
                    Почта <img src="/img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <span>{session?.user?.email}</span>
                  <span
                    className="!text-green cursor-pointer"
                    onClick={() => setModalChangeEmail(true)}
                  >
                    Изменить
                  </span>
                </div>
                <div className="item flex-js-s flex-col">
                  <b>
                    Контактный телефон{" "}
                    <img src="/img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <a href={`tel:${company?.phone_number}`}>
                    {company?.phone_number}
                  </a>
                  {/*<span className="!text-green cursor-pointer">Изменить</span>*/}
                </div>
                <div className="item flex-js-s flex-col">
                  <b>Пароль</b>
                  <span>Был изменен 1 год назад</span>
                  <Link
                    href={`${SITE_URL.FORGOT_PASSWORD_CHECK}/${session.user.passwordResetToken}`}
                    target="_blank"
                    className="!text-green cursor-pointer"
                  >
                    Изменить
                  </Link>
                </div>
              </div>
              <h5>Пользователи</h5>
              <Tooltip content="Скоро :)">
                <div className="users opacity-30 !cursor-default">
                  <div className="user-item">
                    <div className="img-wrap">
                      <img src="/img/avatar.png" alt="" />
                    </div>
                    <div className="texts">
                      <b className="name">Николай</b>
                      <span>Менеджер</span>
                      <a href="mailto:emailplaceholder@mail.com">
                        emailplaceholder@mail.com
                      </a>
                    </div>
                    <div className="icons">
                      <a href="#" className="read-icon">
                        <img src="/img/edit_menu.svg" alt="" />
                      </a>
                      <a href="#" className="delete-icon">
                        <img src="/img/delete-Icon-grey.svg" alt="" />
                      </a>
                    </div>
                  </div>
                  <a href="#" className="user-add">
                    <span className="icon">
                      <img src="/img/plus-green.svg" alt="" />
                    </span>
                    <span className="text">Добавить</span>
                  </a>
                </div>
              </Tooltip>
              <div className="border opacity-10"></div>

              <ChangeCompany />
            </div>
          </div>
        </div>
      </div>

      <ModalChangeEmail
        isOpen={modalChangeEmail}
        onClose={() => setModalChangeEmail(false)}
      />
    </MainTemplate>
  );
}

export default Profile;
