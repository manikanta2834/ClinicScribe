from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

logger = logging.getLogger(__name__)


def create_app_engine():
    """Creates database engine supporting Google Cloud AlloyDB for PostgreSQL or local development."""
    if settings.ALLOYDB_ENABLED:
        logger.info("Initializing Google Cloud AlloyDB for PostgreSQL engine...")
        # Direct Private IP / AlloyDB Auth Proxy connection
        if settings.ALLOYDB_IP_ADDRESS:
            alloydb_url = (
                f"postgresql+asyncpg://{settings.ALLOYDB_DB_USER}:{settings.ALLOYDB_DB_PASSWORD}"
                f"@{settings.ALLOYDB_IP_ADDRESS}:5432/{settings.ALLOYDB_DB_NAME}"
            )
            return create_async_engine(
                alloydb_url,
                echo=settings.DB_ECHO,
                future=True,
                pool_size=20,
                max_overflow=10,
                pool_pre_ping=True,
                pool_recycle=1800,
            )
        else:
            instance_uri = (
                f"projects/{settings.ALLOYDB_PROJECT_ID}/locations/{settings.ALLOYDB_REGION}"
                f"/clusters/{settings.ALLOYDB_CLUSTER}/instances/{settings.ALLOYDB_INSTANCE}"
            )
            logger.info(f"Connecting to AlloyDB instance via IAM/Connector: {instance_uri}")
            alloydb_url = (
                f"postgresql+asyncpg://{settings.ALLOYDB_DB_USER}:{settings.ALLOYDB_DB_PASSWORD}"
                f"@/{settings.ALLOYDB_DB_NAME}?host=/cloudsql/{instance_uri}"
            )
            return create_async_engine(
                alloydb_url,
                echo=settings.DB_ECHO,
                future=True,
                pool_pre_ping=True,
            )

    # Local development SQLite / Standard PostgreSQL
    return create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DB_ECHO,
        future=True,
        pool_pre_ping=True,
    )


engine = create_app_engine()

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

