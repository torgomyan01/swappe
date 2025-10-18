"use server";

import { prisma } from "@/lib/prisma";
import { ActionUpdateUserBonus } from "../auth/update-user-bonus";

export async function ActionCreateCompanyReview(
  companyId: number,
  creater_company_id: number,
  count: number,
  review: string,
  offer_id: number,
) {
  try {
    const CreateCompanyReview = await prisma.company_reviews.create({
      data: {
        company_id: companyId,
        creater_company_id,
        count,
        review,
        created_at: new Date(),
        offer_id,
      },
    });

    await ActionUpdateUserBonus("increment", 10, "Бонус за отзыв о компании");

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
