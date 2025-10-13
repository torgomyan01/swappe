"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetOrCreateSupportChat() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return { status: "error", data: null, error: "logout" };
    }

    // find existing chat
    let chat = await prisma.support_chats.findFirst({
      where: { user_id: session.user.id },
      select: { id: true, user_id: true, created_at: true },
    });

    if (!chat) {
      chat = await prisma.support_chats.create({
        data: { user_id: session.user.id },
        select: { id: true, user_id: true, created_at: true },
      });
    }

    return { status: "ok", data: chat, error: null };
  } catch (error: any) {
    return { status: "error", data: null, error: error?.message || "error" };
  }
}
