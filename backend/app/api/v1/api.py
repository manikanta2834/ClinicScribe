from fastapi import APIRouter
from app.api.v1 import (
    health,
    auth,
    clinics,
    patients,
    analytics,
    consultations,
    admin,
    notifications,
    subscriptions,
)

api_router = APIRouter()

# Health & Diagnostics
api_router.include_router(health.router, tags=["Health"])

# Authentication & Session Sync (Phase 2)
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Multi-Tenant Clinic Management & Onboarding (Phase 2)
api_router.include_router(clinics.router, prefix="/clinics", tags=["Clinics"])

# Patient Directory, History & Medical Records (Phase 3)
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])

# Real-Time Analytics & Dashboard Metrics (Phase 3)
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

# Consultation Workspace & Gemini AI Engine (Phase 4 & 5)
api_router.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])

# Multi-Tenant Administration & Team Management (Phase 6)
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])

# In-App Notification Center (Phase 6)
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])

# SaaS Subscriptions & Quota Metering (Phase 6)
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["Subscriptions"])
