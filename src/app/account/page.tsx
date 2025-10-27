"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { useSession } from "next-auth/react";
import { fileHost, SITE_URL } from "@/utils/consts";
import {
  Link,
  Button,
  Tooltip,
  AvatarGroup,
  Avatar,
  Spinner,
  Skeleton,
} from "@heroui/react";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { passwordChangedText, sliceText } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { ActionGetMyHelperPeople } from "../actions/helper-people/get-my";

function Profile() {
  const { data: session }: any = useSession();
  const router = useRouter();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [helperPeople, setHelperPeople] = useState<IHelperPeople[] | null>(
    null,
  );

  useEffect(() => {
    ActionGetMyHelperPeople().then(({ data }) => {
      setHelperPeople(data as IHelperPeople[]);
    });
  }, []);

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
                  <span>{passwordChangedText(session)}</span>
                </div>
                <div className="item ">
                  <b>Пользователи</b>
                  {helperPeople ? (
                    <>
                      {helperPeople.length > 0 ? (
                        <AvatarGroup isBordered max={5}>
                          {helperPeople.map((item) => (
                            <Tooltip
                              key={`helper-people-${item.id}`}
                              content={item.name}
                            >
                              <Avatar
                                src={`${fileHost}${item.image_path}`}
                                name={item.name}
                                color="secondary"
                              />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      ) : (
                        <span className="text-gray-500">
                          Пользователи пока нет
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-[40px] flex-js-c">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full ml-[-15px] shadow" />
                      <Skeleton className="w-10 h-10 rounded-full ml-[-15px] shadow" />
                      <Skeleton className="w-10 h-10 rounded-full ml-[-15px] shadow" />
                    </div>
                  )}
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
                      <span>
                        {company?.is_self_employed
                          ? "Зарегистрирован как самозанятый"
                          : company?.inn}
                      </span>
                    </div>
                    <div className="item">
                      <b>Город</b>
                      <span>{company?.city_data?.name}</span>
                    </div>
                    <div className="item">
                      <b>Индустрия</b>
                      <span>{company?.industry_data?.name}</span>
                    </div>
                    <div className="item">
                      <b>Официальный сайт и соцсети</b>
                      <div className="social">
                        <div className="links">
                          <div className="flex-js-s flex-col gap-2">
                            {company?.sites?.map((item, i) => (
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
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <b>Интересующие категории</b>
                      <div className="buttons !gap-2 !flex-js-s flex-wrap">
                        {company?.interest_categories?.map((item, index) => (
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
                  {session?.user?.helper_role !== "manager" && (
                    <Link
                      href={SITE_URL.ACCOUNT_CHANGE}
                      className="green-btn read mt-10"
                    >
                      <img src="/img/edit-menu.svg" alt="edit-menu." />
                      Редактировать
                    </Link>
                  )}
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
