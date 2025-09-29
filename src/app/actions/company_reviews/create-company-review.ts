"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCreateCompanyReview(
  companyId: number,
  count: number,
  review: string,
  offer_id: number,
) {
  try {
    const CreateCompanyReview = await prisma.company_reviews.create({
      data: {
        company_id: companyId,
        count,
        review,
        created_at: new Date(),
        offer_id,
      },
    });

    return {
      status: "ok",
      data: CreateCompanyReview,
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
