import { InputMask } from "@react-input/mask";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Listbox,
  ListboxItem,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";
import { isValidUrl, RandomKey } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { ActionCheckInn } from "@/app/actions/check-inn/check-inn";
import { ActionGetAllCountries } from "@/app/actions/create-countries/get-countries";
import { ActionGetAllIndustry } from "@/app/actions/Industry/get-Industry";
import { useSelector } from "react-redux";
import { SITE_URL } from "@/utils/consts";
import { useRouter } from "next/navigation";
import MainTemplate from "@/components/common/main-template/main-template";

type TypeData = {
  suggestions: IOrgData[];
} | null;

interface IThisProps {
  onSubmit: (data: object, index: number) => void;
}

function InfoCompany({ onSubmit }: IThisProps) {
  const router = useRouter();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const company = useSelector((state: IUserStore) => state.userInfo.company);

  useEffect(() => {
    if (company) {
      addToast({
        description: "Вас уже есть кампания ",
        color: "warning",
      });

      router.push(SITE_URL.ACCOUNT);
    }
  }, [company]);

  const [companyData, setCompanyData] = useState<TypeData>(null);
  const [loadingGetData, setLoadingGetData] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<IOrgData | null>(null);

  function ChangeInputInn(e: any) {
    e.preventDefault();
    const value = e.target.value;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setSelectedCompany(null);
    setCompanyData(null);

    setLoadingGetData(true);
    typingTimeoutRef.current = setTimeout(() => {
      if (value.length >= 10) {
        ActionCheckInn(value)
          .then(({ data }) => {
            setCompanyData(data);
          })
          .finally(() => setLoadingGetData(false));
      }
    }, 800);
  }

  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [industry, setIndustry] = useState<IIndustry[]>([]);
  const [socialSites, setSocialSites] = useState([RandomKey()]);
  const [logo, setLogo] = useState<File | null>(null);

  // selected city / industry
  const [city, setCity] = useState<number>(0);
  const [industryName, setIndustryName] = useState<string>("");

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 1048576) {
      addToast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 1 МБ",
        color: "danger",
      });
      e.target.value = "";
      setLogo(null);
      return;
    }
    setLogo(file);
  }

  // submit validation
  function handleSubmit(e: any) {
    e.preventDefault();

    if (!selectedCompany) {
      addToast({
        title: "Ошибка",
        description: "Выберите компанию по ИНН",
        color: "danger",
      });
      return;
    }
    if (!city) {
      addToast({
        title: "Ошибка",
        description: "Выберите город",
        color: "danger",
      });
      return;
    }
    if (!industryName) {
      addToast({
        title: "Ошибка",
        description: "Выберите индустрию",
        color: "danger",
      });
      return;
    }
    if (!logo) {
      addToast({
        title: "Ошибка",
        description: "Загрузите логотип",
        color: "danger",
      });
      return;
    }

    const socials = Array.from(
      e.target.querySelectorAll('input[name="social"]'),
    )
      .map((el: any) => el.value.trim())
      .filter((val) => val !== "");

    if (socials.length === 0) {
      addToast({
        title: "Ошибка",
        description: "Добавьте хотя бы одну ссылку",
        color: "danger",
      });
      return;
    }

    const invalid = socials.find((link) => !isValidUrl(link));
    if (invalid) {
      addToast({
        title: "Ошибка",
        description: "Введите корректную ссылку",
        color: "danger",
      });
      return;
    }

    const inn = e.target.inn.value;
    const phone_number = e.target.phone_number.value;

    const formData = {
      company: selectedCompany.value,
      city,
      inn,
      phone_number,
      industry: industryName,
      socials,
      logo,
    };

    onSubmit(formData, 1);
  }

  return (
    <MainTemplate isEmpty>
      <form className="onbording-form" onSubmit={handleSubmit}>
        <h2>О компании</h2>
        <div className="input-wrap">
          <span>ИНН компании</span>
          <InputMask
            mask="____________"
            replacement={{ _: /\d/ }}
            required
            onChange={ChangeInputInn}
            placeholder="ИНН"
            name="inn"
          />
        </div>

        {companyData && !selectedCompany ? (
          <>
            {companyData.suggestions.length ? (
              <div className="input-wrap">
                <span>Выбрать ваша компания </span>
                <Listbox
                  aria-label="Actions"
                  onAction={(key: any) =>
                    setSelectedCompany(companyData.suggestions[key])
                  }
                >
                  {companyData.suggestions.map(
                    (suggestion: IOrgData, index) => (
                      <ListboxItem key={index}>{suggestion.value}</ListboxItem>
                    ),
                  )}
                </Listbox>
              </div>
            ) : (
              <h3 className="text-center text-[15px] opacity-65 my-4">
                Указанный ИНН не найден :(
              </h3>
            )}
          </>
        ) : null}

        {loadingGetData && (
          <div className="w-full h-[90px] flex-jc-c">
            <Spinner color="secondary" />
          </div>
        )}

        {selectedCompany ? (
          <motion.div
            className="input-wrap"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [0.8, 1], opacity: [0, 1] }}
            transition={{ duration: 0.2 }}
          >
            <span>Название компании</span>
            <input
              type="text"
              name="name_company"
              placeholder="Название"
              disabled
              value={selectedCompany.value}
            />
          </motion.div>
        ) : null}

        <div className="input-wrap">
          <span>Номер телефона </span>
          <InputMask
            mask="+7 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            required
            placeholder="Номер телефона "
            name="phone_number"
          />
        </div>

        <div className="mb-4 autocomplite">
          <span className="text-[14px] mb-1 block">Город</span>
          <Autocomplete
            className="w-full custom-autocomplete"
            placeholder="Город"
            isRequired
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

        <div className="mb-4 autocomplite">
          <span className="text-[14px] mb-1 block">Индустрия</span>
          <Select
            className="w-full custom-select"
            placeholder="Индустрия"
            isRequired
            onChange={(e) => setIndustryName(e.target.value)}
          >
            {industry.map((_industry) => (
              <SelectItem key={`ind-${_industry.id}`}>
                {_industry.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        {socialSites.map((id_, index) => (
          <div key={`social-site-${id_}`} className="input-wrap relative">
            <span>Официальный сайт и соцсети</span>
            <input type="text" name="social" placeholder="https://" required />
            {index ? (
              <i
                className="fa-regular fa-xmark absolute right-4 bottom-[16px] opacity-60 hover:opacity-100 cursor-pointer"
                onClick={() => removeItemSocialSites(id_)}
              />
            ) : null}
          </div>
        ))}

        <span
          className="add cursor-pointer"
          onClick={() => {
            if (socialSites.length <= 5) {
              setSocialSites((old) => [...old, RandomKey()]);
            } else {
              addToast({
                title: "Максимальное количество ссылок — 5.",
                color: "danger",
              });
            }
          }}
        >
          Добавить <img src="/img/plus-green.svg" alt="" />
        </span>

        <div className="input-wrap">
          <span>Логотип</span>
          <label className="file-dropzone">
            <input
              type="file"
              name="file"
              accept=".jpg,.jpeg,.png,.svg"
              hidden
              onChange={handleFileChange}
            />
            <div className="file-dropzone-content">
              <div className="upload-icon">
                <img src="/img/down-icon.svg" alt="" />
              </div>
              <p className="flex-jc-c gap-2">
                Перетащи или{" "}
                <span className="highlight underline text-green !mb-0">
                  выбери файл
                </span>
              </p>
              {logo ? (
                <p className="file-types flex-jc-c gap-2">
                  Файл выбран:{" "}
                  <span className="underline !mb-0">{logo.name}</span> (
                  {Math.round(logo.size / 1024)} КБ)
                </p>
              ) : (
                <p className="file-types">JPG, PNG или SVG (не более 1 МБ)</p>
              )}
            </div>
          </label>
        </div>

        <button className="green-btn cursor-pointer" type="submit">
          Продолжить
        </button>
      </form>
    </MainTemplate>
  );
}

export default InfoCompany;
