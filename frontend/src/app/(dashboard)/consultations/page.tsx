"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  CheckSquare,
  PlusCircle,
  Search,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ConsultationsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const consultations = [
    {
      id: "cs-1092",
      patient_name: "Aarav Sharma",
      patient_code: "CS-P-1002",
      type: "Cardiology Review",
      language: "Hindi / English",
      date: "Today at 10:45 AM",
      status: "Approved",
      badge_variant: "mint" as const,
      chief_complaint: "Exertional dyspnea and blood pressure follow-up",
    },
    {
      id: "cs-1091",
      patient_name: "Kavitha Raman",
      patient_code: "CS-P-1003",
      type: "General Follow-up",
      language: "Tamil / English",
      date: "Today at 09:30 AM",
      status: "Pending Review",
      badge_variant: "warning" as const,
      chief_complaint: "Acute Bronchitis with productive cough and fever",
    },
    {
      id: "cs-1090",
      patient_name: "Siddharth Verma",
      patient_code: "CS-P-1004",
      type: "Dermatology Consult",
      language: "English",
      date: "Yesterday at 03:15 PM",
      status: "Approved",
      badge_variant: "mint" as const,
      chief_complaint: "Migraine Cephalea without aura",
    },
    {
      id: "cs-1089",
      patient_name: "Priya Sundaram",
      patient_code: "CS-P-1001",
      type: "Endocrinology",
      language: "Tamil",
      date: "Yesterday at 01:00 PM",
      status: "Approved",
      badge_variant: "mint" as const,
      chief_complaint: "Hypothyroidism dosage evaluation",
    },
  ];

  const filtered = consultations.filter((c) => {
    const matchesSearch =
      c.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      c.patient_code.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || c.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-evergreen">
            Consultation Records
          </h1>
          <p className="text-xs text-brand-slate">
            Doctor-reviewed audio consultations and structured AI notes
          </p>
        </div>

        <Link href="/consultations/new">
          <GlassButton variant="primary" size="md">
            <PlusCircle className="w-4 h-4" />
            New AI Consultation
          </GlassButton>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search consultations or patients..."
            className="w-full pl-10 pr-4 py-2 text-xs glass-input text-brand-evergreen placeholder:text-brand-slate/60 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-full border border-brand-oceanTeal/20 text-xs">
          {["ALL", "Pending", "Approved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                statusFilter === st
                  ? "bg-brand-evergreen text-white shadow-sm"
                  : "text-brand-slate hover:text-brand-evergreen"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Consultations Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-seafoam/30 text-[11px] font-semibold text-brand-slate uppercase tracking-wider bg-brand-mist/30">
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Chief Complaint</th>
                <th className="py-3.5 px-4">Language Mode</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Note Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-seafoam/20 text-xs">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-brand-seafoam/15 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-brand-evergreen">
                    <div>{c.patient_name}</div>
                    <span className="font-mono text-[10px] text-brand-slate font-normal">
                      {c.patient_code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-slate font-medium">
                    {c.type}
                  </td>
                  <td className="py-3.5 px-4 text-brand-slate max-w-xs truncate">
                    {c.chief_complaint}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-brand-mist text-brand-deepTeal text-[10px] font-medium">
                      {c.language}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-slate/80">{c.date}</td>
                  <td className="py-3.5 px-4">
                    <PillBadge variant={c.badge_variant}>{c.status}</PillBadge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/consultations/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-mint hover:text-brand-evergreen"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Review Note
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
