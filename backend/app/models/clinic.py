import enum
import uuid
from typing import Optional, List
from sqlalchemy import String, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin
from app.models.user import UserRole


class SubscriptionTier(str, enum.Enum):
    """Clinic SaaS subscription tiers."""
    FREE_TRIAL = "FREE_TRIAL"
    DOCTOR_PLAN = "DOCTOR_PLAN"
    CLINIC_PLAN = "CLINIC_PLAN"
    ENTERPRISE = "ENTERPRISE"


class Clinic(Base, UUIDMixin, TimestampMixin):
    """Multi-tenant healthcare organization / clinic."""
    __tablename__ = "clinics"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    registration_number: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    
    # Multilingual default settings
    default_language: Mapped[str] = mapped_column(String(32), default="English / Tamil", nullable=False)
    
    # Subscription info
    subscription_tier: Mapped[SubscriptionTier] = mapped_column(
        Enum(SubscriptionTier, name="subscription_tier"),
        default=SubscriptionTier.FREE_TRIAL,
        nullable=False,
    )
    monthly_consultation_limit: Mapped[int] = mapped_column(default=50, nullable=False)
    current_month_usage: Mapped[int] = mapped_column(default=4, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    memberships = relationship("ClinicMembership", back_populates="clinic", cascade="all, delete-orphan")
    doctor_profiles = relationship("DoctorProfile", back_populates="clinic", cascade="all, delete-orphan")


class ClinicMembership(Base, UUIDMixin, TimestampMixin):
    """Association between User and Clinic defining tenant permissions."""
    __tablename__ = "clinic_memberships"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    clinic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinics.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), default=UserRole.DOCTOR, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="clinic_memberships")
    clinic = relationship("Clinic", back_populates="memberships")


class DoctorProfile(Base, UUIDMixin, TimestampMixin):
    """Clinical practitioner credentials and medical specialization."""
    __tablename__ = "doctor_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    clinic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clinics.id", ondelete="CASCADE"), nullable=False)
    medical_license_number: Mapped[str] = mapped_column(String(128), nullable=False)
    specialization: Mapped[str] = mapped_column(String(128), default="General Medicine", nullable=False)
    qualifications: Mapped[Optional[str]] = mapped_column(String(255), default="MBBS", nullable=True)
    preferred_languages: Mapped[str] = mapped_column(String(255), default="Tamil, English, Hindi", nullable=False)

    user = relationship("User", back_populates="doctor_profile")
    clinic = relationship("Clinic", back_populates="doctor_profiles")

