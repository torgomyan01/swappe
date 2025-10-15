"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionArchiveMe() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return { status: "error" as const, data: [], error: "logout" };
    }

    const updated = await prisma.users.update({
      where: { id: session.user.id },
      data: { status: "archive" },
    });

    return { status: "ok" as const, data: updated, error: "" };
  } catch (e: any) {
    return {
      status: "error" as const,
      data: [],
      error: e?.message || "Не удалось архивировать аккаунт",
    };
  }
}
