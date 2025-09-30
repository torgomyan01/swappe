import { Button } from "@heroui/react";
import Link from "next/link";
import { SITE_URL } from "@/utils/consts";

import "../_private.scss";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const menuItems = [
  {
    name: "Политика в отношении",
    url: SITE_URL.PRIVACY_POLICY_REGARDING,
  },
  {
    name: "Публичная оферта",
    url: SITE_URL.PRIVACY_POLICY_OFFER,
  },
  {
    name: "Согласие пользователя",
    url: SITE_URL.PRIVACY_POLICY_USER_CONSENT,
  },
  {
    name: "Согласие рекламной информации",
    url: SITE_URL.PRIVACY_POLICY_ADS_POLITICAL,
  },
];

function RightMenuPrivacy() {
  const pathname = usePathname();

  return (
    <div className="tabs">
      {menuItems.map((item, index) => (
        <Link key={item.url} href={item.url} className="w-full">
          <Button
            className={clsx("tab-button w-full", {
              active:
                index === 0
                  ? item.url.includes(pathname)
                  : pathname === item.url,
            })}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}

export default RightMenuPrivacy;
