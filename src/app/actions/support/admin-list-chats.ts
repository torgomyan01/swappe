"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionAdminListSupportChats() {
  const session: any = await getServerSession(authOptions);
  if (!session) return { status: "error", data: [], error: "logout" };

  const roles = session.user?.role || session.user?.roles || [];
  const isAdmin = Array.isArray(roles)
    ? roles.includes("admin")
    : roles === "admin";
  if (!isAdmin) return { status: "error", data: [], error: "forbidden" };

  const chats = await prisma.support_chats.findMany({
    orderBy: { id: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      messages: {
        orderBy: { id: "desc" },
        take: 1,
      },
    },
  });

  // Calculate unread_count for each chat (messages from user that came after last admin response)
  const chatsWithUnreadCount = await Promise.all(
    chats.map(async (chat) => {
      // Get the last message from admin (if any)
      const lastAdminMessage = await prisma.support_messages.findFirst({
        where: {
          support_chat_id: chat.id,
          NOT: {
            sender_id: chat.user_id, // Messages from admin (not from user)
          },
        },
        orderBy: { id: "desc" },
      });

      // Count messages from user that came after the last admin message
      // If there's no admin message, count all user messages
      const unreadCount = await prisma.support_messages.count({
        where: {
          support_chat_id: chat.id,
          sender_id: chat.user_id, // Messages from the user
          ...(lastAdminMessage
            ? {
                id: {
                  gt: lastAdminMessage.id, // After last admin message
                },
              }
            : {}),
        },
      });

      return {
        ...chat,
        unread_count: unreadCount,
      };
    }),
  );

  return { status: "ok", data: chatsWithUnreadCount, error: null };
}

export async function ActionAdminGetSupportChat(chatId: number) {
  const session: any = await getServerSession(authOptions);
  if (!session) return { status: "error", data: null, error: "logout" };

  const roles = session.user?.role || session.user?.roles || [];
  const isAdmin = Array.isArray(roles)
    ? roles.includes("admin")
    : roles === "admin";
  if (!isAdmin) return { status: "error", data: null, error: "forbidden" };

  const chat = await prisma.support_chats.findUnique({
    where: { id: chatId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!chat) return { status: "error", data: null, error: "not_found" };

  const messages = await prisma.support_messages.findMany({
    where: { support_chat_id: chatId },
    orderBy: { id: "asc" },
  });

  return { status: "ok", data: { chat, messages }, error: null };
}
