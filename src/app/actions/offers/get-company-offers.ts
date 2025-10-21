"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCompanyOffers(
  user_id: number,
  status: OfferStatus,
) {
  try {
    const createOffer = await prisma.offers.findMany({
      where: {
        user_id,
        status,
      },
      include: {
        user: {
          select: {
            email: true,
            id: true,
            name: true,
            company: {
              include: {
                reviews: {
                  include: {
                    creater_company: true,
                  },
                },
              },
            },
          },
        },
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
