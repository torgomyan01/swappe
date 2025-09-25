"use server";

import { prisma } from "@/lib/prisma";

export async function ActionChangeStatusDealClient(
  id: number,
  status: DealStatusClient,
  clientType: "client" | "owner",
) {
  try {
    const createDeal = await prisma.deals.update({
      where: {
        id,
      },
      data: {
        ...(clientType === "client" && { status_client: status }),
        ...(clientType === "owner" && { status_owner: status }),
      },
    });

    return {
      status: "ok",
      data: createDeal,
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
