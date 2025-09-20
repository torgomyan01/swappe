import moment from "moment";
import "moment/locale/ru";
import MessagesStartHero from "@/app/im/components/messages-start-hero";
import MyMessage from "@/app/im/components/my-message";
import { useSession } from "next-auth/react";
import ClientMessage from "@/app/im/components/client-message";

moment().locale("ru");

interface IThisProps {
  chat: IChatItems;
  messages: IMessage[];
}

function Messages({ chat, messages }: IThisProps) {
  const { data: session }: any = useSession<any>();

  console.log(messages, session);

  return (
    <div className="middle-info">
      <div className="scroll-info">
        <div className="transactions-item style2">
          <div className="status-text">
            {moment(chat.deal.created_at).calendar()}
          </div>

          <MessagesStartHero chat={chat} />

          <div className="txt">
            <div className="new">
              <img src="/img/new-style.svg" alt="" />
              <span>Новая</span>
            </div>
            <b>{chat.chat_name}</b>
            <span>🌟 «Начни общение — создавай коллаборации!»</span>
          </div>
        </div>
        <div className="sms-wrap">
          {/*<div className="status-text">Сегодня</div>*/}

          {messages.map((message) =>
            message.sender_id === session?.user.id ? (
              <MyMessage key={`my-message--${message.id}`} message={message} />
            ) : (
              <ClientMessage
                key={`my-message--${message.id}`}
                message={message}
              />
            ),
          )}

          {/*<div className="right-sms-wrap">*/}
          {/*  <div className="right-sms">*/}
          {/*    <div className="style">*/}
          {/*      Добрый день! Я хотела бы обсудить детали обмена.*/}
          {/*    </div>*/}
          {/*    <div className="time">*/}
          {/*      <img src="/img/chat/massage-state.svg" alt="" />*/}
          {/*      14:30*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className="img">*/}
          {/*    <img src="/img/avatar.png" alt="" />*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="right-sms-wrap">*/}
          {/*  <div className="right-sms">*/}
          {/*    <div className="style">*/}
          {/*      Равным образом сложившаяся структура организации способствует*/}
          {/*      подготовки и реализации направлений прогрессивного развития.*/}
          {/*      Задача организации, в особенности же постоянное*/}
          {/*      информационно-пропагандистское обеспечение нашей деятельности*/}
          {/*      представляет собой интересный.*/}
          {/*    </div>*/}
          {/*    <div className="time">*/}
          {/*      <img src="/img/chat/massage-state.svg" alt="" />*/}
          {/*      14:30*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className="img">*/}
          {/*    <img src="/img/avatar.png" alt="" />*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="left-sms-wrap">*/}
          {/*  <div className="img">*/}
          {/*    <img src="/img/avatar.png" alt="" />*/}
          {/*  </div>*/}
          {/*  <div className="left-sms">*/}
          {/*    <div className="style">*/}
          {/*      Равным образом сложившаяся структура организации способствует*/}
          {/*      подготовки и реализации направлений прогрессивного развития.*/}
          {/*    </div>*/}
          {/*    <div className="time">14:30</div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="right-sms-wrap">*/}
          {/*  <div className="right-sms">*/}
          {/*    <div className="style">Сейчас отправлю детали.</div>*/}
          {/*    <div className="time">*/}
          {/*      <div className="not">*/}
          {/*        <img src="/img/chat/not.svg" alt="" />*/}
          {/*        Не доставлено*/}
          {/*      </div>*/}
          {/*      14:30*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className="img">*/}
          {/*    <img src="/img/avatar.png" alt="" />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="left-sms-wrap">*/}
          {/*  <div className="image-wrap">*/}
          {/*    <img src="/img/chat/sms-img.png" alt="" />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}

export default Messages;
