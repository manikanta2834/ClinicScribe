import uuid
from typing import Optional, Tuple, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.clinic import Clinic
from app.models.patient import Patient, PatientAllergy, MedicalHistory, CurrentMedication
from app.schemas.patient import PatientCreate, PatientSummaryResponse, PatientDetailResponse


class PatientService:
    """Manages tenant-isolated patient records, medical histories, and allergies."""

    @staticmethod
    async def create_patient(
        clinic: Clinic,
        data: PatientCreate,
        db: AsyncSession,
    ) -> Patient:
        # Generate sequential patient code
        count_query = select(func.count(Patient.id)).where(Patient.clinic_id == clinic.id)
        count_res = await db.execute(count_query)
        total_clinic_patients = count_res.scalar() or 0
        patient_code = f"CS-P-{1001 + total_clinic_patients}"

        patient = Patient(
            clinic_id=clinic.id,
            patient_code=patient_code,
            first_name=data.first_name,
            last_name=data.last_name,
            date_of_birth=data.date_of_birth,
            gender=data.gender,
            blood_group=data.blood_group,
            phone=data.phone,
            email=data.email,
            address=data.address,
            preferred_language=data.preferred_language,
        )
        db.add(patient)
        await db.flush()

        # Add initial allergies if provided
        if data.allergies:
            for al in data.allergies:
                allergy_obj = PatientAllergy(
                    patient_id=patient.id,
                    allergen=al.allergen,
                    severity=al.severity,
                    reaction_notes=al.reaction_notes,
                )
                db.add(allergy_obj)

        # Add medical histories if provided
        if data.medical_histories:
            for mh in data.medical_histories:
                history_obj = MedicalHistory(
                    patient_id=patient.id,
                    condition_name=mh.condition_name,
                    diagnosed_year=mh.diagnosed_year,
                    status=mh.status,
                    notes=mh.notes,
                )
                db.add(history_obj)

        # Add current medications if provided
        if data.current_medications:
            for med in data.current_medications:
                med_obj = CurrentMedication(
                    patient_id=patient.id,
                    medication_name=med.medication_name,
                    dosage=med.dosage,
                    frequency=med.frequency,
                    is_active=med.is_active,
                )
                db.add(med_obj)

        await db.commit()
        return await PatientService.get_patient(patient_id=patient.id, clinic=clinic, db=db)

    @staticmethod
    async def list_patients(
        clinic: Clinic,
        db: AsyncSession,
        search: Optional[str] = None,
        language: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Patient], int]:
        query = select(Patient).where(Patient.clinic_id == clinic.id)

        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Patient.first_name.ilike(search_term),
                    Patient.last_name.ilike(search_term),
                    Patient.patient_code.ilike(search_term),
                    Patient.phone.ilike(search_term),
                )
            )

        if language:
            query = query.where(Patient.preferred_language == language)

        # Total count for pagination
        count_query = select(func.count()).select_from(query.subquery())
        count_res = await db.execute(count_query)
        total = count_res.scalar() or 0

        # Paginated fetch
        query = query.order_by(Patient.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        patients = result.scalars().all()

        return list(patients), total

    @staticmethod
    async def get_patient(
        patient_id: uuid.UUID,
        clinic: Clinic,
        db: AsyncSession,
    ) -> Patient:
        query = (
            select(Patient)
            .where(Patient.id == patient_id, Patient.clinic_id == clinic.id)
            .options(
                selectinload(Patient.allergies),
                selectinload(Patient.medical_histories),
                selectinload(Patient.current_medications),
            )
        )
        result = await db.execute(query)
        patient = result.scalar_one_or_none()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found or belongs to another clinic.",
            )
        return patient

