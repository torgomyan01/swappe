"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isAdminSession(session: any): boolean {
  const raw =
    session?.user?.role ?? session?.user?.roles ?? session?.user?.status;
  if (Array.isArray(raw))
    return raw.map((r: any) => String(r).toLowerCase()).includes("admin");
  if (typeof raw === "string") return raw.toLowerCase().includes("admin");
  return false;
}

export async function ActionAdminGetReviewReports(params?: {
  status?: "pending" | "resolved" | "all";
  page?: number;
  pageSize?: number;
}) {
  const session: any = await getServerSession(authOptions);
  if (!session || !isAdminSession(session))
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

  const [items, totalCount] = await prisma.$transaction([
    (prisma as any).review_reports.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" },
      include: {
        review: {
          select: {
            id: true,
            company_id: true,
            review: true,
            count: true,
            status: true,
            created_at: true,
            creater_company_id: true,
            creater_company: {
              select: { id: true, name: true, user_id: true },
            },
          },
        },
        reporter: { select: { id: true, email: true, name: true } },
      },
    }),
    (prisma as any).review_reports.count({ where }),
  ]);

  return { status: "ok", data: items, totalCount, error: "" } as const;
}

export async function ActionAdminResolveReviewReport(
  reportId: number,
  decision: "delete" | "keep",
) {
  const session: any = await getServerSession(authOptions);
  if (!session || !isAdminSession(session))
    return { status: "error", data: [], error: "Доступ запрещен" } as const;

  const report = await (prisma as any).review_reports.findUnique({
    where: { id: reportId },
  });
  if (!report)
    return { status: "error", data: [], error: "Жалоба не найдена" } as const;

  if (decision === "delete") {
    await prisma.$transaction([
      prisma.company_reviews.delete({ where: { id: report.review_id } }),
      (prisma as any).review_reports.update({
        where: { id: reportId },
        data: {
          status: "resolved",
          decision: "delete",
          resolved_at: new Date(),
        },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.company_reviews.update({
        where: { id: report.review_id },
        data: { status: "approved" } as any,
      }),
      (prisma as any).review_reports.update({
        where: { id: reportId },
        data: { status: "resolved", decision: "keep", resolved_at: new Date() },
      }),
    ]);
  }

  return { status: "ok", data: [], error: "" } as const;
}

export async function ActionAdminSendReviewNotification(input: {
  reportId: number;
  recipient: "reviewer" | "reporter";
  title: string;
  message: string;
}) {
  const session: any = await getServerSession(authOptions);
  if (!session || !isAdminSession(session))
    return { status: "error", data: null, error: "Доступ запрещен" } as const;

  const report = await (prisma as any).review_reports.findUnique({
    where: { id: input.reportId },
    include: {
      review: {
        select: {
          id: true,
          creater_company: { select: { user_id: true, name: true } },
        },
      },
      reporter: { select: { id: true, name: true } },
    },
  });
  if (!report)
    return { status: "error", data: null, error: "Жалоба не найдена" } as const;

  const { ActionCreatePushNotification } = await import(
    "@/app/actions/push-notification/create"
  );

  const userId =
    input.recipient === "reviewer"
      ? report.review?.creater_company?.user_id
      : report.reporter?.id;
  if (!userId)
    return {
      status: "error",
      data: null,
      error: "Пользователь не найден",
    } as const;

  const res = await ActionCreatePushNotification(
    userId,
    input.title,
    "warning",
    input.message,
    "/account",
    { reportId: input.reportId, reviewId: report.review?.id },
  );
  if (res.status !== "ok")
    return {
      status: "error",
      data: null,
      error: res.error || "Ошибка уведомления",
    } as const;

  return { status: "ok", data: res.data, error: null } as const;
}
