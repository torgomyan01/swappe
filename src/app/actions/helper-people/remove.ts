// app/actions/countries/add-countries.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function ActionRemoveHelperPeople(id: number) {
  try {
    const removeHelperPeople = await prisma.helper_people.delete({
      where: {
        id,
      },
    });

    return {
      status: "ok",
      data: removeHelperPeople,
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
