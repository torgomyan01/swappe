"use client";

import { ActionGetUserBonus } from "@/app/actions/auth/get-user-bonus";
import "@/app/articles/_article.scss";
import EmptyRes from "@/components/common/empty-res/empty-res";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import { addToast, Link, Skeleton, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionGetUserBalance } from "@/app/actions/auth/get-user-balance";

interface IUserBalance {
  balance: number;
  bonus: number;
  referral_request_count: number;
}

function Profile() {
  const router = useRouter();

  const [bonusHistory, setBonusHistory] = useState<IBounsHistory[] | null>(
    null,
  );

  const [userBalance, setUserBalance] = useState<IUserBalance | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    ActionGetUserBonus().then((res) => {
      if (res.status === "ok") {
        setBonusHistory(res.data as unknown as IBounsHistory[]);
      }
    });

    ActionGetUserBalance().then((res) => {
      if (res.status === "ok") {
        setUserBalance(res.data as unknown as IUserBalance);
      }
    });
  }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast({
          title: "Скопировано",
          color: "success",
        });
      })
      .catch(() => {
        addToast({
          title: "Ошибка копирования",
          color: "danger",
        });
      });
  }

  const totalPages = bonusHistory
    ? Math.ceil(bonusHistory.length / PAGE_SIZE)
    : 0;
  const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
  const pageEndIndex = pageStartIndex + PAGE_SIZE;
  const pagedHistory = bonusHistory
    ? bonusHistory.slice(pageStartIndex, pageEndIndex)
    : [];

  useEffect(() => {
    if (!bonusHistory || bonusHistory.length === 0) return;
    const pages = Math.ceil(bonusHistory.length / PAGE_SIZE);
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [bonusHistory]);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.SEARCH}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <Link href={SITE_URL.SEARCH}>
              Тарифы и бонусы
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Бонусная история</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Бонусная история</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile bonuses-account">
              <h3>Бонусная история</h3>
              {userBalance ? (
                <div className="bonuses-info-items">
                  <div className="bonuses-info-item">
                    <div className="top">
                      <div className="icon yellow">
                        <img src="/img/article/bon-icon5.svg" alt="" />
                      </div>
                      <div className="texts">
                        <span>Кэшбек за все время</span>
                        <b>{userBalance.bonus}</b>
                      </div>
                    </div>
                  </div>
                  <div className="bonuses-info-item">
                    <div className="top">
                      <div className="icon grey">
                        <img src="/img/article/bon-icon6.svg" alt="" />
                      </div>
                      <div className="texts">
                        <span>Всего реферальных активаций</span>
                        <b>{userBalance.referral_request_count || 0}</b>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bonuses-info-items">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton
                      className="bonuses-info-item h-[100px]"
                      key={`key-bonuses-info-item-${index}`}
                    />
                  ))}
                </div>
              )}

              {bonusHistory ? (
                bonusHistory.length ? (
                  <>
                    {pagedHistory.map((item, index) => (
                      <div
                        className="bonus-story-item"
                        key={`key-bonus-story-${index}`}
                      >
                        <span className="date">
                          {new Date(item.created_at).toLocaleDateString(
                            "ru-RU",
                            { day: "2-digit", month: "long" },
                          )}
                        </span>
                        <div className="info">
                          <div className="top-line">
                            <div className="copy">
                              Операция:
                              <span> {item.order_id}</span>
                              <img
                                src="/img/article/copy.svg"
                                alt=""
                                onClick={() => copyToClipboard(item.order_id)}
                                title="Скопировать ID операции"
                                className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                            {/* <b className="price">{item.amount} ₽</b> */}
                          </div>
                          <div className="bottom-line">
                            <span>{item.description}</span>
                            <div className="style">
                              <span>+ {item.amount}</span>
                              <img src="/img/article/style-icon.svg" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                        >
                          Назад
                        </button>
                        <span className="px-2 text-sm text-gray-600">
                          Страница {currentPage} из {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
                        >
                          Вперёд
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyRes title="У вас пока нет никаких операций" />
                )
              ) : (
                <div className="flex-jc-c w-full h-[300px]">
                  <Spinner color="secondary" />
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
