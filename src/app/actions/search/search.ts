"use server";

import { prisma } from "@/lib/prisma";

export async function ActionSearchOffer(
  value: string,
  page: number = 1,
  pageSize: number = 10,
  params: IDataSearchFilter,
) {
  try {
    const skip = (page - 1) * pageSize;

    const whereConditions: any = {
      ...(params.type && { type: params.type }),
      ...(params.vid && { vid: params.vid }),
      status: "active",
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
    };

    if (params.category && params.category.length > 0) {
      whereConditions.AND = {
        category: {
          some: {
            id: {
              in: params.category.map((cat: any) => cat.id),
            },
          },
        },
      };
    }

    if (params.price && params.price.length === 2) {
      if (!whereConditions.AND) {
        whereConditions.AND = {};
      }
      whereConditions.AND.price = {
        gte: params.price[0],
        lte: params.price[1],
      };
    }

    // --- NEW: Add filter for user's company city ---
    if (params.countryCompanyId) {
      // Create the `AND` object if it doesn't already exist
      if (!whereConditions.AND) {
        whereConditions.AND = {};
      }
      // Add the nested filter
      whereConditions.AND.user = {
        is: {
          company: {
            is: {
              city: params.countryCompanyId,
            },
          },
        },
      };
    }

    const countWhereConditions = JSON.parse(JSON.stringify(whereConditions));
    if (countWhereConditions.OR && countWhereConditions.OR[0]?.name) {
      delete countWhereConditions.OR[0].name.mode;
    }
    if (countWhereConditions.OR && countWhereConditions.OR[1]?.description) {
      delete countWhereConditions.OR[1].description.mode;
    }

    const [offers, totalCount] = await prisma.$transaction([
      prisma.offers.findMany({
        where: whereConditions,
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
        where: countWhereConditions,
      }),
    ]);

    return {
      status: "ok",
      data: offers,
      totalCount,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      totalCount: 0,
      error: error.message || "An unknown error occurred",
    };
  }
}
