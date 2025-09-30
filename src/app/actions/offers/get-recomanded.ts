"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCommandedOffers() {
  try {
    const createOffer = await prisma.offers.findMany({
      where: {
        status: "active",
      },
      take: 6,
      orderBy: {
        id: "desc",
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
