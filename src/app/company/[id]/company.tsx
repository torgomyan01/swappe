"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import CompanyLeftMenu from "@/app/company/components/company-left-menu";

interface IThisProps {
  company: IUserCompany;
}

function CompanyPage({ company }: IThisProps) {
  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.HOME}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>{company.name}</span>
          </div>
          <div className="top-mob-line">
            <Link href={SITE_URL.HOME} className="back">
              <img src="/img/back-icon.svg" alt="" />
            </Link>
            <b>{company.name}</b>
          </div>
          <div className="info">
            <CompanyLeftMenu company={company} />
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
                  <span>{company.user.email}</span>
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
              </div>
              <div className="border"></div>

              <h3>Карточка компании</h3>
              <p>
                Информация, которую вы предоставляете в этом разделе, является
                общедоступной. Ее можно увидеть в отзывах и она доступна другим
                пользователям Интернета.
              </p>

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
                  <span>{company?.industry_data?.name}</span>
                </div>
                <div className="item">
                  <b>Индустрия</b>
                  <div className="social">
                    <div className="links">
                      <a href="#">
                        <img src="/img/soc-icon1.svg" alt="soc-icon" />
                      </a>
                      <a href="#">
                        <img src="/img/soc-icon2.svg" alt="soc-icon" />
                      </a>
                      <a href="#">
                        <img src="/img/soc-icon3.svg" alt="soc-icon" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <b>Интересующие категории</b>
                  <div className="buttons !gap-2 !flex-js-s flex-wrap">
                    {company?.interest_categories.map((item, index) => (
                      <button
                        key={`interest_categories-${index}`}
                        className="green-btn !bg-transparent !text-green !border border-green !my-0 hover:!bg-green hover:!text-white"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default CompanyPage;
