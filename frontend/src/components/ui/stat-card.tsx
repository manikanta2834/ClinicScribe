import React from "react";
import { GlassCard } from "./glass-card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
  progressPercent?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle = "vs last month",
  progressPercent,
}) => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-brand-slate uppercase tracking-wider">
          {title}
        </span>
        <div className="w-9 h-9 rounded-xl bg-brand-evergreen text-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold tracking-tight text-brand-evergreen">
            {value}
          </div>
          {change && (
            <div className="flex items-center gap-1 text-xs font-medium text-brand-mint">
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>{change}</span>
              <span className="text-brand-slate/70 font-normal">{subtitle}</span>
            </div>
          )}
        </div>

        {progressPercent !== undefined && (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-brand-seafoam/40"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-mint"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-brand-evergreen">
              {progressPercent}%
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

