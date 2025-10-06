"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { useSession } from "next-auth/react";
import { SITE_URL } from "@/utils/consts";
import { Link, Button } from "@heroui/react";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { sliceText } from "@/utils/helpers";

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  console.log(session, 55555555);

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
                <div className="item">
                  <b>
                    Почта <img src="/img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <span>{session?.user?.email}</span>
                </div>
                <div className="item">
                  <b>
                    Контактный телефон{" "}
                    <img src="/img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <a href={`tel:${company?.phone_number}`}>
                    {company?.phone_number}
                  </a>
                </div>
                <div className="item">
                  <b>Пароль</b>
                  <span>Был изменен 1 год назад</span>
                </div>
                <div className="item">
                  <b>Пользователи</b>
                  <img src="img/avatars.png" alt="avatars" />
                </div>
              </div>
              <div className="border"></div>

              <h3>Карточка компании</h3>
              <p>
                Информация, которую вы предоставляете в этом разделе, является
                общедоступной. Ее можно увидеть в отзывах и она доступна другим
                пользователям Интернета.
              </p>

              {company ? (
                <>
                  <div className="items">
                    <div className="item">
                      <b>Название компании</b>
                      <span>{company?.name}</span>
                    </div>
                    <div className="item">
                      <b>
                        ИНН компании{" "}
                        <img src="/img/check-Icon.svg" alt="check-Icon" />
                      </b>
                      <span>{company?.inn}</span>
                    </div>
                    <div className="item">
                      <b>Город</b>
                      <span>{company?.city_data.name}</span>
                    </div>
                    <div className="item">
                      <b>Индустрия</b>
                      <span>{company?.industry_data.name}</span>
                    </div>
                    <div className="item">
                      <b>Индустрия</b>
                      <div className="social">
                        <div className="links">
                          <div className="flex-js-s flex-col gap-2">
                            {company.sites.map((item, i) => (
                              <Button
                                key={`link_compnay-${i}`}
                                showAnchorIcon
                                as={Link}
                                color="default"
                                href={item}
                                target="_blank"
                              >
                                {sliceText(item, 15)}
                              </Button>
                            ))}
                          </div>

                          {/*<a href="#">*/}
                          {/*  <img src="/img/soc-icon1.svg" alt="soc-icon" />*/}
                          {/*</a>*/}
                          {/*<a href="#">*/}
                          {/*  <img src="/img/soc-icon2.svg" alt="soc-icon" />*/}
                          {/*</a>*/}
                          {/*<a href="#">*/}
                          {/*  <img src="/img/soc-icon3.svg" alt="soc-icon" />*/}
                          {/*</a>*/}
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <b>Интересующие категории</b>
                      <div className="buttons !gap-2 !flex-js-s flex-wrap">
                        {company?.interest_categories.map((item, index) => (
                          <button
                            key={`interest_categories-${index}`}
                            className="green-btn"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={SITE_URL.ACCOUNT_CHANGE}
                    className="green-btn read mt-10"
                  >
                    <img src="/img/edit-menu.svg" alt="edit-menu." />
                    Редактировать
                  </Link>
                </>
              ) : (
                <div className="w-full">
                  <Link
                    href={SITE_URL.COMPANY_CREATE}
                    className="green-btn read mt-10"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Создать компанию
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
