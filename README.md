# ClinicScribe — AI-Powered Clinical Documentation SaaS
**Tagline**: *Turning Conversations into Care.*

ClinicScribe is a premium, multi-tenant healthcare SaaS platform designed to transform multilingual doctor-patient consultations (Tamil, English, Hindi, and code-mixed speech) into structured, doctor-reviewed clinical notes, prescriptions, and patient summaries using Google Gemini AI.

---

## 🎨 Visual Identity & Design System

The platform features a bespoke, medical-grade glassmorphic interface inspired by modern clinical workflows:
- **Canvas Background**: Soft Pale Mist (`#E2F0F1` / `#F1F6F9`) with ambient medical radial glow.
- **Sidebar**: Dark Evergreen (`#075D55`) to Deep Teal (`#0B927F`) gradient with frosted translucent active pills.
- **Glassmorphic Cards**: `rgba(255, 255, 255, 0.85)`, `backdrop-filter: blur(20px)`, border `1px solid rgba(72, 183, 160, 0.22)`, radius `20px`–`24px`.
- **Primary Actions**: Deep Teal (`#267C78`) & Dark Evergreen (`#075D55`).
- **Indicators & Badges**: Mint Green (`#0B927F`) and Seafoam Aqua (`#BFE1E0`).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Or [Node.js 18+](https://nodejs.org/) & [Python 3.11+](https://www.python.org/)

### Option 1: Run with Docker Compose (Recommended)
From the repository root (`c:\ClinicScribe`):
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- **Health Check**: [http://localhost:8000/api/v1/healthz](http://localhost:8000/api/v1/healthz)

---

### Option 2: Run Standalone

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 Routes & Modules Implemented in Phase 1

| Path | Description | Visual Alignment |
| :--- | :--- | :--- |
| `/` | Public Marketing Landing Page | Hero, Gemini Tanglish Demo, 3-step workflow, features, footer |
| `/pricing` | Tiered SaaS Pricing | 4 plans: Free Trial, Doctor ($49), Clinic ($149), Enterprise |
| `/dashboard` | Doctor Dashboard | **Directly mirrors provided design**: 4 KPI cards, smooth wave trend chart, rounded bar performance chart, October 2026 calendar widget, upcoming consultations, recent activity |
| `/api/v1/healthz` | Backend Liveness Probe | JSON service status and environment diagnostics |
| `/api/v1/docs` | Swagger / OpenAPI Docs | Interactive REST API explorer |

---

## 🔒 Security & Medical Safety Mandates
1. **Doctor-in-the-Loop**: AI never independently makes clinical decisions or finalizes notes without doctor review and approval.
2. **Consent-First**: Consultation audio recording strictly requires documented patient consent.
3. **Zero Fabrication**: Prompts enforce negative constraints; missing or uncertain information is flagged rather than guessed.
4. **Tenant Isolation**: All patient and consultation data is isolated per-clinic.
