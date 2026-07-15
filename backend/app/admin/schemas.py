from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.portal.schemas import ServiceRequestResponse, ConsultationResponse, MessageResponse

class AdminUserList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    phone: str
    created_at: datetime
    email_verified: bool
    requests_count: int
    consults_count: int

class AdminUserDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    phone: str
    created_at: datetime
    email_verified: bool
    requests: List[ServiceRequestResponse]
    consultations: List[ConsultationResponse]

class AdminConsultationUpdate(BaseModel):
    status: Optional[str] = None          # confirmed | completed | cancelled
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
    office: Optional[str] = None          # reassign to another branch
    preferred_date: Optional[str] = None  # reschedule
    slot: Optional[str] = None

class AdminConsultationItem(BaseModel):
    """ConsultationResponse enriched with who booked it."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    client_name: str
    client_email: str
    client_phone: str
    service_slug: Optional[str]
    request_id: Optional[int]
    preferred_date: str
    slot: str
    mode: str
    office: str
    status: str
    meeting_link: Optional[str]
    notes: Optional[str]
    created_at: datetime

class AdminRequestUpdate(BaseModel):
    assigned_admin_id: Optional[int] = None
    status: Optional[str] = None

class AdminRequestItem(BaseModel):
    """ServiceRequestResponse enriched with who filed it."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    client_name: str
    client_email: str
    client_phone: str
    service_slug: str
    title: str
    details: str
    status: str
    assigned_admin_id: Optional[int]
    created_at: datetime
    updated_at: datetime

class AdminStats(BaseModel):
    clients: int
    pending_consultations: int
    upcoming_consultations: int
    open_requests: int
    confirmed_subscribers: int
    newsletters_sent: int

class NewsletterCreate(BaseModel):
    subject: str
    body_mdx: str

class NewsletterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    subject: str
    body_mdx: str
    status: str
    sent_at: Optional[datetime] = None
    created_at: datetime

class NewsletterSendResult(BaseModel):
    newsletter_id: int
    recipients: int

class SubscriberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    phone: Optional[str]
    source: Optional[str]
    status: str
    created_at: datetime
