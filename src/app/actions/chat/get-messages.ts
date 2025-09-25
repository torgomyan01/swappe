"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetMessages(chat_id: number) {
  try {
    const messages = await prisma.messages.findMany({
      where: {
        chat_id,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 15,
    });

    const reversedMessages = messages.reverse();

    return {
      status: "ok",
      data: reversedMessages,
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
