import moment from "moment";
import "moment/locale/ru";
import MessagesStartHero from "@/app/im/components/messages-start-hero";
import MyMessage from "@/app/im/components/my-message";
import { useSession } from "next-auth/react";
import ClientMessage from "@/app/im/components/client-message";
import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
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

const Messages = memo(function Messages({
  chat,
  messages,
  onSelectMessage,
  offersBlocks = true,
  chatType = "deal",
}: IThisProps) {
  const { data: session }: any = useSession<any>();

  const [sortMessages, setSortMessages] = useState<IGroupedMessages[]>([]);

  const messagesEndRef: any = useRef(null);

  // Memoize the sorted messages to prevent unnecessary recalculations
  const sortedMessages = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  useEffect(() => {
    setSortMessages(sortedMessages);
  }, [sortedMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView();
      }, 1000);
    }
  }, [sortMessages]);

  // Memoize the offers block to prevent unnecessary re-renders
  const offersBlock = useMemo(() => {
    if (!offersBlocks) return null;

    return (
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
    );
  }, [offersBlocks, chat]);

  // Memoize message rendering to prevent unnecessary re-renders
  const renderMessage = useCallback(
    (message: IMessage) => {
      return message.sender_id === session?.user.id ? (
        <MyMessage
          key={`my-message--${message.id}`}
          message={message}
          info={chat}
          onSelectMessage={onSelectMessage}
        />
      ) : (
        <ClientMessage
          key={`client-message--${message.id}`}
          message={message}
          info={chat}
          onSelectMessage={onSelectMessage}
          chatType={chatType}
        />
      );
    },
    [session?.user.id, chat, onSelectMessage, chatType],
  );

  return (
    <div className="middle-info">
      <div className="scroll-info">
        {offersBlock}
        <div className="sms-wrap">
          {sortMessages.map((messageGroup) => (
            <div key={messageGroup.date}>
              <div className="status-text">
                {moment(messageGroup.date).format("ll")}
              </div>

              {messageGroup.messages.map(renderMessage)}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
});

export default Messages;
