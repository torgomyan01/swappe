// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Այս ֆայլը կարող է պահանջել NextAuth-ի ընդլայնված տիպերը,
// որպեսզի կանխի 'as any' կիրառումը։

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

        const user = await prisma.users.findFirst({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            status: true,
            name: true,
            password_reset_token: true, // Ներառում ենք թոքենը
            role: true,
          },
        });
        if (!user) {
          return null;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          return null;
        }

        if (user.status !== "verified") {
          return null;
        }

        // Derive roles: if status is 'admin' => roles: ['admin']
        const roles = user.role;

        // Վերադարձվող օբյեկտը պետք է պարունակի բոլոր դաշտերը, որոնք անցնում են callbacks-ի միջով
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          status: user.status,
          role: roles,
          password_reset_token: user.password_reset_token,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Սկզբնական Մուտքի Ժամանակ (user օբյեկտը հասանելի է)
      if (user) {
        token.sub = (user as any).id ?? token.sub; // Պահպանել օգտատիրոջ ID-ն
        token.email = (user as any).email; // Պահպանել email-ը
        (token as any).status = (user as any).status;
        // copy roles/role if provided
        if ((user as any).roles) {
          (token as any).roles = (user as any).roles;
        }
        if ((user as any).role) {
          (token as any).role = (user as any).role;
        }
        (token as any).passwordResetToken = (user as any).password_reset_token;
      }

      if (trigger === "update" && session) {
        if (session.email) {
          token.email = session.email;
        }
        if (session.name) {
          token.name = session.name;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Տվյալները փոխանցել session.user օբյեկտին
        (session.user as any).id = token.sub;
        (session.user as any).status = (token as any).status;
        (session.user as any).email = token.email;
        // propagate roles/role to session
        if ((token as any).roles) {
          (session.user as any).roles = (token as any).roles;
        }
        if ((token as any).role) {
          (session.user as any).role = (token as any).role;
        }

        // Պահպանել password_reset_token-ը session.user-ում
        (session.user as any).passwordResetToken = (
          token as any
        ).passwordResetToken;
      }
      return session;
    },
  },
};
