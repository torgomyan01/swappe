"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionMarkMessagesAsRead(chat_id: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    // Update user's last_seen timestamp to mark messages as read
    // This approach uses the last_seen field to determine unread messages
    await prisma.users.update({
      where: { id: session.user.id },
      data: {
        last_seen: new Date(),
      },
    });

    return {
      status: "ok",
      data: [],
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: error.message || String(error),
    };
  }
}
