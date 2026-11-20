import pytest
from datetime import date
from httpx import AsyncClient
from app.schemas.clinical_note import ClinicalNoteStructuredExtraction, MedicationInstruction

@pytest.mark.asyncio
async def test_root_and_healthz(client_a: AsyncClient):
    """Verify backend liveness and basic API info."""
    res_root = await client_a.get("/")
    assert res_root.status_code == 200
    data = res_root.json()
    assert data["name"] == "ClinicScribe API"
    assert "version" in data

    res_health = await client_a.get("/api/v1/healthz")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert health_data["status"] == "healthy"
    assert health_data["services"]["database"] == "ready"

@pytest.mark.asyncio
async def test_patient_crud_and_tenant_isolation(client_a: AsyncClient, seed_data):
    """
    Critical Security Mandate:
    Verify Clinic A creates and reads its patients, while Clinic B CANNOT access Clinic A's patients.
    """
    from app.main import app
    from app.core.security import get_current_user, get_current_clinic

    # 1. Clinic A creates a new patient
    app.dependency_overrides[get_current_clinic] = lambda: seed_data["clinic_a"]
    app.dependency_overrides[get_current_user] = lambda: seed_data["user_a"]

    new_patient = {
        "first_name": "Priya",
        "last_name": "Sundaram",
        "date_of_birth": "1992-05-14",
        "gender": "FEMALE",
        "phone": "+919841029384",
        "email": "priya.sundaram@example.com",
    }
    create_res = await client_a.post("/api/v1/patients", json=new_patient)
    assert create_res.status_code in [200, 201]
    created = create_res.json()
    patient_id = created["id"]
    assert created["first_name"] == "Priya"
    assert created["last_name"] == "Sundaram"

    # 2. Clinic A can fetch the patient
    fetch_res_a = await client_a.get(f"/api/v1/patients/{patient_id}")
    assert fetch_res_a.status_code == 200
    assert fetch_res_a.json()["id"] == patient_id

    # 3. Clinic B tries to fetch Clinic A's patient -> MUST BE 404 Not Found (Zero Tenant Leakage)
    app.dependency_overrides[get_current_clinic] = lambda: seed_data["clinic_b"]
    app.dependency_overrides[get_current_user] = lambda: seed_data["user_b"]

    fetch_res_b = await client_a.get(f"/api/v1/patients/{patient_id}")
    assert fetch_res_b.status_code == 404, "Tenant Isolation failure: Clinic B accessed Clinic A's patient!"

@pytest.mark.asyncio
async def test_clinical_note_schema_validation():
    """
    AI Safety Mandate:
    Verify strict Pydantic parsing of structured clinical notes with uncertainty flags.
    """
    mock_gemini_payload = {
        "detected_language": "ta-IN/en-IN",
        "chief_complaint": "Severe lower back pain for 2 weeks",
        "history_of_present_illness": "Patient reports sharp pain radiating down left leg. Aggravated by bending.",
        "symptoms": ["Lower back pain", "Sciatica", "Numbness in left foot"],
        "examination_findings": "Straight leg raise positive at 45 degrees on left side.",
        "doctor_assessment_diagnosis": "Suspected lumbar disc herniation (L4-L5).",
        "medication_instructions": [
            {
                "medicine_name": "Pregabalin",
                "dosage": "75mg",
                "frequency": "Once daily at bedtime",
                "duration": "14 days",
                "special_instructions": "Take after dinner",
            }
        ],
        "advice": ["Avoid heavy lifting", "Lumbar physiotherapy after acute pain subsides"],
        "follow_up_instructions": "Return in 2 weeks with MRI report",
        "uncertain_information": ["Exact onset date is unclear from consultation"],
        "missing_information": ["Patient did not state prior history of disc surgery"],
    }

    # Pydantic validation
    extracted = ClinicalNoteStructuredExtraction(**mock_gemini_payload)
    assert extracted.chief_complaint == "Severe lower back pain for 2 weeks"
    assert len(extracted.medication_instructions) == 1
    assert extracted.medication_instructions[0].medicine_name == "Pregabalin"
    assert len(extracted.uncertain_information) == 1
    assert "Avoid heavy lifting" in extracted.advice

@pytest.mark.asyncio
async def test_mandatory_consent_enforcement(client_a: AsyncClient, seed_data):
    """
    DPDP Act Compliance Mandate:
    Verify consultations reject recording/processing if patient consent is withheld.
    """
    from app.main import app
    from app.core.security import get_current_user, get_current_clinic
    app.dependency_overrides[get_current_clinic] = lambda: seed_data["clinic_a"]
    app.dependency_overrides[get_current_user] = lambda: seed_data["user_a"]

    # 1. Attempt to create consultation with consent withheld
    no_consent_payload = {
        "patient_id": str(seed_data["patient_a"].id),
        "consultation_type": "Clinical Follow-up",
        "language_used": "Tamil / English",
        "chief_complaint": "Persistent fever",
        "consent": {
            "is_consent_granted": False,
            "consent_notes": "Patient declined consent for recording",
        },
    }
    res_rejected = await client_a.post("/api/v1/consultations", json=no_consent_payload)
    assert res_rejected.status_code in [400, 422], "DPDP Violation: Consultation allowed without consent!"

    # 2. Consultation succeeds when explicit consent is documented
    consent_payload = {
        "patient_id": str(seed_data["patient_a"].id),
        "consultation_type": "Clinical Follow-up",
        "language_used": "Tamil / English",
        "chief_complaint": "Persistent fever",
        "consent": {
            "is_consent_granted": True,
            "consent_type": "VERBAL_AND_DIGITAL_CONFIRMATION",
            "consent_notes": "Patient confirmed consent for AI scribe documentation",
        },
    }
    res_accepted = await client_a.post("/api/v1/consultations", json=consent_payload)
    assert res_accepted.status_code == 201
    consultation = res_accepted.json()
    assert consultation["has_patient_consent"] is True
    assert consultation["patient_id"] == str(seed_data["patient_a"].id)

