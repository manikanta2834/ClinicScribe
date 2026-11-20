import logging
from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.clinic import Clinic, ClinicMembership

logger = logging.getLogger(__name__)

# Security scheme
security_bearer = HTTPBearer(auto_error=False)

# Initialize Firebase Admin if project ID is provided
try:
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
        logger.info("Firebase Admin initialized successfully.")
except Exception as e:
    logger.warning(f"Firebase Admin not initialized with GCP ADC: {e}. Running in dev-tolerant mode.")


async def verify_firebase_token(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> dict:
    """Verifies Firebase ID token or dev token from Authorization header."""
    if not auth_header:
        # Development mock fallback when in development mode
        if settings.ENVIRONMENT == "development":
            return {
                "uid": "dev_doctor_uid_sarah",
                "email": "dr.sarah@cityhealth.com",
                "name": "Dr. Sarah",
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header with Bearer token.",
        )

    token = auth_header.credentials

    # Support dev token directly
    if settings.ENVIRONMENT == "development" and token.startswith("dev-"):
        return {
            "uid": token,
            "email": "dr.sarah@cityhealth.com",
            "name": "Dr. Sarah",
        }

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Firebase token verification failed: {e}")
        # Allow dev fallback if Firebase Admin is unconfigured
        if settings.DEBUG:
            return {
                "uid": "dev_doctor_uid_sarah",
                "email": "dr.sarah@cityhealth.com",
                "name": "Dr. Sarah",
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token.",
        )


async def get_current_user(
    token_payload: dict = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Resolves authenticated User from database or syncs new Firebase user."""
    firebase_uid = token_payload.get("uid")
    email = token_payload.get("email", "unknown@clinicscribe.dev")
    name = token_payload.get("name", "Dr. Sarah")

    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()

    if not user:
        # Create user record automatically on first verified login
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            full_name=name,
            role=UserRole.DOCTOR,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated.",
        )

    return user


async def get_current_clinic(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Clinic:
    """Enforces tenant context by resolving the user's primary clinic."""
    result = await db.execute(
        select(Clinic)
        .join(ClinicMembership, ClinicMembership.clinic_id == Clinic.id)
        .where(ClinicMembership.user_id == user.id, ClinicMembership.is_primary == True)
    )
    clinic = result.scalar_one_or_none()

    if not clinic:
        # Fallback to any clinic membership
        result = await db.execute(
            select(Clinic)
            .join(ClinicMembership, ClinicMembership.clinic_id == Clinic.id)
            .where(ClinicMembership.user_id == user.id)
        )
        clinic = result.scalar_one_or_none()

    if not clinic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No clinic association found for this user. Please complete onboarding.",
        )

    return clinic


def require_role(allowed_roles: List[UserRole]):
    """Role-based access control dependency factory."""
    def role_checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: User lacks required role ({user.role.value}).",
            )
        return user
    return role_checker

