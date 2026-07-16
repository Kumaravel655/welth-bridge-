import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

// Target of the "Unsubscribe" link in every newsletter email. Returns a tiny
// standalone HTML page (no app shell) since recipients may not have JS or a
// session — it just needs to confirm the action.
function page(title: string, message: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — The Wealth Bridge</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#fafafa;margin:0;padding:48px 16px;">
<div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:32px;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#033F80;font-weight:700;">The Wealth Bridge</p>
<h1 style="margin:0 0 12px;font-size:22px;color:#111827;">${title}</h1>
<p style="margin:0;color:#4b5563;">${message}</p>
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return page("Invalid link", "This unsubscribe link is missing its token.");
  }

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/public/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return page("You're unsubscribed", "You won't receive our newsletter anymore. Changed your mind? Subscribe again anytime from the site footer.");
    }
    return page("Invalid link", "This unsubscribe link isn't recognised. It may have already been used.");
  } catch {
    return page("Something went wrong", "We couldn't process this right now — please try again in a few minutes.");
  }
}
