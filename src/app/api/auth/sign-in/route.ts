import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";
const SESSION_COOKIE = "wb_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // matches the backend's 30-day token expiry

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${BACKEND_API_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data: { access_token: string; token_type: string } = await res.json();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}
