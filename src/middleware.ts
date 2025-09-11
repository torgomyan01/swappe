import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/utils/consts"; // Համոզվեք, որ այս ուղին ճիշտ է

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: SITE_URL.HOME,
    },
  },
);

// `config` օբյեկտը մնում է նույնը
export const config = {
  matcher: "/account/:path*",
};
