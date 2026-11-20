import enum
import uuid
from typing import Optional
from sqlalchemy import String, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class AuditAction(str, enum.Enum):
    CONSULTATION_CREATED = "CONSULTATION_CREATED"
    AUDIO_PROCESSED = "AUDIO_PROCESSED"
    NOTE_EDITED = "NOTE_EDITED"
    NOTE_APPROVED = "NOTE_APPROVED"
    PDF_EXPORTED = "PDF_EXPORTED"
    TEAM_MEMBER_INVITED = "TEAM_MEMBER_INVITED"
    SUBSCRIPTION_UPGRADED = "SUBSCRIPTION_UPGRADED"


class AuditLog(Base, UUIDMixin, TimestampMixin):
    """Immutable audit trail for DPDP Act & healthcare SaaS compliance."""
    __tablename__ = "audit_logs"

    clinic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinics.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_email: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[AuditAction] = mapped_column(Enum(AuditAction, name="audit_action"), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entity_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(64), default="127.0.0.1", nullable=True)

