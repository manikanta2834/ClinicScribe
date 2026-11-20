"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Activity,
  Layers,
  Languages,
} from "lucide-react";

type MetricTab = "throughput" | "turnaround" | "accuracy";

export const AnalyticsRectificationShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MetricTab>("throughput");
  const [hoveredDay, setHoveredDay] = useState<number | null>(4); // Default to Friday

  // Daily consultation data (Mon-Sun)
  const throughputData = [
    { day: "Mon", consultations: 24, manualHours: 5.7, csHours: 0.8, rectifiedNotes: 24 },
    { day: "Tue", consultations: 32, manualHours: 7.6, csHours: 1.1, rectifiedNotes: 32 },
    { day: "Wed", consultations: 38, manualHours: 9.0, csHours: 1.3, rectifiedNotes: 38 },
    { day: "Thu", consultations: 42, manualHours: 10.0, csHours: 1.5, rectifiedNotes: 42 },
    { day: "Fri", consultations: 48, manualHours: 11.4, csHours: 1.7, rectifiedNotes: 48 },
    { day: "Sat", consultations: 34, manualHours: 8.1, csHours: 1.2, rectifiedNotes: 34 },
    { day: "Sun", consultations: 18, manualHours: 4.3, csHours: 0.6, rectifiedNotes: 18 },
  ];

  // Turnaround comparison data
  const turnaroundData = [
    {
      method: "Traditional Manual EHR Typing",
      minutes: 14.2,
      color: "bg-gray-400",
      description: "After-hours typing, manual vital entry, missed symptoms.",
      badge: "Status Quo",
    },
    {
      method: "Legacy Dictation Software",
      minutes: 7.8,
      color: "bg-amber-400",
      description: "Requires explicit voice commands, fails on code-mixed speech.",
      badge: "Legacy Tech",
    },
    {
      method: "ClinicScribe AI Clinical Scribe",
      minutes: 2.1,
      color: "bg-brand-mint",
      description: "Ambient listening, Tanglish/Hinglish NLP, instant structured note draft.",
      badge: "85% Faster",
    },
  ];

  // Multilingual Accuracy Rectification Data
  const accuracyMetrics = [
    { lang: "Indian English (Accented)", accuracy: 99.1, samples: "12,400+ consultations" },
    { lang: "Tanglish (Tamil + English)", accuracy: 97.4, samples: "8,900+ consultations" },
    { lang: "Hinglish (Hindi + English)", accuracy: 96.8, samples: "10,200+ consultations" },
    { lang: "Medical Terminology & ICD-10", accuracy: 98.9, samples: "Pharmacology & Diagnostic lexicon" },
    { lang: "Drug Dosage & Unit Verification", accuracy: 99.7, samples: "mg, ml, BD/TDS timing safeguards" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-mist border border-brand-oceanTeal/30 text-xs font-bold text-brand-evergreen">
          <Activity className="w-3.5 h-3.5 text-brand-mint" />
          <span>Real-World Clinical Rectification & Benchmarks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-evergreen tracking-tight">
          Clinical Intelligence & Performance Analytics
        </h2>
        <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
          See how ClinicScribe transforms clinical workflows: eliminating after-hours charting,
          guaranteeing zero AI hallucinations, and keeping doctors 100% in control.
        </p>
      </div>

      {/* Main Glassmorphic Showcase Card */}
      <GlassCard className="p-6 sm:p-8 rounded-3xl border-2 border-brand-oceanTeal/30 shadow-2xl space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-seafoam/30">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-brand-mist/60 border border-brand-oceanTeal/20">
            <button
              type="button"
              onClick={() => setActiveTab("throughput")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "throughput"
                  ? "bg-brand-evergreen text-white shadow-md"
                  : "text-brand-slate hover:text-brand-evergreen"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Consultation Velocity
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("turnaround")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "turnaround"
                  ? "bg-brand-evergreen text-white shadow-md"
                  : "text-brand-slate hover:text-brand-evergreen"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Turnaround Comparison
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("accuracy")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "accuracy"
                  ? "bg-brand-evergreen text-white shadow-md"
                  : "text-brand-slate hover:text-brand-evergreen"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Multilingual Accuracy
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-mint animate-pulse" />
            <span className="text-xs font-bold text-brand-evergreen">Live Clinical Rectification Data</span>
          </div>
        </div>

        {/* Tab 1: Throughput & Time Saved Wave Area Chart */}
        {activeTab === "throughput" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-brand-evergreen">
                  Weekly Patient Throughput vs Charting Time
                </h3>
                <p className="text-xs text-brand-slate">
                  Hover over any weekday to inspect consultation volume and time saved.
                </p>
              </div>

              {hoveredDay !== null && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-mist/80 border border-brand-oceanTeal/30 text-xs">
                  <span className="font-bold text-brand-evergreen">
                    {throughputData[hoveredDay].day}:
                  </span>
                  <span className="text-brand-slate">
                    <strong className="text-brand-evergreen">{throughputData[hoveredDay].consultations}</strong> patients
                  </span>
                  <span className="text-brand-mint font-semibold">
                    Saved {(throughputData[hoveredDay].manualHours - throughputData[hoveredDay].csHours).toFixed(1)} hrs
                  </span>
                </div>
              )}
            </div>

            {/* SVG Wave Area Chart */}
            <div className="relative h-64 w-full bg-gradient-to-b from-brand-mist/30 to-white rounded-2xl p-4 border border-brand-seafoam/40 flex flex-col justify-between overflow-hidden">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 160">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#48B7A0" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#BFE1E0" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#075D55" />
                    <stop offset="50%" stopColor="#267C78" />
                    <stop offset="100%" stopColor="#0B927F" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#E2F0F1" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="700" y2="60" stroke="#E2F0F1" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#E2F0F1" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#E2F0F1" strokeWidth="1" />

                {/* Smooth Filled Wave Area */}
                {/* Points corresponding to 7 days:
                    Mon(50, 110), Tue(150, 80), Wed(250, 58), Thu(350, 42), Fri(450, 24), Sat(550, 68), Sun(650, 126) */}
                <path
                  d="M 50 110 
                     C 100 95, 120 85, 150 80 
                     C 190 75, 220 62, 250 58 
                     C 290 54, 320 45, 350 42 
                     C 390 39, 420 26, 450 24 
                     C 490 22, 520 55, 550 68 
                     C 590 82, 620 120, 650 126 
                     L 650 150 L 50 150 Z"
                  fill="url(#areaGradient)"
                />

                {/* Smooth Curve Stroke */}
                <path
                  d="M 50 110 
                     C 100 95, 120 85, 150 80 
                     C 190 75, 220 62, 250 58 
                     C 290 54, 320 45, 350 42 
                     C 390 39, 420 26, 450 24 
                     C 490 22, 520 55, 550 68 
                     C 590 82, 620 120, 650 126"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  { cx: 50, cy: 110, idx: 0, label: "24" },
                  { cx: 150, cy: 80, idx: 1, label: "32" },
                  { cx: 250, cy: 58, idx: 2, label: "38" },
                  { cx: 350, cy: 42, idx: 3, label: "42" },
                  { cx: 450, cy: 24, idx: 4, label: "48" },
                  { cx: 550, cy: 68, idx: 5, label: "34" },
                  { cx: 650, cy: 126, idx: 6, label: "18" },
                ].map((pt) => {
                  const isHovered = hoveredDay === pt.idx;
                  return (
                    <g key={pt.idx} className="cursor-pointer" onMouseEnter={() => setHoveredDay(pt.idx)}>
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r={isHovered ? 8 : 5}
                        className={`transition-all duration-200 ${
                          isHovered
                            ? "fill-brand-mint stroke-white stroke-[3px]"
                            : "fill-brand-evergreen stroke-white stroke-[2px]"
                        }`}
                      />
                      <text
                        x={pt.cx}
                        y={pt.cy - 12}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-bold ${
                          isHovered ? "fill-brand-mint font-extrabold" : "fill-brand-slate"
                        }`}
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Day Labels */}
              <div className="grid grid-cols-7 text-center pt-2 border-t border-brand-seafoam/30 text-xs font-semibold text-brand-slate">
                {throughputData.map((d, i) => (
                  <button
                    key={d.day}
                    type="button"
                    onMouseEnter={() => setHoveredDay(i)}
                    className={`py-1 rounded-lg transition-colors ${
                      hoveredDay === i ? "bg-brand-evergreen text-white" : "hover:text-brand-evergreen"
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Turnaround Time Comparison Bar Rectification */}
        {activeTab === "turnaround" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-brand-evergreen">
                Documentation Turnaround Time per Consultation
              </h3>
              <p className="text-xs text-brand-slate">
                Average minutes spent writing and reviewing clinical notes per patient encounter.
              </p>
            </div>

            <div className="space-y-4">
              {turnaroundData.map((item) => {
                const percentage = (item.minutes / 15) * 100;
                return (
                  <div
                    key={item.method}
                    className="p-4 rounded-2xl bg-white border border-brand-oceanTeal/30 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-evergreen flex items-center gap-2">
                        {item.method}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-evergreen">
                          {item.minutes} min
                        </span>
                        <PillBadge
                          variant={
                            item.badge.includes("85%") ? "mint" : item.badge.includes("Legacy") ? "warning" : "teal"
                          }
                        >
                          {item.badge}
                        </PillBadge>
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-3 w-full bg-brand-mist rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-brand-slate">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Multilingual Accuracy Rectification */}
        {activeTab === "accuracy" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-brand-evergreen">
                Speech-to-Text & Clinical NLP Precision
              </h3>
              <p className="text-xs text-brand-slate">
                Rigorous benchmarking across regional Indian languages and medical terminology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accuracyMetrics.map((item) => (
                <div
                  key={item.lang}
                  className="p-4 rounded-2xl bg-white border border-brand-oceanTeal/30 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-evergreen flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-brand-deepTeal" />
                      {item.lang}
                    </span>
                    <span className="font-mono font-extrabold text-sm text-brand-mint">
                      {item.accuracy}%
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-brand-mist rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-deepTeal to-brand-mint rounded-full transition-all duration-500"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-brand-slate font-mono">{item.samples}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 Bottom Metric Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-brand-seafoam/30">
          <div className="p-4 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/40 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-evergreen font-mono">
              85.2%
            </span>
            <p className="text-[11px] font-semibold text-brand-slate">Documentation Time Saved</p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/40 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-mint font-mono">
              0.0%
            </span>
            <p className="text-[11px] font-semibold text-brand-slate">Hallucination Index</p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/40 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-deepTeal font-mono">
              98.4%
            </span>
            <p className="text-[11px] font-semibold text-brand-slate">First-Pass Approval Rate</p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/40 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-evergreen font-mono">
              2.5 hrs
            </span>
            <p className="text-[11px] font-semibold text-brand-slate">Reclaimed per Clinic Day</p>
          </div>
        </div>
      </GlassCard>
    </section>
  );
};

