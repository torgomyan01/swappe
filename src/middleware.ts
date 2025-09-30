import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/utils/consts";
import * as UAParser from "ua-parser-js"; // Corrected import

export default withAuth(
  function middleware(request: NextRequest) {
    const userAgent = request.headers.get("user-agent");

    if (userAgent) {
      const parser = UAParser.UAParser(userAgent);
      const device = parser.device;

      if (
        (device.type === "mobile" || device.type === "tablet") &&
        request.nextUrl.pathname === "/account"
      ) {
        return NextResponse.redirect(new URL("/account-menu", request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: SITE_URL.LOGIN,
    },
  },
);

export const config = {
  matcher: ["/account", "/account-menu", "/account/:path*", "/im/:path*"],
};
