import { calcReviews, RandomKey, sliceText } from "@/utils/helpers";
import Image from "next/image";
import moment from "moment";
import "moment/locale/ru";
import Link from "next/link";
import { fileHost, SITE_URL } from "@/utils/consts";

moment().locale("ru");

interface IThisProps {
  offer: IUserOfferFront;
}

function OfferReviews({ offer }: IThisProps) {
  const getCalcRev = calcReviews(offer.user.company.reviews);

  const findReviews = offer.user.company.reviews.slice(0, 2);

  return (
    <>
      <div className="title-wrap !mt-9">
        <h3>Отзывы</h3>
        <div className="stars-info">
          <div className="images">
            {Array.from({ length: 5 }).map((_, i) =>
              i <= +getCalcRev - 1 ? (
                <img key={RandomKey()} src="/img/star.svg" alt="" />
              ) : (
                <img key={RandomKey()} src="/img/star-dubl.svg" alt="" />
              ),
            )}
          </div>
          <span>{getCalcRev} / 5.0</span>
        </div>
      </div>
      <div className="review-items">
        {findReviews.map((review, i) => (
          <div key={`review_item-${i}`} className="review-item">
            <div className="top">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) =>
                  i <= review.count - 1 ? (
                    <img key={RandomKey()} src="/img/star.svg" alt="" />
                  ) : (
                    <img key={RandomKey()} src="/img/star-dubl.svg" alt="" />
                  ),
                )}
              </div>
            </div>
            <p className="text">{review.review}</p>
            <Link
              href={SITE_URL.COMPANY(review.creater_company.id)}
              target="_blank"
              className="w-full"
            >
              <div className="name-wrap">
                <div className="img">
                  <Image
                    src={`${fileHost}${review.creater_company.image_path}`}
                    alt={review.creater_company.name}
                    width={100}
                    height={100}
                  />
                </div>
                <b>{sliceText(review.creater_company.name, 20)}</b>
                <span>{moment(review.created_at).format("l")}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default OfferReviews;
