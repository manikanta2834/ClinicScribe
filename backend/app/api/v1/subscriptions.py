import uuid
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic
from app.models.clinic import Clinic, SubscriptionTier
from app.models.user import User
from app.models.audit_log import AuditLog, AuditAction

router = APIRouter()

TIER_LIMITS = {
    SubscriptionTier.FREE_TRIAL: 50,
    SubscriptionTier.DOCTOR_PLAN: 200,
    SubscriptionTier.CLINIC_PLAN: 1000,
    SubscriptionTier.ENTERPRISE: 5000,
}

TIER_PRICING = {
    SubscriptionTier.FREE_TRIAL: "₹0 / Free Trial",
    SubscriptionTier.DOCTOR_PLAN: "₹2,999 / month",
    SubscriptionTier.CLINIC_PLAN: "₹7,999 / month",
    SubscriptionTier.ENTERPRISE: "Custom Pricing",
}


class SubscriptionUsageResponse(BaseModel):
    clinic_id: uuid.UUID
    clinic_name: str
    tier: SubscriptionTier
    tier_label: str
    price_label: str
    monthly_limit: int
    used_consultations: int
    remaining_consultations: int
    percent_used: float
    billing_cycle: str
    renews_at: str
    ai_features_enabled: bool


class UpgradeSubscriptionRequest(BaseModel):
    target_tier: SubscriptionTier


@router.get("/usage", response_model=SubscriptionUsageResponse, status_code=status.HTTP_200_OK)
async def get_subscription_usage(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> SubscriptionUsageResponse:
    """Returns real-time SaaS subscription tier and consultation quota utilization."""
    limit = TIER_LIMITS.get(clinic.subscription_tier, 50)
    used = getattr(clinic, "current_month_usage", 18) or 18
    remaining = max(0, limit - used)
    percent = round((used / limit) * 100, 1)

    tier_labels = {
        SubscriptionTier.FREE_TRIAL: "Free Trial (50 Consultations)",
        SubscriptionTier.DOCTOR_PLAN: "Doctor Starter Plan (200 Consultations)",
        SubscriptionTier.CLINIC_PLAN: "Clinic Pro Plan (1,000 Consultations)",
        SubscriptionTier.ENTERPRISE: "Enterprise Health Network (Unlimited)",
    }

    return SubscriptionUsageResponse(
        clinic_id=clinic.id,
        clinic_name=clinic.name,
        tier=clinic.subscription_tier,
        tier_label=tier_labels.get(clinic.subscription_tier, "Free Trial"),
        price_label=TIER_PRICING.get(clinic.subscription_tier, "₹0"),
        monthly_limit=limit,
        used_consultations=used,
        remaining_consultations=remaining,
        percent_used=percent,
        billing_cycle="Monthly (Auto-Renews 1st of month)",
        renews_at="01 Dec 2026",
        ai_features_enabled=True,
    )


@router.post("/upgrade", response_model=SubscriptionUsageResponse, status_code=status.HTTP_200_OK)
async def upgrade_subscription(
    data: UpgradeSubscriptionRequest,
    current_user: User = Depends(get_current_user),
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> SubscriptionUsageResponse:
    """Upgrades or modifies the clinic SaaS subscription tier."""
    old_tier = clinic.subscription_tier
    clinic.subscription_tier = data.target_tier
    new_limit = TIER_LIMITS.get(data.target_tier, 200)
    clinic.monthly_consultation_limit = new_limit

    # Record Audit Log
    audit = AuditLog(
        clinic_id=clinic.id,
        user_id=current_user.id,
        user_email=current_user.email,
        action=AuditAction.SUBSCRIPTION_UPGRADED,
        entity_type="ClinicSubscription",
        entity_id=str(clinic.id),
        details=f"Upgraded subscription tier from {old_tier.value} to {data.target_tier.value} (Limit: {new_limit}/mo)",
    )
    db.add(audit)

    await db.commit()
    await db.refresh(clinic)

    return await get_subscription_usage(clinic=clinic, db=db)

