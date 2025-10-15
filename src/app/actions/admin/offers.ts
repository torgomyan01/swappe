"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    return { status: "ok", data: updated, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: null,
      error: e?.message || "Ошибка смены статуса",
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
