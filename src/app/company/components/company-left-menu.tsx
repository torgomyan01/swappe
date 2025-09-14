"use client";

import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSelector } from "react-redux";
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

const menuItems = [
  {
    name: "Информация о компании",
    url: SITE_URL.ACCOUNT(),
  },
  {
    name: "Активные предложения",
    url: SITE_URL.ACCOUNT_SUGGESTIONS,
  },
  {
    name: "Отзывы",
    url: SITE_URL.ACCOUNT_REVIEWS,
  },
];

function CompanyLeftMenu() {
  const pathname = usePathname();

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [loadingCompany, setLoadingCompany] = useState(false);

  useEffect(() => {
    setLoadingCompany(!!company);
  }, [company]);

  return (
    <div className="profile-menu-wrap sticky top-4">
      {loadingCompany ? (
        <>
          {company ? (
            <>
              <div className="top">
                <div className="img-wrap">
                  <Image
                    src={
                      company?.image_path
                        ? `${fileHost}${company?.image_path}`
                        : "/img/default-company.png"
                    }
                    alt="premium-icon"
                    width={300}
                    height={300}
                    className="bg-crem"
                  />
                  {company?.plan === "premium" ? (
                    <div className="premium w-[110px]">
                      <img src="/img/premium-icon.svg" alt="premium-icon" />
                      <span>Премиум</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="name">{company?.name}</span>
              <div className="stars">
                <div className="stars-images flex-js-c gap-1">
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star.svg" alt="star" />
                  <img src="/img/star-dubl.svg" alt="star" />
                </div>
                <span className="num">4.5</span>
              </div>

              <div className="flex-jc-c gap-2 mb-2">
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
                    <DropdownItem key="new">New file</DropdownItem>
                    <DropdownItem key="copy">Copy link</DropdownItem>
                    <DropdownItem key="edit">Edit file</DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                    >
                      Delete file
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
            <div>
              <Button color="secondary" className="w-full mb-4">
                Создайте компаний <i className="fa-regular fa-plus"></i>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-jc-c gap-4 flex-col mb-4">
          <Skeleton className="rounded-full w-full h-[120px] w-[120px]" />

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
