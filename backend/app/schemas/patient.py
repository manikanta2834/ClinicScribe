import uuid
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.patient import Gender, AllergySeverity, ConditionStatus


class AllergyBase(BaseModel):
    allergen: str
    severity: AllergySeverity = AllergySeverity.MODERATE
    reaction_notes: Optional[str] = None


class AllergyResponse(AllergyBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


class MedicalHistoryBase(BaseModel):
    condition_name: str
    diagnosed_year: Optional[int] = None
    status: ConditionStatus = ConditionStatus.ACTIVE
    notes: Optional[str] = None


class MedicalHistoryResponse(MedicalHistoryBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


class MedicationBase(BaseModel):
    medication_name: str
    dosage: str
    frequency: str = "Once daily"
    is_active: bool = True


class MedicationResponse(MedicationBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender = Gender.MALE
    blood_group: Optional[str] = "O+"
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    preferred_language: str = "Tamil"


class PatientCreate(PatientBase):
    allergies: Optional[List[AllergyBase]] = []
    medical_histories: Optional[List[MedicalHistoryBase]] = []
    current_medications: Optional[List[MedicationBase]] = []


class PatientSummaryResponse(PatientBase):
    id: uuid.UUID
    clinic_id: uuid.UUID
    patient_code: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PatientDetailResponse(PatientSummaryResponse):
    allergies: List[AllergyResponse] = []
    medical_histories: List[MedicalHistoryResponse] = []
    current_medications: List[MedicationResponse] = []


class PatientPaginatedList(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[PatientSummaryResponse]

