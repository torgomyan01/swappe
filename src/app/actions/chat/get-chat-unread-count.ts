"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetChatUnreadCount(chat_id: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: 0, error: "logout" };
    }

    // Get user's last_seen timestamp
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { last_seen: true },
    });

    // Count unread messages in this specific chat
    const unreadCount = await prisma.messages.count({
      where: {
        chat_id: chat_id,
        NOT: {
          sender_id: session.user.id, // Not from current user
        },
        created_at: {
          gt: user?.last_seen || new Date(0), // Created after last seen
        },
      },
    });

    return {
      status: "ok",
      data: unreadCount,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: 0,
      error: error.message || String(error),
    };
  }
}
