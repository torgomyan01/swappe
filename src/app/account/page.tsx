import MainTemplate from "@/components/common/main-template/main-template";
import LeftMenu from "@/components/layout/accout/left-menu";

function Profile() {
  return (
    <MainTemplate>
      <div className="profile-wrap">
        <div className="wrapper">
          <div className="breadcrumbs hide-mobile">
            <a href="#index.html">
              Главная
              <img src="img/arr-r.svg" alt="arrow" />
            </a>
            <span>Профиль</span>
          </div>
          <div className="top-mob-line">
            <a href="profile-mobila.html" className="back">
              <img src="img/back-icon.svg" alt="" />
            </a>
            <b>Профиль</b>
          </div>
          <div className="info">
            <LeftMenu />
            <div className="profile profile-account">
              <h3>Аккаунт</h3>
              <p>
                При изменении некоторых данных может потребоваться повторная
                модерация.
              </p>
              <div className="items">
                <div className="item">
                  <b>
                    Почта <img src="img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <a href="mailto:placeholder@mail.com">placeholder@mail.com</a>
                </div>
                <div className="item">
                  <b>
                    Контактный телефон{" "}
                    <img src="img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <a href="tel:+79450000000">+7(945) 000-00-00</a>
                </div>
                <div className="item">
                  <b>Пароль</b>
                  <span>Был изменен 1 год назад</span>
                </div>
                <div className="item">
                  <b>Пользователи</b>
                  <img src="img/avatars.png" alt="avatars" />
                </div>
              </div>
              <div className="border"></div>
              <h3>Карточка компании</h3>
              <p>
                Информация, которую вы предоставляете в этом разделе, является
                общедоступной. Ее можно увидеть в отзывах и она доступна другим
                пользователям Интернета.
              </p>
              <div className="items">
                <div className="item">
                  <b>Название компании</b>
                  <span>ООО Название компании</span>
                </div>
                <div className="item">
                  <b>
                    ИНН компании{" "}
                    <img src="img/check-Icon.svg" alt="check-Icon" />
                  </b>
                  <span>12345 12345</span>
                </div>
                <div className="item">
                  <b>Город</b>
                  <span>Москва и МО</span>
                </div>
                <div className="item">
                  <b>Индустрия</b>
                  <span>Доставка продуктов питания</span>
                </div>
                <div className="item">
                  <b>Оценочная стоимость</b>
                  <span>₽ 1 000 000</span>
                </div>
                <div className="item">
                  <b>Интересующие категории</b>
                  <div className="buttons">
                    <a href="#" className="green-btn">
                      Доставка
                    </a>
                    <a href="#" className="green-btn">
                      Кейтеринг
                    </a>
                  </div>
                </div>
              </div>
              <div className="social">
                <span>Официальный сайт и соцсети</span>
                <div className="links">
                  <a href="#">
                    <img src="img/soc-icon1.svg" alt="soc-icon" />
                  </a>
                  <a href="#">
                    <img src="img/soc-icon2.svg" alt="soc-icon" />
                  </a>
                  <a href="#">
                    <img src="img/soc-icon3.svg" alt="soc-icon" />
                  </a>
                </div>
              </div>
              <a href="#" className="green-btn read">
                <img src="img/edit-menu.svg" alt="edit-menu." />
                Редактировать
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export default Profile;
