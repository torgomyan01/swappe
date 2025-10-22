"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionGetMyInvatingUsers() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const user = await prisma.users.findMany({
      where: {
        inviting_user_id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        company: {
          select: {
            name: true,
            image_path: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      status: "ok",
      data: user,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}
