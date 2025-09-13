"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionCreateUSerFavorites(offerId: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const query = await prisma.user_favorites.create({
      data: {
        user_id: session.user.id,
        offer_id: offerId,
      },
    });

    return {
      status: "ok",
      data: query,
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
