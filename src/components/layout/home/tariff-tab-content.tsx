import { SITE_URL } from "@/utils/consts";
import React from "react";

interface TariffTabContentProps {
  price: number | string;
  items: string[];
  ctaHref?: string;
  ctaLabel?: string;
}

function TariffTabContent({
  price,
  items,
  ctaHref = SITE_URL.REGISTER,
  ctaLabel = "Присоединиться",
}: TariffTabContentProps) {
  const formattedPrice =
    typeof price === "number"
      ? `${new Intl.NumberFormat("ru-RU").format(price)} ₽`
      : String(price);
  return (
    <div className="tab-content active">
      <b className="price">{formattedPrice}</b>
      <ul>
        {items.map((txt, i) => (
          <li key={`feat-${i}`}>{txt}</li>
        ))}
      </ul>
      <a href={ctaHref} className="green-btn">
        {ctaLabel}
      </a>
    </div>
  );
}

export default TariffTabContent;
