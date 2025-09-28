import Image from "next/image";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { formatPrice, sliceText } from "@/utils/helpers";
import { useSelector } from "react-redux";

function AllCompleted() {
  const chat = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  return (
    <>
      {chat && (
        <div className="top-item">
          <div className="imgs">
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chat.deal.client_offer.images[0]}`}
                alt={chat.deal.client.company.name}
                width={100}
                height={100}
                className="object-cover"
              />
              <Link
                href={`${SITE_URL.OFFER}/${chat.deal.client_offer_id}`}
                target="_blank"
                className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
              >
                <i className="fa-light fa-arrow-up-right text-white"></i>
              </Link>
            </div>
            <div className="img relative overflow-hidden group">
              <Image
                src={`${fileHost}${chat.deal.owner_offer.images[0]}`}
                alt={chat.deal.client.company.name}
                width={100}
                height={100}
                className="object-cover"
              />
              <Link
                href={`${SITE_URL.OFFER}/${chat.deal.owner_offer_id}`}
                target="_blank"
                className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
              >
                <i className="fa-light fa-arrow-up-right text-white"></i>
              </Link>
            </div>
          </div>
          <div className="txts">
            <b>
              {sliceText(chat.deal.client_offer.name)},{" "}
              {formatPrice(+chat.deal.client_offer.price)}{" "}
            </b>
            <div className="inf-texts">
              <span className="grey">Бартер осуществлен </span>
            </div>
          </div>
          <div className="new big">
            <img src="/img/new-style3.svg" alt="" />
            <span>Бартер осуществлен</span>
          </div>
        </div>
      )}
    </>
  );
}

export default AllCompleted;
