import SelectType from "@/app/account/offers/create/components/select-type";
import SelectVid from "@/app/account/offers/create/components/select-vid";
import { setCompanyDescription, setCompanyName } from "@/redux/offer-page";
import SelectCategories from "@/app/account/offers/create/components/select-categories";
import InputPrice from "@/app/account/offers/create/components/input-price";
import SelectCordinatesForMapModal from "@/app/account/offers/create/components/select-cordinates-for-map-modal";
import UploadPhotos from "@/app/account/offers/create/components/upload-photos";
import ModalAddVideo from "@/app/account/offers/create/components/modal-add-video";
import { useDispatch } from "react-redux";
import { Button } from "@heroui/react";

interface IThisProps {
  onNextStep: () => void;
}

function InfoTab({ onNextStep }: IThisProps) {
  const dispatch = useDispatch();
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
      <Button className="green-btn cursor-pointer" onClick={onNextStep}>
        Предварительный просмотр
      </Button>
    </div>
  );
}

export default InfoTab;
