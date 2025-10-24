import { calcReviews, formatPrice, RandomKey } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { addToast, Button } from "@heroui/react";
import axios from "axios";
import { fileHostUpload, SITE_URL } from "@/utils/consts";
import { ActionCreateOffer } from "@/app/actions/offers/create";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IThisProps {
  onGoBack: () => void;
}

function Preview({ onGoBack }: IThisProps) {
  const router = useRouter();

  const offerData = useSelector(
    (state: IUserOfferStore) => state.userOffer.offer,
  );

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const getMapIframeUrl = (coords: [number, number]) => {
    const [lat, lon] = coords;
    return `https://yandex.ru/map-widget/v1/?ll=${lon},${lat}&z=16&pt=${lon},${lat},pm2rdl&whatshere[zoom]=16&z=16&l=map&controls=false`;
  };

  const [loading, setLoading] = useState(false);

  function StartCreating() {
    setLoading(true);
    const promise = offerData.images.map((image) => {
      const formData = new FormData();
      formData.append("image", image);

      return axios.post(fileHostUpload, formData);
    });

    addToast({
      description: "Подождите пожалуйста",
      color: "default",
    });

    Promise.all(promise).then((res) => {
      const urls: any = [];

      res.forEach((item) => {
        urls.push(item.data.url);
      });

      ActionCreateOffer({
        name: offerData.name,
        type: offerData.type,
        vid: offerData.vid,
        category: offerData.category,
        price: offerData.price,
        coordinates: offerData.coordinates,
        description: offerData.description,
        images: urls,
        videos: offerData.videos,
      })
        .then((res) => {
          if (res.status === "error") {
            addToast({
              description: res.error,
              color: "danger",
            });
          }

          if (res.status === "ok") {
            addToast({
              description:
                "Спасибо, ваше предложение будет рассмотрено модератором, мы как можно скорее его одобрим",
              color: "success",
            });

            router.push(SITE_URL.ACCOUNT_SUGGESTIONS);
          }
        })
        .finally(() => setLoading(false));
    });
  }

  return (
    <>
      <div className="proposal-info">
        <div className="left-info">
          <div className="swiper main-slider">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                {offerData.images.length ? (
                  <img src={URL.createObjectURL(offerData.images[0])} alt="" />
                ) : (
                  <img src="/img/default-image.png" alt="" />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {offerData.images.map((img, i) => (
              <div key={`prev-img-${i}`}>
                <img
                  src={URL.createObjectURL(img)}
                  alt=""
                  className="w-full rounded-[8px] h-[120px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="right-info">
          <h3>{offerData.name}</h3>
          <div className="rate">
            <b>{company?.name}</b>
            <div className="rate-text">
              {company?.reviews_calc}
              <img src="/img/star.svg" alt="" />
            </div>
            <span>({company?.reviews_count})</span>
          </div>
          <b className="price">{formatPrice(+offerData.price)}</b>
          <div className="links">
            {offerData.category.map((category) => (
              <a key={RandomKey()} href="#">
                {category.name}
              </a>
            ))}
          </div>
          <ul className="list">
            {company && (
              <li>
                <b>Организатор:</b>
                <span>{company.name}</span>
              </li>
            )}

            <li>
              <b>Вид:</b>
              <span>{offerData.vid === "service" ? "Услуга" : "Товар"}</span>
            </li>
            <li>
              <b>Тип:</b>
              <span>{offerData.type === "online" ? "Онлайн" : "Оффлайн"}</span>
            </li>
          </ul>
          <h4>Регион покрытия:</h4>
          <div className="map">
            <iframe
              src={getMapIframeUrl(offerData.coordinates || [0, 0])}
              width="100%"
              height="100%"
              style={{
                border: "none",
                pointerEvents: "none",
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Yandex Map"
            />
          </div>
          <h5>Описание</h5>
          <p className="text">{offerData.description}</p>
        </div>
      </div>

      <div className="buttons">
        <Button className="grey-btn" onPress={onGoBack}>
          Вернуться к форме
        </Button>
        <Button
          className="green-btn"
          onPress={StartCreating}
          isLoading={loading}
        >
          Опубликовать
        </Button>
      </div>
    </>
  );
}

export default Preview;
