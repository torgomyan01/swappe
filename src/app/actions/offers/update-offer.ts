"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionUpdateOffer(offer: any) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    // Check if the offer belongs to the current user
    const existingOffer = await prisma.offers.findFirst({
      where: {
        id: offer.id,
        user_id: session.user.id,
      },
    });

    if (!existingOffer) {
      return {
        status: "error",
        data: [],
        error:
          "Предложение не найдено или у вас нет прав на его редактирование",
      };
    }

    const updateOffer = await prisma.offers.update({
      where: {
        id: offer.id,
      },
      data: {
        name: offer.name,
        type: offer.type,
        vid: offer.vid,
        category: offer.category,
        price: +offer.price,
        coordinates: offer.coordinates,
        description: offer.description,
        images: offer.images,
        videos: offer.videos,
        status: "moderation", // Reset to moderation when updated
      },
    });

    return {
      status: "ok",
      data: updateOffer,
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
