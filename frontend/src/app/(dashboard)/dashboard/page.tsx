import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { UpcomingList } from "@/components/dashboard/upcoming-list";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Users, DollarSign, CheckSquare, Activity, Sparkles, PlusCircle } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Quick Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-seafoam text-brand-evergreen">
              <Sparkles className="w-3 h-3 text-brand-mint" />
              Gemini 1.5 Clinical AI Active
            </span>
          </div>
        </div>
        <Link href="/consultations/new">
          <GlassButton variant="primary" size="md">
            <PlusCircle className="w-4 h-4" />
            New AI Consultation
          </GlassButton>
        </Link>
      </div>

      {/* Row 1: 4 Stat Cards Matching User Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Patients"
          value="1,248"
          change="+12%"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Consultations"
          value="$84.3k"
          change="+8.1%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Tasks Done"
          value="342"
          change="0%"
          isPositive={true}
          icon={<CheckSquare className="w-5 h-5" />}
        />
        <StatCard
          title="System Health"
          value="98%"
          subtitle="Optimal"
          progressPercent={75}
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      {/* Row 2: Charts (Left/Center) + Calendar & Upcoming (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Trend Chart + Performance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div className="md:col-span-3">
              <TrendChart />
            </div>
            <div className="md:col-span-2">
              <PerformanceChart />
            </div>
          </div>

          {/* Recent Activity Table */}
          <RecentActivity />
        </div>

        {/* Right Column (1 col): Calendar + Upcoming Events */}
        <div className="space-y-6">
          <CalendarWidget />
          <UpcomingList />
        </div>
      </div>
    </div>
  );
}

