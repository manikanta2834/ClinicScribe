#!/usr/bin/env bash
# ==============================================================================
# ClinicScribe - Ultra-Fast Google Cloud Run Deployment Script
# Automatically builds from source, containers, and deploys both Frontend & Backend
# ==============================================================================
set -euo pipefail

PROJECT_ID="${1:-clinicscribe-515308}"
REGION="asia-south1"

echo "================================================================="
echo " ClinicScribe: Quick Cloud Run Deployment via Git"
echo " Project:  ${PROJECT_ID}"
echo " Region:   ${REGION}"
echo "================================================================="

gcloud config set project "${PROJECT_ID}"

echo "[1/4] Enabling Google Cloud Services (Cloud Run, Cloud Build, Vertex AI, Artifact Registry)..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com \
  --project="${PROJECT_ID}"

echo "[2/4] Granting Service Account Storage & Build permissions..."
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/storage.admin" \
  --condition=None || true

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.writer" \
  --condition=None || true

echo "[3/4] Building and Deploying Backend API to Cloud Run..."
gcloud run deploy clinicscribe-api \
  --source=./backend \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8000 \
  --memory=1Gi \
  --cpu=1 \
  --set-env-vars=ENVIRONMENT=production,USE_VERTEX_AI=true,GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION},VERTEX_AI_LOCATION=${REGION} \
  --project="${PROJECT_ID}"

BACKEND_URL=$(gcloud run services describe clinicscribe-api --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')
echo "Backend API is live at: ${BACKEND_URL}"

echo "[4/4] Building and Deploying Frontend Web App to Cloud Run..."
gcloud run deploy clinicscribe-web \
  --source=./frontend \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=3000 \
  --memory=1Gi \
  --cpu=1 \
  --set-env-vars=NODE_ENV=production,NEXT_PUBLIC_API_URL=${BACKEND_URL} \
  --project="${PROJECT_ID}"

FRONTEND_URL=$(gcloud run services describe clinicscribe-web --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')

echo "================================================================="
echo " 🎉 ClinicScribe Deployment Completed Successfully!"
echo " 🌐 Frontend Web App: ${FRONTEND_URL}"
echo " 🩺 Backend API:      ${BACKEND_URL}"
echo " 📖 API Docs:         ${BACKEND_URL}/api/v1/docs"
echo "================================================================="

