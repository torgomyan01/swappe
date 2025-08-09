"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ActionGetPlayers() {
  try {
    const checkNumber = await prisma.lottery.findMany();

    return {
      status: "ok",
      data: checkNumber,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error,
    };
  }
}
