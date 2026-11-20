import uuid
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.clinic import SubscriptionTier
from app.models.user import UserRole


class ClinicBase(BaseModel):
    name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    registration_number: Optional[str] = None
    address: Optional[str] = None
    default_language: str = "Tamil / English"


class ClinicCreate(ClinicBase):
    pass


class ClinicResponse(ClinicBase):
    id: uuid.UUID
    slug: str
    subscription_tier: SubscriptionTier
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class DoctorProfileCreate(BaseModel):
    medical_license_number: str
    specialization: str
    qualifications: Optional[str] = "MBBS"
    preferred_languages: str = "Tamil, English, Hindi"


class DoctorProfileResponse(DoctorProfileCreate):
    id: uuid.UUID
    user_id: uuid.UUID
    clinic_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class OnboardingRequest(BaseModel):
    # Doctor Profile
    doctor_full_name: str
    medical_license_number: str
    specialization: str
    qualifications: str
    
    # Clinic Details
    clinic_name: str
    clinic_email: EmailStr
    clinic_phone: Optional[str] = None
    clinic_address: Optional[str] = None
    registration_number: Optional[str] = None
    
    # Multilingual & Subscription
    preferred_languages: str = "Tamil, English, Hindi"
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE_TRIAL


class OnboardingResponse(BaseModel):
    status: str
    clinic: ClinicResponse
    doctor_profile: DoctorProfileResponse
    message: str

