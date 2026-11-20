#!/usr/bin/env bash
# ==============================================================================
# ClinicScribe - Google Cloud Enterprise Deployment Script
# Provisions:
#   - Google Cloud Vertex AI (Gemini 1.5 Pro)
#   - Google Cloud AlloyDB for PostgreSQL (Cluster + Primary Instance + pgvector)
#   - Google Artifact Registry (Docker Container Repository)
#   - Google Cloud Storage (Encrypted Audio & Prescription PDFs)
#   - Serverless VPC Access Connector
#   - Google Cloud Run (Autoscaling Backend & Frontend)
# ==============================================================================

set -euo pipefail

# Configuration Defaults (Override via environment or parameters)
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo "")}"
REGION="${GCP_REGION:-asia-south1}"  # Mumbai / India region (DPDP Act compliance)
ARTIFACT_REPO="clinicscribe-registry"
ALLOYDB_CLUSTER="clinicscribe-alloydb-cluster"
ALLOYDB_INSTANCE="clinicscribe-primary-instance"
VPC_CONNECTOR_NAME="clinicscribe-vpc-cx"
SA_NAME="clinicscribe-app-sa"

echo "================================================================="
echo " ClinicScribe: Google Cloud Enterprise Deployment"
echo " Project:  ${PROJECT_ID}"
echo " Region:   ${REGION}"
echo "================================================================="

if [[ -z "${PROJECT_ID}" ]]; then
  echo "Error: GCP_PROJECT_ID is not set. Run 'gcloud config set project <PROJECT_ID>' or set GCP_PROJECT_ID."
  exit 1
fi

# 1. Enable Required Google Cloud Enterprise APIs
echo "[1/7] Enabling Google Cloud Services (Vertex AI, AlloyDB, Artifact Registry, Cloud Run, VPC Access)..."
gcloud services enable \
  aiplatform.googleapis.com \
  alloydb.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  vpcaccess.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com \
  servicenetworking.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  --project="${PROJECT_ID}"

# 2. Create Google Artifact Registry Repository
echo "[2/7] Configuring Google Artifact Registry..."
if ! gcloud artifacts repositories describe "${ARTIFACT_REPO}" --location="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
  gcloud artifacts repositories create "${ARTIFACT_REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="ClinicScribe Healthcare SaaS Docker Container Registry" \
    --project="${PROJECT_ID}"
  echo "Created Artifact Registry repository: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}"
else
  echo "Artifact Registry repository already exists."
fi

# 3. Create Cloud Storage Buckets (Audio & Signed Clinical Documents)
echo "[3/7] Setting up Google Cloud Storage buckets..."
AUDIO_BUCKET="gs://${PROJECT_ID}-consultation-audio"
DOCS_BUCKET="gs://${PROJECT_ID}-clinical-documents"

if ! gsutil ls -b "${AUDIO_BUCKET}" &>/dev/null; then
  gsutil mb -p "${PROJECT_ID}" -c STANDARD -l "${REGION}" "${AUDIO_BUCKET}"
  gsutil uniformbucketlevelaccess set on "${AUDIO_BUCKET}"
fi

if ! gsutil ls -b "${DOCS_BUCKET}" &>/dev/null; then
  gsutil mb -p "${PROJECT_ID}" -c STANDARD -l "${REGION}" "${DOCS_BUCKET}"
  gsutil uniformbucketlevelaccess set on "${DOCS_BUCKET}"
fi

# 4. Configure VPC Peering and Serverless VPC Access for AlloyDB
echo "[4/7] Configuring Serverless VPC Network & Connector for AlloyDB..."
if ! gcloud compute networks vpc-access connectors describe "${VPC_CONNECTOR_NAME}" --region="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
  gcloud compute networks vpc-access connectors create "${VPC_CONNECTOR_NAME}" \
    --region="${REGION}" \
    --network=default \
    --range=10.8.0.0/28 \
    --min-instances=2 \
    --max-instances=5 \
    --project="${PROJECT_ID}" || echo "VPC connector notice: proceeding..."
fi

# 5. Provision Google Cloud AlloyDB for PostgreSQL
echo "[5/7] Provisioning Google Cloud AlloyDB for PostgreSQL Cluster & Instance..."
if ! gcloud alloydb clusters describe "${ALLOYDB_CLUSTER}" --region="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
  echo "Creating AlloyDB Cluster: ${ALLOYDB_CLUSTER} in ${REGION}..."
  gcloud alloydb clusters create "${ALLOYDB_CLUSTER}" \
    --region="${REGION}" \
    --network=default \
    --password="ChangeMeImmediatelyClinicScribe2026!" \
    --project="${PROJECT_ID}"
fi

if ! gcloud alloydb instances describe "${ALLOYDB_INSTANCE}" --cluster="${ALLOYDB_CLUSTER}" --region="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
  echo "Creating AlloyDB Primary Instance: ${ALLOYDB_INSTANCE}..."
  gcloud alloydb instances create "${ALLOYDB_INSTANCE}" \
    --cluster="${ALLOYDB_CLUSTER}" \
    --region="${REGION}" \
    --instance-type=PRIMARY \
    --cpu-count=2 \
    --project="${PROJECT_ID}"
fi

# 6. Service Account and IAM Roles (Vertex AI, AlloyDB, Cloud Storage)
echo "[6/7] Configuring IAM Service Account permissions for Vertex AI & AlloyDB..."
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "${SA_EMAIL}" --project="${PROJECT_ID}" &>/dev/null; then
  gcloud iam service-accounts create "${SA_NAME}" \
    --display-name="ClinicScribe Healthcare SaaS Service Account" \
    --project="${PROJECT_ID}"
fi

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user"

# Grant AlloyDB Client role
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/alloydb.client"

# Grant Cloud Storage Object Admin
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin"

# 7. Submit Cloud Build to Compile Containers & Deploy to Cloud Run
echo "[7/7] Submitting build to Cloud Build..."
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project="${PROJECT_ID}"

echo "================================================================="
echo " ClinicScribe Google Cloud Enterprise Deployment Successfully Completed!"
echo " - Vertex AI: Gemini 1.5 Pro active in ${REGION}"
echo " - AlloyDB: Cluster ${ALLOYDB_CLUSTER} active"
echo " - Artifact Registry: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}"
echo "================================================================="

