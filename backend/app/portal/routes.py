from datetime import date as date_cls

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List

from app.config import settings
from app.database import get_db
from app.emailer import send_email, wrap_branded
from app.models import User, ServiceRequest, Consultation, Message, RequestStatusEnum, ConsultStatusEnum, ModeEnum
from app.offices import OFFICES, DEFAULT_OFFICE, WORK_START_HOUR, WORK_END_HOUR
from app.auth.dependencies import get_current_user
from app.portal.schemas import (
    UserProfile, ServiceRequestCreate, ServiceRequestResponse, ServiceRequestUpdate,
    ConsultationCreate, ConsultationUpdate, ConsultationResponse, ConsultationSlot,
    MessageCreate, MessageResponse
)

router = APIRouter()

ACTIVE_CONSULT_STATUSES = [ConsultStatusEnum.requested, ConsultStatusEnum.confirmed]


def all_slots() -> List[str]:
    slots = []
    for h in range(WORK_START_HOUR, WORK_END_HOUR):
        slots.append(f"{h:02d}:00")
        slots.append(f"{h:02d}:30")
    return slots


def parse_date_or_400(value: str) -> date_cls:
    try:
        return date_cls.fromisoformat(value)
    except ValueError:
        raise HTTPException(status_code=400, detail="Date must be YYYY-MM-DD")


async def booked_slots_for(db: AsyncSession, date: str, office: str, exclude_id: int | None = None) -> set[str]:
    stmt = (
        select(Consultation.slot)
        .where(Consultation.preferred_date == date)
        .where(Consultation.office == office)
        .where(Consultation.status.in_(ACTIVE_CONSULT_STATUSES))
    )
    if exclude_id is not None:
        stmt = stmt.where(Consultation.id != exclude_id)
    result = await db.execute(stmt)
    return {row[0] for row in result.all()}

@router.get("/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Count open requests
    req_result = await db.execute(
        select(func.count(ServiceRequest.id))
        .where(ServiceRequest.user_id == current_user.id)
        .where(ServiceRequest.status.in_([RequestStatusEnum.submitted, RequestStatusEnum.in_review, RequestStatusEnum.in_progress, RequestStatusEnum.needs_docs]))
    )
    open_requests_count = req_result.scalar_one_or_none() or 0

    # Count upcoming consults
    cons_result = await db.execute(
        select(func.count(Consultation.id))
        .where(Consultation.user_id == current_user.id)
        .where(Consultation.status.in_([ConsultStatusEnum.requested, ConsultStatusEnum.confirmed]))
    )
    upcoming_consults_count = cons_result.scalar_one_or_none() or 0

    return UserProfile(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        email_verified=current_user.email_verified,
        role=current_user.role.value,
        open_requests_count=open_requests_count,
        upcoming_consults_count=upcoming_consults_count
    )

@router.get("/requests", response_model=List[ServiceRequestResponse])
async def list_requests(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceRequest).where(ServiceRequest.user_id == current_user.id).order_by(ServiceRequest.created_at.desc()))
    return result.scalars().all()

@router.post("/requests", response_model=ServiceRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(req_in: ServiceRequestCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_req = ServiceRequest(
        user_id=current_user.id,
        service_slug=req_in.service_slug,
        title=req_in.title,
        details=req_in.details,
    )
    db.add(new_req)
    await db.commit()
    await db.refresh(new_req)
    return new_req

@router.get("/requests/{req_id}", response_model=ServiceRequestResponse)
async def get_request(req_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceRequest).where(ServiceRequest.id == req_id, ServiceRequest.user_id == current_user.id))
    req = result.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return req

@router.patch("/requests/{req_id}", response_model=ServiceRequestResponse)
async def update_request(req_id: int, req_in: ServiceRequestUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceRequest).where(ServiceRequest.id == req_id, ServiceRequest.user_id == current_user.id))
    req = result.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if req_in.title is not None:
        req.title = req_in.title
    if req_in.details is not None:
        req.details = req_in.details
    if req_in.status is not None:
        # A client can only cancel
        if req_in.status == "cancelled":
            req.status = RequestStatusEnum.cancelled
    
    await db.commit()
    await db.refresh(req)
    return req

@router.get("/requests/{req_id}/messages", response_model=List[MessageResponse])
async def list_messages(req_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify request belongs to user
    req_result = await db.execute(select(ServiceRequest).where(ServiceRequest.id == req_id, ServiceRequest.user_id == current_user.id))
    if not req_result.scalars().first():
        raise HTTPException(status_code=404, detail="Request not found")
        
    result = await db.execute(select(Message).where(Message.request_id == req_id).order_by(Message.created_at.asc()))
    return result.scalars().all()

@router.post("/requests/{req_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(req_id: int, msg_in: MessageCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    req_result = await db.execute(select(ServiceRequest).where(ServiceRequest.id == req_id, ServiceRequest.user_id == current_user.id))
    if not req_result.scalars().first():
        raise HTTPException(status_code=404, detail="Request not found")

    new_msg = Message(
        request_id=req_id,
        sender_id=current_user.id,
        sender_role=current_user.role,
        body=msg_in.body,
        attachments=msg_in.attachments
    )
    db.add(new_msg)
    await db.commit()
    await db.refresh(new_msg)
    return new_msg

@router.get("/consultations", response_model=List[ConsultationResponse])
async def list_consultations(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultation).where(Consultation.user_id == current_user.id).order_by(Consultation.created_at.desc()))
    return result.scalars().all()

@router.post("/consultations", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(
    cons_in: ConsultationCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    when = parse_date_or_400(cons_in.preferred_date)
    if when < date_cls.today():
        raise HTTPException(status_code=400, detail="Pick a date in the future")
    if when.weekday() == 6:
        raise HTTPException(status_code=400, detail="We are closed on Sundays")

    if cons_in.mode == ModeEnum.office.value and not cons_in.office:
        raise HTTPException(status_code=400, detail="Pick an office for an in-office visit")
    office = cons_in.office or DEFAULT_OFFICE
    if office not in OFFICES:
        raise HTTPException(status_code=400, detail=f"Office must be one of: {', '.join(OFFICES)}")

    if cons_in.slot not in all_slots():
        raise HTTPException(status_code=400, detail="Invalid time slot")
    booked = await booked_slots_for(db, cons_in.preferred_date, office)
    if cons_in.slot in booked:
        raise HTTPException(status_code=409, detail="That slot was just taken — pick another")

    new_cons = Consultation(
        user_id=current_user.id,
        service_slug=cons_in.service_slug,
        request_id=cons_in.request_id,
        preferred_date=cons_in.preferred_date,
        slot=cons_in.slot,
        mode=cons_in.mode,
        office=office,
        notes=cons_in.notes
    )
    db.add(new_cons)
    await db.commit()
    await db.refresh(new_cons)

    if settings.ADMIN_NOTIFY_EMAIL:
        detail = f"{cons_in.preferred_date} at {cons_in.slot} · {cons_in.mode} · {office} office"
        background_tasks.add_task(
            send_email,
            settings.ADMIN_NOTIFY_EMAIL,
            f"New appointment request — {current_user.name}",
            wrap_branded(
                "New appointment request",
                f"<p><strong>{current_user.name}</strong> ({current_user.email}, {current_user.phone})</p>"
                f"<p>{detail}</p>"
                f"<p>{cons_in.notes or ''}</p>"
                f'<p><a href="{settings.SITE_URL}/admin/appointments" style="color:#033F80;">Review in the admin panel</a></p>',
            ),
            f"{current_user.name} ({current_user.email}) requested: {detail}",
        )
    return new_cons

@router.patch("/consultations/{cons_id}", response_model=ConsultationResponse)
async def update_consultation(cons_id: int, cons_in: ConsultationUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultation).where(Consultation.id == cons_id, Consultation.user_id == current_user.id))
    cons = result.scalars().first()
    if not cons:
        raise HTTPException(status_code=404, detail="Consultation not found")
    # A client can only cancel
    if cons_in.status == "cancelled":
        cons.status = ConsultStatusEnum.cancelled
        await db.commit()
        await db.refresh(cons)
    return cons

@router.get("/consultations/slots", response_model=List[ConsultationSlot])
async def get_slots(date: str, office: str = DEFAULT_OFFICE, db: AsyncSession = Depends(get_db)):
    when = parse_date_or_400(date)
    if office not in OFFICES:
        raise HTTPException(status_code=400, detail=f"Office must be one of: {', '.join(OFFICES)}")
    # Closed Sundays; nothing bookable in the past.
    if when.weekday() == 6 or when < date_cls.today():
        return []
    booked = await booked_slots_for(db, date, office)
    return [ConsultationSlot(slot=s, available=s not in booked) for s in all_slots()]

@router.post("/documents/presign")
async def presign_document(filename: str, current_user: User = Depends(get_current_user)):
    # Mock returning a presigned URL. Real impl would use boto3 and R2 credentials.
    return {"url": f"https://mock-r2-url.com/upload/{current_user.id}/{filename}"}
