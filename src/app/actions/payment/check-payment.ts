"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function ActionCheckPayment(order_id: string) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const payment = await prisma.payments.findFirst({
      where: {
        payment_id: order_id,
      },
    });

    if (payment) {
      const updated = await prisma.payments.update({
        where: { id: payment.id },
        data: { status: "paid" },
      });

      await prisma.users.update({
        where: { id: session.user.id },
        data: { balance: { increment: payment.amount } },
      });

      return {
        status: "ok",
        data: updated,
        error: "",
      };
    } else {
      return {
        status: "error",
        data: "payment not found",
        error: "",
      };
    }
  } catch (error: any) {
    console.error("❌ YooKassa createPayment error:", error?.message || error);

    if (error?.response) {
      console.error("📦 YooKassa error response:", error.response.data);
    }

    return {
      status: "error",
      error: error?.message || "Unknown payment error",
    };
  }
}
