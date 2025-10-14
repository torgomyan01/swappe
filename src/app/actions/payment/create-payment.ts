"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
// @ts-expect-error - YooKassa package doesn't have TypeScript definitions
import YooKassa from "yookassa";

const SHOP_ID = "1176472";
const SECRET_KEY = "live_0vGMltxQNTEMPvxoZxIo20qmNnmu2778Bj5Z4erjnr4";

const yookassa = new YooKassa({
  shopId: SHOP_ID,
  secretKey: SECRET_KEY,
});

export async function ActionCreatePayment(
  amount: number,
  redirect_url: string,
) {
  try {
    if (!SHOP_ID || !SECRET_KEY) {
      throw new Error(
        "Missing required YooKassa credentials (Shop ID or Secret Key).",
      );
    }

    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    // 54‑FZ compliant receipt
    const TAX_SYSTEM_CODE = 1; // 1–6 depending on your shop settings

    const payment = await yookassa.createPayment({
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: redirect_url,
      },
      capture: true,
      description: "Balance top-up",
      receipt: {
        customer: {
          email: session.user.email,
        },
        tax_system_code: TAX_SYSTEM_CODE,
        items: [
          {
            description: "Пополнение баланса",
            quantity: "1.0",
            amount: {
              value: amount.toFixed(2),
              currency: "RUB",
            },
            vat_code: 1, // 1: no VAT, adjust if your shop uses VAT
            payment_subject: "service",
            payment_mode: "full_payment",
          },
        ],
      },
    });

    const plainPayment = JSON.parse(JSON.stringify(payment));

    await prisma.payments.create({
      data: {
        user_id: session.user.id,
        amount: amount,
        status: "pending",
        payment_id: plainPayment.id,
        created_at: new Date(),
      },
    });

    return {
      status: "ok",
      data: plainPayment,
      error: "",
    };
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
