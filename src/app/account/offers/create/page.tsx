"use client";

import "./_creating-proposal.scss";

import MainTemplate from "@/components/common/main-template/main-template";
import { useEffect, useState } from "react";
import { ActionGetAllCategory } from "@/app/actions/category/get-category";
import clsx from "clsx";
import { Spinner } from "@heroui/react";
import { InputMask } from "@react-input/mask";
import SelectCordinatesForMapModal from "@/app/account/offers/create/components/select-cordinates-for-map-modal";
import UploadPhotos from "@/app/account/offers/create/components/upload-photos";
import ModalAddVideo from "@/app/account/offers/create/components/modal-add-video";

function Profile() {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    ActionGetAllCategory().then(({ data }) => {
      setCategories(data);
    });
  }, []);

  function SelectCategory(id: number) {
    const check = selectedCategories?.some((c) => c.id === id);

    if (check) {
      const findCat = selectedCategories?.filter((c) => c.id !== id);

      setSelectedCategories(findCat);
    } else {
      const findCat = categories?.find((c) => c.id === id);

      const newArr = [...selectedCategories, findCat];

      setSelectedCategories(newArr as ICategory[]);
    }
  }

  const [amount, setAmount] = useState("");

  const formatMoney = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue) {
      const formattedValue = new Intl.NumberFormat("ru-RU").format(
        Number(numericValue),
      );
      return `${formattedValue} ₽`;
    }

    return "";
  };

  return (
    <MainTemplate>
      <div className="creating-proposal">
        <div className="wrapper">
          <div className="top-info">
            <h4>Создание предложения</h4>
            <div className="close">
              <img src="/img/close-pop.svg" alt="" />
            </div>
          </div>
          <div className="info-texts">
            <div className="texts green">
              <span className="num">1</span>
              <span className="text">Информация о товаре/услуге</span>
            </div>
            <div className="texts">
              <span className="num">2</span>
              <span className="text">Предварительный просмотр</span>
            </div>
          </div>
          <div className="general-information-form">
            <div className="info">
              <h4>Общая информация</h4>
              <span className="creating-title">Тип</span>
              <div className="radios">
                <div className="radio-wrap">
                  <input type="radio" id="radio1" name="type" />
                  <label
                    htmlFor="radio1"
                    className="border transition border-transparent hover:border-green cursor-pointer"
                  >
                    <span></span>
                    Товар
                  </label>
                </div>
                <div className="radio-wrap">
                  <input type="radio" id="radio2" name="type" />
                  <label
                    htmlFor="radio2"
                    className="border transition border-transparent hover:border-green cursor-pointer"
                  >
                    <span></span>
                    Услуга
                  </label>
                </div>
              </div>
              <span className="creating-title">Вид</span>
              <div className="radios">
                <div className="radio-wrap">
                  <input type="radio" id="radio3" name="view" />
                  <label
                    htmlFor="radio3"
                    className="border transition border-transparent hover:border-green cursor-pointer"
                  >
                    <span></span>
                    Онлайн
                  </label>
                </div>
                <div className="radio-wrap">
                  <input type="radio" id="radio4" name="view" />
                  <label
                    htmlFor="radio4"
                    className="border transition border-transparent hover:border-green cursor-pointer"
                  >
                    <span></span>
                    Оффлайн
                  </label>
                </div>
              </div>
              <span className="creating-title">Название</span>
              <input
                type="text"
                placeholder="Что вы предлагаете контрагентам?"
              />
              <span className="creating-title">Категория</span>
              <span className="subtitle">Можешь выбрать несколько</span>
              {categories ? (
                <div className="tags">
                  {categories.map((category: ICategory) => (
                    <button
                      key={`cat-${category.id}`}
                      className={clsx("cursor-pointer", {
                        "!bg-green !text-white": selectedCategories.some(
                          (c) => c.id === category.id,
                        ),
                        "hover:!bg-cream/50": !selectedCategories.some(
                          (c) => c.id === category.id,
                        ),
                      })}
                      onClick={() => SelectCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="tags h-[134px] flex-jc-c">
                  <Spinner color="secondary" />
                </div>
              )}
              <span className="creating-title">
                Оценочная стоимость бартера, ₽
              </span>
              <InputMask
                mask="_____________"
                replacement={{ _: /\d/ }}
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                onBlur={(e) => {
                  if (e.target.value) {
                    setAmount(formatMoney(e.target.value));
                  }
                }}
                onFocus={() => {
                  setAmount(amount.replace(/\D/g, ""));
                }}
                placeholder="Стоимость, ₽"
                className="price-input"
              />

              <SelectCordinatesForMapModal />

              <span className="creating-title">Описание</span>
              <textarea placeholder="Расскажи подробнее о предоставляемой услуге"></textarea>
              <h4>Медиа</h4>

              <UploadPhotos />

              <ModalAddVideo />
            </div>
            <button className="green-btn">Предварительный просмотр</button>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
