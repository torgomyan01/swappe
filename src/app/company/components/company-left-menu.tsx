"use client";

import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@heroui/react";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { calcReviews } from "@/utils/helpers";
import { ActionGetUserCompanyReviews } from "@/app/actions/company/get-user-company-reviews";

interface IThisProps {
  company: IUserCompany;
}

function CompanyLeftMenu({ company }: IThisProps) {
  const pathname = usePathname();

  const [loadingCompany, setLoadingCompany] = useState(false);

  const menuItems = [
    {
      name: "Информация о компании",
      url: SITE_URL.COMPANY(company.id),
    },
    {
      name: "Активные предложения",
      url: SITE_URL.COMPANY_OFFERS(company.id),
    },
    {
      name: "Отзывы",
      url: SITE_URL.COMPANY_REVIEWS(company.id),
    },
  ];

  useEffect(() => {
    ActionGetUserCompanyReviews().then(({ data }) => {
      CalcReviews(data as IReview[]);
      setLoadingCompany(true);
    });
  }, [company]);

  const [rating, setRating] = useState(0);

  function CalcReviews(reviews: IReview[]) {
    setRating(+calcReviews(reviews));
  }

  return (
    <div className="profile-menu-wrap sticky top-4">
      {loadingCompany ? (
        <>
          {company ? (
            <>
              <div className="top">
                <div className="img-wrap relative">
                  <Image
                    src={
                      company?.image_path
                        ? `${fileHost}${company?.image_path}`
                        : "/img/default-company.png"
                    }
                    alt="premium-icon"
                    width={300}
                    height={300}
                    className="bg-crem object-cover border"
                  />
                  {company.user.tariff === "basic" ||
                  company.user.tariff === "advanced" ? (
                    <div
                      className={clsx("premium w-[110px]", {
                        "w-[110px]": company.user.tariff === "basic",
                        "w-[135px]": company.user.tariff === "advanced",
                      })}
                    >
                      <img src="/img/premium-icon.svg" alt="premium-icon" />
                      <span>
                        {company.user.tariff === "basic"
                          ? "Базовый"
                          : "Продвинутый"}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="name">{company?.name}</span>
              <div className="stars">
                <Rating
                  name="simple-controlled"
                  value={rating}
                  readOnly
                  precision={0.1}
                  sx={{
                    fontSize: 30,
                  }}
                />
                <span className="num">{rating}</span>
              </div>

              <div className="flex-jc-c gap-2 mb-4">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="secondary"
                      className="rounded-[16px] bg-white px-0 min-w-[40px]"
                    >
                      <img src="/img/icons/dots-menu.svg" alt="" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    {/*<DropdownItem key="edit">Edit file</DropdownItem>*/}
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                    >
                      <div className="flex-js-c gap-1">
                        <i className="fa-light fa-flag mr-2"></i>
                        Пожаловаться
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Button color="secondary" className="rounded-[16px]">
                  <img src="/img/icons/start-sale.svg" alt="" />
                  Написать
                </Button>
              </div>
            </>
          ) : (
            <Link href={SITE_URL.COMPANY_CREATE}>
              <Button color="secondary" className="w-full mb-4">
                Создайте компаний <i className="fa-regular fa-plus"></i>
              </Button>
            </Link>
          )}
        </>
      ) : (
        <div className="flex-jc-c gap-4 flex-col mb-4">
          <Skeleton className="rounded-full h-[120px] w-[120px]" />

          <Skeleton className="rounded-lg w-[130px] h-[20px]" />

          <Skeleton className="rounded-lg w-[180px] h-[30px] mt-3" />
        </div>
      )}

      <ul className="profile-menu !border-b-0 !pb-0 !mb-0">
        {menuItems.map((item, index) => (
          <li
            key={`profile-left-menu-item-${index}`}
            className={clsx({
              active: pathname === item.url,
            })}
          >
            <Link href={item.url}>
              <span className="icon"></span>
              <span className="text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyLeftMenu;
