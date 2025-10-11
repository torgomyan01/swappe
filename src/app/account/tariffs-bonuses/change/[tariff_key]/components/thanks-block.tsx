import MainTemplate from "@/components/common/main-template/main-template";
import { SITE_URL } from "@/utils/consts";
import Link from "next/link";

function ThanksBlock() {
  return (
    <MainTemplate isEmpty>
      <div className="main-wrap funds-wrap">
        <div className="wrapper">
          <img src="img/black-logo.svg" alt="" className="logo" />
          <div className="connected-advanced">
            <img src="img/modals/connectes-basic-img.svg" alt="" />
            <b>
              Подключили <br />
              Продвинутый
            </b>
            <span>
              {/* Компенсировали разницу бонусами(123).  */}
              Все преимущества тарифа уже доступны в профиле{" "}
            </span>
            <Link href={SITE_URL.ACCOUNT} className="green-btn">
              Перейти в профиль
            </Link>
          </div>
          <div className="bottom-texts">
            <span>Возникли проблемы?</span>
            <Link href={SITE_URL.CHAT} className="text-green">
              Наша поддержка поможет
            </Link>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default ThanksBlock;
