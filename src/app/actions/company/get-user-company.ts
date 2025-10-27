"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { calcReviews } from "@/utils/helpers";

export async function ActionCGetUserCompany() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const existingCompany = await prisma.user_company.findFirst({
      where: { user_id: session.user.id },
      include: {
        city_data: true,
        industry_data: true,
      },
    });

    if (!existingCompany) {
      return {
        status: "error",
        data: null,
        error: "Company not found",
      };
    }

    const companyReviews: any = await prisma.company_reviews.findMany({
      where: {
        company_id: existingCompany?.id,
      },
    });

    const OfferReviews = calcReviews(companyReviews || []);

    return {
      status: "ok",
      data: {
        ...existingCompany,
        reviews_calc: OfferReviews,
        reviews_count: companyReviews.length,
      },
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
