"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type PaymentsListParams = {
  status?: IPayment["status"] | "all";
  userSearch?: string;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
  page?: number;
  pageSize?: number;
};

function isAdminSession(session: any): boolean {
  const roles = session?.user?.role || session?.user?.roles || [];
  return Array.isArray(roles) ? roles.includes("admin") : roles === "admin";
}

export async function ActionAdminGetPayments(params: PaymentsListParams) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) return { status: "error", data: [], error: "Не авторизован" };
    if (!isAdminSession(session))
      return { status: "error", data: [], error: "Доступ запрещен" };

    const page = Math.max(1, Number(params.page || 1));
    const pageSize = Math.max(1, Math.min(100, Number(params.pageSize || 20)));

    const where: any = {};

    if (params?.status && params.status !== "all") {
      where.status = params.status;
    }

    if (params?.dateFrom || params?.dateTo) {
      where.created_at = {};
      if (params.dateFrom) where.created_at.gte = new Date(params.dateFrom);
      if (params.dateTo) {
        // include the whole end day
        const end = new Date(params.dateTo);
        end.setHours(23, 59, 59, 999);
        where.created_at.lte = end;
      }
    }

    // user search by email or name
    let userFilterIds: number[] | undefined;
    if (params?.userSearch && params.userSearch.trim()) {
      const users = await prisma.users.findMany({
        where: {
          OR: [
            { email: { contains: params.userSearch } },
            { name: { contains: params.userSearch } },
          ],
        },
        select: { id: true },
        take: 500,
      });
      userFilterIds = users.map((u) => u.id);
      if (userFilterIds.length === 0) {
        return { status: "ok", data: [], totalCount: 0 };
      }
      where.user_id = { in: userFilterIds };
    }

    const [totalCount, items] = await Promise.all([
      prisma.payments.count({ where }),
      prisma.payments.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
      }),
    ]);

    return { status: "ok", data: items, totalCount };
  } catch {
    return {
      status: "error",
      data: [],
      error: "Ошибка при получении платежей",
    };
  }
}

export async function ActionAdminGetPaymentsStats(
  params: Omit<PaymentsListParams, "page" | "pageSize">,
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return { status: "error", data: null, error: "Не авторизован" };
    if (!isAdminSession(session))
      return { status: "error", data: null, error: "Доступ запрещен" };

    const where: any = {};
    if (params?.status && params.status !== "all") {
      where.status = params.status;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.created_at = {};
      if (params.dateFrom) where.created_at.gte = new Date(params.dateFrom);
      if (params.dateTo) {
        const end = new Date(params.dateTo);
        end.setHours(23, 59, 59, 999);
        where.created_at.lte = end;
      }
    }
    if (params?.userSearch && params.userSearch.trim()) {
      const users = await prisma.users.findMany({
        where: {
          OR: [
            { email: { contains: params.userSearch } },
            { name: { contains: params.userSearch } },
          ],
        },
        select: { id: true },
        take: 500,
      });
      const ids = users.map((u) => u.id);
      if (ids.length === 0) {
        return {
          status: "ok",
          data: {
            total: 0,
            paid: 0,
            pending: 0,
            failed: 0,
            sumTotal: 0,
            sumPaid: 0,
            avgPaid: 0,
          },
        };
      }
      where.user_id = { in: ids };
    }

    const [total, paid, pending, failed, sumPaid, sumTotal] = await Promise.all(
      [
        prisma.payments.count({ where }),
        prisma.payments.count({ where: { ...where, status: "paid" } }),
        prisma.payments.count({ where: { ...where, status: "pending" } }),
        prisma.payments.count({ where: { ...where, status: "failed" } }),
        prisma.payments.aggregate({
          _sum: { amount: true },
          where: { ...where, status: "paid" },
        }),
        prisma.payments.aggregate({ _sum: { amount: true }, where }),
      ],
    );

    const sumPaidVal = sumPaid._sum.amount || 0;
    const sumTotalVal = sumTotal._sum.amount || 0;
    const avgPaid = paid > 0 ? Math.round(sumPaidVal / paid) : 0;

    return {
      status: "ok",
      data: {
        total,
        paid,
        pending,
        failed,
        sumTotal: sumTotalVal,
        sumPaid: sumPaidVal,
        avgPaid,
      },
    };
  } catch {
    return {
      status: "error",
      data: null,
      error: "Ошибка при получении статистики платежей",
    };
  }
}

export async function ActionAdminExportPaymentsCSV(
  params: Omit<PaymentsListParams, "page" | "pageSize">,
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session)
      return { status: "error", data: null, error: "Не авторизован" };
    if (!isAdminSession(session))
      return { status: "error", data: null, error: "Доступ запрещен" };

    const where: any = {};
    if (params?.status && params.status !== "all") {
      where.status = params.status;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.created_at = {};
      if (params.dateFrom) where.created_at.gte = new Date(params.dateFrom);
      if (params.dateTo) {
        const end = new Date(params.dateTo);
        end.setHours(23, 59, 59, 999);
        where.created_at.lte = end;
      }
    }
    if (params?.userSearch && params.userSearch.trim()) {
      const users = await prisma.users.findMany({
        where: {
          OR: [
            { email: { contains: params.userSearch } },
            { name: { contains: params.userSearch } },
          ],
        },
        select: { id: true },
        take: 500,
      });
      const ids = users.map((u) => u.id);
      if (ids.length === 0) {
        return {
          status: "ok",
          data: "id,user_id,user_email,user_name,amount,status,payment_id,created_at\n",
        };
      }
      where.user_id = { in: ids };
    }

    const items = await prisma.payments.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: { user: { select: { id: true, email: true, name: true } } },
      take: 5000, // safeguard
    });

    const header = [
      "id",
      "user_id",
      "user_email",
      "user_name",
      "amount",
      "status",
      "payment_id",
      "created_at",
    ];

    const rows = items.map((p) => [
      p.id,
      p.user_id,
      p.user?.email ?? "",
      (p.user?.name ?? "").replaceAll(",", " "),
      p.amount,
      p.status,
      p.payment_id,
      p.created_at.toISOString(),
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { status: "ok", data: csv };
  } catch {
    return {
      status: "error",
      data: null,
      error: "Ошибка при экспорте платежей",
    };
  }
}
