import "../_left-menu.scss";

import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Slider,
} from "@heroui/react";
import { ActionGetAllCategory } from "@/app/actions/category/get-category";
import clsx from "clsx";
import { ActionGetAllCountries } from "@/app/actions/create-countries/get-countries";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSearchFilter,
  setCategoryStore,
  setCountryCompanyId,
  setPrice,
  setType,
  setVid,
} from "@/redux/search-filter";

interface IThisProps {
  mobileShow: boolean;
  onClose: () => void;
}

function Filter({ mobileShow, onClose }: IThisProps) {
  const dispatch = useDispatch();

  const filterParams = useSelector(
    (state: ISearchFilterStore) => state.searchFilter,
  );

  const [valuePriceBanners, setValuePriceBanners] = useState<any>([0, 1000000]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setPrice(valuePriceBanners));
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [valuePriceBanners, dispatch]);

  const [category, setCategory] = useState<ICategory[] | null>(null);
  const [categoryQuery, setCategoryQuery] = useState<string>("");

  useEffect(() => {
    ActionGetAllCategory().then(({ data }) => {
      setCategory(data);
    });
  }, []);

  function SelectCategory(id: number) {
    const check = filterParams.category?.some((c) => c.id === id);

    if (check) {
      const findCat = filterParams.category?.filter((c) => c.id !== id);

      if (findCat) {
        dispatch(setCategoryStore(findCat));
      }
    } else {
      const findCat = category?.find((c) => c.id === id);

      const newArr = [...(filterParams.category || []), findCat];

      dispatch(setCategoryStore(newArr as ICategory[]));
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

  const visibleCategories = useMemo(() => {
    const list = category ?? [];
    const q = categoryQuery.trim().toLowerCase();
    const filtered = q
      ? list.filter((c) => c.name.toLowerCase().includes(q))
      : list;
    return q ? filtered : filtered.slice(0, 3);
  }, [category, categoryQuery]);

  const clearFilter = () => {
    dispatch(resetSearchFilter());
    setValuePriceBanners([0, 1000000]);
    setCategoryQuery("");
    setCountries([]);
  };

  return (
    <div
      className={clsx("search-filter-wrap", {
        show: mobileShow,
      })}
    >
      <div className="top-mobile">
        <b>Фильтры</b>
        <button className="close" type="button" onClick={onClose}>
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
            checked={filterParams.type === "product"}
            onChange={() => dispatch(setType("product"))}
          />
          <label htmlFor="radio1">Товары</label>
        </div>
        <div className="radio-wrap">
          <input
            type="radio"
            id="radio2"
            name="checkbox"
            checked={filterParams.type === "service"}
            onChange={() => dispatch(setType("service"))}
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
            checked={filterParams.vid === "online"}
            onChange={() => dispatch(setVid("online"))}
          />
          <label htmlFor="radio3">Онлайн</label>
        </div>
        <div className="radio-wrap">
          <input
            type="radio"
            id="radio4"
            name="checkbox2"
            checked={filterParams.vid === "offline"}
            onChange={() => dispatch(setVid("offline"))}
          />
          <label htmlFor="radio4">Оффлайн</label>
        </div>
      </div>
      <span className="title">Категории</span>
      <div className="input-wrap !mb-2">
        <Input
          type="text"
          placeholder="Поиск категории"
          value={categoryQuery}
          onChange={(e) => setCategoryQuery(e.target.value)}
          color="secondary"
          variant="bordered"
          radius="lg"
          startContent={
            <i className="fa-regular fa-search text-[14px] opacity-60"></i>
          }
        />
      </div>
      <div className="tags">
        {visibleCategories.map((category: ICategory) => (
          <button
            key={`cat__${category.id}`}
            className={clsx("tag cursor-pointer", {
              "!bg-green !text-white": filterParams.category?.some(
                (c) => c.id === category.id,
              ),
              "hover:!bg-cream/50": !filterParams.category?.some(
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
          // formatOptions={{ style: "currency", currency: "RUB" }}
          label="Цена бартера"
          maxValue={1000000}
          minValue={0}
          step={10}
          showTooltip={true}
          size="sm"
          color="secondary"
          value={valuePriceBanners}
          onChange={setValuePriceBanners}
        />
      </div>
      <span className="title">Локация</span>
      <Autocomplete
        className="w-full custom-autocomplete"
        placeholder="Город"
        variant="bordered"
        color="secondary"
        radius="lg"
        onSelectionChange={(value: any) => {
          const val = value ? +value.replace(/country-/g, "") : null;

          dispatch(setCountryCompanyId(val));
        }}
      >
        {countries.map((animal) => (
          <AutocompleteItem key={`country-${animal.id}`}>
            {animal.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Button color="secondary" className="w-full mt-4" onPress={clearFilter}>
        Сбросить фильтры
      </Button>

      <Button className="green-btn" onPress={onClose}>
        Применить фильтрацию
      </Button>
    </div>
  );
}

export default Filter;
