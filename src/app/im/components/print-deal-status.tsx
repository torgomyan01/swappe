import { useSession } from "next-auth/react";
import WaitConfirm from "@/app/im/components/deal-statuses/client/wait-confirm";
import WaitConfirmDoc from "@/app/im/components/deal-statuses/client/wait-confirm-doc";
import Completed from "@/app/im/components/deal-statuses/client/completed";

interface IThisProps {
  chat: IChatItems;
}

function PrintDealStatus({ chat }: IThisProps) {
  const { data: session }: any = useSession();

  function PrintStatuses() {
    if (chat.deal.client.id === session?.user?.id) {
      if (chat.deal.status_client === "wait-confirm") {
        return <WaitConfirm chat={chat} />;
      }
      if (chat.deal.status_client === "wait-doc-confirm") {
        return <WaitConfirmDoc chat={chat} />;
      }
      if (chat.deal.status_client === "doc-confirmed") {
        return <Completed chat={chat} />;
      }
    }
  }

  return (
    <>
      <PrintStatuses />

      {/*<div className="top-item">*/}
      {/*  <div className="imgs">*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img.png" alt="" />*/}
      {/*    </div>*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img2.png" alt="" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="txts">*/}
      {/*    <b>Название сделки, ₽100 000 </b>*/}
      {/*    <div className="inf-texts">*/}
      {/*      <span className="grey">Предложение принято, </span>*/}
      {/*      <a href="#" download="" className="download">*/}
      {/*        скачать договор*/}
      {/*        <img src="/img/chat/download.svg" alt="" />*/}
      {/*      </a>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="btns">*/}
      {/*    <a href="#" className="white-btn">*/}
      {/*      Отказать*/}
      {/*    </a>*/}
      {/*    <a href="#" className="green-btn">*/}
      {/*      Заключить договор*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="top-item">*/}
      {/*  <div className="imgs">*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img.png" alt="" />*/}
      {/*    </div>*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img2.png" alt="" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="txts">*/}
      {/*    <b>Название сделки, ₽100 000 </b>*/}
      {/*    <div className="inf-texts">*/}
      {/*      <span className="grey">Ожидает подтверждения</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="new">*/}
      {/*    <img src="/img/new-style4.svg" alt="" />*/}
      {/*    <span>Заключен договор</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="top-item">*/}
      {/*  <div className="imgs">*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img.png" alt="" />*/}
      {/*    </div>*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img2.png" alt="" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="txts">*/}
      {/*    <b>Название сделки, ₽100 000 </b>*/}
      {/*    <div className="inf-texts">*/}
      {/*      <span className="grey">Ожидает подтверждения</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="new big">*/}
      {/*    <img src="/img/new-style3.svg" alt="" />*/}
      {/*    <span>Бартер осуществлен</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="top-item">*/}
      {/*  <div className="imgs">*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img.png" alt="" />*/}
      {/*    </div>*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img2.png" alt="" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="txts">*/}
      {/*    <b>Название сделки, ₽100 000 </b>*/}
      {/*    <div className="inf-texts">*/}
      {/*      <span className="grey">Сделка прошла успешно</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="btns">*/}
      {/*    <a href="#" className="green-btn">*/}
      {/*      Завершить сделку*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="top-item">*/}
      {/*  <div className="imgs">*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img.png" alt="" />*/}
      {/*    </div>*/}
      {/*    <div className="img">*/}
      {/*      <img src="/img/chat/tom-item-img2.png" alt="" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="txts">*/}
      {/*    <b>Название сделки, ₽100 000 </b>*/}
      {/*    <div className="inf-texts">*/}
      {/*      <span className="grey">Сделка завершена </span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="btns">*/}
      {/*    <a href="#" className="white-btn">*/}
      {/*      Оставить отзыв*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
}

export default PrintDealStatus;
