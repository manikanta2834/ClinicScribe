"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Languages,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const languageStats = [
    { language: "Tamil / English (Tanglish)", count: 68, percentage: 48, color: "bg-deep-teal" },
    { language: "English Only", count: 45, percentage: 32, color: "bg-ocean-teal" },
    { language: "Hindi / English (Hinglish)", count: 29, percentage: 20, color: "bg-mint-green" },
  ];

  const efficiencyMetrics = [
    { label: "Traditional Manual Typing Time", value: "14.2 mins / encounter", bar: 100, color: "bg-muted-slate/50" },
    { label: "ClinicScribe AI Assisted Scribe", value: "2.1 mins / encounter", bar: 15, color: "bg-mint-green" },
    { label: "Physician Time Saved per Encounter", value: "12.1 mins saved (85%)", bar: 85, color: "bg-deep-teal" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-evergreen">
          Clinical Analytics & Documentation Intelligence
        </h1>
        <p className="text-xs text-muted-slate mt-0.5">
          Real-time metrics on doctor time savings, multilingual conversation distribution, and note finalization rates.
        </p>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Consultations"
          value="142"
          change="+18.4%"
          subtitle="vs last month"
          icon={<Users className="w-5 h-5" />}
          isPositive={true}
        />
        <StatCard
          title="Doctor Approval Rate"
          value="98.6%"
          change="Optimal"
          subtitle="compliance"
          icon={<CheckCircle2 className="w-5 h-5" />}
          isPositive={true}
        />
        <StatCard
          title="Avg. Time to Document"
          value="2.1 mins"
          change="-85%"
          subtitle="vs manual typing"
          icon={<Clock className="w-5 h-5" />}
          isPositive={true}
        />
        <StatCard
          title="Hours Saved This Month"
          value="28.6 hrs"
          change="~3.5"
          subtitle="clinic shifts saved"
          icon={<Zap className="w-5 h-5" />}
          isPositive={true}
        />
      </div>

      {/* Two Column Layout: Language Distribution + Time Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Multilingual Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-ocean-teal/15">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-deep-teal" />
                <h2 className="font-bold text-dark-evergreen text-sm">
                  Consultation Language Distribution
                </h2>
              </div>
              <span className="text-xs text-muted-slate">Last 30 Days</span>
            </div>

            <div className="space-y-4">
              {languageStats.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-dark-evergreen">
                      {item.language}
                    </span>
                    <span className="font-bold text-deep-teal">
                      {item.count} consults ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-pale-mist overflow-hidden border border-ocean-teal/15">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-pale-mist/40 border border-ocean-teal/15 flex items-center justify-between text-xs">
              <span className="text-muted-slate">
                Active Speech Engine: <strong className="text-dark-evergreen">Google Gemini 1.5 Pro</strong>
              </span>
              <PillBadge variant="mint" className="text-[10px]">
                Tanglish & Hinglish Optimized
              </PillBadge>
            </div>
          </GlassCard>
        </div>

        {/* Right Column (6 Cols): Time Savings & Efficiency */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-ocean-teal/15">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-mint-green" />
                <h2 className="font-bold text-dark-evergreen text-sm">
                  Documentation Velocity & Efficiency
                </h2>
              </div>
              <PillBadge variant="teal" className="text-[10px]">
                85% Efficiency Boost
              </PillBadge>
            </div>

            <div className="space-y-4">
              {efficiencyMetrics.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-dark-evergreen">
                      {item.label}
                    </span>
                    <span className="font-bold text-deep-teal">{item.value}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-pale-mist overflow-hidden border border-ocean-teal/15">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-seafoam-aqua/20 border border-ocean-teal/20 text-xs text-muted-slate space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-dark-evergreen">
                <ShieldCheck className="w-4 h-4 text-deep-teal" />
                <span>Doctor-in-Control Verification Metric: 100%</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Zero clinical notes are published without mandatory doctor approval. 100% of audio recordings have verified digital patient consent on file.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
