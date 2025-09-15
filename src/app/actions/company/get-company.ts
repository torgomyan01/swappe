"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetCompany(id: number) {
  try {
    const existingCompany = await prisma.user_company.findUnique({
      where: { id },
      include: {
        city_data: true,
        industry_data: true,
        user: true,
      },
    });

    return {
      status: "ok",
      data: existingCompany,
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
