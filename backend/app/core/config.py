from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


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
    
    # Database (defaults to local SQLite for standalone dev; overridden by PostgreSQL in Docker)
    DATABASE_URL: str = "sqlite+aiosqlite:///./clinicscribe.db"
    DB_ECHO: bool = False
    
    # Google Cloud & Gemini AI
    GEMINI_API_KEY: str = "placeholder_gemini_api_key"
    GEMINI_MODEL: str = "gemini-1.5-pro"
    GCP_PROJECT_ID: str = "clinicscribe-dev"
    GCS_AUDIO_BUCKET: str = "clinicscribe-audio-recordings-dev"
    GCS_DOCUMENTS_BUCKET: str = "clinicscribe-documents-dev"
    
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

