from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic
from app.models.user import User
from app.models.clinic import Clinic
from app.schemas.clinic import OnboardingRequest, OnboardingResponse, ClinicResponse
from app.services.clinic_service import ClinicService

router = APIRouter()


@router.post("/onboarding", response_model=OnboardingResponse, status_code=status.HTTP_201_CREATED)
async def complete_onboarding(
    data: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> OnboardingResponse:
    """Multi-step onboarding establishing Clinic, Membership, and Doctor credentials."""
    return await ClinicService.process_onboarding(
        user=current_user,
        data=data,
        db=db,
    )


@router.get("/current", response_model=ClinicResponse, status_code=status.HTTP_200_OK)
async def get_active_clinic(
    clinic: Clinic = Depends(get_current_clinic),
) -> ClinicResponse:
    """Returns currently selected tenant clinic details."""
    return ClinicResponse.model_validate(clinic)

