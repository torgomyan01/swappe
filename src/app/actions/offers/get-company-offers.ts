"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCompanyOffers(user_id: number) {
  try {
    const createOffer = await prisma.offers.findMany({
      where: {
        user_id,
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
