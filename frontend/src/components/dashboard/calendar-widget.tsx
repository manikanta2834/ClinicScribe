"use client";

import React from "react";
import { GlassCard } from "../ui/glass-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CalendarWidget: React.FC = () => {
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  // Sample calendar data for October 2026 matching mockup
  const days = [
    { num: 1, current: true },
    { num: 2, current: true },
    { num: 3, current: true },
    { num: 4, current: true },
    { num: 5, current: true },
    { num: 6, current: true },
    { num: 7, current: true },
    { num: 8, current: true },
    { num: 9, current: true },
    { num: 10, current: true, hasPill: true },
    { num: 11, current: true },
    { num: 12, current: true, active: true },
    { num: 13, current: true },
    { num: 14, current: true },
    { num: 15, current: true },
    { num: 16, current: true },
    { num: 17, current: true },
    { num: 18, current: true },
  ];

  return (
    <GlassCard className="p-5">
      {/* Month & Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-brand-evergreen">October 2026</h3>
        <div className="flex items-center gap-1 text-brand-slate">
          <button className="p-1 hover:text-brand-evergreen hover:bg-brand-seafoam/30 rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-brand-evergreen hover:bg-brand-seafoam/30 rounded-full transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-brand-slate mb-2">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {/* Placeholder offset for Thursday start */}
        <div key="offset-1" />
        <div key="offset-2" />
        <div key="offset-3" />
        {days.map((day) => (
          <div
            key={day.num}
            className="flex items-center justify-center p-1"
          >
            <span
              className={`w-7 h-7 flex items-center justify-center rounded-full font-medium transition-all cursor-pointer ${
                day.active
                  ? "bg-brand-evergreen text-white font-bold shadow-sm"
                  : day.hasPill
                  ? "border border-brand-evergreen/40 text-brand-evergreen font-semibold"
                  : "text-brand-evergreen/80 hover:bg-brand-seafoam/30"
              }`}
            >
              {day.num}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

