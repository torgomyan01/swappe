"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CompanyStatus } from "../../../../@types/enums";

export async function ActionUpdateOffer(offer: any) {
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
        error:
          "Для обновления предложения необходимо зарегистрировать компанию",
      };
    }

    if (userCompany.status !== CompanyStatus.approved) {
      return {
        status: "error",
        data: [],
        error:
          userCompany.status === CompanyStatus.moderation
            ? "Ваша компания находится на модерации. Пожалуйста, дождитесь подтверждения перед обновлением предложений"
            : userCompany.status === CompanyStatus.rejected
              ? "Ваша компания не прошла модерацию. Пожалуйста, проверьте данные компании и попробуйте снова"
              : "Ваша компания не подтверждена. Пожалуйста, дождитесь подтверждения перед обновлением предложений",
      };
    }

    // Check if the offer exists and belongs to the user
    const existingOffer = await prisma.offers.findFirst({
      where: {
        id: offer.id,
        user_id: session.user.id,
      },
    });

    if (!existingOffer) {
      return {
        status: "error",
        data: [],
        error:
          "Предложение не найдено или у вас нет доступа к его редактированию",
      };
    }

    const updateOffer = await prisma.offers.update({
      where: {
        id: offer.id,
      },
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
        status: "moderation", // Reset to moderation when updated
      },
    });

    return {
      status: "ok",
      data: updateOffer,
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
