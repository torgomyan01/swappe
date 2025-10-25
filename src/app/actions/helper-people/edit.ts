// app/actions/helper-people/edit.ts
"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function ActionEditHelperPeople(
  id: number,
  name: string,
  email: string,
  password: string | null,
  role: string,
  image_path: string | null,
) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Unauthorized" };
    }

    // Check if helper people exists and belongs to current user
    const existingHelperPeople = await prisma.helper_people.findFirst({
      where: {
        id,
        user_id: session.user.id,
      },
    });

    if (!existingHelperPeople) {
      return { status: "error", data: [], error: "Helper people not found" };
    }

    // Check if email is already taken by another helper people
    if (email !== existingHelperPeople.email) {
      const emailExists = await prisma.helper_people.findFirst({
        where: {
          email,
          id: { not: id },
        },
        select: { id: true },
      });

      if (emailExists) {
        return { status: "error", data: [], error: "Такой email уже занят" };
      }
    }

    const updateData: any = {
      name,
      email,
      role,
    };

    // Only update password if provided
    if (password) {
      const passwordHash = await hashPassword(password);
      updateData.password = passwordHash;
    }

    // Only update image if provided
    if (image_path) {
      updateData.image_path = image_path;
    }

    const helperPeople = await prisma.helper_people.update({
      where: { id },
      data: updateData,
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
