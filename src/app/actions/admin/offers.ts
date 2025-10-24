"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_URL } from "@/utils/consts";
import { ActionCreatePushNotification } from "../push-notification/create";

export async function ActionAdminGetOffers(params?: {
  status?: "active" | "archive" | "moderation";
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return {
        status: "error",
        data: [],
        totalCount: 0,
        error: "Не авторизован",
      } as const;

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";
    if (!isAdmin)
      return {
        status: "error",
        data: [],
        totalCount: 0,
        error: "Доступ запрещен",
      } as const;

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      ...(params?.status ? { status: params.status } : {}),
    };

    if (params?.search && params.search.trim()) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }

    const [offers, totalCount] = await prisma.$transaction([
      prisma.offers.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
        },
      }),
      prisma.offers.count({ where }),
    ]);

    return { status: "ok", data: offers, totalCount, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: [],
      totalCount: 0,
      error: e?.message || "Ошибка получения предложений",
    } as const;
  }
}

export async function ActionAdminUpdateOffer(input: {
  id: number;
  name?: string;
  type?: string;
  vid?: string;
  category?: any;
  price?: number;
  coordinates?: any;
  description?: string;
  images?: any;
  videos?: any;
}) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return { status: "error", data: null, error: "Не авторизован" } as const;

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";
    if (!isAdmin)
      return { status: "error", data: null, error: "Доступ запрещен" } as const;

    const updated = await prisma.offers.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.vid !== undefined ? { vid: input.vid } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.price !== undefined ? { price: Number(input.price) } : {}),
        ...(input.coordinates !== undefined
          ? { coordinates: input.coordinates }
          : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.images !== undefined ? { images: input.images } : {}),
        ...(input.videos !== undefined ? { videos: input.videos } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true },
        },
      },
    });

    return { status: "ok", data: updated, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: null,
      error: e?.message || "Ошибка обновления предложения",
    } as const;
  }
}

export async function ActionAdminChangeOfferStatus(
  id: number,
  status: "active" | "archive" | "moderation",
  userId: number,
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return { status: "error", data: null, error: "Не авторизован" } as const;

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";
    if (!isAdmin)
      return { status: "error", data: null, error: "Доступ запрещен" } as const;

    const updated = await prisma.offers.update({
      where: { id },
      data: { status },
    });

    if (status === "active") {
      try {
        await ActionCreatePushNotification(
          userId,
          "Ваше предложение опубликовано",
          "success",
          updated.name,
          `${SITE_URL.OFFER}/${updated.id}`,
          {},
        );
      } catch {
        return {
          status: "error",
          data: null,
          error: "Ошибка создания push notification",
        } as const;
      }
    }

    return { status: "ok", data: updated, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: null,
      error: e?.message || "Ошибка смены статуса",
    } as const;
  }
}

export async function ActionAdminSendNotification(input: {
  offerId: number;
  title: string;
  message: string;
}) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return { status: "error", data: null, error: "Не авторизован" } as const;

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";
    if (!isAdmin)
      return { status: "error", data: null, error: "Доступ запрещен" } as const;

    // Get offer details
    const offer = await prisma.offers.findUnique({
      where: { id: input.offerId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!offer) {
      return {
        status: "error",
        data: null,
        error: "Предложение не найдено",
      } as const;
    }

    // Update offer status to warning
    await prisma.offers.update({
      where: { id: input.offerId },
      data: { status: "moderation" }, // Using moderation as warning status
    });

    // Create push notification
    const notification = await ActionCreatePushNotification(
      offer.user_id,
      input.title,
      "warning",
      input.message,
      `${SITE_URL.OFFER}/${offer.id}`,
      {
        offerId: offer.id,
        offerName: offer.name,
        adminMessage: input.message,
      },
    );

    if (notification.status !== "ok") {
      return {
        status: "error",
        data: null,
        error: "Ошибка создания уведомления",
      } as const;
    }

    return { status: "ok", data: notification.data, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: null,
      error: e?.message || "Ошибка отправки уведомления",
    } as const;
  }
}

export async function ActionAdminDeleteOffer(id: number) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return { status: "error", data: null, error: "Не авторизован" } as const;

    const userRoles = session.user?.role || session.user?.roles || [];
    const isAdmin = Array.isArray(userRoles)
      ? userRoles.includes("admin")
      : userRoles === "admin";
    if (!isAdmin)
      return { status: "error", data: null, error: "Доступ запрещен" } as const;

    // Prevent deletion if there are related deals referencing this offer
    const relatedDeals = await prisma.deals.count({
      where: {
        OR: [{ owner_offer_id: id }, { client_offer_id: id }],
      },
    });
    if (relatedDeals > 0) {
      return {
        status: "error",
        data: null,
        error:
          "Нельзя удалить предложение: существуют связанные сделки. Переведите в архив или удалите сделки.",
      } as const;
    }

    await prisma.offers.delete({ where: { id } });
    return { status: "ok", data: null, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: null,
      error:
        e?.message ||
        "Ошибка удаления предложения. Возможно, существуют связанные записи.",
    } as const;
  }
}
