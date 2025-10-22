import { Button } from "@heroui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";

function TelegramBlock() {
  const [view, setView] = useState(false);

  useEffect(() => {
    const getScrabed = localStorage.getItem("telegram_block_scrabed");
    if (getScrabed === "1") {
      setView(false);
      return;
    }

    setTimeout(() => {
      setView(true);
    }, 5000);
  }, []);

  function SunScrabed() {
    localStorage.setItem("telegram_block_scrabed", "1");
    setView(false);
  }

  return (
    <div
      className={clsx(
        "w-[calc(100%-40px)] sm:w-[490px] fixed right-6 bottom-6 bg-white rounded-3xl shadow-2xl p-8 border border-[#EAECF0] transform transition z-50",
        {
          "translate-x-[calc(100%+100px)] pointer-events-none": !view,
        },
      )}
    >
      <div className="flex-je-c">
        <i
          className="fa-regular fa-xmark text-2xl cursor-pointer"
          onClick={() => setView(false)}
        ></i>
      </div>

      <div className="flex-jc-c">
        <img src="/img/icons/img-telegram.svg" alt="" />
      </div>

      <h3 className="text-center text-[32px] font-semibold mt-8">
        Мы на связи
      </h3>
      <p className="text-[14px] text-[#858C95] mt-4 text-center">
        Актуальные новости сервиса в нашем Telegram-канале
      </p>

      <div className="flex-jc-c mt-8">
        <Button
          as={Link}
          href="https://t.me/swappeplatform"
          target="_blank"
          onPress={SunScrabed}
          startContent={<img src="/img/icons/paper-plane-fill.svg" />}
          color="secondary"
          className="rounded-[16px] !flex-jc-c"
        >
          Присоединиться
        </Button>
      </div>
    </div>
  );
}

export default TelegramBlock;
