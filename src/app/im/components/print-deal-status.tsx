import { fileHost, SITE_URL } from "@/utils/consts";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/helpers";

interface IThisProps {
  chat: IChatItems;
}

function PrintDealStatus({ chat }: IThisProps) {
  return (
    <>
      <div className="top-item">
        <div className="imgs">
          <div className="img relative overflow-hidden group">
            <Image
              src={`${fileHost}${chat.deal.client_offer.images[0]}`}
              alt={chat.deal.client.company.name}
              width={100}
              height={100}
              className="object-cover"
            />
            <Link
              href={`${SITE_URL.OFFER}/${chat.deal.client_offer_id}`}
              target="_blank"
              className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
            >
              <i className="fa-light fa-arrow-up-right text-white"></i>
            </Link>
          </div>
          <div className="img relative overflow-hidden group">
            <Image
              src={`${fileHost}${chat.deal.owner_offer.images[0]}`}
              alt={chat.deal.client.company.name}
              width={100}
              height={100}
              className="object-cover"
            />
            <Link
              href={`${SITE_URL.OFFER}/${chat.deal.owner_offer_id}`}
              target="_blank"
              className="w-full h-full absolute left-0 top-0 bg-green/50 transition opacity-0 group-hover:opacity-100 !flex-jc-c cursor-pointer"
            >
              <i className="fa-light fa-arrow-up-right text-white"></i>
            </Link>
          </div>
        </div>
        <div className="txts">
          <b>
            {chat.deal.client_offer.name},{" "}
            {formatPrice(+chat.deal.client_offer.price)}{" "}
          </b>
          <div className="inf-texts">
            <span className="grey">Ожидает подтверждения</span>
          </div>
        </div>
        <div className="new">
          <img src="/img/new-style.svg" alt="" />
          <span>Новая</span>
        </div>
      </div>
      {/*<div class="top-item">*/}
      {/*    <div class="imgs">*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img.png" alt="">*/}
      {/*        </div>*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img2.png" alt="">*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="txts">*/}
      {/*        <b>Название сделки, ₽100 000 </b>*/}
      {/*        <div class="inf-texts">*/}
      {/*            <span class="grey">Предложение принято, </span>*/}
      {/*            <a href="#" download="" class="download">*/}
      {/*                скачать договор*/}
      {/*                <img src="/img/chat/download.svg" alt="">*/}
      {/*            </a>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="btns">*/}
      {/*        <a href="#" class="white-btn">Отказать</a>*/}
      {/*        <a href="#" class="green-btn">Заключить договор</a>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/*<div class="top-item">*/}
      {/*    <div class="imgs">*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img.png" alt="">*/}
      {/*        </div>*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img2.png" alt="">*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="txts">*/}
      {/*        <b>Название сделки, ₽100 000 </b>*/}
      {/*        <div class="inf-texts">*/}
      {/*            <span class="grey">Ожидает подтверждения</span>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="new">*/}
      {/*        <img src="/img/new-style4.svg" alt="">*/}
      {/*        <span>Заключен договор</span>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/*<div class="top-item">*/}
      {/*    <div class="imgs">*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img.png" alt="">*/}
      {/*        </div>*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img2.png" alt="">*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="txts">*/}
      {/*        <b>Название сделки, ₽100 000 </b>*/}
      {/*        <div class="inf-texts">*/}
      {/*            <span class="grey">Ожидает подтверждения</span>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="new big">*/}
      {/*        <img src="/img/new-style3.svg" alt="">*/}
      {/*        <span>Бартер осуществлен</span>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/*<div class="top-item">*/}
      {/*    <div class="imgs">*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img.png" alt="">*/}
      {/*        </div>*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img2.png" alt="">*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="txts">*/}
      {/*        <b>Название сделки, ₽100 000 </b>*/}
      {/*        <div class="inf-texts">*/}
      {/*            <span class="grey">Сделка прошла успешно</span>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="btns">*/}
      {/*        <a href="#" class="green-btn">Завершить сделку</a>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/*<div class="top-item">*/}
      {/*    <div class="imgs">*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img.png" alt="">*/}
      {/*        </div>*/}
      {/*        <div class="img">*/}
      {/*            <img src="/img/chat/tom-item-img2.png" alt="">*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="txts">*/}
      {/*        <b>Название сделки, ₽100 000 </b>*/}
      {/*        <div class="inf-texts">*/}
      {/*            <span class="grey">Сделка завершена </span>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div class="btns">*/}
      {/*        <a href="#" class="white-btn">Оставить отзыв</a>*/}
      {/*    </div>*/}
      {/*</div> */}
    </>
  );
}

export default PrintDealStatus;
