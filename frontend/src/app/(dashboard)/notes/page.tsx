"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Download,
  Sparkles,
  ArrowRight,
  Filter,
  ShieldCheck,
  Languages,
} from "lucide-react";

export default function ClinicalNotesDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");

  const notes = [
    {
      id: "cs-1092",
      patient_name: "Priya Sundaram",
      patient_code: "CS-P-1001",
      diagnosis: "Acute Bronchitis (Doctor-Stated)",
      chief_complaint: "Dry cough, chest congestion, nocturnal wheezing",
      language: "Tamil / English (Tanglish)",
      model: "Gemini 1.5 Pro",
      prompt_version: "v1.2.0-clinical-safety",
      is_approved: true,
      approved_at: "Today at 10:48 AM",
      meds_count: 3,
    },
    {
      id: "cs-1091",
      patient_name: "Aarav Sharma",
      patient_code: "CS-P-1002",
      diagnosis: "Essential Hypertension (Stage 1)",
      chief_complaint: "Exertional dyspnea, early morning headaches",
      language: "Hindi / English (Hinglish)",
      model: "Gemini 1.5 Pro",
      prompt_version: "v1.2.0-clinical-safety",
      is_approved: true,
      approved_at: "Today at 09:30 AM",
      meds_count: 2,
    },
    {
      id: "cs-1090",
      patient_name: "Kavitha Raman",
      patient_code: "CS-P-1003",
      diagnosis: "Acute Bronchitis (Pending Approval)",
      chief_complaint: "Productive cough and fever for 3 days",
      language: "Tamil / English (Tanglish)",
      model: "Gemini 1.5 Pro",
      prompt_version: "v1.2.0-clinical-safety",
      is_approved: false,
      approved_at: null,
      meds_count: 3,
    },
    {
      id: "cs-1089",
      patient_name: "Siddharth Verma",
      patient_code: "CS-P-1004",
      diagnosis: "Migraine Cephalea without aura",
      chief_complaint: "Unilateral throbbing headache with photophobia",
      language: "English Only",
      model: "Gemini 1.5 Pro",
      prompt_version: "v1.2.0-clinical-safety",
      is_approved: true,
      approved_at: "Yesterday at 03:15 PM",
      meds_count: 2,
    },
  ];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "APPROVED"
        ? n.is_approved
        : !n.is_approved;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark-evergreen">
            Clinical Notes & Transcripts
          </h1>
          <p className="text-xs text-muted-slate mt-0.5">
            Doctor-reviewed clinical records, Gemini AI extraction traceability, and prescription drafts.
          </p>
        </div>

        <Link href="/consultations/new">
          <GlassButton
            variant="primary"
            size="sm"
            className="bg-deep-teal text-white flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            New AI Consultation
          </GlassButton>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by patient, diagnosis, or symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-ocean-teal/25 bg-white/80 focus:outline-none focus:ring-1 focus:ring-deep-teal shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white/70 p-1 rounded-2xl border border-ocean-teal/20 text-xs">
          <Filter className="w-3.5 h-3.5 text-deep-teal ml-2 mr-1" />
          {(["ALL", "APPROVED", "PENDING"] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                statusFilter === filterKey
                  ? "bg-deep-teal text-white shadow-xs"
                  : "text-muted-slate hover:text-dark-evergreen"
              }`}
            >
              {filterKey === "ALL" ? "All Notes" : filterKey === "APPROVED" ? "Approved" : "Awaiting Review"}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => (
          <GlassCard key={note.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark-evergreen text-sm">
                      {note.patient_name}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-pale-mist text-deep-teal">
                      {note.patient_code}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-slate mt-0.5 flex items-center gap-1.5">
                    <Languages className="w-3 h-3 text-ocean-teal" />
                    <span>{note.language}</span>
                  </p>
                </div>

                {note.is_approved ? (
                  <PillBadge variant="mint" className="text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                  </PillBadge>
                ) : (
                  <PillBadge variant="warning" className="text-[10px]">
                    <Clock className="w-3 h-3 mr-1" /> Awaiting Review
                  </PillBadge>
                )}
              </div>

              {/* Assessment */}
              <div className="p-3 rounded-xl bg-pale-mist/40 border border-ocean-teal/15 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-deep-teal block">
                  Diagnosis / Assessment
                </span>
                <p className="text-xs font-semibold text-dark-evergreen">
                  {note.diagnosis}
                </p>
                <p className="text-[11px] text-muted-slate truncate">
                  {note.chief_complaint}
                </p>
              </div>

              {/* AI Traceability Footer */}
              <div className="flex items-center justify-between text-[11px] text-muted-slate pt-1 border-t border-ocean-teal/10">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-mint-green" />
                  <span>{note.model} • {note.prompt_version}</span>
                </span>
                <span>{note.meds_count} medications</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-ocean-teal/15">
              <span className="text-[11px] text-muted-slate">
                {note.approved_at || "Transcribed Today"}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`http://localhost:8000/api/v1/consultations/${note.id}/prescription-pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-xl border border-ocean-teal/20 text-deep-teal text-xs font-medium hover:bg-pale-mist transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </a>

                <Link href={`/consultations/${note.id}`}>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    className="bg-deep-teal text-white hover:bg-dark-evergreen text-xs flex items-center gap-1"
                  >
                    <span>Review & Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </GlassButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
