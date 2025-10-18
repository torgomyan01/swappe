"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCreatePushNotification(
  user_id: number,
  title: string,
  type: PushNotificationType,
  description: string,
  link: string,
  body: object,
) {
  try {
    if (!user_id) {
      return { status: "error", data: [], error: "user_id is required" };
    }

    const createPushNotification = await prisma.push_notifications.create({
      data: {
        user_id: user_id,
        title: title,
        type: type,
        description: description,
        link: link,
        body: body,
        opened: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      status: "ok",
      data: createPushNotification,
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
