from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic
from app.models.user import User
from app.models.clinic import Clinic
from app.schemas.user import UserResponse, UserSyncRequest
from app.schemas.clinic import ClinicResponse

router = APIRouter()


@router.post("/sync", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def sync_firebase_user(
    data: UserSyncRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Syncs Firebase profile data into ClinicScribe database."""
    current_user.full_name = data.full_name
    if data.avatar_url:
        current_user.avatar_url = data.avatar_url
    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.get("/me", status_code=status.HTTP_200_OK)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns authenticated user profile, assigned roles, and current clinic."""
    clinic_data = None
    try:
        clinic = await get_current_clinic(user=current_user, db=db)
        clinic_data = ClinicResponse.model_validate(clinic)
    except Exception:
        clinic_data = None

    return {
        "user": UserResponse.model_validate(current_user),
        "clinic": clinic_data,
        "onboarding_completed": clinic_data is not None,
    }

