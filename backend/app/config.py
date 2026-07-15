from pathlib import Path

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200 # 30 days

    # SMTP — optional; when unset, outbound email is skipped (logged only).
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    MAIL_FROM_NAME: str = "The Wealth Bridge"
    ADMIN_NOTIFY_EMAIL: str = ""  # where new-booking alerts land
    SITE_URL: str = "http://localhost:3000"  # used in email links (unsubscribe, portal)

    class Config:
        # Resolved relative to this file, not the process's cwd, so the app
        # finds .env regardless of where uvicorn is launched from.
        env_file = Path(__file__).resolve().parent.parent / ".env"

settings = Settings()
