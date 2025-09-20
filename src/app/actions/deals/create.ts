"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Data {
  offer_id: number;
  client_id: number;
  client_offer_id: number;
}

export async function ActionCreateDeals(data: Data) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const createDeal = await prisma.deals.create({
      data: {
        owner_id: session.user.id,
        owner_offer_id: data.offer_id,
        client_id: data.client_id,
        client_offer_id: data.client_offer_id,
        status: "start",
        created_at: new Date(),
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
