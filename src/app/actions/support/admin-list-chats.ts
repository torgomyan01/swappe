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

  return { status: "ok", data: chats, error: null };
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
