import uuid
from typing import List, Optional
from pydantic import BaseModel


class MetricCard(BaseModel):
    title: str
    value: str
    change: Optional[str] = None
    is_positive: bool = True
    subtitle: Optional[str] = None
    progress_percent: Optional[int] = None


class TrendPoint(BaseModel):
    label: str
    value: int


class UpcomingAppointment(BaseModel):
    id: str
    patient_name: str
    patient_code: str
    time: str
    type: str
    language: str


class RecentActivityItem(BaseModel):
    id: str
    patient_name: str
    patient_code: str
    type: str
    language: str
    time_ago: str
    status: str
    badge_variant: str


class DashboardAnalyticsResponse(BaseModel):
    active_patients_count: int
    monthly_consultations_count: int
    pending_notes_count: int
    system_health_percent: int
    kpis: List[MetricCard]
    trends: List[TrendPoint]
    performance_bars: List[dict]
    upcoming_appointments: List[UpcomingAppointment]
    recent_activity: List[RecentActivityItem]

