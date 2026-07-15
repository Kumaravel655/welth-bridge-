from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    client = "client"
    admin = "admin"

class RequestStatusEnum(str, enum.Enum):
    submitted = "submitted"
    in_review = "in_review"
    in_progress = "in_progress"
    needs_docs = "needs_docs"
    completed = "completed"
    cancelled = "cancelled"

class ConsultStatusEnum(str, enum.Enum):
    requested = "requested"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"

class ModeEnum(str, enum.Enum):
    call = "call"
    video = "video"
    office = "office"

class SubscriberStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    unsubscribed = "unsubscribed"

class NewsletterStatusEnum(str, enum.Enum):
    draft = "draft"
    scheduled = "scheduled"
    sending = "sending"
    sent = "sent"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    email_verified = Column(Boolean, default=False)
    phone = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.client, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Verification(Base):
    __tablename__ = "verifications"
    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, index=True, nullable=False)
    value = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_slug = Column(String, nullable=False)
    title = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    status = Column(Enum(RequestStatusEnum), default=RequestStatusEnum.submitted, nullable=False)
    assigned_admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_slug = Column(String, nullable=True)
    request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=True)
    preferred_date = Column(String, nullable=False) # e.g. YYYY-MM-DD
    slot = Column(String, nullable=False) # e.g. 10:00
    office = Column(String, nullable=False, server_default="Vellore") # Vellore | Arakkonam | Ranipet
    mode = Column(Enum(ModeEnum), nullable=False)
    status = Column(Enum(ConsultStatusEnum), default=ConsultStatusEnum.requested, nullable=False)
    meeting_link = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender_role = Column(Enum(RoleEnum), nullable=False)
    body = Column(Text, nullable=False)
    attachments = Column(JSON, nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ClientDocument(Base):
    __tablename__ = "client_documents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=True)
    storage_key = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    mime = Column(String, nullable=False)
    size_bytes = Column(Integer, nullable=False)
    direction = Column(String, nullable=False) # client_upload, admin_share
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subscriber(Base):
    __tablename__ = "subscribers"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    source = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    status = Column(Enum(SubscriberStatusEnum), default=SubscriberStatusEnum.pending, nullable=False)
    confirm_token = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)

class Newsletter(Base):
    __tablename__ = "newsletters"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    body_mdx = Column(Text, nullable=False)
    status = Column(Enum(NewsletterStatusEnum), default=NewsletterStatusEnum.draft, nullable=False)
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    audience_filter = Column(JSON, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class NewsletterSend(Base):
    __tablename__ = "newsletter_sends"
    id = Column(Integer, primary_key=True, index=True)
    newsletter_id = Column(Integer, ForeignKey("newsletters.id"), nullable=False)
    subscriber_id = Column(Integer, ForeignKey("subscribers.id"), nullable=False)
    status = Column(String, nullable=False) # queued, sent, failed, bounced
    sent_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)
