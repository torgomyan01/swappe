"use client";

import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionGetChatInfo } from "@/app/actions/chat/get-chat-info";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import PrintDealStatus from "@/app/im/components/print-deal-status";
import Messages from "@/app/im/components/messages";
import { ActionGetMessages } from "@/app/actions/chat/get-messages";
import { useSession } from "next-auth/react";

function ChatInfo() {
  const { id } = useParams();
  const { data: session }: any = useSession<any>();
  const [chatInfo, setChatInfo] = useState<IChatItems | null>(null);

  useEffect(() => {
    if (id) {
      ActionGetChatInfo(+id).then(({ data }) => {
        setChatInfo(data as IChatItems);
      });
    }
  }, [id]);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<any>(null);

  function GetOldMessages() {
    if (id) {
      ActionGetMessages(+id).then(({ data }) => {
        setMessages(data as IMessage[]);
      });
    }
  }

  useEffect(() => {
    GetOldMessages();

    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://${window.location.host}`
        : "ws://localhost:3004";

    console.log(wsUrl);

    const wsClient: any = new WebSocket(wsUrl);

    wsClient.onopen = () => console.log("Connected to WebSocket server");

    wsClient.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.type === "MESSAGE") {
        if (id && data.payload.chat_id === +id) {
          setMessages((prev) => [...prev, data.payload]);
        }
      }
    };

    wsClient.onclose = () => console.log("Disconnected from WebSocket server");
    wsClient.onerror = (error: any) => console.error("WebSocket error:", error);

    setWs(wsClient);

    return () => {
      if (wsClient) {
        wsClient.close();
      }
    };
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (input && ws && ws.readyState === WebSocket.OPEN && id && chatInfo) {
      const messageData = {
        type: "NEW_MESSAGE",
        chat_id: +id,
        sender_id: session.user.id,
        content: input,
        file_type: null,
        file_paths: null,
        selected_chat_id: null,
      };
      ws.send(JSON.stringify(messageData));
      setInput("");
    }
  };

  return (
    <>
      {chatInfo ? (
        <div className="chat-info">
          <div className="top-info">
            <div className="top-line">
              <div className="left-inf">
                <div className="images">
                  <div className="img-b">
                    <Image
                      src={`${fileHost}${chatInfo.deal.client_offer.images[0]}`}
                      alt={chatInfo.deal.client.company.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="img-s">
                    <Image
                      src={`${fileHost}${chatInfo.deal.client.company.image_path}`}
                      alt={chatInfo.deal.client.company.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="texts">
                  <b>{chatInfo?.deal.client.company.name}</b>
                  <span>Имя менеджера</span>
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
                <span className="status">В сети 2 дня назад</span>
              </div>
            </div>

            <PrintDealStatus chat={chatInfo} />
          </div>

          <Messages chat={chatInfo} messages={messages} />

          <div className="bottom-info">
            <button className="plus" type="button">
              <img src="/img/chat/plus-white.svg" alt="" />
            </button>
            <div className="chat-dialog-wrap">
              {/*<div className="answer">*/}
              {/*  <img src="/img/chat/forward.svg" alt="" className="back" />*/}
              {/*  <div className="img-wrapper">*/}
              {/*    <img src="/img/chat/answer-img.png" alt="" />*/}
              {/*  </div>*/}
              {/*  <div className="texts">*/}
              {/*    <span className="green">Ответ Diamond Кейтеринг</span>*/}
              {/*    <span className="black">*/}
              {/*      Задача организации, в особенности же постоянное*/}
              {/*      информационно...{" "}*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*  <button className="close" type="button">*/}
              {/*    <img src="/img/close-grey.svg" alt="" />*/}
              {/*  </button>*/}
              {/*</div>*/}
              <form action="#" onSubmit={sendMessage}>
                <input
                  className="w-full resize-none"
                  placeholder="Начни диалог"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </form>
              <button className="smile !right-14 !bottom-[14px]" type="button">
                <img src="/img/chat/happy.svg" alt="" />
              </button>
              <button className="smile !bottom-[11px] !right-6" type="button">
                <i className="fa-solid fa-paper-plane"></i>
              </button>

              {/*<Tooltip content={<EmojiPicker />}>*/}
              {/*</Tooltip>*/}

              {/*<Dropdown>*/}
              {/*  <DropdownTrigger>*/}
              {/*    <button className="smile" type="button">*/}
              {/*      <img src="/img/chat/happy.svg" alt="" />*/}
              {/*    </button>*/}
              {/*  </DropdownTrigger>*/}
              {/*  <DropdownMenu aria-label="smals">*/}
              {/*    <DropdownItem key="smals">*/}
              {/*      <EmojiPicker />*/}
              {/*    </DropdownItem>*/}
              {/*  </DropdownMenu>*/}
              {/*</Dropdown>*/}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[70dvh] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </>
  );
}

export default ChatInfo;
