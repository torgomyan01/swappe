"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetDeals(
  userId: number,
  statusOwner: DealStatusClient[] = [],
  statusClient: DealStatusOwner[] = [],
) {
  try {
    const _statusOwn = statusOwner.map((status) => {
      return { statue_owner: status };
    });
    const _statusClient = statusClient.map((status) => {
      return { status_client: status };
    });

    const data = await prisma.deals.findMany({
      where: {
        owner_id: userId,
        OR: [..._statusOwn, ..._statusClient],
      },
      include: {
        owner_offer: true,
        client_offer: true,
        client: {
          select: {
            email: true,
            id: true,
            name: true,
            company: {
              include: {
                reviews: {
                  select: {
                    count: true,
                  },
                },
              },
            },
          },
        },
        owner: {
          select: {
            email: true,
            id: true,
            name: true,
            company: {
              include: {
                reviews: {
                  select: {
                    count: true,
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
      data,
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
