"use server";

import { prisma } from "@/lib/prisma";
import { CompanyStatus } from "../../../../@types/enums";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ActionCreatePushNotification } from "../push-notification/create";
import { SITE_URL } from "@/utils/consts";

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
  is_self_employed: boolean,
) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    console.log(is_self_employed, 5555);

    // Each user can have only one company (user_company.user_id is unique)
    const userExistingCompany = await prisma.user_company.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    });
    if (userExistingCompany) {
      return {
        status: "error",
        data: [],
        error: "В личном кабинете уже зарегистрирована компания",
      };
    }

    if (!is_self_employed) {
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
        status: CompanyStatus.moderation,
        sites,
        image_path,
        plan: "free",
        is_self_employed,
      },
    });

    // Send push notification about moderation
    try {
      await ActionCreatePushNotification(
        session.user.id,
        "Ваша компания отправлена на модерацию",
        "warning",
        `Ваша компания "${CreateCompany.name}" была отправлена на модерацию. Мы максимально быстро проверим и подтвердим её.`,
        SITE_URL.ACCOUNT,
        {
          companyId: CreateCompany.id,
          companyName: CreateCompany.name,
        },
      );
    } catch (error) {
      // Notification error shouldn't fail the whole operation
      console.error("Failed to send push notification:", error);
    }

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
