import enum
import uuid
from typing import Optional
from sqlalchemy import String, Boolean, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class NotificationType(str, enum.Enum):
    CONSULTATION_PENDING = "CONSULTATION_PENDING"
    NOTE_APPROVED = "NOTE_APPROVED"
    QUOTA_WARNING = "QUOTA_WARNING"
    TEAM_INVITE = "TEAM_INVITE"
    SYSTEM = "SYSTEM"


class Notification(Base, UUIDMixin, TimestampMixin):
    """In-app notifications for doctors and clinic staff."""
    __tablename__ = "notifications"

    clinic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinics.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, name="notification_type"), default=NotificationType.SYSTEM, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    action_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

