// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // redirect error-ը քո login էջ
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

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          status: user.status,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id ?? token.sub;
        (token as any).status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).status = (token as any).status;
      }
      return session;
    },
  },
};
