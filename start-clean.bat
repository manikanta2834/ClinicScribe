@echo off
echo ========================================================
echo  ClinicScribe - Clean Startup & Port Rectifier
echo ========================================================

echo [1/3] Terminating any stale node or python processes on port 3000/8000...
powershell -NoProfile -Command "Get-Process node, python -ErrorAction SilentlyContinue | Stop-Process -Force"

echo [2/3] Cleaning stale .next cache...
if exist "frontend\.next" rd /s /q "frontend\.next"

echo [3/3] Starting Backend & Frontend...
start "ClinicScribe Backend (FastAPI)" cmd /c "cd backend && venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "ClinicScribe Frontend (Next.js)" cmd /c "cd frontend && npm run dev"

echo ========================================================
echo  ClinicScribe is starting!
echo  Frontend: http://localhost:3000
echo  Backend:  http://127.0.0.1:8000
echo ========================================================

