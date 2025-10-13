"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ActionCheckUserTarifStatus } from "../payment/check-user-tarif-status";

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

    const checkUserTarifStatus = await ActionCheckUserTarifStatus();

    if (!checkUserTarifStatus.data) {
      return {
        status: "error",
        data: [],
        error: "Ваш тариф пока не хватает для создания сделки",
      };
    }

    const getUsersDeals = await prisma.deals.findMany({
      where: {
        owner_id: session.user.id,
      },
    });

    if (checkUserTarifStatus.tariff === "basic") {
      if (getUsersDeals.length >= 2) {
        return {
          status: "error",
          data: [],
          error:
            "Вы достигли максимального количества сделок для вашего тарифа",
        };
      }
    }

    if (checkUserTarifStatus.tariff === "advanced") {
      if (getUsersDeals.length >= 5) {
        return {
          status: "error",
          data: [],
          error:
            "Вы достигли максимального количества сделок для вашего тарифа",
        };
      }
    }

    const createDeal = await prisma.deals.create({
      data: {
        owner_id: session.user.id,
        owner_offer_id: data.offer_id,
        client_id: data.client_id,
        client_offer_id: data.client_offer_id,
        status_client: "wait-confirm",
        statue_owner: "wait-confirm",
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
