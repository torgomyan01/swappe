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
      authorized: ({ token, req }) => {
        // Allow public for non-matched paths; matched handled by config.matcher
        const url = req.nextUrl.pathname;
        if (!token) {
          return false;
        }
        if (url.startsWith("/admin")) {
          const raw =
            (token as any)?.role ??
            (token as any)?.roles ??
            (token as any)?.status;
          if (Array.isArray(raw)) {
            return raw.map((r) => String(r).toLowerCase()).includes("admin");
          }
          if (typeof raw === "string") {
            return raw.toLowerCase().includes("admin");
          }
          return false;
        }
        return true;
      },
    },
    pages: {
      signIn: SITE_URL.LOGIN,
    },
  },
);

export const config = {
  matcher: [
    "/account",
    "/account-menu",
    "/account/:path*",
    "/im/:path*",
    "/admin/:path*",
    "/admin",
  ],
};
