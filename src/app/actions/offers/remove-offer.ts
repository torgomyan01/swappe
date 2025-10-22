"use server";

import { prisma } from "@/lib/prisma";

export async function ActionRemoveOffer(id: number) {
  try {
    const getOffer = await prisma.offers.findFirst({
      where: {
        id,
      },
    });

    if (!getOffer) {
      return { status: "error", data: {}, error: "Предложение не найдено" };
    }

    const getDeals = await prisma.deals.findMany({
      where: {
        OR: [{ owner_offer_id: id }, { client_offer_id: id }],
      },
    });

    if (getDeals.length) {
      return {
        status: "error",
        data: {},
        error:
          "Нельзя удалить предложение: существуют связанные сделки. Переведите в архив или удалите сделки.",
      };
    }

    const removeOffer = await prisma.offers.delete({
      where: {
        id,
      },
    });

    return {
      status: "ok",
      data: removeOffer,
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
