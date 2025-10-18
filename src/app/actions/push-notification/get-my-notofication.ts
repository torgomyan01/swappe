"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionGetMyPushNotifications() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return { status: "error", data: [], error: "Не авторизован" };
    }

    const getPushNotifications = await prisma.push_notifications.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 10,
    });

    return {
      status: "ok",
      data: getPushNotifications,
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
