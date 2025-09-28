"use server";

import { prisma } from "@/lib/prisma";

export async function ActionCreateCompanyReview(
  companyId: number,
  count: number,
  review: string,
) {
  try {
    const CreateCompanyReview = await prisma.company_reviews.create({
      data: {
        company_id: companyId,
        count,
        review,
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
