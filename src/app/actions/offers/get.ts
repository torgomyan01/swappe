"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionMyOffers(status: OfferStatus) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const createOffer = await prisma.offers.findMany({
      where: {
        user_id: session.user.id,
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
