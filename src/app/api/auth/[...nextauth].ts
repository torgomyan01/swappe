import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ստուգում ենք բազայում
        const user = await prisma.users.findFirst({
          where: { email: credentials?.email },
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id.toString(), // ✅ cast number to string
          name: user.login,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // custom login էջ
  },
  session: {
    strategy: "jwt", // կամ 'database' եթե պահպանում ես բազայում
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler: any = NextAuth(authOptions);

export { handler as GET, handler as POST };
