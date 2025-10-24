"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetUnreadMessageCount() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: 0, error: "logout" };
    }

    // Get all chats where the user is either owner or client
    const userChats = await prisma.chats.findMany({
      where: {
        OR: [
          {
            deal: {
              client_id: session.user.id,
            },
          },
          {
            deal: {
              owner_id: session.user.id,
            },
          },
        ],
      },
      select: {
        id: true,
        deal: {
          select: {
            client_id: true,
            owner_id: true,
          },
        },
      },
    });

    // Get unread messages count for each chat
    let totalUnreadCount = 0;

    for (const chat of userChats) {
      // Count messages where:
      // - The message is not from the current user
      // - The message was created after the user's last_seen timestamp
      const user = await prisma.users.findUnique({
        where: { id: session.user.id },
        select: { last_seen: true },
      });

      const unreadCount = await prisma.messages.count({
        where: {
          chat_id: chat.id,
          NOT: {
            sender_id: session.user.id, // Not from current user
          },
          created_at: {
            gt: user?.last_seen || new Date(0), // Created after last seen
          },
        },
      });

      totalUnreadCount += unreadCount;
    }

    return {
      status: "ok",
      data: totalUnreadCount,
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
