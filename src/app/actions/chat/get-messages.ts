"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetMessages(chat_id: number) {
  try {
    const messages = await prisma.messages.findMany({
      where: {
        chat_id,
      },
    });

    return {
      status: "ok",
      data: messages,
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
