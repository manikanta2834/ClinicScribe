"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  HeartPulse,
  Pill,
  Clock,
  Mic,
  FileCheck2,
} from "lucide-react";

export default function PatientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // Synthetic patient detail representation
  const patient = {
    id: params.id,
    patient_code: "CS-P-1001",
    name: "Priya Sundaram",
    gender: "Female",
    age: 38,
    dob: "14 June 1988",
    blood_group: "O+",
    phone: "+91 98401 23456",
    email: "priya.sundaram@gmail.com",
    address: "14/2, 4th Cross Street, T. Nagar, Chennai, Tamil Nadu",
    preferred_language: "Tamil / English (Tanglish)",
    allergies: [
      {
        name: "Penicillin",
        severity: "Severe",
        notes: "Causes anaphylactic urticaria and breathing difficulty",
      },
    ],
    chronic_conditions: [
      {
        name: "Hypothyroidism",
        diagnosed: "2021",
        status: "Active (Managed)",
      },
      {
        name: "Mild Allergic Rhinitis",
        diagnosed: "2023",
        status: "Active",
      },
    ],
    medications: [
      {
        name: "Thyronorm (Levothyroxine Sodium)",
        dosage: "50 mcg",
        frequency: "Once daily morning (Empty stomach)",
        prescribed_by: "Dr. Sarah",
      },
      {
        name: "Montair-LC",
        dosage: "10 mg",
        frequency: "Once daily at bedtime (SOS)",
        prescribed_by: "Dr. Sarah",
      },
    ],
    past_consultations: [
      {
        id: "cs-1089",
        date: "Yesterday at 04:30 PM",
        type: "Endocrinology Review",
        doctor: "Dr. Sarah",
        status: "Approved",
        notes: "TSH levels stable at 2.4 mIU/L. Continue current dosage for 3 months.",
      },
      {
        id: "cs-0992",
        date: "14 July 2026",
        type: "Routine Health Checkup",
        doctor: "Dr. Sarah",
        status: "Approved",
        notes: "BP 118/76 mmHg. Mild seasonal rhinitis treated with antihistamines.",
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="text-xs font-semibold text-brand-slate hover:text-brand-evergreen flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patient Directory
        </Link>

        <Link href="/consultations/new">
          <GlassButton variant="primary" size="md">
            <Mic className="w-4 h-4" />
            Start AI Consultation
          </GlassButton>
        </Link>
      </div>

      {/* Hero Demographics Card */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-evergreen text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              PS
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-brand-evergreen">
                  {patient.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-mist text-brand-deepTeal font-mono text-xs font-bold border border-brand-oceanTeal/30">
                  {patient.patient_code}
                </span>
              </div>
              <p className="text-xs text-brand-slate">
                {patient.gender} &bull; {patient.age} years &bull; Blood Group:{" "}
                <strong className="text-brand-evergreen">{patient.blood_group}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs text-brand-slate">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-mint" />
              {patient.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-mint" />
              {patient.email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-mint" />
              {patient.address}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Grid: Allergies, Conditions & Medications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Allergies Card */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-brand-evergreen">
              Documented Allergies
            </h3>
          </div>

          <div className="space-y-2.5">
            {patient.allergies.map((al, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800">{al.name}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                    {al.severity}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  {al.notes}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Chronic Conditions Card */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-brand-mint" />
            <h3 className="text-sm font-bold text-brand-evergreen">
              Medical History
            </h3>
          </div>

          <div className="space-y-2.5">
            {patient.chronic_conditions.map((cond, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-brand-mist/50 border border-brand-seafoam text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-evergreen">
                    {cond.name}
                  </span>
                  <span className="text-[10px] text-brand-slate">
                    Since {cond.diagnosed}
                  </span>
                </div>
                <p className="text-[11px] text-brand-deepTeal font-medium">
                  {cond.status}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Active Medications Card */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-brand-deepTeal" />
            <h3 className="text-sm font-bold text-brand-evergreen">
              Current Medications
            </h3>
          </div>

          <div className="space-y-2.5">
            {patient.medications.map((med, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white border border-brand-oceanTeal/30 text-xs space-y-1 shadow-sm"
              >
                <div className="font-bold text-brand-evergreen">
                  {med.name}
                </div>
                <div className="text-[11px] text-brand-slate">
                  {med.dosage} &bull; {med.frequency}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Past Consultations History */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-evergreen">
              Consultation & Clinical Notes History
            </h3>
            <p className="text-xs text-brand-slate">
              Immutable doctor-reviewed encounters and structured AI notes
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {patient.past_consultations.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white/90 border border-brand-seafoam/40 hover:border-brand-oceanTeal transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-brand-evergreen">
                    {c.type}
                  </span>
                  <PillBadge variant="mint">{c.status}</PillBadge>
                </div>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {c.notes}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-brand-slate/70 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-mint" />
                    {c.date}
                  </span>
                  <span>Doctor: {c.doctor}</span>
                </div>
              </div>

              <Link
                href={`/consultations/${c.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-deepTeal hover:text-brand-mint flex-shrink-0"
              >
                <FileCheck2 className="w-4 h-4" />
                View Approved Note
              </Link>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

