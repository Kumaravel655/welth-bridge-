from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    DATABASE_URL: str

    @field_validator("DATABASE_URL")
    @classmethod
    def _anchor_sqlite_path(cls, v: str) -> str:
        # A relative SQLite path would resolve against the process cwd,
        # creating stray db files when uvicorn/alembic run from elsewhere.
        # Anchor it to the backend directory instead.
        prefix = "sqlite+aiosqlite:///"
        if v.startswith(prefix):
            raw = v[len(prefix):]
            if not Path(raw).is_absolute():
                v = prefix + (BACKEND_DIR / raw).resolve().as_posix()
        return v
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
