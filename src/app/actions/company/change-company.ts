"use server";

import { prisma } from "@/lib/prisma";

export async function ActionChangeCompany(
  id: number,
  city: number,
  industry: number,
  interest_categories: object,
  sites: object,
) {
  try {
    const CreateCompany = await prisma.user_company.update({
      where: {
        id,
      },
      data: {
        city,
        industry,
        interest_categories,
        sites,
      },
    });

    return {
      status: "ok",
      data: CreateCompany,
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
