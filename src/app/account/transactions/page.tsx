"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ActionGetDeals } from "@/app/actions/deals/get";
import { useSession } from "next-auth/react";
import DealItem from "@/app/account/transactions/components/deal-item";
import { Spinner } from "@heroui/react";
import EmptyRes from "@/components/common/empty-res/empty-res";

function Profile() {
  const { data: session }: any = useSession();

  const router = useRouter();

  const activeTab = ["Активные сделки", "Архив"];
  const [active, setActive] = useState(0);

  const [results, setResults] = useState<IDeal[] | null>(null);

  console.log(results);

  const activeStatuses: [DealStatusClient[], DealStatusOwner[]] = [
    ["wait-confirm", "wait-doc-confirm", "doc-confirmed", "send-review"],
    ["canceled", "completed"],
  ];

  useEffect(() => {
    setResults(null);
    ActionGetDeals(
      session.user.id,
      activeStatuses[active],
      activeStatuses[active],
    ).then(({ data }) => {
      setResults(data as IDeal[]);
    });
  }, [session, active]);

  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <Link href={SITE_URL.SEARCH}>
              Главная
              <img src="/img/arr-r.svg" alt="arrow" />
            </Link>
            <span>Сделки</span>
          </div>
          <div className="top-mob-line">
            <span
              className="back"
              onClick={() => router.push(SITE_URL.ACCOUNT)}
            >
              <img src="/img/back-icon.svg" alt="" />
            </span>
            <b>Сделки</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile favorite-account">
              <div className="tabs">
                {activeTab.map((item, index) => (
                  <button
                    key={`key-trans-${item}`}
                    className={clsx("tab-button", {
                      "!rounded-[50px] active": active === index,
                    })}
                    onClick={() => setActive(index)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="tab-content-wrap">
                {results ? (
                  results.length > 0 ? (
                    <div className="tab-content active">
                      <div className="transactions-info">
                        {results?.map((item, index) => (
                          <DealItem key={`key-deal-${index}`} item={item} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyRes
                      title={
                        activeTab[active] === "Активные сделки"
                          ? "Пока нет активных сделок"
                          : "Пока нет завершенных сделок"
                      }
                    />
                  )
                ) : (
                  <div className="w-full h-[400px] flex-jc-c">
                    <Spinner color="secondary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
