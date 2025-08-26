"use server";

import { prisma } from "@/lib/prisma";
import { CompanyStatus } from "../../../../@types/enums";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionCreateCompany(
  name: string,
  inn: string,
  city: number,
  industry: number,
  about_us: string,
  interest_categories: number,
  sites: object,
  image_path: string,
  phone_number: string,
) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const existingCompany = await prisma.user_company.findFirst({
      where: { inn },
    });

    if (existingCompany) {
      return {
        status: "error",
        data: [],
        error: "Компания с таким ИНН уже зарегистрирована",
      };
    }

    const CreateCompany = await prisma.user_company.create({
      data: {
        user_id: session.user.id,
        name,
        phone_number,
        inn,
        city,
        industry,
        about_us,
        interest_categories,
        status: CompanyStatus.verify,
        sites,
        image_path,
        plan: "free",
      },
    });

    return {
      status: "ok",
      data: CreateCompany,
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
