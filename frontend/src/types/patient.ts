export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE";
export type ConditionStatus = "ACTIVE" | "RESOLVED" | "CHRONIC";

export interface Allergy {
  id: string;
  allergen: string;
  severity: AllergySeverity;
  reaction_notes?: string;
}

export interface MedicalHistoryItem {
  id: string;
  condition_name: string;
  diagnosed_year?: number;
  status: ConditionStatus;
  notes?: string;
}

export interface Medication {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  is_active: boolean;
}

export interface Patient {
  id: string;
  clinic_id: string;
  patient_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  blood_group: string;
  phone: string;
  email?: string;
  address?: string;
  preferred_language: string;
  created_at: string;
  allergies?: Allergy[];
  medical_histories?: MedicalHistoryItem[];
  current_medications?: Medication[];
}

