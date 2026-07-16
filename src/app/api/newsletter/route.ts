import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

// Signups are stored in the backend's subscribers table — that list is what
// the admin panel's newsletter send goes out to. If the backend is down we
// fall back to emailing the admin (the pre-database behaviour) so no signup
// is silently lost.
async function notifyAdminFallback(email: string, source: string | undefined) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Wealth Bridge Website" <${process.env.SMTP_USER}>`,
    to: process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: "New Newsletter Subscriber (backend was offline)",
    text: [
      `Email:   ${email}`,
      `Source:  ${source || "unknown"}`,
      `When:    ${new Date().toISOString()}`,
      "",
      "The portal backend was unreachable, so this subscriber was NOT saved",
      "to the database. Add them manually from the admin panel.",
    ].join("\n"),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    try {
      const res = await fetch(`${BACKEND_API_URL}/public/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
        cache: "no-store",
      });
      if (res.ok) {
        return NextResponse.json({ success: true });
      }
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: typeof body.detail === "string" ? body.detail : "Failed to subscribe." },
        { status: res.status }
      );
    } catch {
      // Backend unreachable — fall back to notifying the admin by email.
      await notifyAdminFallback(email, source);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
