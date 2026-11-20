import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

from app.main import app
from app.core.database import get_db
from app.models import (
    Base,
    User,
    UserRole,
    Clinic,
    ClinicMembership,
    SubscriptionTier,
    Patient,
    Gender,
)
from app.core.security import get_current_user, get_current_clinic

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)

@pytest_asyncio.fixture(scope="session", autouse=True)
async def init_test_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()

@pytest_asyncio.fixture
async def seed_data(db_session: AsyncSession):
    """Seeds two clinics and users for tenant isolation testing."""
    import uuid
    suffix = uuid.uuid4().hex[:6]
    clinic_a = Clinic(
        name="Aura Med Clinic",
        slug=f"aura-med-{suffix}",
        contact_email=f"info-{suffix}@auramed.com",
        subscription_tier=SubscriptionTier.CLINIC_PLAN,
        monthly_consultation_limit=500,
        current_month_usage=10,
    )
    clinic_b = Clinic(
        name="Apollo Health",
        slug=f"apollo-health-{suffix}",
        contact_email=f"info-{suffix}@apollo.com",
        subscription_tier=SubscriptionTier.DOCTOR_PLAN,
        monthly_consultation_limit=100,
        current_month_usage=4,
    )
    db_session.add_all([clinic_a, clinic_b])
    await db_session.flush()

    user_a = User(
        firebase_uid=f"uid_doctor_a_{suffix}",
        email=f"dr.sarah-{suffix}@auramed.com",
        full_name="Dr. Sarah Jenkins",
        role=UserRole.DOCTOR,
        is_active=True,
    )
    user_b = User(
        firebase_uid=f"uid_doctor_b_{suffix}",
        email=f"dr.raj-{suffix}@apollo.com",
        full_name="Dr. Raj Sharma",
        role=UserRole.DOCTOR,
        is_active=True,
    )
    db_session.add_all([user_a, user_b])
    await db_session.flush()

    mem_a = ClinicMembership(
        clinic_id=clinic_a.id,
        user_id=user_a.id,
        role=UserRole.DOCTOR,
        is_primary=True,
    )
    mem_b = ClinicMembership(
        clinic_id=clinic_b.id,
        user_id=user_b.id,
        role=UserRole.DOCTOR,
        is_primary=True,
    )
    db_session.add_all([mem_a, mem_b])

    from datetime import date
    # Seed Patient in Clinic A
    patient_a = Patient(
        clinic_id=clinic_a.id,
        patient_code=f"MRN-A-{suffix}",
        first_name="Ramesh",
        last_name="Kumar",
        date_of_birth=date(1980, 1, 1),
        gender=Gender.MALE,
        phone="+919876543210",
    )
    db_session.add(patient_a)
    await db_session.commit()

    return {
        "clinic_a": clinic_a,
        "clinic_b": clinic_b,
        "user_a": user_a,
        "user_b": user_b,
        "membership_a": mem_a,
        "membership_b": mem_b,
        "patient_a": patient_a,
    }

@pytest_asyncio.fixture
async def client_a(db_session: AsyncSession, seed_data) -> AsyncGenerator[AsyncClient, None]:
    """Client acting as Dr. Sarah at Clinic A."""
    async def override_get_db():
        yield db_session

    async def override_user():
        return seed_data["user_a"]

    async def override_clinic():
        return seed_data["clinic_a"]

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_current_clinic] = override_clinic

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest_asyncio.fixture
async def client_b(db_session: AsyncSession, seed_data) -> AsyncGenerator[AsyncClient, None]:
    """Client acting as Dr. Raj at Clinic B (different tenant)."""
    async def override_get_db():
        yield db_session

    async def override_user():
        return seed_data["user_b"]

    async def override_clinic():
        return seed_data["clinic_b"]

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_current_clinic] = override_clinic

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
