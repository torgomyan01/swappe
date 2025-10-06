"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetAdminSection(name: string) {
  try {
    const getSection = await prisma.admin_sections.findFirst({
      where: { name },
    });

    return {
      status: "ok",
      data: getSection,
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
