"""Seed script for ClinicScribe synthetic multilingual patient and consultation data."""
import asyncio
import uuid
from datetime import date, datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine
from app.models.base import Base
from app.models.clinic import Clinic, ClinicMembership, DoctorProfile, SubscriptionTier
from app.models.user import User, UserRole
from app.models.patient import Patient, PatientAllergy, MedicalHistory, CurrentMedication, Gender, AllergySeverity, ConditionStatus
from app.models.consultation import Consultation, ConsultationStatus, NoteStatus
from app.models.clinical_note import ClinicalNote
from app.models.notification import Notification, NotificationType
from app.models.audit_log import AuditLog, AuditAction


async def seed_data():
    print("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Create or get Demo User (Dr. Sarah)
        doctor = User(
            id=uuid.uuid4(),
            firebase_uid="dev_doctor_uid_sarah",
            email="dr.sarah@cityhealth.com",
            full_name="Dr. Sarah Sundaram",
            role=UserRole.DOCTOR,
            is_active=True,
        )
        session.add(doctor)
        await session.flush()

        # 2. Create Demo Clinic
        clinic = Clinic(
            id=uuid.uuid4(),
            name="City Health Clinic",
            slug="city-health-clinic-001",
            registration_number="REG-TN-2024-8842",
            address="142 Anna Salai, Chennai, Tamil Nadu",
            contact_email="dr.sarah@cityhealth.com",
            contact_phone="+91 98401 23456",
            default_language="Tamil, English, Hindi",
            subscription_tier=SubscriptionTier.DOCTOR_PLAN,
            is_active=True,
        )
        session.add(clinic)
        await session.flush()

        # 3. Create Membership
        membership = ClinicMembership(
            user_id=doctor.id,
            clinic_id=clinic.id,
            role=UserRole.CLINIC_OWNER,
            is_primary=True,
        )
        session.add(membership)

        # 4. Create Doctor Profile
        profile = DoctorProfile(
            user_id=doctor.id,
            clinic_id=clinic.id,
            medical_license_number="TN-MC-84920",
            specialization="General Medicine",
            qualifications="MBBS, MD",
            preferred_languages="Tamil, English, Hindi",
        )
        session.add(profile)

        # 5. Create Synthetic Patients (Tamil, Hindi, English cases)
        p1 = Patient(
            clinic_id=clinic.id,
            patient_code="CS-P-1001",
            first_name="Priya",
            last_name="Sundaram",
            date_of_birth=date(1988, 6, 14),
            gender=Gender.FEMALE,
            blood_group="O+",
            phone="+91 98401 23456",
            email="priya.s@gmail.com",
            address="T. Nagar, Chennai",
            preferred_language="Tamil",
        )
        session.add(p1)
        await session.flush()

        al1 = PatientAllergy(
            patient_id=p1.id,
            allergen="Penicillin",
            severity=AllergySeverity.SEVERE,
            reaction_notes="Anaphylaxis urticaria and breathing tightness",
        )
        mh1 = MedicalHistory(
            patient_id=p1.id,
            condition_name="Hypothyroidism",
            diagnosed_year=2021,
            status=ConditionStatus.ACTIVE,
        )
        med1 = CurrentMedication(
            patient_id=p1.id,
            medication_name="Thyronorm (Levothyroxine)",
            dosage="50mcg",
            frequency="Once daily morning empty stomach",
            is_active=True,
        )
        session.add_all([al1, mh1, med1])

        # Patient 2: Aarav Sharma (Hindi/English)
        p2 = Patient(
            clinic_id=clinic.id,
            patient_code="CS-P-1002",
            first_name="Aarav",
            last_name="Sharma",
            date_of_birth=date(1975, 11, 20),
            gender=Gender.MALE,
            blood_group="B+",
            phone="+91 98112 34567",
            email="aarav.sharma@yahoo.com",
            address="Indiranagar, Bangalore",
            preferred_language="Hindi / English",
        )
        session.add(p2)
        await session.flush()

        al2 = PatientAllergy(
            patient_id=p2.id,
            allergen="Aspirin",
            severity=AllergySeverity.MODERATE,
            reaction_notes="Gastric irritation",
        )
        mh2 = MedicalHistory(
            patient_id=p2.id,
            condition_name="Essential Hypertension",
            diagnosed_year=2019,
            status=ConditionStatus.CHRONIC,
        )
        med2 = CurrentMedication(
            patient_id=p2.id,
            medication_name="Telmisartan",
            dosage="40mg",
            frequency="Once daily morning",
            is_active=True,
        )
        session.add_all([al2, mh2, med2])

        # Consultations for both patients
        c1 = Consultation(
            clinic_id=clinic.id,
            doctor_id=doctor.id,
            patient_id=p1.id,
            consultation_date=datetime.now(timezone.utc),
            consultation_type="Endocrinology Review",
            language_used="Tamil",
            status=ConsultationStatus.APPROVED,
            note_status=NoteStatus.APPROVED,
            chief_complaint="Routine thyroid follow-up. Mild morning fatigue.",
            has_patient_consent=True,
        )
        c2 = Consultation(
            clinic_id=clinic.id,
            doctor_id=doctor.id,
            patient_id=p2.id,
            consultation_date=datetime.now(timezone.utc),
            consultation_type="Cardiology Review",
            language_used="Hindi / English",
            status=ConsultationStatus.PENDING_REVIEW,
            note_status=NoteStatus.AWAITING_DOCTOR_APPROVAL,
            chief_complaint="Chest congestion for 3 days and blood pressure review.",
            has_patient_consent=True,
        )
        session.add_all([c1, c2])

        await session.commit()
        print("Database seeded successfully with demo clinic, doctor, and multilingual synthetic patients!")


if __name__ == "__main__":
    asyncio.run(seed_data())

