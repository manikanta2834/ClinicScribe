Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " ClinicScribe - Clean Startup & Port Rectifier" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`n[1/3] Terminating stale node/python processes..." -ForegroundColor Yellow
Get-Process node, python -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "[2/3] Clearing stale .next cache to ensure 100% clean Tailwind styling..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\frontend\.next") {
    Remove-Item -Recurse -Force "$PSScriptRoot\frontend\.next" -ErrorAction SilentlyContinue
}

Write-Host "[3/3] Launching Backend & Frontend on Ports 8000 and 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\activate; uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`nClinicScribe is live!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Cyan

