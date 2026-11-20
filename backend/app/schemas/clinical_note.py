import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.models.consultation import ConsultationStatus, NoteStatus


class MedicationInstruction(BaseModel):
    medicine_name: str
    dosage: str
    frequency: str
    duration: Optional[str] = "5 days"
    special_instructions: Optional[str] = "After food"


class ClinicalNoteStructuredExtraction(BaseModel):
    """Strict schema produced by Google Gemini Clinical AI Engine."""
    detected_language: str
    chief_complaint: str
    history_of_present_illness: str
    symptoms: List[str]
    examination_findings: Optional[str] = None
    doctor_assessment_diagnosis: str
    medication_instructions: List[MedicationInstruction]
    advice: List[str]
    follow_up_instructions: str
    uncertain_information: List[str] = []
    missing_information: List[str] = []


class ClinicalNoteUpdateRequest(BaseModel):
    """Schema for doctor edits prior to final approval."""
    chief_complaint: Optional[str] = None
    history_of_present_illness: Optional[str] = None
    symptoms: Optional[List[str]] = None
    examination_findings: Optional[str] = None
    doctor_assessment_diagnosis: Optional[str] = None
    medication_instructions: Optional[List[MedicationInstruction]] = None
    advice: Optional[List[str]] = None
    follow_up_instructions: Optional[str] = None


class ClinicalNoteResponse(ClinicalNoteStructuredExtraction):
    id: uuid.UUID
    consultation_id: uuid.UUID
    raw_transcript: str
    model_name: str
    prompt_version: str
    is_doctor_approved: bool
    approved_at: Optional[str] = None
    doctor_edits_applied: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConsentRequest(BaseModel):
    is_consent_granted: bool = True
    consent_type: str = "VERBAL_AND_DIGITAL_CONFIRMATION"
    consent_notes: Optional[str] = "Patient affirmed understanding of recording for documentation."


class ConsultationCreateRequest(BaseModel):
    patient_id: uuid.UUID
    consultation_type: str = "General Consultation"
    language_used: str = "Tamil / English"
    chief_complaint: Optional[str] = None
    consent: ConsentRequest


class ConsultationProcessRequest(BaseModel):
    audio_base64: Optional[str] = None
    transcript_text: Optional[str] = None
    audio_filename: Optional[str] = None
    language_hint: Optional[str] = "Tamil, English, Hindi"


class PatientSummaryRequest(BaseModel):
    language: str = "Tamil"  # Options: "Tamil", "Hindi", "English"


class PatientMedicationSchedule(BaseModel):
    medicine: str
    dosage: str
    schedule: str  # e.g., "காலை - இரவு (Morning - Night)"
    instructions: str


class PatientSummaryResponse(BaseModel):
    language: str
    patient_name: str
    greeting: str
    diagnosis_summary: str
    medication_schedule: List[PatientMedicationSchedule]
    lifestyle_precautions: List[str]
    warning_signs: List[str]
    follow_up_advice: str


class ConsultationResponse(BaseModel):
    id: uuid.UUID
    clinic_id: uuid.UUID
    doctor_id: uuid.UUID
    patient_id: uuid.UUID
    consultation_date: datetime
    consultation_type: str
    language_used: str
    status: ConsultationStatus
    note_status: NoteStatus
    chief_complaint: Optional[str] = None
    has_patient_consent: bool
    clinical_note: Optional[ClinicalNoteResponse] = None

    model_config = ConfigDict(from_attributes=True)
