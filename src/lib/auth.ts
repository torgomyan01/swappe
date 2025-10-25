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

        // First try to find main user
        const user: any = await prisma.users.findFirst({
          where: { email },
        });

        if (user) {
          const ok = await bcrypt.compare(password, user.password ?? "");
          if (!ok) {
            return null;
          }

          if (user.status === "archive") {
            throw new Error("ARCHIVED_ACCOUNT");
          }
          if (user.status !== "verified") {
            throw new Error("NOT_VERIFIED");
          }

          // Remove sensitive fields
          const { password: _pw, ...userSafe } = user;

          // Normalize role/roles for downstream usage
          const roles = userSafe.role;

          return {
            ...userSafe,
            name: userSafe.name ?? userSafe.email,
            role: roles,
            isHelper: false, // Main user
          } as any;
        }

        // If not main user, try helper people
        const helperPeople = await prisma.helper_people.findFirst({
          where: { email },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
                role: true,
                tariff: true,
                balance: true,
                bonus: true,
                tariff_start_date: true,
                tariff_end_date: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        });

        if (helperPeople) {
          const ok = await bcrypt.compare(password, helperPeople.password);
          if (!ok) {
            return null;
          }

          return {
            id: helperPeople.user_id,
            name: helperPeople.name,
            email: helperPeople.email,
            role: helperPeople.role,
            image_path: helperPeople.image_path,
            user_id: helperPeople.user_id,
            isHelper: true, // Helper user
            helper_role: helperPeople.role,
            // Main user data for context
            main_user: {
              id: helperPeople.user.id,
              name: helperPeople.user.name,
              email: helperPeople.user.email,
              status: helperPeople.user.status,
              role: helperPeople.user.role,
              tariff: helperPeople.user.tariff,
              balance: helperPeople.user.balance,
              bonus: helperPeople.user.bonus,
              tariff_start_date: helperPeople.user.tariff_start_date,
              tariff_end_date: helperPeople.user.tariff_end_date,
              created_at: helperPeople.user.created_at,
              updated_at: helperPeople.user.updated_at,
            },
          } as any;
        }

        return null;
      },
    }),
    // Yandex OAuth provider (custom object)
    {
      id: "yandex",
      name: "Yandex",
      type: "oauth",
      wellKnown: undefined,
      authorization: {
        url: "https://oauth.yandex.com/authorize",
        params: { scope: "login:email login:info" },
      },
      token: "https://oauth.yandex.com/token",
      userinfo: "https://login.yandex.ru/info?format=json",
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      // Explicitly set the redirect URI to match what you configure in Yandex OAuth
      redirectUri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/yandex`,
      profile(profile: any) {
        // Yandex returns fields like: id, login, default_email/email, display_name, default_avatar_id
        const email = profile.default_email || profile.email || "";
        const name =
          profile.display_name || profile.real_name || profile.login || email;
        return {
          id: String(profile.id || profile.psuid || profile.uuid || email),
          name,
          email,
          image: undefined,
        } as any;
      },
    } as any,
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account, profile }) {
      // Handle OAuth (Yandex) sign-in: ensure local user exists and reflect full payload in token
      if (account?.provider === "yandex") {
        const oauthEmail =
          (user as any)?.email || (profile as any)?.email || "";
        if (oauthEmail) {
          // Find or create local user
          let dbUser: any = await prisma.users.findFirst({
            where: { email: oauthEmail },
          });
          if (!dbUser) {
            // Reuse initial tariff logic similar to registration
            const usersCountSample = await prisma.users.findMany({ take: 111 });
            const now = new Date();
            const oneYearMs = 30 * 24 * 60 * 60 * 1000 * 12;
            const tariff_end_date =
              usersCountSample.length < 109
                ? new Date(now.getTime() + oneYearMs)
                : new Date();
            const tariff = usersCountSample.length < 109 ? "advanced" : "free";

            const randomPasswordHash = await bcrypt.hash(
              crypto.randomUUID(),
              12,
            );
            const code = Math.floor(1000 + Math.random() * 9000);
            dbUser = await prisma.users.create({
              data: {
                name: (user as any)?.name || oauthEmail,
                email: oauthEmail,
                password: randomPasswordHash,
                status: "verified",
                verification_code: code,
                password_reset_token: crypto.randomUUID(),
                password_reset_expires: "",
                balance: 0,
                bonus: 0,
                referral_code: crypto.randomUUID(),
                referral_request_count: 0,
                tariff,
                tariff_start_date: new Date(),
                tariff_end_date,
                role: ["user"],
                created_at: new Date(),
                updated_at: new Date(),
              } as any,
            });
          }

          // Map db user to token
          token.sub = String(dbUser.id);
          token.email = dbUser.email;
          (token as any).status = dbUser.status;
          if (dbUser.roles) {
            (token as any).roles = dbUser.roles;
          }
          if (dbUser.role) {
            (token as any).role = dbUser.role;
          }
          (token as any).passwordResetToken = dbUser.password_reset_token;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...safeDbUser } = dbUser;

          (token as any).user = {
            ...safeDbUser,
            name: safeDbUser.name ?? safeDbUser.email,
          } as any;
        }
      }

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

        // Handle helper people authentication
        if ((user as any).isHelper) {
          (token as any).isHelper = true;
          (token as any).helper_role = (user as any).helper_role;
          (token as any).user_id = (user as any).user_id;
          (token as any).main_user = (user as any).main_user;
          // For helper people, use main user's ID as the primary identifier
          token.sub = String((user as any).user_id);
        } else {
          (token as any).isHelper = false;
        }

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

        // Handle helper people session data
        if ((token as any).isHelper) {
          (session.user as any).isHelper = true;
          (session.user as any).helper_role = (token as any).helper_role;
          (session.user as any).user_id = (token as any).user_id;
          (session.user as any).main_user = (token as any).main_user;
          // For helper people, use main user's data for most fields
          if ((token as any).main_user) {
            (session.user as any).main_user_id = (token as any).main_user.id;
            (session.user as any).main_user_name = (
              token as any
            ).main_user.name;
            (session.user as any).main_user_email = (
              token as any
            ).main_user.email;
            (session.user as any).tariff = (token as any).main_user.tariff;
            (session.user as any).balance = (token as any).main_user.balance;
            (session.user as any).bonus = (token as any).main_user.bonus;
            (session.user as any).tariff_start_date = (
              token as any
            ).main_user.tariff_start_date;
            (session.user as any).tariff_end_date = (
              token as any
            ).main_user.tariff_end_date;
          }
        } else {
          (session.user as any).isHelper = false;
        }

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
