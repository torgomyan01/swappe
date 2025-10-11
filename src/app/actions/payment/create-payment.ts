"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
// @ts-expect-error - YooKassa package doesn't have TypeScript definitions
import YooKassa from "yookassa";

const SHOP_ID = "1182358";
const SECRET_KEY = "test_ZRNpZvmZhpgXTTjnNg6y5RSitMuiMXSzeDhcnrX_SCw";

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
      description: "Test payment",
    });

    console.log("✅ YooKassa payment created:", payment);

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
