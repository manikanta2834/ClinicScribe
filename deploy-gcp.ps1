# =============================================================================
# ClinicScribe — Automated Google Cloud Production Deployment Script (PowerShell)
# Target Project: clinicscribe-515308
# Target Region:  asia-south1 (Mumbai)
# =============================================================================

$ErrorActionPreference = "Stop"

$PROJECT_ID = "clinicscribe-515308"
$REGION = "asia-south1"
$REPO_NAME = "clinicscribe-repo"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🏥 ClinicScribe — Google Cloud Production Deployment" -ForegroundColor Green
Write-Host "Project ID: $PROJECT_ID"
Write-Host "Region:     $REGION"
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Set Google Cloud Project
Write-Host "1️⃣  Configuring active GCP project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# 2. Enable Required GCP APIs
Write-Host "2️⃣  Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    secretmanager.googleapis.com `
    storage.googleapis.com `
    generativelanguage.googleapis.com

# 3. Create Artifact Registry Repository
Write-Host "3️⃣  Checking / Creating Artifact Registry repository..." -ForegroundColor Yellow
$repoExists = gcloud artifacts repositories describe $REPO_NAME --location=$REGION 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud artifacts repositories create $REPO_NAME `
        --repository-format=docker `
        --location=$REGION `
        --description="ClinicScribe Docker container repository"
    Write-Host "   ✅ Created Artifact Registry: $REPO_NAME in $REGION" -ForegroundColor Green
} else {
    Write-Host "   ✅ Artifact Registry $REPO_NAME already exists." -ForegroundColor Green
}

# 4. Storage Buckets
$AUDIO_BUCKET = "$PROJECT_ID-audio"
$DOCS_BUCKET = "$PROJECT_ID-docs"
Write-Host "4️⃣  Configuring Cloud Storage buckets..." -ForegroundColor Yellow

$bucketAudioExists = gcloud storage buckets describe "gs://$AUDIO_BUCKET" 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud storage buckets create "gs://$AUDIO_BUCKET" --location=$REGION --uniform-bucket-level-access
    Write-Host "   ✅ Audio bucket created: gs://$AUDIO_BUCKET" -ForegroundColor Green
}

$bucketDocsExists = gcloud storage buckets describe "gs://$DOCS_BUCKET" 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud storage buckets create "gs://$DOCS_BUCKET" --location=$REGION --uniform-bucket-level-access
    Write-Host "   ✅ Docs bucket created: gs://$DOCS_BUCKET" -ForegroundColor Green
}

# 5. Build & Deploy Backend
Write-Host "5️⃣  Building and deploying ClinicScribe FastAPI Backend to Cloud Run..." -ForegroundColor Yellow
$BACKEND_IMAGE = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest"

gcloud builds submit backend --tag=$BACKEND_IMAGE

gcloud run deploy clinicscribe-backend `
    --image=$BACKEND_IMAGE `
    --region=$REGION `
    --platform=managed `
    --allow-unauthenticated `
    --cpu=1 `
    --memory=1Gi `
    --min-instances=0 `
    --max-instances=10 `
    --port=8000 `
    --set-env-vars="ENVIRONMENT=production,DEBUG=False,PROJECT_NAME=ClinicScribe,AUDIO_STORAGE_BUCKET=$AUDIO_BUCKET,DOCS_STORAGE_BUCKET=$DOCS_BUCKET"

$BACKEND_URL = (gcloud run services describe clinicscribe-backend --region=$REGION --format="value(status.url)").Trim()
Write-Host "   ✅ Backend deployed: $BACKEND_URL" -ForegroundColor Green

# 6. Build & Deploy Frontend
Write-Host "6️⃣  Building and deploying ClinicScribe Next.js Frontend to Cloud Run..." -ForegroundColor Yellow
$FRONTEND_IMAGE = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/frontend:latest"

gcloud builds submit frontend --tag=$FRONTEND_IMAGE

gcloud run deploy clinicscribe-frontend `
    --image=$FRONTEND_IMAGE `
    --region=$REGION `
    --platform=managed `
    --allow-unauthenticated `
    --cpu=1 `
    --memory=512Mi `
    --min-instances=0 `
    --max-instances=10 `
    --port=3000 `
    --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1"

$FRONTEND_URL = (gcloud run services describe clinicscribe-frontend --region=$REGION --format="value(status.url)").Trim()

# 7. Update Backend CORS
Write-Host "7️⃣  Updating Backend CORS whitelist..." -ForegroundColor Yellow
gcloud run services update clinicscribe-backend `
    --region=$REGION `
    --update-env-vars="CORS_ORIGINS=[`"$FRONTEND_URL`",`"http://localhost:3000`",`"http://localhost:3001`"]"

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🌐 Frontend Web App:     $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "🏥 Doctor Dashboard:     $FRONTEND_URL/dashboard" -ForegroundColor Cyan
Write-Host "🎨 Liquid Metal Brand:   $FRONTEND_URL/liquid-metal" -ForegroundColor Cyan
Write-Host "📚 Backend REST API:     $BACKEND_URL/api/v1/docs" -ForegroundColor Cyan
Write-Host "🩺 Backend Health:       $BACKEND_URL/api/v1/healthz" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
