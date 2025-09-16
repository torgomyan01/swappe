"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/utils/consts";
import moment from "moment";

const Schema = z.object({
  email: z
    .string({ required_error: "Укажите e‑mail" })
    .trim()
    .toLowerCase()
    .email("Некорректный e‑mail")
    .max(250, "E‑mail слишком длинный"),
});

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

export async function ActionForgotPassword(email: string) {
  try {
    const parsed = Schema.safeParse({ email });
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Неверные данные";
      return { status: "error", data: [], error: msg };
    }
    const { email: vEmail } = parsed.data;

    // 2) exists check (մնաց միայն email֊ով՝ ինչպես քո կոդում է)
    const user = await prisma.users.findFirst({
      where: { email: vEmail },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        status: "error",
        data: [],
        error:
          "Внимание: зарегистрированного пользователя с таким адресом электронной почты нет.",
      };
    }

    const resetToken = crypto.randomUUID();
    const tokenExpiresAt = moment().add(10).format(); // 1 ժամ հետո

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password_reset_token: resetToken,
        password_reset_expires: tokenExpiresAt,
      },
    });

    const resetLink = `${appUrl()}${SITE_URL.FORGOT_PASSWORD_CHECK}/${resetToken}`;

    const transport = await mailer();
    await transport.sendMail({
      from: process.env.MAIL_FROM || "No Reply <no-reply@localhost>",
      to: user.email,
      subject: "Восстановление пароля",
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
          <h2>Восстановление пароля</h2>
          <p>Вы запросили сброс пароля для своей учётной записи.</p>
          <p>Чтобы создать новый пароль, перейдите по ссылке ниже:</p>
          <p><a href="${resetLink}" 
                style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">
                Восстановить пароль
             </a></p>
          <p>Если кнопка не работает, скопируйте эту ссылку:</p>
          <p><code>${resetLink}</code></p>
          <p>Эта ссылка действительна в течение одного часа.</p>
        </div>
      `,
    });

    return {
      status: "ok",
      data: [],
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
