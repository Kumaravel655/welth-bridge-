import { NextRequest, NextResponse } from "next/server";

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
