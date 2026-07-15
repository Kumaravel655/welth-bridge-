from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# Profile
class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    email_verified: bool
    role: str
    open_requests_count: int
    upcoming_consults_count: int

# Service Requests
class ServiceRequestCreate(BaseModel):
    service_slug: str
    title: str
    details: str

class ServiceRequestUpdate(BaseModel):
    title: Optional[str] = None
    details: Optional[str] = None
    status: Optional[str] = None

class ServiceRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    service_slug: str
    title: str
    details: str
    status: str
    assigned_admin_id: Optional[int]
    created_at: datetime
    updated_at: datetime

# Consultations
class ConsultationCreate(BaseModel):
    service_slug: Optional[str] = None
    request_id: Optional[int] = None
    preferred_date: str
    slot: str
    mode: str
    office: Optional[str] = None  # required when mode == "office"; defaults to head office
    notes: Optional[str] = None

class ConsultationUpdate(BaseModel):
    status: Optional[str] = None  # clients may only cancel

class ConsultationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
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

class ConsultationSlot(BaseModel):
    slot: str
    available: bool

# Messages
class MessageCreate(BaseModel):
    body: str
    attachments: Optional[dict] = None

class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    request_id: int
    sender_id: int
    sender_role: str
    body: str
    attachments: Optional[dict]
    read_at: Optional[datetime]
    created_at: datetime
