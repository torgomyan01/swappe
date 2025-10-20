"use client";

import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Button,
  Skeleton,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ActionGetUserCompanyReviews } from "@/app/actions/company/get-user-company-reviews";
import Rating from "@mui/material/Rating";
import { calcReviews } from "@/utils/helpers";
import axios from "axios";
import { fileHostUpload, fileHostRemove } from "@/utils/consts";
import { ActionUpdateCompanyImage } from "@/app/actions/company/change-company";
import { ActionCGetUserCompany } from "@/app/actions/company/get-user-company";
import { setCompany } from "@/redux/user";
import { ActionArchiveMe } from "@/app/actions/auth/archive-user";

const menuItems = [
  {
    name: "Профиль",
    url: "/account",
  },
  {
    name: "Мои предложения",
    url: SITE_URL.ACCOUNT_SUGGESTIONS,
  },
  {
    name: "Cделки",
    url: SITE_URL.ACCOUNT_TRANSACTIONS,
  },
  {
    name: "Избранное",
    url: SITE_URL.ACCOUNT_FAVORITES,
  },
  {
    name: "Отзывы",
    url: SITE_URL.ACCOUNT_REVIEWS,
    // rightContent: <span className="style">+9</span>,
  },
];

interface IThisProps {
  isMobile?: boolean;
}

function LeftMenu({ isMobile = false }: IThisProps) {
  const pathname = usePathname();

  const { data: session }: any = useSession();

  const dispatch = useDispatch();
  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [loadingCompany, setLoadingCompany] = useState(false);
  const [updatingImage, setUpdatingImage] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const [rating, setRating] = useState(0);

  useEffect(() => {
    ActionGetUserCompanyReviews().then(({ data }) => {
      CalcReviews(data as IReview[]);
      setLoadingCompany(true);
    });
  }, [company]);

  function CalcReviews(reviews: IReview[]) {
    setRating(+calcReviews(reviews));
  }

  async function handlePickNewLogo(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file || !company?.id) return;
    setUpdatingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", file);
      const res = await axios.post(fileHostUpload, uploadData);
      const newPath =
        res?.data?.path || res?.data?.image_path || res?.data?.url || "";
      if (!newPath) return;

      const oldPath = company?.image_path || "";
      if (oldPath) {
        const fd = new FormData();
        fd.append("path", oldPath);
        await axios.post(fileHostRemove, fd);
      }

      const updated = await ActionUpdateCompanyImage(company.id, newPath);
      if ((updated as any)?.status === "ok") {
        const fresh = await ActionCGetUserCompany();
        if (fresh?.status === "ok") {
          dispatch(setCompany(fresh.data as any));
        }
      }
    } finally {
      setUpdatingImage(false);
    }
  }

  return (
    <div
      className={clsx("profile-menu-wrap sticky top-4", {
        "!block !w-full !min-w-full": isMobile,
      })}
    >
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
                    className="bg-crem"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePickNewLogo}
                    className="hidden"
                    id="company-logo-input"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("company-logo-input")?.click()
                    }
                    className="absolute top-[-5px] right-[-5px] bg-white/90 hover:bg-white rounded-full w-[40px] h-[40px] flex-jc-c shadow cursor-pointer"
                    aria-label="Change logo"
                    disabled={updatingImage}
                  >
                    {updatingImage ? (
                      <Spinner color="secondary" size="sm" />
                    ) : (
                      <i className="fa-solid fa-pencil text-black" />
                    )}
                  </button>
                  {session?.user?.tariff === "basic" ||
                  session?.user?.tariff === "advanced" ? (
                    <div
                      className={clsx("premium w-[110px]", {
                        "w-[110px]": session?.user?.tariff === "basic",
                        "w-[135px]": session?.user?.tariff === "advanced",
                      })}
                    >
                      <img src="/img/premium-icon.svg" alt="premium-icon" />
                      <span>
                        {session?.user?.tariff === "basic"
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
            </>
          ) : (
            <Link href={SITE_URL.COMPANY_CREATE}>
              <Button color="secondary" className="w-full mb-4">
                Создайте компанию <i className="fa-regular fa-plus"></i>
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

      <ul className="profile-menu">
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
        <li>
          <Link href={SITE_URL.ACCOUNT_TARIFFS_BONUSES}>
            <img src="/img/subscription.svg" alt="subscription" />
            <span className="green">Тариф и бонусы</span>
          </Link>
        </li>
      </ul>
      <span className="close cursor-pointer" onClick={() => signOut()}>
        <img src="/img/close-Icon.svg" alt="close-Icon" />
        Выйти
      </span>
      <button
        type="button"
        className="delete cursor-pointer"
        onClick={() => setConfirmOpen(true)}
      >
        <img src="/img/delete-Icon.svg" alt="delete-Icon" />
        Удалить профиль
      </button>
      <Modal
        size="xl"
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        hideCloseButton
      >
        <ModalContent className="p-0">
          {() => (
            <>
              <ModalBody className="p-0">
                <div className="popups-wrap">
                  <div className="global-popup !p-0">
                    <div className="form-wrap !max-w-full">
                      <img src="img/sign-in-style2.png" alt="" />
                      <div
                        className="popup-close"
                        onClick={() => setConfirmOpen(false)}
                      >
                        <img src="img/close-pop.svg" alt="" />
                      </div>
                      <form>
                        <h2>
                          Уверены, что хотите <br /> удалить профиль?
                        </h2>
                        <p>
                          Вы уверены, что хотите удалить (архивировать) свой
                          профиль? Вы сможете восстановить его позже.
                        </p>
                        <Button
                          onPress={() => setConfirmOpen(false)}
                          disabled={archiving}
                          className="green-btn"
                          type="button"
                        >
                          Отменить
                        </Button>
                        <Button
                          className="delete-link bg-transparent shadow-none !border-b-white"
                          isLoading={archiving}
                          onPress={async () => {
                            setArchiving(true);
                            const res = await ActionArchiveMe();
                            setArchiving(false);
                            if ((res as any)?.status === "ok") {
                              setConfirmOpen(false);
                              await signOut({ callbackUrl: SITE_URL.LOGIN });
                            }
                          }}
                        >
                          Удалить профиль
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default LeftMenu;
