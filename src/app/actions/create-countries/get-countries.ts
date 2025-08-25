// app/actions/countries/add-countries.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function ActionGetAllCountries() {
  try {
    const allCountries = await prisma.countries_tb.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const sorting = allCountries.sort((a: any, b: any) =>
      a.name.localeCompare(b.name),
    );

    return {
      status: "ok",
      data: sorting,
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
