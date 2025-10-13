import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// YooKassa webhook handler
// Handles: payment.waiting_for_capture, payment.succeeded, payment.canceled, refund.succeeded
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const event = body?.event as string | undefined;
    const object = body?.object as any | undefined;
    const paymentId = object?.id as string | undefined;

    if (!event || !paymentId) {
      // Bad payload — acknowledge with 400
      return NextResponse.json(
        { status: "error", error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    // Process in a transaction for idempotency
    const result = await prisma.$transaction(async (tx) => {
      const paymentRow = await tx.payments.findFirst({
        where: { payment_id: paymentId },
      });

      if (!paymentRow) {
        return { handled: false, reason: "payment_not_found" };
      }

      const currentStatus = paymentRow.status;

      // Normalize supported events
      switch (event) {
        case "payment.waiting_for_capture": {
          if (currentStatus !== "paid" && currentStatus !== "refunded") {
            await tx.payments.update({
              where: { id: paymentRow.id },
              data: { status: "waiting_for_capture" },
            });
          }
          return { handled: true, status: "waiting_for_capture" };
        }

        case "payment.succeeded": {
          if (currentStatus !== "paid") {
            await tx.payments.update({
              where: { id: paymentRow.id },
              data: { status: "paid" },
            });

            // Credit user balance once
            await tx.users.update({
              where: { id: paymentRow.user_id },
              data: { balance: { increment: paymentRow.amount } },
            });
          }
          return { handled: true, status: "paid" };
        }

        case "payment.canceled": {
          if (currentStatus !== "paid" && currentStatus !== "refunded") {
            await tx.payments.update({
              where: { id: paymentRow.id },
              data: { status: "canceled" },
            });
          }
          return { handled: true, status: "canceled" };
        }

        case "refund.succeeded": {
          // Only revert if previously paid and not already refunded
          if (currentStatus === "paid") {
            await tx.payments.update({
              where: { id: paymentRow.id },
              data: { status: "refunded" },
            });

            await tx.users.update({
              where: { id: paymentRow.user_id },
              data: { balance: { decrement: paymentRow.amount } },
            });
          } else if (currentStatus !== "refunded") {
            // Mark as refunded if not already
            await tx.payments.update({
              where: { id: paymentRow.id },
              data: { status: "refunded" },
            });
          }
          return { handled: true, status: "refunded" };
        }

        default: {
          // Unknown but acknowledge to avoid retries
          return { handled: true, status: "ignored" };
        }
      }
    });

    if (!result.handled && result.reason === "payment_not_found") {
      // Acknowledge with 200 to stop retries, but signal not found
      return NextResponse.json(
        { status: "error", error: "payment not found" },
        { status: 200 },
      );
    }

    // Always acknowledge with 200 per YooKassa spec
    return NextResponse.json(
      { status: "ok", data: { processed: true } },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ YooKassa webhook error:", error?.message || error);
    return NextResponse.json(
      { status: "error", error: error?.message || "Unknown webhook error" },
      { status: 500 },
    );
  }
}
