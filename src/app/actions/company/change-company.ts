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

export async function ActionUpdateCompanyImage(id: number, image_path: string) {
  try {
    const updated = await prisma.user_company.update({
      where: { id },
      data: { image_path },
    });

    return {
      status: "ok" as const,
      data: updated,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error" as const,
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}
