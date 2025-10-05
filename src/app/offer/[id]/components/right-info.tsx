import { calcReviews, formatPrice, getMapIframeUrl } from "@/utils/helpers";
import ButtonCreateDeal from "@/app/offer/[id]/components/button-create-deal";
import { useDispatch, useSelector } from "react-redux";
import { addToast, Button } from "@heroui/react";
import { ActionCRemoveUserFavorites } from "@/app/actions/favorites/remove-user-favorites";
import { setAppendFavorites, setRemoveFavorite } from "@/redux/user";
import { ActionCreateUSerFavorites } from "@/app/actions/favorites/create-user-favorites";
import { SITE_URL } from "@/utils/consts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface IThisProps {
  offer: IUserOfferFront;
}

function OfferRightInfo({ offer }: IThisProps) {
  const { data: session } = useSession();

  const router = useRouter();
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: IUserStore) => state.userInfo.favorites,
  );

  const liked = favorites?.find((favorite) => favorite.offer_id === offer.id);

  function CreateFavorites() {
    if (session) {
      addToast({
        description: "Ждите ",
        color: "warning",
      });

      if (liked) {
        ActionCRemoveUserFavorites(liked.id).then(() => {
          dispatch(setRemoveFavorite(liked.id));
          addToast({
            description: "Готов ",
            color: "primary",
          });
        });
      } else {
        ActionCreateUSerFavorites(offer.id).then(({ data }) => {
          dispatch(dispatch(setAppendFavorites(data as IUserFavorite)));

          addToast({
            description: "Готов ",
            color: "primary",
          });
        });
      }
    } else {
      router.push(SITE_URL.LOGIN);
    }
  }

  const getCalcRev = calcReviews(offer.user.company.reviews);

  return (
    <div className="right-info">
      <h1>{offer.name}</h1>
      <div className="rate">
        <b>{offer.user.company.name}</b>
        <div className="rate-text">
          {getCalcRev}
          <img src="/img/star.svg" alt="" />
        </div>
        <span>({offer.user.company.reviews.length})</span>
      </div>
      <b className="price">{formatPrice(+offer.price)}</b>
      <div className="links">
        {offer.category.map((item, i) => (
          <a key={`cat__${i}`} href="#">
            {item.name}
          </a>
        ))}
      </div>
      <div className="info-btns">
        <ButtonCreateDeal offer={offer} />

        <Button className="heart-btn flex-jc-c" onPress={CreateFavorites}>
          <i
            className={clsx("fa-heart text-[24px]", {
              "fa-regular": !liked,
              "fa-solid text-red-600": liked,
            })}
          />
        </Button>
      </div>

      <ul className="list">
        <li>
          <b>Организатор:</b>
          <span>{offer.user.company.name}</span>
        </li>

        <li>
          <b>Вид:</b>
          <span>{offer.vid === "service" ? "Услуга" : "Товар"}</span>
        </li>
        <li>
          <b>Тип:</b>
          <span>{offer.type === "online" ? "Онлайн" : "Оффлайн"}</span>
        </li>
      </ul>
      <h4>Регион покрытия:</h4>
      <div className="map w-full !max-w-[100%] h-[300] rounded-[12px] overflow-hidden">
        <iframe
          src={getMapIframeUrl(offer.coordinates || [0, 0])}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Yandex Map"
        />
      </div>
      <h5>Описание</h5>
      <p className="text">{offer.description}</p>
    </div>
  );
}

export default OfferRightInfo;
