"use server";

import { prisma } from "@/lib/prisma";

export async function ActionSingleOffer(id: number) {
  try {
    const createOffer = await prisma.offers.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            email: true,
            id: true,
            name: true,
            company: true,
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
      data: {},
      error: error.message || String(error),
    };
  }
}
