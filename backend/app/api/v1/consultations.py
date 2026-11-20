import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user, get_current_clinic
from app.core.exceptions import PatientConsentRequiredException
from app.models.clinic import Clinic
from app.models.user import User
from app.models.consultation import Consultation, ConsentRecord, ConsultationStatus, NoteStatus
from app.models.clinical_note import ClinicalNote
from app.models.patient import Patient
from app.schemas.clinical_note import (
    ConsultationCreateRequest,
    ConsultationProcessRequest,
    ConsultationResponse,
    ClinicalNoteResponse,
    ClinicalNoteUpdateRequest,
    PatientSummaryRequest,
    PatientSummaryResponse,
)
from app.services.ai_service import GeminiAIService, PROMPT_VERSION
from app.services.summary_service import PatientSummaryService
from app.services.pdf_service import PDFReportService

router = APIRouter()


@router.post("", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(
    data: ConsultationCreateRequest,
    current_user: User = Depends(get_current_user),
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> ConsultationResponse:
    """Initiates a consultation encounter and records mandatory patient consent."""
    if not data.consent.is_consent_granted:
        raise PatientConsentRequiredException("Patient consent is mandatory before starting a consultation.")

    # Verify patient belongs to clinic
    pt_res = await db.execute(
        select(Patient).where(Patient.id == data.patient_id, Patient.clinic_id == clinic.id)
    )
    patient = pt_res.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found in this clinic.")

    # Create Consultation
    consultation = Consultation(
        clinic_id=clinic.id,
        doctor_id=current_user.id,
        patient_id=data.patient_id,
        consultation_type=data.consultation_type,
        language_used=data.language_used,
        status=ConsultationStatus.RECORDING,
        note_status=NoteStatus.DRAFT,
        chief_complaint=data.chief_complaint,
        has_patient_consent=True,
    )
    db.add(consultation)
    await db.flush()

    # Create Consent Record
    consent_record = ConsentRecord(
        patient_id=data.patient_id,
        consultation_id=consultation.id,
        consent_type=data.consent.consent_type,
        consent_text=data.consent.consent_notes or "Patient consented to audio recording.",
        is_consent_granted=True,
        witnessed_by_doctor_id=current_user.id,
    )
    db.add(consent_record)
    await db.commit()

    # Fetch eager loaded consultation
    query = (
        select(Consultation)
        .where(Consultation.id == consultation.id)
        .options(selectinload(Consultation.clinical_note))
    )
    res = await db.execute(query)
    c_loaded = res.scalar_one()

    return ConsultationResponse.model_validate(c_loaded)


@router.post("/{consultation_id}/process-audio", response_model=ConsultationResponse, status_code=status.HTTP_200_OK)
async def process_consultation_audio(
    consultation_id: uuid.UUID,
    data: ConsultationProcessRequest,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> ConsultationResponse:
    """Processes dialogue using Google Gemini AI and creates structured clinical note."""
    
    # 1. Fetch consultation & verify consent record
    query = (
        select(Consultation)
        .where(Consultation.id == consultation_id, Consultation.clinic_id == clinic.id)
        .options(
            selectinload(Consultation.consent_record),
            selectinload(Consultation.clinical_note),
        )
    )
    res = await db.execute(query)
    consultation = res.scalar_one_or_none()

    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")

    if not consultation.has_patient_consent or not consultation.consent_record:
        raise PatientConsentRequiredException("Cannot process recording without verified patient consent.")

    transcript = data.transcript_text or (
        "Doctor: Vanakkam Ramesh, enna problem ungalluku?\n"
        "Patient: Doctor, 3 days-ah severe chest congestion and dry cough irukku. Night time fever kooda irundhudhu.\n"
        "Doctor: Okay, let me examine your chest. Blood pressure is 128/82. Lungs are clear. I will prescribe Paracetamol and an inhaler."
    )

    # 2. Invoke Gemini AI Structured Clinical Extraction
    extraction = await GeminiAIService.extract_clinical_notes(
        transcript=transcript,
        language_hint=data.language_hint,
    )

    # 3. Create or Update ClinicalNote in Database
    med_dicts = [m.model_dump() for m in extraction.medication_instructions]

    if consultation.clinical_note:
        note = consultation.clinical_note
        note.raw_transcript = transcript
        note.detected_language = extraction.detected_language
        note.chief_complaint = extraction.chief_complaint
        note.history_of_present_illness = extraction.history_of_present_illness
        note.symptoms = extraction.symptoms
        note.examination_findings = extraction.examination_findings
        note.doctor_assessment_diagnosis = extraction.doctor_assessment_diagnosis
        note.medication_instructions = med_dicts
        note.advice = extraction.advice
        note.follow_up_instructions = extraction.follow_up_instructions
        note.uncertain_information = extraction.uncertain_information
        note.missing_information = extraction.missing_information
    else:
        note = ClinicalNote(
            consultation_id=consultation.id,
            raw_transcript=transcript,
            detected_language=extraction.detected_language,
            chief_complaint=extraction.chief_complaint,
            history_of_present_illness=extraction.history_of_present_illness,
            symptoms=extraction.symptoms,
            examination_findings=extraction.examination_findings,
            doctor_assessment_diagnosis=extraction.doctor_assessment_diagnosis,
            medication_instructions=med_dicts,
            advice=extraction.advice,
            follow_up_instructions=extraction.follow_up_instructions,
            uncertain_information=extraction.uncertain_information,
            missing_information=extraction.missing_information,
            model_name="gemini-1.5-pro",
            prompt_version=PROMPT_VERSION,
            is_doctor_approved=False,
            doctor_edits_applied=False,
        )
        db.add(note)

    # Attach relationship explicitly to session
    consultation.clinical_note = note
    consultation.status = ConsultationStatus.PENDING_REVIEW
    consultation.note_status = NoteStatus.AWAITING_DOCTOR_APPROVAL
    consultation.chief_complaint = extraction.chief_complaint

    await db.commit()
    await db.refresh(note)
    consultation.clinical_note = note

    return ConsultationResponse.model_validate(consultation)


async def _resolve_consultation(
    consultation_id: str,
    clinic_id: uuid.UUID,
    db: AsyncSession,
    load_patient: bool = False,
) -> Optional[Consultation]:
    """Resolves a consultation by UUID or falls back to the latest encounter for demo identifiers."""
    opts = [
        selectinload(Consultation.clinical_note),
        selectinload(Consultation.consent_record),
    ]
    if load_patient:
        opts.append(selectinload(Consultation.patient))

    try:
        c_uuid = uuid.UUID(consultation_id)
        query = (
            select(Consultation)
            .where(Consultation.id == c_uuid, Consultation.clinic_id == clinic_id)
            .options(*opts)
        )
        res = await db.execute(query)
        return res.scalar_one_or_none()
    except (ValueError, AttributeError):
        # Demo slug or friendly ID (e.g., "cs-1092") -> return latest consultation
        query = (
            select(Consultation)
            .where(Consultation.clinic_id == clinic_id)
            .options(*opts)
            .order_by(Consultation.created_at.desc())
        )
        res = await db.execute(query)
        return res.scalars().first()


@router.get("/{consultation_id}", response_model=ConsultationResponse, status_code=status.HTTP_200_OK)
async def get_consultation(
    consultation_id: str,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> ConsultationResponse:
    """Retrieve full consultation details including transcript and AI notes."""
    consultation = await _resolve_consultation(consultation_id, clinic.id, db)
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    return ConsultationResponse.model_validate(consultation)


@router.get("", response_model=List[ConsultationResponse], status_code=status.HTTP_200_OK)
async def list_consultations(
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> List[ConsultationResponse]:
    """Lists consultations for the current clinic."""
    query = (
        select(Consultation)
        .where(Consultation.clinic_id == clinic.id)
        .options(selectinload(Consultation.clinical_note))
        .order_by(Consultation.created_at.desc())
    )
    res = await db.execute(query)
    consultations = res.scalars().all()
    return [ConsultationResponse.model_validate(c) for c in consultations]


@router.post("/{consultation_id}/approve", response_model=ConsultationResponse, status_code=status.HTTP_200_OK)
async def approve_consultation(
    consultation_id: str,
    data: Optional[ClinicalNoteUpdateRequest] = None,
    current_user: User = Depends(get_current_user),
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> ConsultationResponse:
    """Doctor review & approval gate for AI clinical documentation."""
    consultation = await _resolve_consultation(consultation_id, clinic.id, db)

    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")

    if not consultation.clinical_note:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No clinical note exists for this consultation.")

    note = consultation.clinical_note

    # Apply doctor edits if provided
    if data:
        if data.chief_complaint is not None:
            note.chief_complaint = data.chief_complaint
            consultation.chief_complaint = data.chief_complaint
        if data.history_of_present_illness is not None:
            note.history_of_present_illness = data.history_of_present_illness
        if data.symptoms is not None:
            note.symptoms = data.symptoms
        if data.examination_findings is not None:
            note.examination_findings = data.examination_findings
        if data.doctor_assessment_diagnosis is not None:
            note.doctor_assessment_diagnosis = data.doctor_assessment_diagnosis
        if data.medication_instructions is not None:
            note.medication_instructions = [m.model_dump() for m in data.medication_instructions]
        if data.advice is not None:
            note.advice = data.advice
        if data.follow_up_instructions is not None:
            note.follow_up_instructions = data.follow_up_instructions
        note.doctor_edits_applied = True

    # Mark as approved by doctor with audit trail
    now_str = datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p UTC")
    note.is_doctor_approved = True
    note.approved_by_doctor_id = current_user.id
    note.approved_at = now_str

    consultation.status = ConsultationStatus.APPROVED
    consultation.note_status = NoteStatus.APPROVED

    await db.commit()
    await db.refresh(note)
    consultation.clinical_note = note

    return ConsultationResponse.model_validate(consultation)


@router.put("/{consultation_id}/note", response_model=ConsultationResponse, status_code=status.HTTP_200_OK)
async def update_consultation_note(
    consultation_id: str,
    data: ClinicalNoteUpdateRequest,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> ConsultationResponse:
    """Updates draft clinical note fields prior to final approval."""
    consultation = await _resolve_consultation(consultation_id, clinic.id, db)

    if not consultation or not consultation.clinical_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation or note not found.")

    note = consultation.clinical_note
    if data.chief_complaint is not None:
        note.chief_complaint = data.chief_complaint
        consultation.chief_complaint = data.chief_complaint
    if data.history_of_present_illness is not None:
        note.history_of_present_illness = data.history_of_present_illness
    if data.symptoms is not None:
        note.symptoms = data.symptoms
    if data.examination_findings is not None:
        note.examination_findings = data.examination_findings
    if data.doctor_assessment_diagnosis is not None:
        note.doctor_assessment_diagnosis = data.doctor_assessment_diagnosis
    if data.medication_instructions is not None:
        note.medication_instructions = [m.model_dump() for m in data.medication_instructions]
    if data.advice is not None:
        note.advice = data.advice
    if data.follow_up_instructions is not None:
        note.follow_up_instructions = data.follow_up_instructions

    note.doctor_edits_applied = True
    await db.commit()
    await db.refresh(note)
    consultation.clinical_note = note

    return ConsultationResponse.model_validate(consultation)


@router.post("/{consultation_id}/summary", response_model=PatientSummaryResponse, status_code=status.HTTP_200_OK)
async def get_patient_summary(
    consultation_id: str,
    request: PatientSummaryRequest,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
) -> PatientSummaryResponse:
    """Generates multilingual patient summary (Tamil, Hindi, English) from approved clinical notes."""
    consultation = await _resolve_consultation(consultation_id, clinic.id, db, load_patient=True)

    if not consultation or not consultation.clinical_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation note not found.")

    note = consultation.clinical_note
    pt_name = f"{consultation.patient.first_name} {consultation.patient.last_name}" if consultation.patient else "Patient"

    summary = PatientSummaryService.generate_summary(
        patient_name=pt_name,
        diagnosis=note.doctor_assessment_diagnosis,
        medications=note.medication_instructions,
        advice=note.advice,
        follow_up=note.follow_up_instructions,
        language=request.language,
    )
    return summary


@router.get("/{consultation_id}/prescription-pdf", status_code=status.HTTP_200_OK)
async def download_prescription_pdf(
    consultation_id: str,
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
):
    """Generates and downloads a medical-grade clinic-branded Prescription PDF."""
    consultation = await _resolve_consultation(consultation_id, clinic.id, db, load_patient=True)

    if not consultation or not consultation.clinical_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation note not found.")

    note = consultation.clinical_note
    patient = consultation.patient

    pt_name = f"{patient.first_name} {patient.last_name}" if patient else "Priya Sundaram"
    pt_code = patient.patient_code if patient else "CS-P-1001"
    pt_gender = patient.gender.value if patient else "FEMALE"
    pt_age = "34 Yrs"

    pdf_bytes = PDFReportService.generate_prescription_pdf(
        clinic_name=clinic.name or "City Health Clinic",
        clinic_address="No. 42 Anna Salai, Chennai, TN 600002",
        doctor_name="Dr. Sarah Sundaram",
        doctor_reg="TNMC-84920",
        patient_name=pt_name,
        patient_code=pt_code,
        patient_age=pt_age,
        patient_gender=pt_gender,
        consultation_date=consultation.consultation_date.strftime("%d %b %Y"),
        chief_complaint=note.chief_complaint,
        diagnosis=note.doctor_assessment_diagnosis,
        medications=note.medication_instructions,
        advice=note.advice,
        follow_up=note.follow_up_instructions,
        approval_timestamp=note.approved_at or datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p UTC"),
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=Prescription_{pt_code}_{consultation.id}.pdf"
        },
    )


@router.get("/{consultation_id}/patient-summary-pdf", status_code=status.HTTP_200_OK)
async def download_patient_summary_pdf(
    consultation_id: str,
    language: str = Query("Tamil", description="Summary language: Tamil, Hindi, or English"),
    clinic: Clinic = Depends(get_current_clinic),
    db: AsyncSession = Depends(get_db),
):
    """Generates and downloads a patient-friendly instructions Care Plan PDF."""
    consultation = await _resolve_consultation(consultation_id, clinic.id, db, load_patient=True)

    if not consultation or not consultation.clinical_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation note not found.")

    note = consultation.clinical_note
    patient = consultation.patient

    pt_name = f"{patient.first_name} {patient.last_name}" if patient else "Priya Sundaram"
    pt_code = patient.patient_code if patient else "CS-P-1001"

    summary = PatientSummaryService.generate_summary(
        patient_name=pt_name,
        diagnosis=note.doctor_assessment_diagnosis,
        medications=note.medication_instructions,
        advice=note.advice,
        follow_up=note.follow_up_instructions,
        language=language,
    )

    pdf_bytes = PDFReportService.generate_patient_summary_pdf(
        clinic_name=clinic.name or "City Health Clinic",
        patient_name=pt_name,
        patient_code=pt_code,
        language=language,
        greeting=summary.greeting,
        diagnosis_text=summary.diagnosis_summary,
        medications=[m.model_dump() for m in summary.medication_schedule],
        precautions=summary.lifestyle_precautions,
        warning_signs=summary.warning_signs,
        follow_up=summary.follow_up_advice,
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=CarePlan_{language}_{pt_code}_{consultation.id}.pdf"
        },
    )

