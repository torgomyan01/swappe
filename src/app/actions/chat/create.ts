"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionCreateChat(chat_name: string, deal_id: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const createChat = await prisma.chats.create({
      data: {
        chat_name,
        deal_id,
        user_id: session.user.id,
      },
    });

    return {
      status: "ok",
      data: createChat,
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
