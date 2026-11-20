"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  CheckSquare,
  FileText,
  Activity,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Consultations", href: "/consultations", icon: CheckSquare },
    { label: "Clinical Notes", href: "/notes", icon: FileText },
  ];

  return (
    <aside
      className={cn(
        "w-64 h-[calc(100vh-32px)] my-4 ml-4 rounded-3xl sidebar-gradient text-white flex flex-col justify-between p-6 shadow-2xl flex-shrink-0 z-20",
        className
      )}
    >
      <div>
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-8 group">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all">
            <Activity className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              ClinicScribe
            </div>
            <div className="text-[10px] text-brand-seafoam tracking-wider font-medium uppercase">
              AI Clinical SaaS
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/20 text-white backdrop-blur-md shadow-sm border border-white/20 font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-brand-seafoam" : "text-white/70")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Badge & Settings */}
      <div className="space-y-3 pt-6 border-t border-white/15">
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-seafoam mb-1">
            <Sparkles className="w-4 h-4 text-brand-seafoam animate-pulse" />
            <span>Gemini AI Engine</span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed">
            Multilingual speech-to-note ready (Tamil, Hindi, English).
          </p>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Clinic Settings</span>
        </Link>
      </div>
    </aside>
  );
};

