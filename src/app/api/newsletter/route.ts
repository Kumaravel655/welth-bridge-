import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// No database exists for subscriber storage — this notifies the admin by
// email on every signup so they can curate the list manually. Swap the
// transporter.sendMail body below for a real ESP call (Brevo, Mailchimp,
// etc.) if/when subscriber volume justifies it; the request/response
// contract here (POST {email, source} -> {success}) doesn't need to change.
export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

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
      subject: "New Newsletter Subscriber",
      text: [
        `Email:   ${email}`,
        `Source:  ${source || "unknown"}`,
        `When:    ${new Date().toISOString()}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="margin:0 0 16px;color:#111827;">New Newsletter Subscriber</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;width:90px;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Source</td><td style="padding:8px 12px;color:#111827;">${source || "unknown"}</td></tr>
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="margin:0;font-size:12px;color:#9ca3af;">This is a signup notification only — there is no subscriber database. Add this address to your mailing list manually.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup email error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
