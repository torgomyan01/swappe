"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetUserFavorites() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const allIndustry = await prisma.user_favorites.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        offers: true, // This includes the related offer data
      },
    });

    return {
      status: "ok",
      data: allIndustry,
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
