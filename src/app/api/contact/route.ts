import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    // ── Validate required fields ──
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    // ── Create SMTP transporter ──
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ── Compose email ──
    const mailOptions = {
      from: `"Wealth Bridge Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New Enquiry from ${name} — Website Contact Form`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Phone:   ${phone || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="margin:0 0 16px;color:#111827;">📬 New Enquiry from Website</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;width:90px;">Name</td><td style="padding:8px 12px;color:#111827;">${name}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Phone</td><td style="padding:8px 12px;">${phone || "Not provided"}</td></tr>
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="margin:0 0 8px;font-weight:600;color:#374151;">Message:</p>
          <p style="margin:0;color:#111827;white-space:pre-wrap;line-height:1.6;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="margin:0;font-size:12px;color:#9ca3af;">Sent from the Wealth Bridge website contact form.</p>
        </div>
      `,
    };

    // ── Send email ──
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
