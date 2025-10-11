// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(creds) {
        const email = (creds?.email as string)?.trim().toLowerCase() || "";
        const password = String(creds?.password ?? "");
        if (!email || !password) {
          return null;
        }

        // Fetch full user record; we'll remove password before returning
        const user: any = await prisma.users.findFirst({
          where: { email },
        });
        if (!user) {
          return null;
        }

        const ok = await bcrypt.compare(password, user.password ?? "");
        if (!ok) {
          return null;
        }

        if (user.status !== "verified") {
          return null;
        }

        // Remove sensitive fields
        const { password: _pw, ...userSafe } = user;

        console.log(_pw, 55555);

        // Normalize role/roles for downstream usage
        const roles = userSafe.role;

        return {
          ...userSafe,
          name: userSafe.name ?? userSafe.email,
          role: roles,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = (user as any).id ?? token.sub;
        token.email = (user as any).email;
        (token as any).status = (user as any).status;
        if ((user as any).roles) {
          (token as any).roles = (user as any).roles;
        }
        if ((user as any).role) {
          (token as any).role = (user as any).role;
        }
        (token as any).passwordResetToken = (user as any).password_reset_token;
        // Attach full user payload (without password) for session consumption
        (token as any).user = user as any;
      }

      if (trigger === "update" && session) {
        if (session.email) {
          token.email = session.email;
        }
        if (session.name) {
          token.name = session.name;
        }

        // Support client-side session.update({ ... }) for tariff fields
        const tknAny = token as any;
        const sessAny = session as any;

        if (sessAny.tariff !== undefined) {
          // reflect in token top-level if desired
          tknAny.tariff = sessAny.tariff;
          // and in embedded user payload
          tknAny.user = {
            ...(tknAny.user || {}),
            tariff: sessAny.tariff,
          };
        }

        if (sessAny.tariff_end_date !== undefined) {
          tknAny.tariff_end_date = sessAny.tariff_end_date;
          tknAny.user = {
            ...(tknAny.user || {}),
            tariff_end_date: sessAny.tariff_end_date,
          };
        }

        if (sessAny.tariff_start_date !== undefined) {
          tknAny.tariff_start_date = sessAny.tariff_start_date;
          tknAny.user = {
            ...(tknAny.user || {}),
            tariff_start_date: sessAny.tariff_start_date,
          };
        }

        if (sessAny.balance !== undefined) {
          tknAny.balance = sessAny.balance;
          tknAny.user = {
            ...(tknAny.user || {}),
            balance: sessAny.balance,
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).status = (token as any).status;
        (session.user as any).email = token.email;
        if ((token as any).roles) {
          (session.user as any).roles = (token as any).roles;
        }
        if ((token as any).role) {
          (session.user as any).role = (token as any).role;
        }

        (session.user as any).passwordResetToken = (
          token as any
        ).passwordResetToken;

        // Merge all user fields (sans password) into session.user
        if ((token as any).user) {
          Object.assign(session.user as any, (token as any).user);
          // Ensure password is not present even if somehow included
          delete (session.user as any).password;
        }

        // Also mirror explicit top-level fields if set during update
        if ((token as any).tariff !== undefined) {
          (session.user as any).tariff = (token as any).tariff;
        }
        if ((token as any).tariff_end_date !== undefined) {
          (session.user as any).tariff_end_date = (
            token as any
          ).tariff_end_date;
        }
        if ((token as any).tariff_start_date !== undefined) {
          (session.user as any).tariff_start_date = (
            token as any
          ).tariff_start_date;
        }
        if ((token as any).balance !== undefined) {
          (session.user as any).balance = (token as any).balance;
        }
      }
      return session;
    },
  },
};
