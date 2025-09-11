import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_URL } from "@/utils/consts";

export async function middleware(request: NextRequest) {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL(SITE_URL.HOME, request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/account/:path*",
};
