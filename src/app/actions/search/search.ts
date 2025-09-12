"use server";

import { prisma } from "@/lib/prisma";

export async function ActionSearchOffer(
  value: string,
  page: number = 1,
  pageSize: number = 10,
  type: OfferType | null = null,
  vid: OfferVid | null = null,
  categoriesId: number[] | null,
) {
  try {
    const skip = (page - 1) * pageSize;

    const [offers, totalOffers] = await prisma.$transaction([
      prisma.offers.findMany({
        where: {
          ...(type && { type }),
          ...(vid && { vid }),
          OR: [
            {
              name: {
                contains: value,
              },
            },
            {
              description: {
                contains: value,
              },
            },
          ],
        },
        skip,
        take: pageSize,
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
      }),
      prisma.offers.count({
        where: {
          OR: [
            {
              name: {
                contains: value,
              },
            },
            {
              description: {
                contains: value,
              },
            },
          ],
        },
      }),
    ]);

    if (categoriesId) {
      const filterCats = categoriesId.some((catId) =>
        offers
          .flatMap((offer) =>
            offer.category ? JSON.parse(offer.category) : [],
          )
          .some((cat) => cat.id === catId),
      );

      console.log(filterCats, 99999999999);
    }

    return {
      status: "ok",
      data: offers,
      totalCount: totalOffers,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      totalCount: 0,
      error: error.message || String(error),
    };
  }
}
