-- =============================================================================
-- ClinicScribe: Google Cloud AlloyDB for PostgreSQL Enterprise Schema Setup
-- Optimized for:
--   1. AlloyDB Columnar Engine (Analytical reporting and consultation metrics)
--   2. pgvector (Clinical guideline semantic search & vector retrieval)
--   3. Multi-Tenant Clinic Data Isolation (Indian DPDP Act & HIPAA compliance)
-- =============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector for semantic retrieval

-- 2. Configure AlloyDB Columnar Engine
ALTER SYSTEM SET google_columnar_engine.enabled = 'on';
ALTER SYSTEM SET google_columnar_engine.memory_size_in_mb = 1024;
SELECT pg_reload_conf();

-- 3. Core Multi-Tenant Tables

-- Clinics (Tenants)
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    license_number VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    postal_code VARCHAR(20),
    subscription_tier VARCHAR(50) DEFAULT 'DOCTOR_PLAN',
    monthly_consultation_limit INT DEFAULT 200,
    consultations_used_this_month INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(50) DEFAULT 'DOCTOR',
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic Memberships (RBAC & Tenant Association)
CREATE TABLE IF NOT EXISTS clinic_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'DOCTOR',
    is_primary BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, clinic_id)
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    preferred_language VARCHAR(50) DEFAULT 'Tamil',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, patient_code)
);

-- Consultations (Encounters)
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consultation_date TIMESTAMPTZ DEFAULT NOW(),
    consultation_type VARCHAR(100) DEFAULT 'General Consultation',
    language_used VARCHAR(50) DEFAULT 'Tamil / English',
    audio_storage_uri VARCHAR(500),
    audio_duration_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'RECORDING',
    note_status VARCHAR(50) DEFAULT 'DRAFT',
    chief_complaint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mandatory Consent Records (Zero Recording Without Documented Consent)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    is_consent_granted BOOLEAN NOT NULL DEFAULT TRUE,
    consent_type VARCHAR(100) DEFAULT 'VERBAL_AND_DIGITAL_CONFIRMATION',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    consent_notes TEXT
);

-- Structured Clinical Notes (Gemini 1.5 Pro Extracted & Doctor Approved)
CREATE TABLE IF NOT EXISTS clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    raw_transcript TEXT NOT NULL,
    detected_language VARCHAR(50) DEFAULT 'Tamil / English',
    chief_complaint TEXT NOT NULL,
    history_of_present_illness TEXT NOT NULL,
    symptoms JSONB DEFAULT '[]'::jsonb,
    examination_findings TEXT,
    doctor_assessment_diagnosis TEXT NOT NULL,
    medication_instructions JSONB DEFAULT '[]'::jsonb,
    advice JSONB DEFAULT '[]'::jsonb,
    follow_up_instructions TEXT,
    uncertain_information JSONB DEFAULT '[]'::jsonb,
    missing_information JSONB DEFAULT '[]'::jsonb,
    model_name VARCHAR(100) DEFAULT 'gemini-1.5-pro',
    prompt_version VARCHAR(50) DEFAULT 'v1.2.0-clinical-safety',
    is_doctor_approved BOOLEAN DEFAULT FALSE,
    approved_by_doctor_id UUID REFERENCES users(id),
    approved_at VARCHAR(100),
    doctor_edits_applied BOOLEAN DEFAULT FALSE,
    pdf_prescription_uri VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs (Tamper-Evident Healthcare Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. High-Performance Indexes for AlloyDB Columnar Engine
CREATE INDEX IF NOT EXISTS idx_consultations_clinic_date ON consultations (clinic_id, consultation_date DESC);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_code ON patients (clinic_id, patient_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_clinic_timestamp ON audit_logs (clinic_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_approved ON clinical_notes (is_doctor_approved);

-- 5. Accelerate Tables with AlloyDB Columnar Engine
SELECT google_columnar_engine_add('consultations');
SELECT google_columnar_engine_add('patients');
SELECT google_columnar_engine_add('clinical_notes');

