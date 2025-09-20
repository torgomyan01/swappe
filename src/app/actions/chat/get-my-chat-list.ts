"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetMyChatList() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const chats = await prisma.chats.findMany({
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
      include: {
        deal: {
          include: {
            owner_offer: true,
            owner: {
              select: {
                email: true,
                id: true,
                name: true,
                company: true,
              },
            },
            client: {
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
      data: chats,
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
