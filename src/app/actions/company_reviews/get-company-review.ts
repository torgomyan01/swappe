"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetCompanyReview(company_id: number) {
  try {
    const getCompany = await prisma.company_reviews.findMany({
      where: {
        company_id,
        status: "approved",
      },
    });

    return {
      status: "ok",
      data: getCompany,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}
