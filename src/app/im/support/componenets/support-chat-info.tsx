"use client";

import { addToast, Spinner } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import Messages from "@/app/im/components/messages";
import { useSession } from "next-auth/react";
import InputEmoji from "react-input-emoji";
import clsx from "clsx";
import { PhotoProvider } from "react-photo-view";
import FeedbackBlock from "@/app/im/components/feedback-block";
import { ActionGetOrCreateSupportChat } from "@/app/actions/support/get-or-create-support-chat";
import { ActionGetSupportMessages } from "@/app/actions/support/get-support-messages";
import { useSelector } from "react-redux";
import { useWebSocket } from "@/contexts/websocket-context";

function SupportChatInfo() {
  const { data: session }: any = useSession<any>();
  const {
    sendMessage: globalSendMessage,
    onMessage,
    offMessage,
    isConnected,
  } = useWebSocket();

  const company = useSelector((state: IUserStore) => state.userInfo.company);
  const [supportChatId, setSupportChatId] = useState<number | null>(null);
  const [chatInfo, setChatInfo] = useState<any | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sendLoading, setSendLoading] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const res = await ActionGetOrCreateSupportChat();
      if (res.status !== "ok") {
        addToast({
          title: "Ошибка",
          description: "Авторизуйтесь.",
          color: "danger",
        });
        return;
      }
      const scId = res.data?.id as number;
      setSupportChatId(scId);

      const uiChat: any = {
        id: scId,
        chat_name: "Чат с поддержкой",
        deal: {
          created_at: new Date(),
          owner_offer: {
            images: ["/img/chat/dialogues-big-img.png"],
            name: "Поддержка",
            price: 0,
          },
          client_offer: {
            images: ["/img/chat/dialogues-small-img.png"],
            name: "Пользователь",
            price: 0,
          },
          client: {
            company: {
              name: "Swappe Support",
              image_path: "/img/default-company.png",
            },
          },
        },
      };
      setChatInfo(uiChat);

      const m = await ActionGetSupportMessages(scId);
      if (m.status === "ok") {
        const mapped = (m.data as any[]).map((mm) => ({
          id: mm.id,
          chat_id: mm.support_chat_id,
          sender_id: mm.sender_id,
          content: mm.content,
          file_type: mm.file_type,
          file_paths: mm.file_paths,
          selected_chat_id: null,
          created_at: mm.created_at,
        })) as IMessage[];
        setMessages(mapped);
      }
    })();
  }, []);

  // Handle WebSocket messages for support chat
  useEffect(() => {
    if (!supportChatId) return;

    const handleWebSocketMessage = (data: any) => {
      if (
        data.type === "SUPPORT_MESSAGE" &&
        data.payload.support_chat_id === supportChatId
      ) {
        setSendLoading(false);
        const p = data.payload;
        const mapped: IMessage = {
          id: p.id,
          chat_id: p.support_chat_id,
          sender_id: p.sender_id,
          content: p.content,
          file_type: p.file_type,
          file_paths: p.file_paths,
          selected_chat_id: null,
          created_at: p.created_at,
        };
        setMessages((prev) => [...prev, mapped]);
      }
    };

    onMessage(handleWebSocketMessage);

    return () => {
      offMessage(handleWebSocketMessage);
    };
  }, [supportChatId, onMessage, offMessage]);

  const [text, setText] = useState("");

  const findSelectedMessage = messages.find(
    (msg) => msg.id === selectedMessage,
  );

  const sendMessage = () => {
    if (isConnected && supportChatId && chatInfo && session?.user?.id) {
      setSendLoading(true);
      setText("");

      if (text.trim()) {
        const messageData = {
          type: "NEW_SUPPORT_MESSAGE",
          support_chat_id: supportChatId,
          sender_id: session.user.id,
          content: text.trim(),
          file_type: null,
          file_paths: null,
          selected_chat_id: selectedMessage,
        } as any;
        globalSendMessage(messageData);
        setSelectedMessage(0);
      }
    }
  };

  return (
    <PhotoProvider>
      {chatInfo ? (
        <div
          className={clsx("chat-info", {
            "lg:!hidden": false,
          })}
        >
          <div className="top-info">
            <div className="top-line">
              <div className="left-inf">
                <div className="images">
                  <div className="img-b">
                    <Image
                      src="/img/support.png"
                      alt="swappe support"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="img-s">
                    <Image
                      src={`${fileHost}${company?.image_path}`}
                      alt={company?.name || "Swappe"}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="texts">
                  <b>{company?.name || "Swappe"}</b>
                  <span>Чат с поддержкой</span>
                </div>
              </div>
              <div className="right-inf">
                <div className="dots-wrap">
                  <div className="dots-icon !cursor-default">
                    <img
                      src="/img/chat/dots-menu.svg"
                      alt=""
                      className="opacity-0"
                    />
                  </div>
                </div>
                <span className="status">Онлайн</span>
              </div>
            </div>
          </div>

          <Messages
            chat={chatInfo}
            messages={messages}
            onSelectMessage={(id) => setSelectedMessage(id)}
            offersBlocks={false}
            chatType="support"
          />

          <div className="bottom-info">
            <div className="chat-dialog-wrap">
              {/* attachments disabled in support chat */}

              {selectedMessage && findSelectedMessage ? (
                <FeedbackBlock
                  message={findSelectedMessage}
                  chatInfo={chatInfo}
                  onClose={() => setSelectedMessage(0)}
                />
              ) : null}

              <form action="#" className="relative !z-[100]">
                <InputEmoji
                  value={text}
                  onChange={setText}
                  cleanOnEnter
                  onEnter={sendMessage}
                  placeholder="Напиши сообщение..."
                  shouldReturn
                  shouldConvertEmojiToImage={false}
                />
                <button
                  className="smile !bottom-[12px] !right-[60px] !cursor-pointer relative z-10"
                  type="button"
                  disabled={sendLoading}
                  onClick={sendMessage}
                >
                  {sendLoading ? (
                    <Spinner
                      color="secondary"
                      size="sm"
                      className="relative top-1"
                    />
                  ) : (
                    <i className="fa-solid fa-paper-plane text-green"></i>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[70dvh] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </PhotoProvider>
  );
}

export default SupportChatInfo;
