import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-mist/50 relative overflow-hidden selection:bg-brand-seafoam selection:text-brand-evergreen">
      {/* Ambient Radial Medical Highlights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-seafoam/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-oceanTeal/20 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="px-8 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-brand-evergreen flex items-center justify-center text-white shadow-sm group-hover:bg-brand-deepTeal transition-all">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-brand-evergreen">
              ClinicScribe
            </span>
            <span className="block text-[10px] text-brand-mint font-semibold uppercase tracking-wider">
              Turning Conversations into Care
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
          <ShieldCheck className="w-4 h-4 text-brand-mint" />
          <span>Doctor-in-Control & Tenant Isolated</span>
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        {children}
      </main>

      {/* Auth Footer */}
      <footer className="py-6 text-center text-xs text-brand-slate z-10 border-t border-brand-seafoam/30">
        <span>&copy; 2026 ClinicScribe Technologies. Secure Healthcare SaaS Platform.</span>
      </footer>
    </div>
  );
}

