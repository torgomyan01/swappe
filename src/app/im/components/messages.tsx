import moment from "moment";
import "moment/locale/ru";
import MessagesStartHero from "@/app/im/components/messages-start-hero";
import MyMessage from "@/app/im/components/my-message";
import { useSession } from "next-auth/react";
import ClientMessage from "@/app/im/components/client-message";
import { useEffect, useRef, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { groupMessagesByDate } from "@/utils/helpers";

moment().locale("ru");

interface IThisProps {
  chat: IChatItems;
  messages: IMessage[];
  onSelectMessage: (messageId: number) => void;
  offersBlocks?: boolean;
  chatType?: "support" | "deal";
}

function Messages({
  chat,
  messages,
  onSelectMessage,
  offersBlocks = true,
  chatType = "deal",
}: IThisProps) {
  const { data: session }: any = useSession<any>();

  const [sortMessages, setSortMessages] = useState<IGroupedMessages[]>([]);

  const messagesEndRef: any = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView();
      }, 1000);
    }

    const sorted = groupMessagesByDate(messages);

    setSortMessages(sorted);
  }, [messages]);

  return (
    <div className="middle-info">
      <div className="scroll-info">
        {offersBlocks && (
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
        )}
        <div className="sms-wrap">
          {sortMessages.map((message) => (
            <>
              <div className="status-text">
                {moment(message.date).format("ll")}
              </div>

              {message.messages.map((message) =>
                message.sender_id === session?.user.id ? (
                  <MyMessage
                    key={`my-message--${message.id}`}
                    message={message}
                    info={chat}
                    onSelectMessage={onSelectMessage}
                  />
                ) : (
                  <ClientMessage
                    key={`my-message--${message.id}`}
                    message={message}
                    info={chat}
                    onSelectMessage={onSelectMessage}
                    chatType={chatType}
                  />
                ),
              )}
            </>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export default Messages;
