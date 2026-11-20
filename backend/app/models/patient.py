import enum
import uuid
from datetime import date
from typing import Optional, List
from sqlalchemy import String, Date, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Gender(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class AllergySeverity(str, enum.Enum):
    MILD = "MILD"
    MODERATE = "MODERATE"
    SEVERE = "SEVERE"


class ConditionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    RESOLVED = "RESOLVED"
    CHRONIC = "CHRONIC"


class Patient(Base, UUIDMixin, TimestampMixin):
    """Patient record strictly isolated by clinic tenant boundary."""
    __tablename__ = "patients"

    clinic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinics.id", ondelete="CASCADE"), index=True, nullable=False)
    patient_code: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(128), nullable=False)
    last_name: Mapped[str] = mapped_column(String(128), nullable=False)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[Gender] = mapped_column(Enum(Gender, name="patient_gender"), default=Gender.MALE, nullable=False)
    blood_group: Mapped[Optional[str]] = mapped_column(String(16), default="O+", nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(32), index=True, nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(32), default="Tamil", nullable=False)

    # Relationships
    allergies = relationship("PatientAllergy", back_populates="patient", cascade="all, delete-orphan")
    medical_histories = relationship("MedicalHistory", back_populates="patient", cascade="all, delete-orphan")
    current_medications = relationship("CurrentMedication", back_populates="patient", cascade="all, delete-orphan")
    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")


class PatientAllergy(Base, UUIDMixin, TimestampMixin):
    """Documented allergies (e.g., Penicillin, NSAIDs, Peanuts)."""
    __tablename__ = "patient_allergies"

    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True, nullable=False)
    allergen: Mapped[str] = mapped_column(String(128), nullable=False)
    severity: Mapped[AllergySeverity] = mapped_column(Enum(AllergySeverity, name="allergy_severity"), default=AllergySeverity.MODERATE, nullable=False)
    reaction_notes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    patient = relationship("Patient", back_populates="allergies")


class MedicalHistory(Base, UUIDMixin, TimestampMixin):
    """Past conditions and chronic illnesses (e.g., Type 2 Diabetes, Hypertension)."""
    __tablename__ = "medical_histories"

    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True, nullable=False)
    condition_name: Mapped[str] = mapped_column(String(255), nullable=False)
    diagnosed_year: Mapped[Optional[int]] = mapped_column(nullable=True)
    status: Mapped[ConditionStatus] = mapped_column(Enum(ConditionStatus, name="condition_status"), default=ConditionStatus.ACTIVE, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    patient = relationship("Patient", back_populates="medical_histories")


class CurrentMedication(Base, UUIDMixin, TimestampMixin):
    """Active prescription medications patient is currently taking."""
    __tablename__ = "current_medications"

    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), index=True, nullable=False)
    medication_name: Mapped[str] = mapped_column(String(255), nullable=False)
    dosage: Mapped[str] = mapped_column(String(128), nullable=False)
    frequency: Mapped[str] = mapped_column(String(128), default="Once daily", nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    patient = relationship("Patient", back_populates="current_medications")

