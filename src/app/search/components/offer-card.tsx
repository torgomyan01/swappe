import { calcReviews, formatPrice, truncateString } from "@/utils/helpers";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { ActionCreateUSerFavorites } from "@/app/actions/favorites/create-user-favorites";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  addToast,
  DropdownItem,
  DropdownMenu,
  Button,
  DropdownTrigger,
  Dropdown,
  Tooltip,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { setAppendFavorites, setRemoveFavorite } from "@/redux/user";
import clsx from "clsx";
import { ActionCRemoveUserFavorites } from "@/app/actions/favorites/remove-user-favorites";
import Image from "next/image";

interface IThisProps {
  offer: IUserOfferFront;
  onlyTitle?: boolean;
}

function OfferCard({ offer, onlyTitle = false }: IThisProps) {
  const { data: session }: any = useSession();

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

  const OfferReviews = calcReviews(offer.user?.company?.reviews || []);

  const checkMyOffer = offer.user_id === session?.user?.id;

  return (
    <div className="offer-item group !flex-js-s">
      <div className="img-wrap !p-0">
        <Link
          href={`${SITE_URL.OFFER}/${offer.id}`}
          className="img p-2 sm:p-4"
          target="_blank"
        >
          <Image
            src={`${fileHost}${offer.images[0]}`}
            alt=""
            className="rounded-[12px] transition transform group-hover:scale-[1.01] object-cover"
            width={400}
            height={400}
          />
        </Link>
        {checkMyOffer ? (
          <Dropdown className="min-w-0 w-fit">
            <DropdownTrigger className="absolute top-6 right-6">
              <Button className="min-w-[40px]">
                <i className="fa-solid fa-ellipsis-vertical transform rotate-90"></i>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="changes offer"
              className="offer-item-dropdown"
            >
              <DropdownItem key="new">
                <Tooltip
                  content="Статистика"
                  color="secondary"
                  placement="right"
                >
                  <img src="/img/icons/stats.svg" alt="edit" />
                </Tooltip>
              </DropdownItem>
              <DropdownItem key="new">
                <Tooltip
                  content="Редактировать"
                  color="secondary"
                  placement="right"
                >
                  <img src="/img/icons/edit.svg" alt="edit" />
                </Tooltip>
              </DropdownItem>
              <DropdownItem key="new">
                <Tooltip content="В архив" color="secondary" placement="right">
                  <img src="/img/icons/Archive.svg" alt="edit" />
                </Tooltip>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div
            className={clsx("favorite", {
              open: liked,
            })}
            onClick={CreateFavorites}
          />
        )}
      </div>
      {onlyTitle ? (
        <div className="mt-2 flex-jsb-c w-full">
          <Link
            href={`${SITE_URL.OFFER}/${offer.id}`}
            target="_blank"
            className="!text-left"
          >
            <p className="font-semibold">{truncateString(offer.name)}</p>
          </Link>

          <b className="flex-je-c gap-1 text-[#EDB53E] text-[14px]">
            {OfferReviews}{" "}
            <img src="/img/star-small.svg" alt="" className="mb-[2px] block" />
          </b>
        </div>
      ) : (
        <>
          <div className="text-wrap flex-jsb-c w-full">
            {offer.user.company && <span>{offer.user.company.name}</span>}
            <b>
              4.5 <img src="/img/star-small.svg" alt="" />
            </b>
          </div>

          <Link href={`${SITE_URL.OFFER}/${offer.id}`} target="_blank">
            <p>{truncateString(offer.name)}</p>
          </Link>
          <span className="barter">Бартер</span>
          <b className="price">{formatPrice(+offer.price)}</b>
        </>
      )}
    </div>
  );
}

export default OfferCard;
