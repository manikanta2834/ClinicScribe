from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

_BASE_DIR = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DB_FILE = (_BASE_DIR / "clinicscribe.db").as_posix()


class Settings(BaseSettings):
    """ClinicScribe Core Application Settings."""
    
    PROJECT_NAME: str = "ClinicScribe API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security & CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Database (defaults to local SQLite for standalone dev; overridden by AlloyDB or PostgreSQL)
    DATABASE_URL: str = f"sqlite+aiosqlite:///{_DEFAULT_DB_FILE}"
    DB_ECHO: bool = False

    # Google Cloud & Enterprise Infrastructure
    GCP_PROJECT_ID: str = "clinicscribe-515308"
    GCP_REGION: str = "asia-south1"  # Mumbai / India region for DPDP Act compliance

    # Google Cloud Vertex AI
    USE_VERTEX_AI: bool = True
    VERTEX_AI_MODEL: str = "gemini-1.5-pro"
    VERTEX_AI_LOCATION: str = "asia-south1"

    # Google Cloud AlloyDB for PostgreSQL
    ALLOYDB_ENABLED: bool = False  # Set to True when running in GCP environment
    ALLOYDB_PROJECT_ID: str = "clinicscribe-515308"
    ALLOYDB_REGION: str = "asia-south1"
    ALLOYDB_CLUSTER: str = "clinicscribe-alloydb-cluster"
    ALLOYDB_INSTANCE: str = "clinicscribe-primary-instance"
    ALLOYDB_DB_USER: str = "postgres"
    ALLOYDB_DB_PASSWORD: str = ""
    ALLOYDB_DB_NAME: str = "clinicscribe"
    ALLOYDB_IP_ADDRESS: str = ""
    ALLOYDB_USE_IAM_AUTH: bool = False

    # Google Cloud Artifact Registry & Container Images
    ARTIFACT_REGISTRY_REPO: str = "asia-south1-docker.pkg.dev/clinicscribe-515308/clinicscribe-registry"

    # Google Cloud Storage (GCS)
    GCS_AUDIO_BUCKET: str = "clinicscribe-consultation-audio"
    GCS_DOCUMENTS_BUCKET: str = "clinicscribe-clinical-documents"

    # Gemini Developer API (Alternative fallback)
    GEMINI_API_KEY: str = "placeholder_gemini_api_key"
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # Firebase
    FIREBASE_PROJECT_ID: str = "clinicscribe-dev"
    
    # Multi-tenant limits
    DEFAULT_MAX_CONSULTATIONS_PER_MONTH: int = 50
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()

