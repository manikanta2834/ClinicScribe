import enum
from typing import Optional
from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class UserRole(str, enum.Enum):
    """Role-based access levels."""
    PLATFORM_ADMIN = "PLATFORM_ADMIN"
    CLINIC_OWNER = "CLINIC_OWNER"
    CLINIC_ADMIN = "CLINIC_ADMIN"
    DOCTOR = "DOCTOR"
    STAFF = "STAFF"


class User(Base, UUIDMixin, TimestampMixin):
    """Authenticated user account linked to Firebase Authentication."""
    __tablename__ = "users"

    firebase_uid: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"),
        default=UserRole.DOCTOR,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # Relationships
    clinic_memberships = relationship("ClinicMembership", back_populates="user", cascade="all, delete-orphan")
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

