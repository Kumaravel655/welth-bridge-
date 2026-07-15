"""Unauthenticated endpoints: newsletter subscribe/unsubscribe.

The Next.js site proxies its footer/blog signup forms here so subscribers
land in Postgres (the admin newsletter send reads this table). Unsubscribe
links in every newsletter email point back at the GET endpoint via the
frontend, keyed by the per-subscriber confirm_token.
"""

import re
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func

from app.database import get_db
from app.models import Subscriber, SubscriberStatusEnum

router = APIRouter()

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class SubscribeIn(BaseModel):
    email: str
    source: str | None = None


@router.post("/newsletter/subscribe", status_code=status.HTTP_201_CREATED)
async def subscribe(data: SubscribeIn, db: AsyncSession = Depends(get_db)):
    email = data.email.strip().lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    result = await db.execute(select(Subscriber).where(Subscriber.email == email))
    sub = result.scalars().first()

    if sub:
        # Re-subscribing after an unsubscribe reactivates; otherwise idempotent.
        if sub.status == SubscriberStatusEnum.unsubscribed:
            sub.status = SubscriberStatusEnum.confirmed
            sub.confirmed_at = func.now()
            await db.commit()
        return {"success": True, "already": sub.status != SubscriberStatusEnum.unsubscribed}

    # No double opt-in by design (client keeps things simple) — signups are
    # confirmed immediately; confirm_token doubles as the unsubscribe token.
    sub = Subscriber(
        email=email,
        source=data.source,
        status=SubscriberStatusEnum.confirmed,
        confirm_token=uuid.uuid4().hex,
        confirmed_at=func.now(),
    )
    db.add(sub)
    await db.commit()
    return {"success": True, "already": False}


@router.get("/newsletter/unsubscribe")
async def unsubscribe(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Subscriber).where(Subscriber.confirm_token == token))
    sub = result.scalars().first()
    if not sub:
        raise HTTPException(status_code=404, detail="Unknown unsubscribe link")
    if sub.status != SubscriberStatusEnum.unsubscribed:
        sub.status = SubscriberStatusEnum.unsubscribed
        await db.commit()
    return {"success": True, "email": sub.email}
