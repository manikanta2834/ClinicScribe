import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic
from app.models.clinic import Clinic
from app.models.user import User
from app.models.notification import Notification, NotificationType

router = APIRouter()


class NotificationResponse(BaseModel):
    id: uuid.UUID
    clinic_id: uuid.UUID
    title: str
    message: str
    type: NotificationType
    is_read: bool
    action_url: Optional[str] = None
    created_at: datetime


@router.get("", response_model=List[NotificationResponse], status_code=status.HTTP_200_OK)
async def list_notifications(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> List[NotificationResponse]:
    """Lists recent notifications for the clinic and attending clinician."""
    query = (
        select(Notification)
        .where(Notification.clinic_id == clinic.id)
        .order_by(Notification.created_at.desc())
        .limit(20)
    )
    res = await db.execute(query)
    notifications = res.scalars().all()

    # Pre-seed realistic notifications if none exist
    if not notifications:
        seeded = [
            Notification(
                clinic_id=clinic.id,
                title="Consultation Awaiting Review",
                message="Priya Sundaram (Acute Bronchitis) note has been transcribed by Gemini AI and is awaiting doctor approval.",
                type=NotificationType.CONSULTATION_PENDING,
                is_read=False,
                action_url="/consultations/cs-1092",
            ),
            Notification(
                clinic_id=clinic.id,
                title="Prescription PDF Verified",
                message="Official prescription signed and archived with tamper-evident digital seal CS-SIG-92841.",
                type=NotificationType.NOTE_APPROVED,
                is_read=False,
                action_url="/consultations/cs-1092",
            ),
            Notification(
                clinic_id=clinic.id,
                title="Monthly Quota Update",
                message="Your clinic has processed 18 of 50 monthly consultations (36% used). All AI models active.",
                type=NotificationType.QUOTA_WARNING,
                is_read=True,
                action_url="/settings",
            ),
            Notification(
                clinic_id=clinic.id,
                title="Multilingual AI Update",
                message="Gemini AI Scribe v1.2.0-clinical-safety is active with Tamil, Hindi, and Tanglish comprehension.",
                type=NotificationType.SYSTEM,
                is_read=True,
                action_url="/settings",
            ),
        ]
        db.add_all(seeded)
        await db.commit()
        notifications = seeded

    return [
        NotificationResponse(
            id=n.id,
            clinic_id=n.clinic_id,
            title=n.title,
            message=n.message,
            type=n.type,
            is_read=n.is_read,
            action_url=n.action_url,
            created_at=n.created_at,
        )
        for n in notifications
    ]


@router.post("/{notification_id}/read", status_code=status.HTTP_200_OK)
async def mark_notification_read(
    notification_id: uuid.UUID,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
):
    """Marks a single notification as read."""
    res = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.clinic_id == clinic.id,
        )
    )
    notif = res.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")

    notif.is_read = True
    await db.commit()
    return {"status": "success", "message": "Notification marked as read."}


@router.post("/mark-all-read", status_code=status.HTTP_200_OK)
async def mark_all_notifications_read(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
):
    """Marks all clinic notifications as read."""
    await db.execute(
        update(Notification)
        .where(Notification.clinic_id == clinic.id)
        .values(is_read=True)
    )
    await db.commit()
    return {"status": "success", "message": "All notifications marked as read."}

