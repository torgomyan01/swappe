import "../_left-menu.scss";

import { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Slider } from "@heroui/react";
import { ActionGetAllCategory } from "@/app/actions/category/get-category";
import clsx from "clsx";
import { ActionGetAllCountries } from "@/app/actions/create-countries/get-countries";

function Filter() {
  const [valuePriceBanners, setValuePriceBanners] = useState<any>([100, 300]);
  const [valuePriceCompany, setValuePriceCompany] = useState<any>([100, 300]);

  const [type, setType] = useState<"product" | "service">("product");
  const [vid, setVid] = useState<"online" | "offline">("online");

  const [category, setCategory] = useState<ICategory[] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    ActionGetAllCategory().then(({ data }) => {
      setCategory(data);
    });
  }, []);

  function SelectCategory(id: number) {
    const check = selectedCategories?.some((c) => c.id === id);

    if (check) {
      const findCat = selectedCategories?.filter((c) => c.id !== id);

      setSelectedCategories(findCat);
    } else {
      const findCat = category?.find((c) => c.id === id);

      const newArr = [...selectedCategories, findCat];

      setSelectedCategories(newArr as ICategory[]);
    }
  }

  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    [],
  );

  useEffect(() => {
    ActionGetAllCountries().then(({ data }) => {
      setCountries(data);
    });
  }, []);

  return (
    <div className="search-filter-wrap">
      <div className="top-mobile">
        <b>Фильтры</b>
        <button className="close" type="button">
          <img src="/img/close-pop.svg" alt="" />
        </button>
      </div>
      <span className="title">Тип</span>
      <div className="radios">
        <div className="radio-wrap">
          <input
            type="radio"
            id="radio1"
            name="checkbox"
            checked={type === "product"}
            onChange={() => setType("product")}
          />
          <label htmlFor="radio1">Товары</label>
        </div>
        <div className="radio-wrap">
          <input
            type="radio"
            id="radio2"
            name="checkbox"
            checked={type === "service"}
            onChange={() => setType("service")}
          />
          <label htmlFor="radio2">Услуги</label>
        </div>
      </div>
      <span className="title">Вид</span>
      <div className="radios">
        <div className="radio-wrap">
          <input
            type="radio"
            id="radio3"
            name="checkbox2"
            checked={vid === "online"}
            onChange={() => setVid("online")}
          />
          <label htmlFor="radio3">Онлайн</label>
        </div>
        <div className="radio-wrap">
          <input
            type="radio"
            id="radio4"
            name="checkbox2"
            checked={vid === "offline"}
            onChange={() => setVid("offline")}
          />
          <label htmlFor="radio4">Оффлайн</label>
        </div>
      </div>
      <span className="title">Категории</span>
      <div className="tags">
        {category?.map((category: ICategory) => (
          <button
            key={`cat__${category.id}`}
            className={clsx("tag cursor-pointer", {
              "!bg-green !text-white": selectedCategories.some(
                (c) => c.id === category.id,
              ),
              "hover:!bg-cream/50": !selectedCategories.some(
                (c) => c.id === category.id,
              ),
            })}
            type="button"
            onClick={() => SelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="slider-block">
        <Slider
          className="w-full"
          formatOptions={{ style: "currency", currency: "USD" }}
          label="Цена бартера"
          maxValue={1000}
          minValue={0}
          step={10}
          showTooltip={true}
          size="sm"
          color="secondary"
          value={valuePriceBanners}
          onChange={setValuePriceBanners}
        />
        {/*<div className="range-values">*/}
        {/*  <span id="barter-min">₽25000</span>*/}
        {/*  <span id="barter-max">₽75000</span>*/}
        {/*</div>*/}
      </div>
      <div className="slider-block !mt-4">
        {/*<div className="title">Цена компании</div>*/}
        <Slider
          className="w-full"
          formatOptions={{ style: "currency", currency: "USD" }}
          label="Цена компании"
          maxValue={1000}
          minValue={0}
          step={10}
          showTooltip={true}
          size="sm"
          color="secondary"
          value={valuePriceCompany}
          onChange={setValuePriceCompany}
        />
        {/*<div className="range-values">*/}
        {/*  <span id="company-min">₽25000</span>*/}
        {/*  <span id="company-max">₽75000</span>*/}
        {/*</div>*/}
      </div>
      <span className="title">Локация</span>
      <Autocomplete
        className="w-full custom-autocomplete"
        placeholder="Город"
        variant="bordered"
        color="secondary"
        radius="lg"
      >
        {countries.map((animal) => (
          <AutocompleteItem key={`country-${animal.id}`}>
            {animal.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <a href="#" className="green-btn">
        Применить фильтрацию
      </a>
    </div>
  );
}

export default Filter;
