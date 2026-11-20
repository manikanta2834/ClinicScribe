import React from "react";
import { GlassCard } from "../ui/glass-card";

export const PerformanceChart: React.FC = () => {
  const bars = [
    { label: "A", height: "45%" },
    { label: "B", height: "70%" },
    { label: "C", height: "55%" },
    { label: "D", height: "40%" },
    { label: "E", height: "90%" },
  ];

  return (
    <GlassCard className="p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-brand-evergreen">
          Performance
        </h2>
        <p className="text-xs text-brand-slate">Documentation efficiency</p>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 flex items-end justify-between gap-3 px-3 my-2">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="w-full bg-brand-mist/50 rounded-full h-full flex items-end overflow-hidden p-1">
              <div
                style={{ height: bar.height }}
                className="w-full bg-brand-mint hover:bg-brand-evergreen transition-all duration-300 rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-brand-slate">{bar.label}</span>
          </div>
        ))}
      </div>

      <div className="text-center text-[11px] text-brand-slate border-t border-brand-seafoam/30 pt-2">
        Avg. 2.4 min / consultation note
      </div>
    </GlassCard>
  );
};

