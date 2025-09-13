"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCRemoveUserFavorites(favoriteId: number) {
  try {
    const query = await prisma.user_favorites.delete({
      where: {
        id: favoriteId,
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
