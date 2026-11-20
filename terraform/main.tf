# ==============================================================================
# ClinicScribe - Google Cloud Enterprise Infrastructure (Terraform)
# Provisions:
#   - Google Cloud Vertex AI (Gemini 1.5 Pro)
#   - Google Cloud AlloyDB for PostgreSQL Cluster & Instance
#   - Google Artifact Registry (Docker Repository)
#   - Google Cloud Storage Buckets (Encrypted Audio & Prescription PDFs)
#   - Serverless VPC Access Connector
#   - Google Cloud Run (Autoscaling Backend & Frontend)
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.30.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "Google Cloud Project ID"
  default     = "clinicscribe-515308"
}

variable "region" {
  type        = string
  description = "Google Cloud Region (India DPDP Act compliance)"
  default     = "asia-south1" # Mumbai
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# 1. Google Artifact Registry Repository
resource "google_artifact_registry_repository" "clinicscribe_registry" {
  location      = var.region
  repository_id = "clinicscribe-registry"
  description   = "ClinicScribe Healthcare SaaS Docker Container Registry"
  format        = "DOCKER"
}

# 2. Cloud Storage Buckets
resource "google_storage_bucket" "audio_recordings" {
  name          = "${var.project_id}-consultation-audio"
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90 # Transition older audio to nearline
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}

resource "google_storage_bucket" "clinical_documents" {
  name          = "${var.project_id}-clinical-documents"
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}

# 3. VPC Network & Private Services Connection for AlloyDB
resource "google_compute_network" "clinicscribe_vpc" {
  name                    = "clinicscribe-vpc"
  auto_create_subnetworks = true
}

resource "google_compute_global_address" "private_ip_alloc" {
  name          = "alloydb-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.clinicscribe_vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.clinicscribe_vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_alloc.name]
}

# 4. Serverless VPC Access Connector (Connects Cloud Run to AlloyDB Private IP)
resource "google_vpc_access_connector" "serverless_connector" {
  name          = "clinicscribe-vpc-cx"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.clinicscribe_vpc.name
  min_instances = 2
  max_instances = 5
}

# 5. Google Cloud AlloyDB for PostgreSQL Cluster
resource "google_alloydb_cluster" "alloydb_cluster" {
  provider   = google-beta
  cluster_id = "clinicscribe-alloydb-cluster"
  location   = var.region
  network_config {
    network = google_compute_network.clinicscribe_vpc.id
  }

  initial_user {
    user     = "postgres"
    password = "ChangeMeImmediatelyClinicScribe2026!"
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

# 6. Google Cloud AlloyDB Primary Instance
resource "google_alloydb_instance" "alloydb_primary" {
  provider      = google-beta
  cluster       = google_alloydb_cluster.alloydb_cluster.name
  instance_id   = "clinicscribe-primary-instance"
  instance_type = "PRIMARY"

  machine_config {
    cpu_count = 2
  }

  database_flags = {
    "google_columnar_engine.enabled"           = "on"
    "google_columnar_engine.memory_size_in_mb" = "1024"
  }
}

# 7. IAM Service Account for Cloud Run & Vertex AI
resource "google_service_account" "app_sa" {
  account_id   = "clinicscribe-app-sa"
  display_name = "ClinicScribe Healthcare SaaS Application SA"
}

# Grant Vertex AI User
resource "google_project_iam_member" "vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}

# Grant AlloyDB Client
resource "google_project_iam_member" "alloydb_client" {
  project = var.project_id
  role    = "roles/alloydb.client"
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}

# Grant Cloud Storage Object Admin
resource "google_project_iam_member" "storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}

output "artifact_registry_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.clinicscribe_registry.repository_id}"
}

output "alloydb_cluster_name" {
  value = google_alloydb_cluster.alloydb_cluster.cluster_id
}

output "vpc_connector_id" {
  value = google_vpc_access_connector.serverless_connector.id
}

