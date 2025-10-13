"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetSupportMessages(chatId: number) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const messages = await prisma.support_messages.findMany({
      where: { support_chat_id: chatId },
      orderBy: { id: "asc" },
    });

    return { status: "ok", data: messages, error: null };
  } catch (error: any) {
    return { status: "error", data: [], error: error?.message || "error" };
  }
}
