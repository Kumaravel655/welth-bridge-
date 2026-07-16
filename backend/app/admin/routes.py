from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.sql import func as sqlfunc
from typing import List, Optional

from app.config import settings
from app.database import get_db, SessionLocal
from app.emailer import send_email, wrap_branded
from app.models import (
    User, ServiceRequest, Consultation, Message, Newsletter, NewsletterSend, Subscriber,
    RoleEnum, RequestStatusEnum, ConsultStatusEnum, SubscriberStatusEnum, NewsletterStatusEnum,
)
from app.offices import OFFICES
from app.auth.dependencies import get_admin_user
from app.portal.routes import all_slots, booked_slots_for
from app.portal.schemas import ConsultationResponse, MessageCreate, MessageResponse
from app.admin.schemas import (
    AdminUserList, AdminUserDetail, AdminConsultationUpdate, AdminConsultationItem,
    AdminRequestUpdate, AdminRequestItem, AdminStats,
    NewsletterCreate, NewsletterResponse, NewsletterSendResult, SubscriberResponse,
)

router = APIRouter()


@router.get("/stats", response_model=AdminStats)
async def get_stats(admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    async def count(stmt):
        return (await db.execute(stmt)).scalar_one()

    return AdminStats(
        clients=await count(select(func.count(User.id)).where(User.role == RoleEnum.client)),
        pending_consultations=await count(
            select(func.count(Consultation.id)).where(Consultation.status == ConsultStatusEnum.requested)
        ),
        upcoming_consultations=await count(
            select(func.count(Consultation.id)).where(Consultation.status == ConsultStatusEnum.confirmed)
        ),
        open_requests=await count(
            select(func.count(ServiceRequest.id)).where(
                ServiceRequest.status.in_([
                    RequestStatusEnum.submitted, RequestStatusEnum.in_review,
                    RequestStatusEnum.in_progress, RequestStatusEnum.needs_docs,
                ])
            )
        ),
        confirmed_subscribers=await count(
            select(func.count(Subscriber.id)).where(Subscriber.status == SubscriberStatusEnum.confirmed)
        ),
        newsletters_sent=await count(
            select(func.count(Newsletter.id)).where(Newsletter.status == NewsletterStatusEnum.sent)
        ),
    )


@router.get("/users", response_model=List[AdminUserList])
async def list_users(admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.role == RoleEnum.client).order_by(User.created_at.desc()))
    users = result.scalars().all()

    response = []
    for u in users:
        req_res = await db.execute(select(func.count(ServiceRequest.id)).where(ServiceRequest.user_id == u.id))
        cons_res = await db.execute(select(func.count(Consultation.id)).where(Consultation.user_id == u.id))

        response.append(AdminUserList(
            id=u.id,
            name=u.name,
            email=u.email,
            phone=u.phone,
            created_at=u.created_at,
            email_verified=u.email_verified,
            requests_count=req_res.scalar_one_or_none() or 0,
            consults_count=cons_res.scalar_one_or_none() or 0
        ))
    return response


@router.get("/users/{user_id}", response_model=AdminUserDetail)
async def get_user_detail(user_id: int, admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    u_res = await db.execute(select(User).where(User.id == user_id, User.role == RoleEnum.client))
    u = u_res.scalars().first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    req_res = await db.execute(select(ServiceRequest).where(ServiceRequest.user_id == u.id))
    cons_res = await db.execute(select(Consultation).where(Consultation.user_id == u.id))

    return AdminUserDetail(
        id=u.id,
        name=u.name,
        email=u.email,
        phone=u.phone,
        created_at=u.created_at,
        email_verified=u.email_verified,
        requests=req_res.scalars().all(),
        consultations=cons_res.scalars().all()
    )


def _consultation_item(cons: Consultation, user: User) -> AdminConsultationItem:
    return AdminConsultationItem(
        id=cons.id,
        user_id=cons.user_id,
        client_name=user.name,
        client_email=user.email,
        client_phone=user.phone,
        service_slug=cons.service_slug,
        request_id=cons.request_id,
        preferred_date=cons.preferred_date,
        slot=cons.slot,
        mode=cons.mode.value if hasattr(cons.mode, "value") else cons.mode,
        office=cons.office,
        status=cons.status.value if hasattr(cons.status, "value") else cons.status,
        meeting_link=cons.meeting_link,
        notes=cons.notes,
        created_at=cons.created_at,
    )


@router.get("/consultations", response_model=List[AdminConsultationItem])
async def list_all_consultations(
    status_filter: Optional[str] = None,
    office: Optional[str] = None,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Consultation, User)
        .join(User, User.id == Consultation.user_id)
        .order_by(Consultation.preferred_date.asc(), Consultation.slot.asc())
    )
    if status_filter:
        stmt = stmt.where(Consultation.status == status_filter)
    if office:
        stmt = stmt.where(Consultation.office == office)
    result = await db.execute(stmt)
    return [_consultation_item(cons, user) for cons, user in result.all()]


@router.patch("/consultations/{cons_id}", response_model=AdminConsultationItem)
async def update_consultation(
    cons_id: int,
    update_data: AdminConsultationUpdate,
    background_tasks: BackgroundTasks,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Consultation, User).join(User, User.id == Consultation.user_id).where(Consultation.id == cons_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Consultation not found")
    cons, client = row

    # Reschedule / reassign office first, then check the new slot is free.
    if update_data.office:
        if update_data.office not in OFFICES:
            raise HTTPException(status_code=400, detail=f"Office must be one of: {', '.join(OFFICES)}")
        cons.office = update_data.office
    if update_data.preferred_date:
        cons.preferred_date = update_data.preferred_date
    if update_data.slot:
        if update_data.slot not in all_slots():
            raise HTTPException(status_code=400, detail="Invalid time slot")
        cons.slot = update_data.slot
    if update_data.preferred_date or update_data.slot or update_data.office:
        booked = await booked_slots_for(db, cons.preferred_date, cons.office, exclude_id=cons.id)
        if cons.slot in booked:
            raise HTTPException(status_code=409, detail="That slot is already booked at this office")

    status_changed_to = None
    if update_data.status:
        if update_data.status not in [s.value for s in ConsultStatusEnum]:
            raise HTTPException(status_code=400, detail="Invalid status")
        if update_data.status != (cons.status.value if hasattr(cons.status, "value") else cons.status):
            status_changed_to = update_data.status
        cons.status = update_data.status
    if update_data.meeting_link is not None:
        cons.meeting_link = update_data.meeting_link or None
    if update_data.notes is not None:
        cons.notes = update_data.notes or None

    await db.commit()
    await db.refresh(cons)

    # Notify the client when their appointment is confirmed or cancelled.
    if status_changed_to in ("confirmed", "cancelled"):
        mode = cons.mode.value if hasattr(cons.mode, "value") else cons.mode
        detail = f"{cons.preferred_date} at {cons.slot} · {mode} · {cons.office} office"
        if status_changed_to == "confirmed":
            link_html = (
                f'<p>Join link: <a href="{cons.meeting_link}" style="color:#033F80;">{cons.meeting_link}</a></p>'
                if cons.meeting_link else ""
            )
            subject = "Your appointment is confirmed — The Wealth Bridge"
            title = "Appointment confirmed"
            body = f"<p>Hi {client.name},</p><p>Your appointment is confirmed:</p><p><strong>{detail}</strong></p>{link_html}"
        else:
            subject = "Your appointment was cancelled — The Wealth Bridge"
            title = "Appointment cancelled"
            body = (
                f"<p>Hi {client.name},</p><p>Unfortunately we had to cancel this appointment:</p>"
                f"<p><strong>{detail}</strong></p><p>Please book another slot from your portal, or call us and we'll fit you in.</p>"
            )
        body += f'<p><a href="{settings.SITE_URL}/portal/consultations" style="color:#033F80;">View in your portal</a></p>'
        background_tasks.add_task(
            send_email, client.email, subject, wrap_branded(title, body),
            f"Hi {client.name}, your appointment ({detail}) is now {status_changed_to}.",
        )

    return _consultation_item(cons, client)


def _request_item(req: ServiceRequest, user: User) -> AdminRequestItem:
    return AdminRequestItem(
        id=req.id,
        user_id=req.user_id,
        client_name=user.name,
        client_email=user.email,
        client_phone=user.phone,
        service_slug=req.service_slug,
        title=req.title,
        details=req.details,
        status=req.status.value if hasattr(req.status, "value") else req.status,
        assigned_admin_id=req.assigned_admin_id,
        created_at=req.created_at,
        updated_at=req.updated_at,
    )


@router.get("/requests", response_model=List[AdminRequestItem])
async def list_all_requests(admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ServiceRequest, User).join(User, User.id == ServiceRequest.user_id).order_by(ServiceRequest.created_at.desc())
    )
    return [_request_item(req, user) for req, user in result.all()]


@router.get("/requests/{req_id}", response_model=AdminRequestItem)
async def get_admin_request(req_id: int, admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ServiceRequest, User).join(User, User.id == ServiceRequest.user_id).where(ServiceRequest.id == req_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Request not found")
    return _request_item(*row)


@router.patch("/requests/{req_id}", response_model=AdminRequestItem)
async def update_admin_request(req_id: int, update_data: AdminRequestUpdate, admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ServiceRequest, User).join(User, User.id == ServiceRequest.user_id).where(ServiceRequest.id == req_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Request not found")
    req, user = row

    if update_data.assigned_admin_id is not None:
        req.assigned_admin_id = update_data.assigned_admin_id
    if update_data.status is not None:
        if update_data.status not in [s.value for s in RequestStatusEnum]:
            raise HTTPException(status_code=400, detail="Invalid status")
        req.status = update_data.status

    await db.commit()
    await db.refresh(req)
    return _request_item(req, user)


@router.get("/requests/{req_id}/messages", response_model=List[MessageResponse])
async def admin_list_messages(req_id: int, admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceRequest).where(ServiceRequest.id == req_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Request not found")

    result = await db.execute(select(Message).where(Message.request_id == req_id).order_by(Message.created_at.asc()))
    return result.scalars().all()


@router.post("/requests/{req_id}/messages", response_model=MessageResponse)
async def admin_create_message(req_id: int, msg_in: MessageCreate, admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceRequest).where(ServiceRequest.id == req_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Request not found")

    new_msg = Message(
        request_id=req_id,
        sender_id=admin_user.id,
        sender_role=admin_user.role,
        body=msg_in.body,
        attachments=msg_in.attachments
    )
    db.add(new_msg)
    await db.commit()
    await db.refresh(new_msg)
    return new_msg


# ── Newsletters ──────────────────────────────────────────────────────────────

def _render_newsletter_html(body: str) -> str:
    """Plain-text-with-blank-lines authoring: blank line = new paragraph."""
    paragraphs = [p.strip().replace("\n", "<br/>") for p in body.split("\n\n") if p.strip()]
    return "".join(f'<p style="margin:0 0 14px;color:#111827;line-height:1.6;">{p}</p>' for p in paragraphs)


async def _send_newsletter_job(newsletter_id: int) -> None:
    """Runs after the response is returned — uses its own DB session."""
    async with SessionLocal() as db:
        nl = (await db.execute(select(Newsletter).where(Newsletter.id == newsletter_id))).scalars().first()
        if not nl:
            return
        subs = (
            await db.execute(select(Subscriber).where(Subscriber.status == SubscriberStatusEnum.confirmed))
        ).scalars().all()

        html_body = _render_newsletter_html(nl.body_mdx)
        any_failed = False
        for sub in subs:
            # /unsubscribe is a Next.js page (NOT under /api, which nginx routes
            # straight to this backend in production).
            unsub = f'<br/><a href="{settings.SITE_URL}/unsubscribe?token={sub.confirm_token}" style="color:#9ca3af;">Unsubscribe</a>'
            ok = await send_email(
                sub.email,
                nl.subject,
                wrap_branded(nl.subject, html_body, footer_html=unsub),
                nl.body_mdx,
            )
            any_failed = any_failed or not ok
            db.add(NewsletterSend(
                newsletter_id=nl.id,
                subscriber_id=sub.id,
                status="sent" if ok else "failed",
                sent_at=sqlfunc.now() if ok else None,
            ))

        nl.status = NewsletterStatusEnum.sent
        nl.sent_at = sqlfunc.now()
        await db.commit()


@router.get("/newsletters", response_model=List[NewsletterResponse])
async def list_newsletters(admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Newsletter).order_by(Newsletter.created_at.desc()))
    return result.scalars().all()


@router.post("/newsletters", response_model=NewsletterResponse, status_code=status.HTTP_201_CREATED)
async def create_newsletter(data: NewsletterCreate, admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    nl = Newsletter(
        subject=data.subject,
        body_mdx=data.body_mdx,
        created_by=admin_user.id
    )
    db.add(nl)
    await db.commit()
    await db.refresh(nl)
    return nl


@router.post("/newsletters/{nl_id}/send", response_model=NewsletterSendResult)
async def send_newsletter(
    nl_id: int,
    background_tasks: BackgroundTasks,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Newsletter).where(Newsletter.id == nl_id))
    nl = result.scalars().first()
    if not nl:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    if nl.status == NewsletterStatusEnum.sent:
        raise HTTPException(status_code=400, detail="This newsletter was already sent")
    if nl.status == NewsletterStatusEnum.sending:
        raise HTTPException(status_code=400, detail="This newsletter is already being sent")

    count = (
        await db.execute(select(func.count(Subscriber.id)).where(Subscriber.status == SubscriberStatusEnum.confirmed))
    ).scalar_one()
    if count == 0:
        raise HTTPException(status_code=400, detail="No confirmed subscribers to send to")

    nl.status = NewsletterStatusEnum.sending
    await db.commit()

    background_tasks.add_task(_send_newsletter_job, nl_id)
    return NewsletterSendResult(newsletter_id=nl_id, recipients=count)


@router.get("/subscribers", response_model=List[SubscriberResponse])
async def list_subscribers(admin_user: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Subscriber).order_by(Subscriber.created_at.desc()))
    return result.scalars().all()
