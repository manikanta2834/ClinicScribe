import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.ai_service import GeminiAIService
from app.services.summary_service import PatientSummaryService
from app.services.pdf_service import PDFReportService
from app.schemas.clinical_note import ClinicalNoteStructuredExtraction


@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/")
        assert res.status_code == 200
        data = res.json()
        assert data["name"] == "ClinicScribe API"
        assert "Turning Conversations into Care" in data["tagline"]


@pytest.mark.asyncio
async def test_zero_fabrication_plain_voice():
    """Safety Mandate: Plain conversational speech must produce ZERO medications."""
    plain_dialogues = [
        "Hello doctor, good morning. How are you today? Thank you.",
        "Vanakkam doctor, nalla irukkeengala? Idhu oru routine visit dhaan.",
        "Doctor sab, namaste. Main theek hoon, bas routine milne aaya tha.",
    ]
    for dialogue in plain_dialogues:
        extraction = await GeminiAIService.extract_clinical_notes(dialogue)
        assert isinstance(extraction, ClinicalNoteStructuredExtraction)
        assert len(extraction.medication_instructions) == 0, f"Expected 0 meds, got {extraction.medication_instructions}"
        assert "Routine" in extraction.doctor_assessment_diagnosis or "Observation" in extraction.doctor_assessment_diagnosis


@pytest.mark.asyncio
async def test_zero_fabrication_symptoms_without_prescription():
    """Safety Mandate: When patient describes symptoms but doctor prescribes nothing, medications must be EMPTY."""
    dialogue = (
        "Doctor: Hello, what seems to be the trouble?\n"
        "Patient: Doctor, I have had a dry cough for 2 days.\n"
        "Doctor: Chest is clear. It is mild viral upper respiratory irritation. Drink warm water. No medicines needed today."
    )
    extraction = await GeminiAIService.extract_clinical_notes(dialogue)
    assert len(extraction.medication_instructions) == 0
    assert any("No pharmacological medications" in msg for msg in extraction.missing_information)


@pytest.mark.asyncio
async def test_explicit_prescription_extraction():
    """Explicit prescriptions spoken by doctor must be accurately captured."""
    dialogue = (
        "Doctor: You have acute bronchitis. I am prescribing Paracetamol 650mg twice daily for 5 days after food."
    )
    extraction = await GeminiAIService.extract_clinical_notes(dialogue)
    assert len(extraction.medication_instructions) >= 1
    med_names = [m.medicine_name.lower() for m in extraction.medication_instructions]
    assert any("paracetamol" in name for name in med_names)


def test_multilingual_summaries_zero_meds():
    """Validates summary generation in Tamil, Hindi, and English when no medications are prescribed."""
    for lang in ["Tamil", "Hindi", "English"]:
        summary = PatientSummaryService.generate_summary(
            patient_name="Ramesh",
            diagnosis="Routine Clinical Observation",
            medications=[],
            advice=["Drink warm water", "Get adequate rest"],
            follow_up="Return as needed",
            language=lang,
        )
        assert summary.patient_name == "Ramesh"
        assert len(summary.medication_schedule) == 0
        assert len(summary.lifestyle_precautions) >= 1


def test_pdf_service_generation():
    """Validates that Prescription PDF builds cleanly for both zero-medication and prescribed consultations."""
    pdf_no_meds = PDFReportService.generate_prescription_pdf(
        clinic_name="City Health Clinic",
        clinic_address="12 Main Road, Chennai, Tamil Nadu",
        doctor_name="Dr. Sarah Sundaram",
        doctor_reg="TNMC-84920",
        patient_name="Priya Ramesh",
        patient_code="CS-P-1001",
        patient_age="32",
        patient_gender="Female",
        consultation_date="2026-11-20",
        chief_complaint="General Medical Consultation",
        diagnosis="Routine Clinical Observation",
        medications=[],
        advice=["Maintain hydration"],
        follow_up="PRN",
        approval_timestamp="2026-11-20 18:30:00 IST",
    )
    assert len(pdf_no_meds) > 1000  # Generated valid PDF bytes

    pdf_with_meds = PDFReportService.generate_prescription_pdf(
        clinic_name="City Health Clinic",
        clinic_address="12 Main Road, Chennai, Tamil Nadu",
        doctor_name="Dr. Sarah Sundaram",
        doctor_reg="TNMC-84920",
        patient_name="Priya Ramesh",
        patient_code="CS-P-1001",
        patient_age="32",
        patient_gender="Female",
        consultation_date="2026-11-20",
        chief_complaint="Cough and fever",
        diagnosis="Acute Bronchitis",
        medications=[
            {
                "medicine_name": "Paracetamol",
                "dosage": "650 mg",
                "frequency": "Twice daily",
                "duration": "5 days",
                "special_instructions": "After food",
            }
        ],
        advice=["Steam inhalation"],
        follow_up="5 days",
        approval_timestamp="2026-11-20 18:30:00 IST",
    )
    assert len(pdf_with_meds) > 1000

