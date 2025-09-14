"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionCreateOffer(offer: any) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    console.log(offer);

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
        status: "active",
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
