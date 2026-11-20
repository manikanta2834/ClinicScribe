# ==============================================================================
# ClinicScribe - Google Cloud Enterprise Deployment Script (PowerShell)
# Provisions:
#   - Google Cloud Vertex AI (Gemini 1.5 Pro)
#   - Google Cloud AlloyDB for PostgreSQL
#   - Google Artifact Registry (Docker Container Repository)
#   - Google Cloud Storage (Encrypted Audio & Prescription PDFs)
#   - Serverless VPC Access Connector
#   - Google Cloud Run (Autoscaling Backend & Frontend)
# ==============================================================================

param (
    [string]$ProjectId = $env:GCP_PROJECT_ID,
    [string]$Region = "asia-south1",
    [string]$ArtifactRepo = "clinicscribe-registry",
    [string]$AlloyDBCluster = "clinicscribe-alloydb-cluster",
    [string]$AlloyDBInstance = "clinicscribe-primary-instance"
)

$ErrorActionPreference = "Stop"

if (-not $ProjectId) {
    try {
        $ProjectId = (gcloud config get-value project 2>$null).Trim()
    } catch {}
}

if (-not $ProjectId) {
    Write-Error "GCP Project ID is required. Pass -ProjectId <ID> or set GCP_PROJECT_ID."
    exit 1
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " ClinicScribe: Google Cloud Enterprise Deployment (Windows/PowerShell)" -ForegroundColor Cyan
Write-Host " Project:  $ProjectId" -ForegroundColor Green
Write-Host " Region:   $Region" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Enable Services
Write-Host "[1/7] Enabling Google Cloud Services (Vertex AI, AlloyDB, Artifact Registry, Cloud Run)..." -ForegroundColor Yellow
gcloud services enable `
    aiplatform.googleapis.com `
    alloydb.googleapis.com `
    artifactregistry.googleapis.com `
    run.googleapis.com `
    vpcaccess.googleapis.com `
    secretmanager.googleapis.com `
    compute.googleapis.com `
    servicenetworking.googleapis.com `
    storage.googleapis.com `
    cloudbuild.googleapis.com `
    --project=$ProjectId

# 2. Artifact Registry
Write-Host "[2/7] Ensuring Google Artifact Registry repository exists..." -ForegroundColor Yellow
$repoCheck = gcloud artifacts repositories describe $ArtifactRepo --location=$Region --project=$ProjectId 2>$null
if (-not $repoCheck) {
    gcloud artifacts repositories create $ArtifactRepo `
        --repository-format=docker `
        --location=$Region `
        --description="ClinicScribe Healthcare SaaS Docker Container Registry" `
        --project=$ProjectId
    Write-Host "Artifact Registry created: $Region-docker.pkg.dev/$ProjectId/$ArtifactRepo" -ForegroundColor Green
} else {
    Write-Host "Artifact Registry repository already exists." -ForegroundColor Gray
}

# 3. Cloud Storage
Write-Host "[3/7] Setting up Cloud Storage buckets..." -ForegroundColor Yellow
$audioBucket = "gs://${ProjectId}-consultation-audio"
$docsBucket = "gs://${ProjectId}-clinical-documents"
gsutil mb -p $ProjectId -c STANDARD -l $Region $audioBucket 2>$null
gsutil mb -p $ProjectId -c STANDARD -l $Region $docsBucket 2>$null

# 4. AlloyDB Cluster & Instance
Write-Host "[4/7] Ensuring Google Cloud AlloyDB for PostgreSQL Cluster & Instance..." -ForegroundColor Yellow
$clusterCheck = gcloud alloydb clusters describe $AlloyDBCluster --region=$Region --project=$ProjectId 2>$null
if (-not $clusterCheck) {
    Write-Host "Creating AlloyDB Cluster: $AlloyDBCluster..." -ForegroundColor Yellow
    gcloud alloydb clusters create $AlloyDBCluster `
        --region=$Region `
        --network=default `
        --password="ChangeMeImmediatelyClinicScribe2026!" `
        --project=$ProjectId
}

$instCheck = gcloud alloydb instances describe $AlloyDBInstance --cluster=$AlloyDBCluster --region=$Region --project=$ProjectId 2>$null
if (-not $instCheck) {
    Write-Host "Creating AlloyDB Primary Instance: $AlloyDBInstance..." -ForegroundColor Yellow
    gcloud alloydb instances create $AlloyDBInstance `
        --cluster=$AlloyDBCluster `
        --region=$Region `
        --instance-type=PRIMARY `
        --cpu-count=2 `
        --project=$ProjectId
}

# 5. Cloud Build Submission
Write-Host "[5/7] Submitting container build and deployment via Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --config=cloudbuild.yaml --project=$ProjectId

Write-Host "=================================================================" -ForegroundColor Green
Write-Host " ClinicScribe Google Cloud Enterprise Deployment Successfully Initiated!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

