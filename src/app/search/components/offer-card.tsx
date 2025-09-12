import { formatPrice, truncateString } from "@/utils/helpers";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";

interface IThisProps {
  offer: IUserOfferFront;
}

function OfferCard({ offer }: IThisProps) {
  return (
    <div className="offer-item group">
      <div className="img-wrap">
        <Link
          href={`${SITE_URL.OFFER}/${offer.id}`}
          className="img py-4"
          target="_blank"
        >
          <img
            src={`${fileHost}${offer.images[0]}`}
            alt=""
            className="rounded-[12px] transition transform group-hover:scale-[1.01]"
          />
        </Link>
        <div className="favorite open"></div>
      </div>
      <div className="text-wrap">
        <span>{offer.user.company.name}</span>
        <b>
          4.5 <img src="/img/star-small.svg" alt="" />
        </b>
      </div>
      <Link href={`${SITE_URL.OFFER}/${offer.id}`} target="_blank">
        <p>{truncateString(offer.name)}</p>
      </Link>
      <span className="barter">Бартер</span>
      <b className="price">{formatPrice(+offer.price)}</b>
    </div>
  );
}

export default OfferCard;
