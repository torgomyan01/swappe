import SelectType from "@/app/account/offers/create/components/select-type";
import SelectVid from "@/app/account/offers/create/components/select-vid";
import { setCompanyDescription, setCompanyName } from "@/redux/offer-page";
import SelectCategories from "@/app/account/offers/create/components/select-categories";
import InputPrice from "@/app/account/offers/create/components/input-price";
import SelectCordinatesForMapModal from "@/app/account/offers/create/components/select-cordinates-for-map-modal";
import UploadPhotos from "@/app/account/offers/create/components/upload-photos";
import ModalAddVideo from "@/app/account/offers/create/components/modal-add-video";
import { useDispatch, useSelector } from "react-redux";
import { addToast, Button } from "@heroui/react";

interface IThisProps {
  onNextStep: () => void;
}

function InfoTab({ onNextStep }: IThisProps) {
  const dispatch = useDispatch();

  const offerData = useSelector(
    (state: IUserOfferStore) => state.userOffer.offer,
  );

  function NextAndCHeckValidation() {
    if (!offerData.type) {
      addToast({
        title: "Ошибка",
        description: "Выбрайте Тип",
        color: "danger",
      });
      return;
    }

    if (!offerData.vid) {
      addToast({
        title: "Ошибка",
        description: "Выбрайте Вид",
        color: "danger",
      });
      return;
    }

    if (!offerData.name) {
      addToast({
        title: "Ошибка",
        description: "Напишите Название",
        color: "danger",
      });
      return;
    }

    if (!offerData.category.length) {
      addToast({
        title: "Ошибка",
        description: "Выберите хотя один категория",
        color: "danger",
      });
      return;
    }

    if (!offerData.price) {
      addToast({
        title: "Ошибка",
        description: "Напишите стоимость",
        color: "danger",
      });
      return;
    }

    if (!offerData.coordinates) {
      addToast({
        title: "Ошибка",
        description: "Выберите Регион покрытия",
        color: "danger",
      });
      return;
    }

    if (!offerData.description) {
      addToast({
        title: "Ошибка",
        description: "Напишите Описание",
        color: "danger",
      });
      return;
    }

    if (offerData.images.length < 3) {
      addToast({
        title: "Ошибка",
        description: "Добавьте минимум 3 фото",
        color: "danger",
      });
      return;
    }

    onNextStep();
  }

  return (
    <div className="general-information-form">
      <div className="info">
        <h4>Общая информация</h4>
        <span className="creating-title">Тип</span>

        <SelectType />

        <span className="creating-title">Вид</span>

        <SelectVid />

        <span className="creating-title">Название</span>
        <input
          type="text"
          placeholder="Что вы предлагаете контрагентам?"
          onChange={(e) => dispatch(setCompanyName(e.target.value))}
        />
        <span className="creating-title">Категория</span>
        <span className="subtitle">Можешь выбрать несколько</span>

        <SelectCategories />

        <span className="creating-title">Оценочная стоимость бартера, ₽</span>

        <InputPrice />

        <SelectCordinatesForMapModal />

        <span className="creating-title">Описание</span>
        <textarea
          placeholder="Расскажи подробнее о предоставляемой услуге"
          onChange={(e) => dispatch(setCompanyDescription(e.target.value))}
        />
        <h4>Медиа</h4>

        <UploadPhotos />

        <ModalAddVideo />
      </div>
      <Button
        className="green-btn cursor-pointer"
        onPress={NextAndCHeckValidation}
      >
        Предварительный просмотр
      </Button>
    </div>
  );
}

export default InfoTab;
