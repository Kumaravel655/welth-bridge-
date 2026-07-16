import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

// Unauthenticated passthrough to the backend's /public/* endpoints. In
// production nginx routes /api/* straight to FastAPI (stripping /api), so
// this handler only runs in local dev — it mirrors what nginx does.
async function proxy(req: NextRequest, path: string[]) {
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const url = `${BACKEND_API_URL}/public/${path.join("/")}${req.nextUrl.search}`;

  const res = await fetch(url, {
    method: req.method,
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

type Params = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(req, path);
}
