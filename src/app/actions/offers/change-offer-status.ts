"use server";

import { prisma } from "@/lib/prisma";

export async function ActionChangeOfferStatus(
  offerIds: number[],
  status: OfferStatus,
) {
  try {
    for (const offerId of offerIds) {
      await prisma.offers.update({
        where: {
          id: offerId,
        },
        data: {
          status,
        },
      });
    }

    return {
      status: "ok",
      data: {},
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
