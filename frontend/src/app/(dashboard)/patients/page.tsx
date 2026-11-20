"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PillBadge } from "@/components/ui/pill-badge";
import { Patient } from "@/types/patient";
import {
  Users,
  Search,
  PlusCircle,
  FileText,
  UserCheck,
  Phone,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react";

// Synthetic initial seed patients for demonstration
const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-1001",
    clinic_id: "cln-demo-001",
    patient_code: "CS-P-1001",
    first_name: "Priya",
    last_name: "Sundaram",
    date_of_birth: "1988-06-14",
    gender: "FEMALE",
    blood_group: "O+",
    phone: "+91 98401 23456",
    email: "priya.s@gmail.com",
    address: "T. Nagar, Chennai, Tamil Nadu",
    preferred_language: "Tamil",
    created_at: "2026-10-12T09:30:00Z",
    allergies: [{ id: "al-1", allergen: "Penicillin", severity: "SEVERE", reaction_notes: "Anaphylaxis rash" }],
    medical_histories: [{ id: "mh-1", condition_name: "Hypothyroidism", diagnosed_year: 2021, status: "ACTIVE" }],
    current_medications: [{ id: "med-1", medication_name: "Thyronorm", dosage: "50mcg", frequency: "Morning empty stomach", is_active: true }],
  },
  {
    id: "pat-1002",
    clinic_id: "cln-demo-001",
    patient_code: "CS-P-1002",
    first_name: "Aarav",
    last_name: "Sharma",
    date_of_birth: "1975-11-20",
    gender: "MALE",
    blood_group: "B+",
    phone: "+91 98112 34567",
    email: "aarav.sharma@yahoo.com",
    address: "Indiranagar, Bangalore",
    preferred_language: "Hindi / English",
    created_at: "2026-10-15T11:15:00Z",
    allergies: [{ id: "al-2", allergen: "Aspirin", severity: "MODERATE", reaction_notes: "Gastric upset" }],
    medical_histories: [{ id: "mh-2", condition_name: "Hypertension", diagnosed_year: 2019, status: "CHRONIC" }],
    current_medications: [{ id: "med-2", medication_name: "Telmisartan", dosage: "40mg", frequency: "Once daily morning", is_active: true }],
  },
  {
    id: "pat-1003",
    clinic_id: "cln-demo-001",
    patient_code: "CS-P-1003",
    first_name: "Kavitha",
    last_name: "Raman",
    date_of_birth: "1994-03-08",
    gender: "FEMALE",
    blood_group: "A+",
    phone: "+91 94440 98765",
    email: "kavitha.r@gmail.com",
    address: "Mylapore, Chennai",
    preferred_language: "Tamil / English",
    created_at: "2026-10-18T14:00:00Z",
    allergies: [],
    medical_histories: [{ id: "mh-3", condition_name: "Bronchial Asthma", diagnosed_year: 2018, status: "CHRONIC" }],
    current_medications: [{ id: "med-3", medication_name: "Budecort Inhaler", dosage: "200mcg", frequency: "Twice daily as needed", is_active: true }],
  },
  {
    id: "pat-1004",
    clinic_id: "cln-demo-001",
    patient_code: "CS-P-1004",
    first_name: "Siddharth",
    last_name: "Verma",
    date_of_birth: "1982-08-25",
    gender: "MALE",
    blood_group: "AB+",
    phone: "+91 99887 65432",
    email: "sid.verma@outlook.com",
    address: "Anna Nagar, Chennai",
    preferred_language: "English",
    created_at: "2026-10-22T10:45:00Z",
    allergies: [{ id: "al-3", allergen: "Sulfa Drugs", severity: "SEVERE" }],
    medical_histories: [],
    current_medications: [],
  },
];

export default function PatientsDirectoryPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Patient Form
  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "1990-01-01",
    gender: "MALE" as const,
    blood_group: "O+",
    phone: "",
    email: "",
    preferred_language: "Tamil",
    allergy: "",
  });

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      p.patient_code.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);

    const matchesLanguage =
      languageFilter === "ALL" || p.preferred_language.includes(languageFilter);

    return matchesSearch && matchesLanguage;
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Patient = {
      id: "pat-" + (1000 + patients.length + 1),
      clinic_id: "cln-demo-001",
      patient_code: `CS-P-${1000 + patients.length + 1}`,
      first_name: newPatient.first_name,
      last_name: newPatient.last_name,
      date_of_birth: newPatient.date_of_birth,
      gender: newPatient.gender,
      blood_group: newPatient.blood_group,
      phone: newPatient.phone,
      email: newPatient.email,
      preferred_language: newPatient.preferred_language,
      created_at: new Date().toISOString(),
      allergies: newPatient.allergy
        ? [{ id: "al-" + Date.now(), allergen: newPatient.allergy, severity: "MODERATE" }]
        : [],
      medical_histories: [],
      current_medications: [],
    };

    setPatients([created, ...patients]);
    setIsModalOpen(false);
    setNewPatient({
      first_name: "",
      last_name: "",
      date_of_birth: "1990-01-01",
      gender: "MALE",
      blood_group: "O+",
      phone: "",
      email: "",
      preferred_language: "Tamil",
      allergy: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-evergreen">
            Patient Directory
          </h1>
          <p className="text-xs text-brand-slate">
            {patients.length} active patients managed under your clinic tenant
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Patient
        </GlassButton>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, patient ID, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs glass-input text-brand-evergreen placeholder:text-brand-slate/60 shadow-sm"
          />
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-full border border-brand-oceanTeal/20 self-start sm:self-auto text-xs">
          {["ALL", "Tamil", "English", "Hindi"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguageFilter(lang)}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                languageFilter === lang
                  ? "bg-brand-evergreen text-white shadow-sm"
                  : "text-brand-slate hover:text-brand-evergreen"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-seafoam/30 text-[11px] font-semibold text-brand-slate uppercase tracking-wider bg-brand-mist/30">
                <th className="py-3.5 px-4">Patient Code</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Gender & DOB</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Allergies</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-seafoam/20 text-xs">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-seafoam/15 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-deepTeal">
                      {p.patient_code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-evergreen">
                      <Link
                        href={`/patients/${p.id}`}
                        className="hover:underline flex items-center gap-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-brand-oceanTeal/20 text-brand-evergreen font-bold text-[10px] flex items-center justify-center">
                          {p.first_name[0]}
                          {p.last_name[0]}
                        </div>
                        <span>
                          {p.first_name} {p.last_name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-brand-slate">
                      {p.gender} &bull; {p.date_of_birth}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-brand-mist text-brand-evergreen font-semibold text-[11px]">
                        {p.blood_group}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-brand-seafoam/50 text-brand-deepTeal text-[10px] font-medium">
                        {p.preferred_language}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-brand-slate font-mono">
                      {p.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.allergies && p.allergies.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold text-[10px]">
                          {p.allergies[0].allergen}
                        </span>
                      ) : (
                        <span className="text-brand-slate/60 text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/patients/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-mint hover:text-brand-evergreen"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-slate text-xs">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-oceanTeal/30 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-brand-slate hover:text-brand-evergreen hover:bg-brand-mist/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-brand-evergreen mb-1">
              Add New Patient
            </h2>
            <p className="text-xs text-brand-slate mb-6">
              Create a patient record isolated to your clinic.
            </p>

            <form onSubmit={handleAddPatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-evergreen">First Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.first_name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, first_name: e.target.value })
                    }
                    placeholder="e.g. Ramesh"
                    className="w-full px-3.5 py-2 glass-input mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-evergreen">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.last_name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, last_name: e.target.value })
                    }
                    placeholder="e.g. Kumar"
                    className="w-full px-3.5 py-2 glass-input mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-brand-evergreen">DOB</label>
                  <input
                    type="date"
                    required
                    value={newPatient.date_of_birth}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, date_of_birth: e.target.value })
                    }
                    className="w-full px-3.5 py-2 glass-input mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-evergreen">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2 glass-input mt-1 bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-brand-evergreen">Blood Group</label>
                  <select
                    value={newPatient.blood_group}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, blood_group: e.target.value })
                    }
                    className="w-full px-3.5 py-2 glass-input mt-1 bg-white"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-evergreen">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 glass-input mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-evergreen">Language</label>
                  <select
                    value={newPatient.preferred_language}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, preferred_language: e.target.value })
                    }
                    className="w-full px-3.5 py-2 glass-input mt-1 bg-white"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil / English">Tamil / English</option>
                    <option value="Hindi / English">Hindi / English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-evergreen">
                  Known Drug Allergy (Optional)
                </label>
                <input
                  type="text"
                  value={newPatient.allergy}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, allergy: e.target.value })
                  }
                  placeholder="e.g. Penicillin, Paracetamol, None"
                  className="w-full px-3.5 py-2 glass-input mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <GlassButton
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton type="submit" variant="primary" size="md">
                  Save Patient Record
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
