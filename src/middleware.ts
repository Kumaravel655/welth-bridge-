import { NextRequest, NextResponse } from "next/server";

import { decodeJwtRole } from "@/lib/session";

const PUBLIC_PORTAL_PATHS = ["/portal/sign-in", "/portal/sign-up"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PORTAL_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("wb_session")?.value;
  if (!token) {
    const signInUrl = new URL("/portal/sign-in", req.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // /admin is admin-only. The role claim is decoded without signature
  // verification — fine for routing, since the backend re-verifies the JWT
  // on every API call an admin page makes.
  if (pathname.startsWith("/admin") && decodeJwtRole(token) !== "admin") {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
