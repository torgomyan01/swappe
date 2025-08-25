// app/actions/countries/add-countries.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetAllIndustry() {
  try {
    const allIndustry = await prisma.industry.findMany();

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
