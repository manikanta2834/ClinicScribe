from fastapi import APIRouter, status
from pydantic import BaseModel
from typing import Dict
from app.core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    services: Dict[str, str]


@router.get("/healthz", response_model=HealthResponse, status_code=status.HTTP_200_OK)
@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check() -> HealthResponse:
    """Liveness probe for Cloud Run and local health monitors."""
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        services={
            "database": "ready",
            "gemini_ai": "configured" if settings.GEMINI_API_KEY else "unconfigured",
            "storage": "ready",
        },
    )


@router.get("/readyz", status_code=status.HTTP_200_OK)
async def readiness_probe() -> Dict[str, str]:
    """Readiness probe indicating application is prepared to receive traffic."""
    return {"status": "ready"}

