"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ActionReportCompanyReview(
  reviewId: number,
  reason: string,
  details?: string,
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return { status: "error", data: [], error: "logout" } as const;
    }

    const review = await prisma.company_reviews.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });

    if (!review) {
      return {
        status: "error",
        data: [],
        error: "Отзыв не найден",
      } as const;
    }

    // Create report
    const report = await (prisma as any).review_reports.create({
      data: {
        review_id: reviewId,
        reporter_id: session.user.id,
        reason,
        details,
      },
    });

    // Hide review until moderation
    await prisma.company_reviews.update({
      where: { id: reviewId },
      data: { status: "pending" } as any,
    });

    return { status: "ok", data: report, error: "" } as const;
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    } as const;
  }
}
