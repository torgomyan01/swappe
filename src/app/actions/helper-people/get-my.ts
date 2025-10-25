// app/actions/countries/add-countries.ts
"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionGetMyHelperPeople() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Unauthorized" };
    }

    const helperPeople = await prisma.helper_people.findMany({
      where: { user_id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image_path: true,
      },
    });

    return {
      status: "ok",
      data: helperPeople,
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
