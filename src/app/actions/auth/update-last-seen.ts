"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionUpdateLastSeen() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    await prisma.users.update({
      where: { id: session.user.id },
      data: {
        last_seen: new Date(),
      },
    });

    return {
      status: "ok",
      data: [],
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
