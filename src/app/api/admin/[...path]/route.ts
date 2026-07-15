import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

// BFF proxy for the admin API — mirrors /api/portal/[...path]. Role
// enforcement lives in FastAPI's get_admin_user dependency; this just
// forwards the session JWT.
async function proxy(req: NextRequest, path: string[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get("wb_session")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const url = `${BACKEND_API_URL}/api/admin/${path.join("/")}${req.nextUrl.search}`;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
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

export async function PATCH(req: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(req, path);
}
