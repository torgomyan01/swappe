"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetAllCategory() {
  try {
    const allIndustry = await prisma.categories.findMany();

    return {
      status: "ok",
      data: allIndustry,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: error.message || String(error),
    };
  }
}
