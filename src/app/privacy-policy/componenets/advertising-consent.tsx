function AdvertisingConsent() {
  return (
    <div className="p-6 sm:p-8 bg-white shadow-2xl rounded-xl mb-8 font-sans text-gray-800">
      <header className="mb-6 border-b-4 border-gren pb-3">
        <h1 className="text-2xl font-extrabold text-gray-900">
          СОГЛАСИЕ НА ПОЛУЧЕНИЕ РЕКЛАМНОЙ ИНФОРМАЦИИ
        </h1>
      </header>

      <div className="space-y-4 text-sm leading-relaxed">
        <p className="p-3 bg-red-50 border-l-4 border-red-500 font-medium">
          Проставляя отметку в соответствующем поле, я подтверждаю, что действую
          свободно, своей волей и в своём интересе и даю согласие
          индивидуальному предпринимателю **Махониной Анастасии Евгеньевне**
          (ИНН 550711863779, ОГРНИП 323470400092754; e-mail:{" "}
          <code className="bg-gray-200 p-0.5 rounded">support@swappe.ru</code>)
          (далее — **Оператор**) на получение рекламной информации о товарах,
          услугах, акциях, мероприятиях и иных предложениях **Swappe.ru** и
          партнёров Оператора.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-5 mb-2">
          Используемые каналы связи:
        </h2>

        <p>
          Настоящее согласие включает использование предоставленных мной
          контактных данных (адрес электронной почты, номер телефона, иные
          контактные данные) для направления рекламных материалов с применением:
        </p>

        <ul className="list-disc list-inside space-y-1 ml-4 p-3 bg-gray-50 border rounded !p-4">
          <li>электронной почты;</li>
          <li>SMS-сообщений;</li>
          <li>push-уведомлений;</li>
          <li>мессенджеров;</li>
          <li>иных средств связи.</li>
        </ul>

        <p className="mt-4 font-medium text-green-700">
          Я подтверждаю, что согласие предоставляется **добровольно** и без
          какого-либо принуждения.
        </p>

        <p className="text-xs italic text-gray-600 border-t pt-2">
          Согласие предоставляется в соответствии со статьёй 18 Федерального
          закона от 13.03.2006 № 38-ФЗ «О рекламе» и статьёй 10.1 Федерального
          закона от 27.07.2006 № 152-ФЗ «О персональных данных».
        </p>

        {/* Блок отзыва согласия */}
        <h2 className="text-lg font-bold text-red-700 mt-5 mb-2">
          Отзыв согласия
        </h2>

        <p className="font-semibold">
          Согласие действует в течение всего срока пользования сервисами
          Swappe.ru и может быть отозвано в **любой момент**:
        </p>

        <ul className="list-disc list-inside space-y-1 ml-4 text-sm font-medium">
          <li>
            направив уведомление на e-mail{" "}
            <code className="bg-red-100 p-0.5 rounded">support@swappe.ru</code>;
          </li>
          <li>либо воспользовавшись функцией «Отписаться» в сообщении.</li>
        </ul>

        <p className="mt-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-xs">
          Отказ от согласия **не ограничивает** мои права на использование Сайта
          и сервисов Swappe.ru.
        </p>

        <p className="text-xs italic text-gray-500 pt-2 border-t">
          Факт предоставления согласия фиксируется Оператором (дата, время,
          IP-адрес) и хранится в течение всего срока его действия и не менее
          трёх лет после его отзыва, если более длительный срок не установлен
          законодательством РФ.
        </p>
      </div>
    </div>
  );
}

export default AdvertisingConsent;
