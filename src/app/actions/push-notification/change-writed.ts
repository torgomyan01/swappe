"use server";

import { prisma } from "@/lib/prisma";

export async function ActionChangeWritedPushNotification(ids: number[]) {
  try {
    const getPushNotifications = await prisma.push_notifications.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        opened: true,
        updated_at: new Date(),
      },
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
