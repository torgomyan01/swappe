"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetChatInfo(id: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const createChat = await prisma.chats.findUnique({
      where: {
        id,
      },
      include: {
        deal: {
          include: {
            owner_offer: true,
            client_offer: true,
            client: {
              select: {
                email: true,
                id: true,
                name: true,
                company: true,
              },
            },
            owner: {
              select: {
                email: true,
                id: true,
                name: true,
                company: true,
              },
            },
          },
        },
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
      data: {},
      error: error.message || String(error),
    };
  }
}
