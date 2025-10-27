"use client";

import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { ActionGetMessages } from "@/app/actions/chat/get-messages";
import { ActionMarkMessagesAsRead } from "@/app/actions/chat/mark-messages-read";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { PhotoProvider } from "react-photo-view";
import FeedbackBlock from "@/app/im/components/feedback-block";
import { useDispatch, useSelector } from "react-redux";
import { UpdateChatInfo } from "@/utils/helpers";
import Messages from "@/app/im/components/messages";
import ChatHeader from "@/app/im/components/chat-header";
import MessageInput from "@/app/im/components/message-input";
import { useWebSocket } from "@/contexts/websocket-context";

const ChatInfo = memo(function ChatInfo() {
  const dispatch: any = useDispatch();
  const { id }: { id: string } = useParams();
  const { data: session }: any = useSession<any>();
  const chatInfo = useSelector((state: IUserStore) => state.userInfo.chatInfo);
  const { sendMessage, onMessage, offMessage, isConnected } = useWebSocket();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number>(0);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null,
  );

  // Memoized callback for getting old messages
  const getOldMessages = useCallback(() => {
    if (id) {
      ActionGetMessages(+id).then(({ data }) => {
        setMessages(data as IMessage[]);
        // Mark messages as read when chat is opened
        ActionMarkMessagesAsRead(+id);
      });
    }
  }, [id]);

  // Memoized callback for sending messages
  const handleSendMessage = useCallback(
    (messageData: any) => {
      if (isConnected && id && chatInfo && session?.user?.id) {
        setSendLoading(true);

        const fullMessageData = {
          ...messageData,
          type: "NEW_MESSAGE",
          chat_id: +id,
          sender_id: session.user.id,
        };

        sendMessage(fullMessageData);
      }
    },
    [isConnected, id, chatInfo, session?.user.id, sendMessage],
  );

  // Memoized callback for selecting messages
  const handleSelectMessage = useCallback((messageId: number) => {
    setSelectedMessage(messageId);
  }, []);

  // Memoized callback for closing selected message
  const handleCloseSelectedMessage = useCallback(() => {
    setSelectedMessage(0);
  }, []);

  // Find selected message
  const findSelectedMessage = useMemo(() => {
    return messages.find((msg) => msg.id === selectedMessage);
  }, [messages, selectedMessage]);

  // Initialize chat info
  useEffect(() => {
    if (id) {
      dispatch(UpdateChatInfo(id));
    }
  }, [id, dispatch]);

  // Initialize messages and WebSocket message handling
  useEffect(() => {
    getOldMessages();
  }, [id, getOldMessages]);

  // Handle WebSocket messages
  useEffect(() => {
    const handleWebSocketMessage = (data: any) => {
      if (data.type === "MESSAGE") {
        if (id && data.payload.chat_id === +id) {
          setSendLoading(false);
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(
              (msg) => msg.id === data.payload.id,
            );
            if (messageExists) {
              return prev;
            }
            return [...prev, data.payload];
          });
        }
      }

      // Handle subscription required error
      if (data.type === "SUBSCRIPTION_REQUIRED") {
        setSendLoading(false);
        setSubscriptionError(
          data.message ||
            "Для отправки сообщений необходимо активировать тарифный план",
        );
        setTimeout(() => setSubscriptionError(null), 5000);
      }
    };

    onMessage(handleWebSocketMessage);

    return () => {
      offMessage(handleWebSocketMessage);
    };
  }, [id, onMessage, offMessage]);

  return (
    <PhotoProvider>
      {id ? (
        chatInfo ? (
          <div
            className={clsx("chat-info", {
              "lg:!hidden": !id,
            })}
          >
            <ChatHeader chatInfo={chatInfo} />

            <Messages
              chat={chatInfo}
              messages={messages}
              onSelectMessage={handleSelectMessage}
            />

            {selectedMessage && findSelectedMessage ? (
              <FeedbackBlock
                message={findSelectedMessage}
                chatInfo={chatInfo}
                onClose={handleCloseSelectedMessage}
              />
            ) : null}

            <MessageInput
              onSendMessage={handleSendMessage}
              sendLoading={sendLoading}
              selectedMessage={selectedMessage}
              onSelectMessage={handleSelectMessage}
              subscriptionError={subscriptionError}
            />
          </div>
        ) : (
          <div className="w-full h-[70dvh] flex-jc-c">
            <Spinner color="secondary" />
          </div>
        )
      ) : (
        <div
          className={clsx("chat-info !h-[60dvh] !flex-jc-c opacity-50", {
            "max-lg:!hidden": !id,
          })}
        >
          Выбирайте чат пожалуйста
        </div>
      )}
    </PhotoProvider>
  );
});

export default ChatInfo;
