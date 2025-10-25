// app/actions/countries/add-countries.ts
"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function ActionCreateHelperPeople(
  name: string,
  email: string,
  password: string,
  role: string,
  image_path: string,
) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Unauthorized" };
    }

    const existingHelperPeople = await prisma.helper_people.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingHelperPeople) {
      return { status: "error", data: [], error: "Такой email уже занят" };
    }

    const existingUser = await prisma.users.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { status: "error", data: [], error: "Такой email уже занят" };
    }

    const passwordHash = await hashPassword(password);

    const helperPeople = await prisma.helper_people.create({
      data: {
        name,
        email,
        password: passwordHash,
        role,
        user_id: session.user.id,
        image_path,
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
