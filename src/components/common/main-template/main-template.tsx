"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import React, { useEffect } from "react";
import Header from "@/components/common/header/header";
import Footer from "@/components/common/footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { setLang, setWords } from "@/redux/translate";
import { localStorageKeys } from "@/utils/consts";
import Whatsapp from "@/components/common/whatsapp/whatsapp";
import Preloader from "@/components/common/preloader/preloader";
import { getTranslations } from "@/lib/translationCache";
import CookieComponent from "@/components/common/main-template/cookie";

interface IThisProps {
  children?: React.ReactNode;
  pageOff?: boolean;
  footer?: boolean;
  headerInfo?: boolean;
  bodyColor?: string;
}

function MainTemplate({
  children,
  pageOff = false,
  footer = true,
  headerInfo = true,
  bodyColor = "#e8eaef",
}: IThisProps) {
  const dispatch = useDispatch();
  const getLanguage = useSelector(
    (state: IStateTranslate) => state.translateSite.selectedLang,
  );
  const words = useSelector(
    (state: IStateTranslate) => state.translateSite.words,
  );

  useEffect(() => {
    document.body.style.backgroundColor = bodyColor;
  }, [bodyColor]);

  useEffect(() => {
    startTranslate(getLanguage);
  }, [getLanguage]);

  useEffect(() => {
    const getLang = localStorage.getItem(localStorageKeys.languages);

    if (getLang) {
      startTranslate(getLang);
    } else {
      startTranslate("ru");
      localStorage.setItem(localStorageKeys.languages, "ru");
    }
  }, []);

  function startTranslate(lang: string) {
    dispatch(setLang(lang));

    getTranslations(lang).then((trans) => {
      dispatch(setWords(trans));
    });
  }

  return (
    <HeroUIProvider>
      <ToastProvider />
      <Header info={headerInfo} />
      {pageOff ? (
        <div className="w-full h-[calc(100dvh-165px)] bg-[#132C5E] flex-jc-c flex-col gap-4">
          <img src="img/no-page.svg" alt="preloader" />
          <h1 className="text-center w-full max-w-[560px] text-[44px] text-white font-bold tracking-[-1.346px] leading-[46.119px]">
            Здесь скоро появится что-то классное
          </h1>
          <h1 className="text-[27px] text-[#ADBAD1]">
            Мы уже варим идеи и монтируем смысл
          </h1>
        </div>
      ) : (
        <>
          {words ? (
            <>
              {children}
              {footer ? <Footer /> : null}
            </>
          ) : (
            <Preloader />
          )}
        </>
      )}
      <Whatsapp />

      <CookieComponent />
    </HeroUIProvider>
  );
}

export default MainTemplate;
