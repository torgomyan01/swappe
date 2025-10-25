// app/actions/helper-people/auth.ts
"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function ActionAuthenticateHelperPeople(
  email: string,
  password: string,
) {
  try {
    // Find helper people by email
    const helperPeople = await prisma.helper_people.findFirst({
      where: { email: email.toLowerCase().trim() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true,
            tariff: true,
            balance: true,
            bonus: true,
            tariff_start_date: true,
            tariff_end_date: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!helperPeople) {
      return { status: "error", data: null, error: "Helper people not found" };
    }

    // Check if the main user account is active
    if (helperPeople.user.status === "archive") {
      return { status: "error", data: null, error: "Main account is archived" };
    }

    if (helperPeople.user.status !== "verified") {
      return {
        status: "error",
        data: null,
        error: "Main account is not verified",
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, helperPeople.password);
    if (!passwordMatch) {
      return { status: "error", data: null, error: "Invalid password" };
    }

    // Return helper people data with main user info
    return {
      status: "ok",
      data: {
        id: helperPeople.id,
        name: helperPeople.name,
        email: helperPeople.email,
        role: helperPeople.role,
        image_path: helperPeople.image_path,
        user_id: helperPeople.user_id,
        // Main user data
        main_user: {
          id: helperPeople.user.id,
          name: helperPeople.user.name,
          email: helperPeople.user.email,
          status: helperPeople.user.status,
          role: helperPeople.user.role,
          tariff: helperPeople.user.tariff,
          balance: helperPeople.user.balance,
          bonus: helperPeople.user.bonus,
          tariff_start_date: helperPeople.user.tariff_start_date,
          tariff_end_date: helperPeople.user.tariff_end_date,
          created_at: helperPeople.user.created_at,
          updated_at: helperPeople.user.updated_at,
        },
      },
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: null,
      error: error.message || String(error),
    };
  }
}
