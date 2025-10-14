import { useEffect, useState } from "react";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { ActionGetAllCountries } from "@/app/actions/create-countries/get-countries";
import { ActionGetAllIndustry } from "@/app/actions/Industry/get-Industry";
import { ActionGetAllCategory } from "@/app/actions/category/get-category";
import clsx from "clsx";
import { ActionChangeCompany } from "@/app/actions/company/change-company";

function ChangeCompany() {
  const company = useSelector((state: IUserStore) => state.userInfo.company);

  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [industry, setIndustry] = useState<IIndustry[]>([]);
  const [industryName, setIndustryName] = useState<string>("");
  const [socialSites, setSocialSites] = useState<string[]>([]);

  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [city, setCity] = useState<number>(0);

  useEffect(() => {
    if (company) {
      setSocialSites(company.sites);
      setSelectedCategories(company.interest_categories);
      setCity(company.city);
      setIndustryName(`ind-${company.industry}`);
    }
  }, [company]);

  useEffect(() => {
    ActionGetAllCountries().then(({ data }) => {
      setCountries(data);
    });
    ActionGetAllIndustry().then(({ data }) => {
      setIndustry(data as IIndustry[]);
    });
  }, []);

  function removeItemSocialSites(id: string) {
    const newSites = socialSites.filter((_id) => _id !== id);
    setSocialSites(newSites);
  }

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

  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  function SaveChanges() {
    if (company) {
      setLoadingSave(true);
      ActionChangeCompany(
        company.id,
        city,
        +industryName.replace(/ind-/g, ""),
        selectedCategories,
        socialSites,
      )
        .then(() => {
          addToast({
            description: "Спасибо, изменение успешно сохранено.",
            color: "success",
          });
        })
        .finally(() => setLoadingSave(false));
    }
  }

  return company ? (
    <>
      <h3>Карточка компании</h3>
      <p>
        Информация, которую вы предоставляете в этом разделе, является
        общедоступной. Ее можно увидеть в отзывах и она доступна другим
        пользователям Интернета.
      </p>
      <form className="profile-change-form">
        <div className="label-wrap">
          <span>Название компании</span>
          <input
            type="text"
            placeholder="Название компании"
            value={company?.name}
            disabled
          />
        </div>
        <div className="label-wrap">
          <span>ИНН компании</span>
          <input
            type="text"
            placeholder="12345 12345"
            value={company?.inn}
            disabled
          />
        </div>
        {company && countries.length ? (
          <div className="mb-4 autocomplite">
            <span className="text-[14px] mb-1 block">Город</span>
            <Autocomplete
              className="w-full custom-autocomplete"
              placeholder="Город"
              isRequired
              defaultSelectedKey={`country-${company?.city_data.id}`}
              onSelectionChange={(key) => {
                const cityName =
                  countries.find((c) => `country-${c.id}` === key)?.id || 0;
                setCity(cityName);
              }}
            >
              {countries.map((animal) => (
                <AutocompleteItem key={`country-${animal.id}`}>
                  {animal.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        ) : null}

        {company && industry ? (
          <div className="mb-4 autocomplite">
            <span className="text-[14px] mb-1 block">Индустрия</span>
            <Select
              className="w-full custom-select"
              placeholder="Индустрия"
              isRequired
              defaultSelectedKeys={[`ind-${company.industry_data.id}`]}
              onChange={(e) => setIndustryName(e.target.value)}
            >
              {industry.map((_industry) => (
                <SelectItem key={`ind-${_industry.id}`}>
                  {_industry.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="label-wrap">
          <span>Официальный сайт и соцсети</span>

          {socialSites.map((id_, index) => (
            <div key={`site__${index}`} className="input-wrap relative mb-2">
              <input
                type="text"
                name="social"
                placeholder="https://"
                required
                onChange={(e) => {
                  const newVal = [...socialSites];
                  newVal[index] = e.target.value;

                  setSocialSites(newVal);
                }}
                defaultValue={id_}
              />
              {index ? (
                <i
                  className="fa-regular fa-xmark absolute right-4 bottom-[16px] opacity-60 hover:opacity-100 cursor-pointer"
                  onClick={() => removeItemSocialSites(id_)}
                />
              ) : null}
            </div>
          ))}

          <Button
            color="secondary"
            className="mt-4"
            onClick={() => {
              if (socialSites.length <= 5) {
                setSocialSites((old) => [...old, "https://"]);
              } else {
                addToast({
                  title: "Максимальное количество ссылок — 5.",
                  color: "danger",
                });
              }
            }}
          >
            Добавить
            <i className="fa-solid fa-plus"></i>
          </Button>
        </div>

        <div className="label-wrap">
          <span>Интересующие категории</span>
          <div className="btns gap-2">
            {categories?.map((category: ICategory) => (
              <Button
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
              </Button>
            ))}
          </div>
        </div>
      </form>
      <Button
        className="green-btn read mt-6"
        onPress={SaveChanges}
        isLoading={loadingSave}
      >
        <img src="/img/check-circle.svg" alt="edit-menu." />
        Сохранить изменения
      </Button>
    </>
  ) : (
    <div className="w-full h-[400px] flex-jc-c">
      <Spinner color="secondary" />
    </div>
  );
}

export default ChangeCompany;
