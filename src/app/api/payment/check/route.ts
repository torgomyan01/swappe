import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payment = await prisma.payments.findFirst({
      where: {
        payment_id: body.object.id,
      },
    });

    if (payment) {
      const updated = await prisma.payments.update({
        where: { id: payment.id },
        data: { status: "paid" },
      });

      await prisma.users.update({
        where: { id: payment.user_id },
        data: { balance: { increment: payment.amount } },
      });

      return NextResponse.json(
        {
          status: "ok",
          data: updated,
          error: "",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          data: "payment not found",
          error: "",
        },
        { status: 404 },
      );
    }
  } catch (error: any) {
    console.error("❌ YooKassa createPayment error:", error?.message || error);

    if (error?.response) {
      console.error("📦 YooKassa error response:", error.response.data);
    }

    return NextResponse.json(
      {
        status: "error",
        error: error?.message || "Unknown payment error",
      },
      { status: 500 },
    );
  }
}
