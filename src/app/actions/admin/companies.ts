"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_URL } from "@/utils/consts";
import { ActionCreatePushNotification } from "../push-notification/create";
import { CompanyStatus } from "../../../../@types/enums";

export async function ActionAdminGetCompanies(params?: {
  status?: "moderation" | "approved" | "rejected" | "all";
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

    const where: any = {};

    if (params?.status && params.status !== "all") {
      where.status = params.status;
    }

    if (params?.search && params.search.trim()) {
      where.OR = [
        { name: { contains: params.search } },
        { inn: { contains: params.search } },
        { phone_number: { contains: params.search } },
      ];
    }

    const [companies, totalCount] = await prisma.$transaction([
      prisma.user_company.findMany({
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
            },
          },
          city_data: {
            select: {
              id: true,
              name: true,
              name_alt: true,
            },
          },
          industry_data: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.user_company.count({ where }),
    ]);

    return { status: "ok", data: companies, totalCount, error: null } as const;
  } catch (e: any) {
    return {
      status: "error",
      data: [],
      totalCount: 0,
      error: e?.message || "Ошибка получения компаний",
    } as const;
  }
}

export async function ActionAdminChangeCompanyStatus(
  id: number,
  status: "moderation" | "approved" | "rejected",
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

    const updated = await prisma.user_company.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send push notification when status changes
    try {
      let notificationTitle = "";
      let notificationMessage = "";
      let notificationType: "success" | "warning" | "danger" = "success";

      if (status === CompanyStatus.approved) {
        notificationTitle = "Ваша компания одобрена";
        notificationMessage = `Компания "${updated.name}" успешно прошла модерацию и одобрена.`;
        notificationType = "success";
      } else if (status === CompanyStatus.rejected) {
        notificationTitle = "Ваша компания не прошла модерацию";
        notificationMessage = `К сожалению, компания "${updated.name}" не прошла модерацию. Пожалуйста, проверьте данные и попробуйте снова.`;
        notificationType = "danger";
      } else if (status === CompanyStatus.moderation) {
        notificationTitle = "Компания отправлена на модерацию";
        notificationMessage = `Компания "${updated.name}" отправлена на повторную модерацию. Мы максимально быстро проверим её.`;
        notificationType = "warning";
      }

      if (notificationTitle) {
        await ActionCreatePushNotification(
          userId,
          notificationTitle,
          notificationType,
          notificationMessage,
          SITE_URL.ACCOUNT,
          {
            companyId: updated.id,
            companyName: updated.name,
          },
        );
      }
    } catch {
      // Notification error shouldn't fail the whole operation
      console.error("Failed to send push notification");
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

export async function ActionAdminSendCompanyNotification(input: {
  companyId: number;
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

    // Get company details
    const company = await prisma.user_company.findUnique({
      where: { id: input.companyId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!company) {
      return {
        status: "error",
        data: null,
        error: "Компания не найдена",
      } as const;
    }

    // Update company status to moderation if sending rejection
    // The admin can choose to change status or leave it as is
    // We'll keep the current status unless explicitly changed via ActionAdminChangeCompanyStatus

    // Create push notification
    const notification = await ActionCreatePushNotification(
      company.user_id,
      input.title,
      "warning",
      input.message,
      SITE_URL.ACCOUNT,
      {
        companyId: company.id,
        companyName: company.name,
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
