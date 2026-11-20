import enum
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class ConsultationStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    RECORDING = "RECORDING"
    PROCESSING = "PROCESSING"
    PENDING_REVIEW = "PENDING_REVIEW"
    APPROVED = "APPROVED"
    CANCELLED = "CANCELLED"


class NoteStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    AWAITING_DOCTOR_APPROVAL = "AWAITING_DOCTOR_APPROVAL"
    APPROVED = "APPROVED"


class ConsentRecord(Base, UUIDMixin, TimestampMixin):
    """Immutable record documenting explicit patient consent before recording."""
    __tablename__ = "consent_records"

    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True, nullable=False)
    consultation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("consultations.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    consent_type: Mapped[str] = mapped_column(String(64), default="VERBAL_AND_DIGITAL_CONFIRMATION", nullable=False)
    consent_text: Mapped[str] = mapped_column(
        Text,
        default="Patient has been informed and explicitly consented to audio recording for AI-assisted clinical note transcription under doctor review.",
        nullable=False,
    )
    is_consent_granted: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    witnessed_by_doctor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    granted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    consultation = relationship("Consultation", back_populates="consent_record")


class Consultation(Base, UUIDMixin, TimestampMixin):
    """A clinical encounter between Doctor and Patient."""
    __tablename__ = "consultations"

    clinic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinics.id", ondelete="CASCADE"), index=True, nullable=False)
    doctor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True, nullable=False)

    consultation_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    consultation_type: Mapped[str] = mapped_column(String(128), default="General Consultation", nullable=False)
    language_used: Mapped[str] = mapped_column(String(64), default="Tamil / English", nullable=False)
    status: Mapped[ConsultationStatus] = mapped_column(
        Enum(ConsultationStatus, name="consultation_status"),
        default=ConsultationStatus.PENDING_REVIEW,
        nullable=False,
    )
    note_status: Mapped[NoteStatus] = mapped_column(
        Enum(NoteStatus, name="note_status"),
        default=NoteStatus.AWAITING_DOCTOR_APPROVAL,
        nullable=False,
    )
    chief_complaint: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    has_patient_consent: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    audio_file_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="consultations")
    doctor = relationship("User")
    consent_record = relationship("ConsentRecord", back_populates="consultation", uselist=False, cascade="all, delete-orphan")
    clinical_note = relationship("ClinicalNote", back_populates="consultation", uselist=False, cascade="all, delete-orphan")
