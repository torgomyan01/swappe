"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionGetMyCompanyReview() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const getCompany = await prisma.user_company.findFirst({
      where: {
        user_id: session.user.id,
      },
    });

    if (getCompany) {
      const GetCompanyReview = await prisma.company_reviews.findMany({
        where: {
          company_id: getCompany.id,
        },
        include: {
          offers: true,
          creater_company: true,
        },
      });

      return {
        status: "ok",
        data: GetCompanyReview,
        error: "",
      };
    }

    return {
      status: "error",
      data: [],
      error: "Your not created company",
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
