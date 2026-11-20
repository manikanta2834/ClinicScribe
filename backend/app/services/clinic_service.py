import re
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.user import User, UserRole
from app.models.clinic import Clinic, ClinicMembership, DoctorProfile
from app.schemas.clinic import OnboardingRequest, OnboardingResponse, ClinicResponse, DoctorProfileResponse


def slugify(text: str) -> str:
    """Generate URL-safe slug from clinic name."""
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", text)


class ClinicService:
    """Encapsulates multi-tenant onboarding and clinic management."""

    @staticmethod
    async def process_onboarding(
        user: User,
        data: OnboardingRequest,
        db: AsyncSession,
    ) -> OnboardingResponse:
        """Atomic provisioning of Clinic, ClinicMembership, and DoctorProfile."""
        
        # 1. Update User Name if provided
        user.full_name = data.doctor_full_name
        
        # 2. Generate unique clinic slug
        base_slug = slugify(data.clinic_name)
        slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

        # 3. Create Clinic
        clinic = Clinic(
            name=data.clinic_name,
            slug=slug,
            registration_number=data.registration_number,
            address=data.clinic_address,
            contact_email=data.clinic_email,
            contact_phone=data.clinic_phone,
            default_language=data.preferred_languages,
            subscription_tier=data.subscription_tier,
            is_active=True,
        )
        db.add(clinic)
        await db.flush()

        # 4. Create Clinic Membership (Owner + Doctor)
        membership = ClinicMembership(
            user_id=user.id,
            clinic_id=clinic.id,
            role=UserRole.CLINIC_OWNER,
            is_primary=True,
        )
        db.add(membership)

        # 5. Create Doctor Profile
        doctor_profile = DoctorProfile(
            user_id=user.id,
            clinic_id=clinic.id,
            medical_license_number=data.medical_license_number,
            specialization=data.specialization,
            qualifications=data.qualifications,
            preferred_languages=data.preferred_languages,
        )
        db.add(doctor_profile)

        # Commit atomic transaction
        await db.commit()
        await db.refresh(clinic)
        await db.refresh(doctor_profile)

        return OnboardingResponse(
            status="success",
            clinic=ClinicResponse.model_validate(clinic),
            doctor_profile=DoctorProfileResponse.model_validate(doctor_profile),
            message="Clinic onboarding completed successfully.",
        )

