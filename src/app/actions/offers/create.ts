"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ActionUpdateUserBonus } from "../auth/update-user-bonus";
import { CompanyStatus } from "../../../../@types/enums";

export async function ActionCreateOffer(offer: any) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    // Check if user has a company and it's approved
    const userCompany = await prisma.user_company.findFirst({
      where: { user_id: session.user.id },
      select: { id: true, name: true, status: true },
    });

    if (!userCompany) {
      return {
        status: "error",
        data: [],
        error: "Для создания предложения необходимо зарегистрировать компанию",
      };
    }

    if (userCompany.status !== CompanyStatus.approved) {
      return {
        status: "error",
        data: [],
        error:
          userCompany.status === CompanyStatus.moderation
            ? "Ваша компания находится на модерации. Пожалуйста, дождитесь подтверждения перед созданием предложений"
            : userCompany.status === CompanyStatus.rejected
              ? "Ваша компания не прошла модерацию. Пожалуйста, проверьте данные компании и попробуйте снова"
              : "Ваша компания не подтверждена. Пожалуйста, дождитесь подтверждения перед созданием предложений",
      };
    }

    const getOffers = await prisma.offers.findMany({
      where: {
        user_id: session.user.id,
      },
    });

    if (!getOffers.length) {
      await ActionUpdateUserBonus(
        "increment",
        50,
        "Бонус за создание первого предложения",
      );
    }

    const createOffer = await prisma.offers.create({
      data: {
        name: offer.name,
        type: offer.type,
        vid: offer.vid,
        category: offer.category,
        price: +offer.price,
        coordinates: offer.coordinates,
        description: offer.description,
        images: offer.images,
        videos: offer.videos,
        user_id: session.user.id,
        status: "moderation",
      },
    });

    return {
      status: "ok",
      data: createOffer,
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
