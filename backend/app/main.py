from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup setup
    setup_logging()
    try:
        from app.models.base import Base
        from app.models import clinic, user, patient, consultation, clinical_note, audit_log  # noqa: F401
        from app.core.database import engine
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"Database schema auto-init notice: {e}")
    yield
    # Graceful shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root status route
@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "ClinicScribe API",
        "tagline": "Turning Conversations into Care.",
        "version": settings.VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs",
    }

@app.get("/health", tags=["Root"])
@app.get("/api/v1/healthz", tags=["Root"])
async def health_check():
    return {"status": "ok", "service": "ClinicScribe API"}

# Register API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

