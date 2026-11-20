#!/usr/bin/env bash
# =============================================================================
# ClinicScribe — Automated Google Cloud Production Deployment Script
# Target Project: clinicscribe-515308
# Target Region:  asia-south1 (Mumbai) / us-central1
# =============================================================================

set -e

PROJECT_ID="clinicscribe-515308"
REGION="asia-south1"
REPO_NAME="clinicscribe-repo"

echo "=================================================================="
echo "🏥 ClinicScribe — Google Cloud Production Deployment"
echo "Project ID: ${PROJECT_ID}"
echo "Region:     ${REGION}"
echo "=================================================================="

# 1. Set Google Cloud Project
echo "1️⃣  Configuring active GCP project..."
gcloud config set project "${PROJECT_ID}"

# 2. Enable Required GCP APIs
echo "2️⃣  Enabling required Google Cloud APIs (Cloud Run, Artifact Registry, Cloud Build, Secret Manager, Cloud Storage)..."
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    storage.googleapis.com \
    generativelanguage.googleapis.com

# 3. Create Artifact Registry Repository
echo "3️⃣  Checking / Creating Artifact Registry repository..."
if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" >/dev/null 2>&1; then
    gcloud artifacts repositories create "${REPO_NAME}" \
        --repository-format=docker \
        --location="${REGION}" \
        --description="ClinicScribe Docker container repository"
    echo "   ✅ Created Artifact Registry: ${REPO_NAME} in ${REGION}"
else
    echo "   ✅ Artifact Registry ${REPO_NAME} already exists."
fi

# 4. Create Encrypted Cloud Storage Buckets with DPDP 30-Day Lifecycle
echo "4️⃣  Configuring Cloud Storage buckets for audio & clinical PDFs..."
AUDIO_BUCKET="${PROJECT_ID}-audio"
DOCS_BUCKET="${PROJECT_ID}-docs"

if ! gcloud storage buckets describe "gs://${AUDIO_BUCKET}" >/dev/null 2>&1; then
    gcloud storage buckets create "gs://${AUDIO_BUCKET}" \
        --location="${REGION}" \
        --uniform-bucket-level-access
    
    # Apply 30-day retention lifecycle (DPDP Compliance)
    cat <<EOF > /tmp/lifecycle-audio.json
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 30}
    }
  ]
}
EOF
    gcloud storage buckets update "gs://${AUDIO_BUCKET}" --lifecycle-file=/tmp/lifecycle-audio.json
    rm -f /tmp/lifecycle-audio.json
    echo "   ✅ Audio bucket created with 30-day auto-purge policy: gs://${AUDIO_BUCKET}"
fi

if ! gcloud storage buckets describe "gs://${DOCS_BUCKET}" >/dev/null 2>&1; then
    gcloud storage buckets create "gs://${DOCS_BUCKET}" \
        --location="${REGION}" \
        --uniform-bucket-level-access
    echo "   ✅ Docs bucket created: gs://${DOCS_BUCKET}"
fi

# 5. Build & Deploy Backend (Cloud Run)
echo "5️⃣  Building and deploying ClinicScribe FastAPI Backend to Cloud Run..."
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/backend:latest"

gcloud builds submit backend \
    --tag="${BACKEND_IMAGE}"

gcloud run deploy clinicscribe-backend \
    --image="${BACKEND_IMAGE}" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --cpu=1 \
    --memory=1Gi \
    --min-instances=0 \
    --max-instances=10 \
    --port=8000 \
    --set-env-vars="ENVIRONMENT=production,DEBUG=False,PROJECT_NAME=ClinicScribe,AUDIO_STORAGE_BUCKET=${AUDIO_BUCKET},DOCS_STORAGE_BUCKET=${DOCS_BUCKET}"

BACKEND_URL=$(gcloud run services describe clinicscribe-backend --region="${REGION}" --format='value(status.url)')
echo "   ✅ Backend deployed successfully: ${BACKEND_URL}"

# 6. Build & Deploy Frontend (Cloud Run)
echo "6️⃣  Building and deploying ClinicScribe Next.js Frontend to Cloud Run..."
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/frontend:latest"

gcloud builds submit frontend \
    --tag="${FRONTEND_IMAGE}"

gcloud run deploy clinicscribe-frontend \
    --image="${FRONTEND_IMAGE}" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --cpu=1 \
    --memory=512Mi \
    --min-instances=0 \
    --max-instances=10 \
    --port=3000 \
    --set-env-vars="NEXT_PUBLIC_API_URL=${BACKEND_URL}/api/v1"

FRONTEND_URL=$(gcloud run services describe clinicscribe-frontend --region="${REGION}" --format='value(status.url)')

# 7. Update Backend CORS to include Frontend Cloud Run URL
echo "7️⃣  Updating Backend CORS whitelist with Frontend domain..."
gcloud run services update clinicscribe-backend \
    --region="${REGION}" \
    --update-env-vars="CORS_ORIGINS=[\"${FRONTEND_URL}\",\"http://localhost:3000\",\"http://localhost:3001\"]"

echo ""
echo "=================================================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================================================="
echo "🌐 Frontend Web App:     ${FRONTEND_URL}"
echo "🏥 Doctor Dashboard:     ${FRONTEND_URL}/dashboard"
echo "🎨 Liquid Metal Brand:   ${FRONTEND_URL}/liquid-metal"
echo "📚 Backend REST API:     ${BACKEND_URL}/api/v1/docs"
echo "🩺 Backend Health:       ${BACKEND_URL}/api/v1/healthz"
echo "=================================================================="
