"""Create (or promote) an admin user.

Usage, from backend/ with the venv active:
    python create_admin.py <email> <password> [name] [phone]

If a user with that email already exists it is promoted to admin (and the
password updated); otherwise a new admin account is created.
"""

import asyncio
import sys

from sqlalchemy.future import select

from app.database import SessionLocal
from app.models import User, RoleEnum
from app.auth.utils import get_password_hash


async def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password> [name] [phone]")
        sys.exit(1)

    email = sys.argv[1].strip().lower()
    password = sys.argv[2]
    name = sys.argv[3] if len(sys.argv) > 3 else "Admin"
    phone = sys.argv[4] if len(sys.argv) > 4 else "0000000000"

    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if user:
            user.role = RoleEnum.admin
            user.hashed_password = get_password_hash(password)
            action = "promoted to admin (password updated)"
        else:
            user = User(
                name=name,
                email=email,
                phone=phone,
                role=RoleEnum.admin,
                email_verified=True,
                hashed_password=get_password_hash(password),
            )
            db.add(user)
            action = "created as admin"
        await db.commit()
        print(f"{email} {action}")


if __name__ == "__main__":
    asyncio.run(main())
