"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner, Avatar, Button, Input } from "@heroui/react";
import { ActionAdminGetSupportChat } from "@/app/actions/support/admin-list-chats";
import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/contexts/websocket-context";

export default function AdminSupportChatPage() {
  const { id }: any = useParams();
  const chatId = Number(id);
  const { data: session }: any = useSession();
  const {
    sendMessage: globalSendMessage,
    onMessage,
    offMessage,
    isConnected,
  } = useWebSocket();
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useState<HTMLDivElement | null>(null)[0];
  const [messagesContainer, setMessagesContainer] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const res = await ActionAdminGetSupportChat(chatId);
      if (res.status === "ok") {
        setChat(res.data?.chat);
        setMessages(res.data?.messages || []);
      }
      setLoading(false);
    })();
  }, [chatId]);

  // Handle WebSocket messages for admin support chat
  useEffect(() => {
    if (!chatId) return;

    const handleWebSocketMessage = (data: any) => {
      if (
        data.type === "SUPPORT_MESSAGE" &&
        data.payload.support_chat_id === chatId
      ) {
        setSending(false);
        setMessages((prev) => [...prev, data.payload as any]);
      }
    };

    onMessage(handleWebSocketMessage);

    return () => {
      offMessage(handleWebSocketMessage);
    };
  }, [chatId, onMessage, offMessage]);

  const send = () => {
    if (!isConnected) return;
    if (!text.trim() || !chatId || !session?.user?.id) return;
    setSending(true);
    globalSendMessage({
      type: "NEW_SUPPORT_MESSAGE",
      support_chat_id: chatId,
      sender_id: session.user.id,
      content: text.trim(),
      file_type: null,
      file_paths: null,
    });
    setText("");
  };

  // Autoscroll to bottom when new messages arrive or when loading is complete
  useEffect(() => {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages, loading, messagesContainer]);

  if (loading) {
    return (
      <AdminMainTemplate pathname={`/${SITE_URL.ADMIN}`}>
        <div className="w-full h-[60dvh] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      </AdminMainTemplate>
    );
  }

  return (
    <AdminMainTemplate pathname={`/${SITE_URL.ADMIN}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Avatar
              name={(chat?.user_id && `#${chat.user_id}`) || "User"}
              className="bg-default-200 text-default-700"
              size="sm"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold truncate">
              Чат с пользователем #{chat?.user_id}
            </h1>
            <div className="text-xs text-default-500 flex items-center gap-2">
              <span className={isConnected ? "text-success" : "text-danger"}>
                {isConnected ? "Онлайн" : "Офлайн"}
              </span>
              <span>•</span>
              <span>{messages.length} сообщений</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-default-50 flex items-center justify-between">
            <div className="text-sm text-default-600">
              Поддержка ↔ Пользователь #{chat?.user_id}
            </div>
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              isDisabled={!isConnected}
            >
              {isConnected ? "Подключено" : "Отключено"}
            </Button>
          </div>

          {/* Messages */}
          <div
            ref={setMessagesContainer}
            className="p-4 space-y-3 max-h-[65dvh] min-h-[45dvh] overflow-y-auto bg-gradient-to-b from-white to-default-50"
          >
            {messages.length === 0 && (
              <div className="text-center text-default-400 text-sm py-12">
                Здесь появится история сообщений
              </div>
            )}
            {messages.map((m) => {
              const isUser = m.sender_id === chat?.user_id;
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isUser ? "justify-start" : "justify-end"}`}
                >
                  {isUser && (
                    <Avatar
                      size="sm"
                      className="bg-default-200 text-default-700"
                      name="U"
                    />
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isUser
                        ? "bg-default-100 text-foreground rounded-tl-none"
                        : "bg-success-100 text-success-900 rounded-tr-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  </div>
                  {!isUser && (
                    <Avatar
                      size="sm"
                      className="bg-success-600 text-white"
                      name="A"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef as any} />
          </div>

          {/* Composer */}
          <div className="p-3 border-t bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <Input
                className="flex-1"
                radius="lg"
                variant="bordered"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напишите ответ..."
                onKeyDown={(e: any) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <Button
                color="success"
                radius="lg"
                type="submit"
                isDisabled={sending || !text.trim()}
                className="min-w-[44px]"
              >
                {sending ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <i className="fa-solid fa-paper-plane" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AdminMainTemplate>
  );
}
