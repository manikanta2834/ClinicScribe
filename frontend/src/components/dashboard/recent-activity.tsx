import React from "react";
import { GlassCard } from "../ui/glass-card";
import { PillBadge } from "../ui/pill-badge";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: "CS-1092",
      patient: "Aarav Sharma",
      language: "Hindi / English",
      type: "Cardiology Review",
      time: "24 mins ago",
      status: "Approved",
      badgeVariant: "mint" as const,
    },
    {
      id: "CS-1091",
      patient: "Kavitha Raman",
      language: "Tamil / English",
      type: "General Follow-up",
      time: "1 hour ago",
      status: "Pending Review",
      badgeVariant: "warning" as const,
    },
    {
      id: "CS-1090",
      patient: "Siddharth Verma",
      language: "English",
      type: "Dermatology Consult",
      time: "3 hours ago",
      status: "Approved",
      badgeVariant: "mint" as const,
    },
    {
      id: "CS-1089",
      patient: "Priya Sundaram",
      language: "Tamil",
      type: "Endocrinology",
      time: "Yesterday",
      status: "Approved",
      badgeVariant: "mint" as const,
    },
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-brand-evergreen">Recent Activity</h2>
          <p className="text-xs text-brand-slate">Recent consultations & clinical note status</p>
        </div>
        <Link
          href="/consultations"
          className="text-xs font-semibold text-brand-mint hover:text-brand-evergreen flex items-center gap-1 transition-colors"
        >
          View all consultations
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-seafoam/30 text-[11px] font-semibold text-brand-slate uppercase tracking-wider">
              <th className="pb-3 px-3">Patient</th>
              <th className="pb-3 px-3">Consultation Type</th>
              <th className="pb-3 px-3">Language Mode</th>
              <th className="pb-3 px-3">Time</th>
              <th className="pb-3 px-3">Note Status</th>
              <th className="pb-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-seafoam/20 text-xs">
            {activities.map((row) => (
              <tr key={row.id} className="hover:bg-brand-seafoam/15 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-brand-evergreen">
                  {row.patient}
                </td>
                <td className="py-3.5 px-3 text-brand-slate">{row.type}</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-brand-mist text-brand-deepTeal text-[10px] font-medium">
                    {row.language}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-brand-slate/80">{row.time}</td>
                <td className="py-3.5 px-3">
                  <PillBadge variant={row.badgeVariant}>{row.status}</PillBadge>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <Link
                    href={`/consultations/${row.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deepTeal hover:text-brand-mint"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

