import { useEffect, useState } from "react";
import { ActionGetUserFavorites } from "@/app/actions/favorites/get-user-favorites-product";
import OfferCard from "@/app/search/components/offer-card";
import { Spinner } from "@heroui/react";
import EmptyRes from "@/components/common/empty-res/empty-res";

function FavoriteOffer() {
  const [favorites, setFavorites] = useState<IUserFavorite[] | null>(null);

  useEffect(() => {
    UpdateFavorites();
  }, []);

  function UpdateFavorites() {
    setFavorites(null);
    ActionGetUserFavorites().then(({ data }) => {
      setFavorites(data as IUserFavorite[]);
    });
  }

  return (
    <div className="tab-content active">
      {favorites ? (
        favorites.length > 0 ? (
          <div className="offers-items">
            {favorites?.map(
              (favorite, index) =>
                favorite.offers && (
                  <OfferCard
                    key={`fav__${index}`}
                    offer={favorite.offers}
                    onlyTitle
                    onUpdate={UpdateFavorites}
                  />
                ),
            )}
          </div>
        ) : (
          <EmptyRes title="Вы ещё ничего не добавили" />
        )
      ) : (
        <div className="w-full h-[200px] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </div>
  );
}

export default FavoriteOffer;
