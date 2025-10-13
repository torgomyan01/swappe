// app/actions/users/create-user.ts
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/utils/consts";

const BCRYPT_ROUNDS = 12;

const Schema = z.object({
  name: z
    .string({ required_error: "Укажите имя" })
    .trim()
    .min(2, "Имя слишком короткое")
    .max(64, "Имя слишком длинное"),
  password: z
    .string({ required_error: "Укажите пароль" })
    .min(8, "Пароль должен содержать не менее 8 символов")
    .max(255, "Пароль слишком длинный"),
  email: z
    .string({ required_error: "Укажите e‑mail" })
    .trim()
    .toLowerCase()
    .email("Некорректный e‑mail")
    .max(250, "E‑mail слишком длинный"),
});

async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

async function mailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env as any;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP не настроен");
  }

  const port = Number(SMTP_PORT);
  const secure = port === 465; // 465 → SSL/TLS, 587 → STARTTLS

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    authMethod: "LOGIN", // чаще всего для Jino ок; при необходимости сам переключится
    requireTLS: !secure, // для 587 принудительно STARTTLS
    tls: { minVersion: "TLSv1.2" },
    logger: true,
    debug: true,
  });

  await transport.verify(); // если упадёт — сразу увидим причину
  return transport;
}

function appUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || "";
  if (!url) {
    throw new Error("APP URL не настроен");
  }
  return url.replace(/\/+$/, "");
}

export async function ActionCreateUser(
  name: string,
  password: string,
  email: string,
  referral_code?: string,
  user_id?: string,
) {
  try {
    const parsed = Schema.safeParse({ name, password, email });
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Неверные данные";
      return { status: "error", data: [], error: msg };
    }
    const { name: vName, password: vPassword, email: vEmail } = parsed.data;

    // 2) exists check (մնաց միայն email֊ով՝ ինչպես քո կոդում է)
    const checkUser = await prisma.users.findFirst({
      where: { email: vEmail },
      select: { id: true },
    });

    if (checkUser) {
      return {
        status: "error",
        data: [],
        error: "Вы уже зарегистрированы на нашем сайте.",
      };
    }

    const getFirst100users = await prisma.users.findMany({
      take: 111,
    });

    const now = new Date();
    const oneYear = 30 * 24 * 60 * 60 * 1000 * 12;

    const tariff_end_date =
      getFirst100users.length < 109
        ? new Date(now.getTime() + oneYear)
        : new Date();

    const tariff = getFirst100users.length < 109 ? "advanced" : "free";

    const passwordHash = await hashPassword(vPassword);

    const code = Math.floor(1000 + Math.random() * 9000);

    const newUser = await prisma.users.create({
      data: {
        name: vName,
        email: vEmail,
        password: passwordHash,
        status: "no-verified",
        verification_code: code,
        password_reset_token: "",
        password_reset_expires: "",
        balance: 0,
        bonus: 0,
        referral_code: crypto.randomUUID(),
        tariff,
        tariff_start_date: new Date(),
        tariff_end_date,
        role: ["user"],
        created_at: new Date(),
        updated_at: new Date(),
      } as any,
    });

    const verifyLink = `${appUrl()}${SITE_URL.VERIFY_USER}/${code}/${newUser.email}`;

    const transport = await mailer();
    await transport.sendMail({
      from: process.env.MAIL_FROM || "No Reply <no-reply@localhost>",
      to: newUser.email,
      subject: "Подтверждение e‑mail",
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
          <h2>Подтверждение e‑mail</h2>
          <p>Для завершения регистрации нажмите на кнопку ниже.</p>
          <p><a href="${verifyLink}" 
                style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">
                Подтвердить e‑mail
             </a></p>
          <p>Если кнопка не работает, скопируйте ссылку:</p>
          <p><code>${verifyLink}</code></p>
        </div>
      `,
    });

    if (referral_code && user_id) {
      const getRefUser = await prisma.users.findFirst({
        where: { id: +user_id, referral_code: referral_code },
        select: { id: true, bonus: true },
      });

      if (getRefUser) {
        await prisma.users.update({
          where: { id: getRefUser.id },
          data: { bonus: { increment: 350 } as any },
        });
      }
    }

    return {
      status: "ok",
      data: newUser,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error:
        typeof error?.message === "string"
          ? error.message
          : "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}
