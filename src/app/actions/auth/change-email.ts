"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/utils/consts";

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
  const secure = port === 465;

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    authMethod: "LOGIN",
    requireTLS: !secure,
    tls: { minVersion: "TLSv1.2" },
    logger: true,
    debug: true,
  });

  await transport.verify();
  return transport;
}

function appUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || "";
  if (!url) {
    throw new Error("APP URL не настроен");
  }
  return url.replace(/\/+$/, "");
}

export async function ActionChangeEmail(email: string, oldEmail: string) {
  try {
    const parsed = Schema.safeParse({ email });
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Неверные данные";
      return { status: "error", data: [], error: msg };
    }
    const { email: vEmail } = parsed.data;

    const user = await prisma.users.findFirst({
      where: { email: vEmail },
      select: { id: true, email: true },
    });

    if (user) {
      return {
        status: "error",
        data: [],
        error:
          "Внимание: Этот адрес электронной почты уже зарегистрирован в системе.",
      };
    }

    const Account = await prisma.users.findFirst({
      where: { email: oldEmail },
    });

    if (Account) {
      const code = Math.floor(1000 + Math.random() * 9000);

      const verifyLink = `${appUrl()}${SITE_URL.VERIFY_USER_EMAIL}/${code}/${email}/${oldEmail}`;

      await prisma.users.update({
        where: { id: Account.id },
        data: {
          verification_code: code,
        },
      });

      const transport = await mailer();
      await transport.sendMail({
        from: process.env.MAIL_FROM || "No Reply <no-reply@localhost>",
        to: email,
        subject: "Подтверждение смены адреса электронной почты", // Թեմայի փոփոխություն
        html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
          <h2>Подтверждение Смены Электронной Почты</h2>
          <p>Вы запросили изменение своего адреса электронной почты.</p>
          <p>Чтобы подтвердить смену, перейдите по ссылке ниже:</p>
          <p><a href="${verifyLink}" 
                style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">
                Подтвердить смену почты
             </a></p>
          <p>Если кнопка не работает, скопируйте эту ссылку:</p>
          <p><code>${verifyLink}</code></p>
          <p>Эта ссылка действительна в течение ограниченного времени.</p>
          <p>Если вы не запрашивали смену электронной почты, просто проигнорируйте это письмо.</p>
        </div>
      `,
      });

      return {
        status: "ok",
        data: [],
        error: "",
      };
    } else {
      return {
        status: "error",
        data: [],
        error: "Error",
      };
    }
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
