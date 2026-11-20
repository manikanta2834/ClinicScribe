"use client";

import React, { useState } from "react";
import { GlassCard } from "../ui/glass-card";

export const TrendChart: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"Weekly" | "Monthly">("Weekly");

  // Synthetic trend points for smooth wave rendering
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <GlassCard className="p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-brand-evergreen">
            Consultation Trends
          </h2>
          <p className="text-xs text-brand-slate">
            Real-time AI documentation volume
          </p>
        </div>

        {/* Filter Toggle Pill */}
        <div className="flex items-center p-1 bg-brand-mist/60 rounded-full border border-brand-oceanTeal/20">
          <button
            onClick={() => setActiveFilter("Weekly")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              activeFilter === "Weekly"
                ? "bg-white text-brand-evergreen shadow-sm"
                : "text-brand-slate hover:text-brand-evergreen"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveFilter("Monthly")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              activeFilter === "Monthly"
                ? "bg-white text-brand-evergreen shadow-sm"
                : "text-brand-slate hover:text-brand-evergreen"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* SVG Smooth Wave Chart (Matching Mockup) */}
      <div className="w-full h-44 relative my-2">
        <svg
          viewBox="0 0 500 150"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#48B7A0" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#BFE1E0" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E2F0F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Smooth Area Fill */}
          <path
            d="M 0,120 Q 70,110 120,70 T 250,55 T 375,35 T 500,20 L 500,150 L 0,150 Z"
            fill="url(#areaGradient)"
          />

          {/* Smooth Wave Line */}
          <path
            d="M 0,120 Q 70,110 120,70 T 250,55 T 375,35 T 500,20"
            fill="none"
            stroke="#075D55"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Active Highlight Marker */}
          <circle cx="375" cy="35" r="5" fill="#0B927F" className="animate-pulse" />
          <circle cx="375" cy="35" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between items-center text-xs font-medium text-brand-slate px-2 pt-2 border-t border-brand-seafoam/30">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </GlassCard>
  );
};

