"use client";

import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { ActionGetMessages } from "@/app/actions/chat/get-messages";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { PhotoProvider } from "react-photo-view";
import FeedbackBlock from "@/app/im/components/feedback-block";
import { useDispatch, useSelector } from "react-redux";
import { UpdateChatInfo } from "@/utils/helpers";
import Messages from "@/app/im/components/messages";
import ChatHeader from "@/app/im/components/chat-header";
import MessageInput from "@/app/im/components/message-input";

const ChatInfo = memo(function ChatInfo() {
  const dispatch: any = useDispatch();
  const { id }: { id: string } = useParams();
  const { data: session }: any = useSession<any>();
  const chatInfo = useSelector((state: IUserStore) => state.userInfo.chatInfo);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number>(0);

  // Memoized callback for getting old messages
  const getOldMessages = useCallback(() => {
    if (id) {
      ActionGetMessages(+id).then(({ data }) => {
        setMessages(data as IMessage[]);
      });
    }
  }, [id]);

  // Memoized callback for sending messages
  const handleSendMessage = useCallback(
    (messageData: any) => {
      if (ws && ws.readyState === WebSocket.OPEN && id && chatInfo) {
        setSendLoading(true);

        const fullMessageData = {
          ...messageData,
          chat_id: +id,
          sender_id: session.user.id,
        };

        ws.send(JSON.stringify(fullMessageData));
      }
    },
    [ws, id, chatInfo, session?.user.id],
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

  // Initialize WebSocket and get messages
  useEffect(() => {
    getOldMessages();

    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://${window.location.host}/ws`
        : "ws://localhost:3004";

    const wsClient = new WebSocket(wsUrl);

    wsClient.onopen = () => console.log("Connected to WebSocket server");

    wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "MESSAGE") {
        if (id && data.payload.chat_id === +id) {
          setSendLoading(false);
          setMessages((prev) => [...prev, data.payload]);
        }
      }
    };

    wsClient.onclose = () => console.log("Disconnected from WebSocket server");
    wsClient.onerror = (error) => console.error("WebSocket error:", error);

    setWs(wsClient);

    return () => {
      if (wsClient) {
        wsClient.close();
      }
    };
  }, [id, getOldMessages]);

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
