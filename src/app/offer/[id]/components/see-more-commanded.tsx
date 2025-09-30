import { useEffect, useState } from "react";
import { ActionCommandedOffers } from "@/app/actions/offers/get-recomanded";
import OfferCard from "@/app/search/components/offer-card";
import Link from "next/link";
import { SITE_URL } from "@/utils/consts";
import { Spinner } from "@heroui/react";

function SeeMoreCommanded() {
  const [offers, setOffers] = useState<IUserOfferFront[] | null>(null);

  useEffect(() => {
    ActionCommandedOffers().then(({ data }) => {
      setOffers(data as IUserOfferFront[]);
    });
  }, []);

  return (
    <div className="look-more">
      <h3>Посмотри еще</h3>
      {offers ? (
        <>
          <div className="look-more-items">
            {offers.map((offer: IUserOfferFront, index) => (
              <OfferCard key={`offer-recom-${index}`} offer={offer} />
            ))}
          </div>
          <Link href={SITE_URL.SEARCH} className="green-btn">
            Показать больше
          </Link>
        </>
      ) : (
        <div className="w-full h-[300px] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </div>
  );
}

export default SeeMoreCommanded;
