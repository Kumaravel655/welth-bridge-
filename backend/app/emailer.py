"""Outbound email over SMTP (Gmail app password), shared by booking
notifications and newsletter sends.

smtplib is synchronous, so every caller goes through asyncio.to_thread —
never call _send_sync directly from a coroutine. When SMTP is not
configured the send is skipped and logged, so local/dev environments
without credentials keep working.
"""

import asyncio
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger("wealthbridge.emailer")


def _send_sync(to: str, subject: str, html: str, text: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.MAIL_FROM_NAME} <{settings.SMTP_USER}>"
    msg["To"] = to
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.sendmail(settings.SMTP_USER, [to], msg.as_string())


async def send_email(to: str, subject: str, html: str, text: str) -> bool:
    """Send one email. Returns True on success, False on failure/not configured."""
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.info("SMTP not configured — skipping email to %s (%s)", to, subject)
        return False
    try:
        await asyncio.to_thread(_send_sync, to, subject, html, text)
        return True
    except Exception:
        logger.exception("Failed to send email to %s (%s)", to, subject)
        return False


def wrap_branded(title: str, body_html: str, footer_html: str = "") -> str:
    """Minimal branded shell used by all transactional/newsletter emails."""
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#033F80;font-weight:700;">The Wealth Bridge</p>
      <h2 style="margin:0 0 16px;color:#111827;">{title}</h2>
      {body_html}
      <hr style="margin:20px 0 12px;border:none;border-top:1px solid #e5e7eb;" />
      <p style="margin:0;font-size:12px;color:#9ca3af;">The Wealth Bridge · Vellore · Arakkonam · Ranipet{footer_html}</p>
    </div>
    """
