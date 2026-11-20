import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.DOCTOR


class UserCreate(UserBase):
    firebase_uid: str


class UserSyncRequest(BaseModel):
    firebase_uid: str
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: uuid.UUID
    firebase_uid: str
    is_active: bool
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

