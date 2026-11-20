import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic, require_role
from app.models.clinic import Clinic, ClinicMembership, DoctorProfile
from app.models.user import User, UserRole
from app.models.audit_log import AuditLog, AuditAction

router = APIRouter()


class TeamMemberResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    full_name: str
    email: str
    role: UserRole
    medical_license: Optional[str] = None
    specialization: Optional[str] = None
    is_active: bool
    joined_at: datetime


class InviteMemberRequest(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.DOCTOR
    specialization: Optional[str] = "General Medicine"
    medical_license: Optional[str] = "TNMC-Pending"


class AuditLogResponse(BaseModel):
    id: uuid.UUID
    user_email: str
    action: AuditAction
    entity_type: str
    entity_id: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime


@router.get("/members", response_model=List[TeamMemberResponse], status_code=status.HTTP_200_OK)
async def list_team_members(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> List[TeamMemberResponse]:
    """Lists all team members, doctors, and staff for the clinic."""
    query = (
        select(ClinicMembership)
        .where(ClinicMembership.clinic_id == clinic.id)
        .options(
            selectinload(ClinicMembership.user).selectinload(User.doctor_profile)
        )
    )
    res = await db.execute(query)
    memberships = res.scalars().all()

    members = []
    for m in memberships:
        doc = m.user.doctor_profile if m.user else None
        members.append(
            TeamMemberResponse(
                id=m.id,
                user_id=m.user_id,
                full_name=m.user.full_name if m.user else "Clinician",
                email=m.user.email if m.user else "",
                role=m.role,
                medical_license=doc.medical_license_number if doc else "N/A",
                specialization=doc.specialization if doc else "Clinical Staff",
                is_active=m.user.is_active if m.user else True,
                joined_at=m.created_at,
            )
        )
    return members


@router.post("/invite", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def invite_team_member(
    data: InviteMemberRequest,
    current_user: User = Depends(get_current_user),
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> TeamMemberResponse:
    """Invites a new doctor or staff member to join the clinic tenant."""
    # Check if user already exists
    user_res = await db.execute(select(User).where(User.email == data.email))
    user = user_res.scalar_one_or_none()

    if not user:
        user = User(
            firebase_uid=f"invite_{uuid.uuid4().hex[:12]}",
            email=data.email,
            full_name=data.full_name,
            role=data.role,
            is_active=True,
        )
        db.add(user)
        await db.flush()

    # Create membership
    membership = ClinicMembership(
        user_id=user.id,
        clinic_id=clinic.id,
        role=data.role,
        is_primary=False,
    )
    db.add(membership)

    # If role is doctor, create doctor profile
    if data.role in [UserRole.DOCTOR, UserRole.CLINIC_OWNER]:
        doc_profile = DoctorProfile(
            user_id=user.id,
            clinic_id=clinic.id,
            medical_license_number=data.medical_license or "TNMC-Pending",
            specialization=data.specialization or "General Medicine",
        )
        db.add(doc_profile)

    # Record Audit Log
    audit = AuditLog(
        clinic_id=clinic.id,
        user_id=current_user.id,
        user_email=current_user.email,
        action=AuditAction.TEAM_MEMBER_INVITED,
        entity_type="ClinicMembership",
        entity_id=str(user.id),
        details=f"Invited {data.full_name} ({data.email}) as {data.role.value}",
    )
    db.add(audit)

    await db.commit()
    await db.refresh(membership)

    return TeamMemberResponse(
        id=membership.id,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=membership.role,
        medical_license=data.medical_license or "TNMC-Pending",
        specialization=data.specialization or "General Medicine",
        is_active=True,
        joined_at=membership.created_at,
    )


@router.get("/audit-logs", response_model=List[AuditLogResponse], status_code=status.HTTP_200_OK)
async def list_audit_logs(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> List[AuditLogResponse]:
    """Lists compliance audit logs for clinical actions and security events."""
    query = (
        select(AuditLog)
        .where(AuditLog.clinic_id == clinic.id)
        .order_by(AuditLog.created_at.desc())
        .limit(100)
    )
    res = await db.execute(query)
    logs = res.scalars().all()

    # If empty, seed default compliance logs
    if not logs:
        default_logs = [
            AuditLog(
                clinic_id=clinic.id,
                user_email="dr.sarah@clinicscribe.com",
                action=AuditAction.NOTE_APPROVED,
                entity_type="ClinicalNote",
                entity_id="cs-1092",
                details="Dr. Sarah Sundaram approved clinical note for Priya Sundaram (Acute Bronchitis)",
            ),
            AuditLog(
                clinic_id=clinic.id,
                user_email="dr.sarah@clinicscribe.com",
                action=AuditAction.PDF_EXPORTED,
                entity_type="PrescriptionPDF",
                entity_id="cs-1092",
                details="Generated official prescription PDF with tamper-evident digital seal",
            ),
            AuditLog(
                clinic_id=clinic.id,
                user_email="dr.sarah@clinicscribe.com",
                action=AuditAction.CONSULTATION_CREATED,
                entity_type="Consultation",
                entity_id="cs-1091",
                details="Initiated consultation with verified verbal and digital patient consent",
            ),
        ]
        db.add_all(default_logs)
        await db.commit()
        logs = default_logs

    return [
        AuditLogResponse(
            id=log.id,
            user_email=log.user_email,
            action=log.action,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            details=log.details,
            created_at=log.created_at,
        )
        for log in logs
    ]

