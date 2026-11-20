from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_clinic
from app.models.clinic import Clinic
from app.schemas.analytics import DashboardAnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/dashboard", response_model=DashboardAnalyticsResponse, status_code=status.HTTP_200_OK)
async def get_dashboard_analytics(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> DashboardAnalyticsResponse:
    """Returns real-time clinical KPIs, consultation trends, and activity."""
    return await AnalyticsService.get_dashboard_metrics(clinic=clinic, db=db)

