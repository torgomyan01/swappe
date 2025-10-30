"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionGetUserCompanyReviews() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const existingCompany = await prisma.user_company.findFirst({
      where: { user_id: session.user.id },
      select: {
        id: true,
      },
    });

    const reviews = await prisma.company_reviews.findMany({
      where: { company_id: existingCompany?.id, status: "approved" },
    });

    return {
      status: "ok",
      data: reviews,
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
