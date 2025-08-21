"use client";

import { useRef, useState } from "react";
import { ActionCheckInn } from "@/app/actions/check-inn/check-inn";
import { InputMask } from "@react-input/mask";
import { Listbox, ListboxItem } from "@heroui/react";
import { motion } from "framer-motion";

type TypeData = {
  suggestions: IOrgData[];
} | null;

function Register() {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [companyData, setCompanyData] = useState<TypeData>(null);

  const [selectedCompany, setSelectedCompany] = useState<IOrgData | null>(null);

  function ChangeInputInn(e: any) {
    e.preventDefault();
    const value = e.target.value;

    // clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setSelectedCompany(null);
    setCompanyData(null);

    typingTimeoutRef.current = setTimeout(() => {
      if (value.length >= 10) {
        setCompanyData("loading");
        ActionCheckInn(value).then(({ data }) => {
          setCompanyData(data);
        });
      }
    }, 800);
  }

  return (
    <div className="main-wrap">
      <div className="wrapper">
        <img src="/img/black-logo.svg" alt="" className="logo" />
        <div className="form-wrap">
          <div className="steps-wrap">
            <img src="/img/onbording-style.png" alt="" />
            <div className="steps-items">
              <span className="num active">1</span>
              <span className="dots"></span>
              <span className="num">2</span>
              <span className="dots"></span>
              <span className="num">3</span>
            </div>
          </div>
          <form className="onbording-form">
            <h2>О компании</h2>
            <div className="input-wrap">
              <span>ИНН компании</span>
              <InputMask
                mask="____________"
                replacement={{ _: /\d/ }}
                required
                onChange={ChangeInputInn}
                placeholder="ИНН"
              />
            </div>

            {companyData && !selectedCompany ? (
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
            ) : null}

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
              <span>Город</span>
              <select>
                <option value="1">Город</option>
                <option value="1">Москва</option>
                <option value="1">Ереван</option>
              </select>
            </div>
            <div className="input-wrap">
              <span>Индустрия</span>
              <select>
                <option value="1">Выбери индустрию из списка</option>
                <option value="1">Индустрия 1</option>
                <option value="1">Индустрия 2</option>
              </select>
            </div>
            <div className="input-wrap">
              <div className="w-wrap">
                Оценочная стоимость
                <div className="tooltip">
                  <img src="/img/tooltip-icon.svg" alt="" />
                  <span className="text">Tooltip text</span>
                </div>
              </div>
              <input type="email" name="email" placeholder="Стоимость" />
            </div>
            <div className="input-wrap">
              <span>Официальный сайт и соцсети</span>
              <input type="email" name="email" placeholder="https://" />
            </div>
            <a href="#" className="add">
              Добавить <img src="/img/plus-green.svg" alt="" />
            </a>
            <div className="input-wrap">
              <span>Логотип</span>
              <label className="file-dropzone">
                <input
                  type="file"
                  name="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  hidden
                />
                <div className="file-dropzone-content">
                  <div className="upload-icon">
                    <img src="/img/down-icon.svg" alt="" />
                  </div>
                  <p>
                    Перетащи или <span className="highlight">выбери файл</span>
                  </p>
                  <p className="file-types">JPG, PNG или SVG</p>
                </div>
              </label>
            </div>
            <button className="green-btn" type="button">
              Продолжить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
