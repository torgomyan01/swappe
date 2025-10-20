"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ActionUpdateUserBonus } from "../auth/update-user-bonus";

export async function ActionCreateOffer(offer: any) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const getOffers = await prisma.offers.findMany({
      where: {
        user_id: session.user.id,
      },
    });

    if (!getOffers.length) {
      await ActionUpdateUserBonus(
        "increment",
        50,
        "Бонус за создание первого предложения",
      );
    }

    const createOffer = await prisma.offers.create({
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
        user_id: session.user.id,
        status: "moderation",
      },
    });

    return {
      status: "ok",
      data: createOffer,
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
