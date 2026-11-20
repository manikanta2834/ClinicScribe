import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic
from app.models.clinic import Clinic
from app.models.user import User
from app.schemas.patient import (
    PatientCreate,
    PatientSummaryResponse,
    PatientDetailResponse,
    PatientPaginatedList,
)
from app.services.patient_service import PatientService

router = APIRouter()


@router.post("", response_model=PatientDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    data: PatientCreate,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> PatientDetailResponse:
    """Create a new patient within the authenticated clinic boundary."""
    patient = await PatientService.create_patient(clinic=clinic, data=data, db=db)
    return PatientDetailResponse.model_validate(patient)


@router.get("", response_model=PatientPaginatedList, status_code=status.HTTP_200_OK)
async def list_patients(
    search: Optional[str] = Query(None, description="Search by name, patient code, or phone"),
    language: Optional[str] = Query(None, description="Filter by patient language"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> PatientPaginatedList:
    """List and search patients with pagination, scoped to current clinic."""
    skip = (page - 1) * page_size
    items, total = await PatientService.list_patients(
        clinic=clinic,
        db=db,
        search=search,
        language=language,
        skip=skip,
        limit=page_size,
    )
    return PatientPaginatedList(
        total=total,
        page=page,
        page_size=page_size,
        items=[PatientSummaryResponse.model_validate(p) for p in items],
    )


@router.get("/{patient_id}", response_model=PatientDetailResponse, status_code=status.HTTP_200_OK)
async def get_patient_detail(
    patient_id: uuid.UUID,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> PatientDetailResponse:
    """Get full patient profile including allergies and medical history."""
    patient = await PatientService.get_patient(patient_id=patient_id, clinic=clinic, db=db)
    return PatientDetailResponse.model_validate(patient)

