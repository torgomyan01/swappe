import moment from "moment";
import "moment/locale/ru";
import MessagesStartHero from "@/app/im/components/messages-start-hero";
import MyMessage from "@/app/im/components/my-message";
import { useSession } from "next-auth/react";
import ClientMessage from "@/app/im/components/client-message";
import { useEffect, useRef } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider } from "react-photo-view";

moment().locale("ru");

interface IThisProps {
  chat: IChatItems;
  messages: IMessage[];
}

function Messages({ chat, messages }: IThisProps) {
  const { data: session }: any = useSession<any>();

  const messagesEndRef: any = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <PhotoProvider>
      <div className="middle-info">
        <div className="scroll-info">
          {/* ref-ը հեռացրել ենք այստեղից */}
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
                <MyMessage
                  key={`my-message--${message.id}`}
                  message={message}
                  info={chat}
                />
              ) : (
                <ClientMessage
                  key={`my-message--${message.id}`}
                  message={message}
                  info={chat}
                />
              ),
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </PhotoProvider>
  );
}

export default Messages;
