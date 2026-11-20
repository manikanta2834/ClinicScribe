import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-mist/40">
      {/* Floating Header */}
      <header className="sticky top-4 z-50 px-6 max-w-7xl mx-auto w-full">
        <nav className="glass-card px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-evergreen flex items-center justify-center text-white shadow-sm">
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

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-evergreen/80">
            <Link href="#how-it-works" className="hover:text-brand-evergreen transition-colors">
              How it Works
            </Link>
            <Link href="#features" className="hover:text-brand-evergreen transition-colors">
              Features
            </Link>
            <Link href="#multilingual" className="hover:text-brand-evergreen transition-colors">
              Multilingual AI
            </Link>
            <Link href="/pricing" className="hover:text-brand-evergreen transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <GlassButton variant="outline" size="sm">
                Sign In
              </GlassButton>
            </Link>
            <Link href="/register">
              <GlassButton variant="primary" size="sm">
                Start Free Trial
                <ArrowRight className="w-3.5 h-3.5" />
              </GlassButton>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-brand-seafoam/40 bg-white/70 backdrop-blur-md py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-evergreen flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-brand-evergreen">ClinicScribe</span>
            </div>
            <p className="text-xs text-brand-slate leading-relaxed">
              AI-powered clinical documentation platform designed for modern clinics and hospitals.
              Doctor-in-control medical note generation.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-mint">
              <ShieldCheck className="w-4 h-4" />
              <span>Consent-First & Multi-Tenant Isolated</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-evergreen mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-brand-slate">
              <li><Link href="/dashboard" className="hover:text-brand-evergreen">Doctor Dashboard</Link></li>
              <li><Link href="#features" className="hover:text-brand-evergreen">Multilingual Engine</Link></li>
              <li><Link href="#how-it-works" className="hover:text-brand-evergreen">Clinical Verification</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-evergreen">Subscription Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-evergreen mb-3">
              Compliance & Safety
            </h4>
            <ul className="space-y-2 text-xs text-brand-slate">
              <li>Doctor Review Protocol</li>
              <li>Consent Verification</li>
              <li>DPDP & DISHA Alignment</li>
              <li>Encrypted Audio Storage</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-evergreen mb-3">
              ClinicScribe SaaS
            </h4>
            <p className="text-xs text-brand-slate mb-3">
              Transform your medical practice today. Built with Google Gemini AI.
            </p>
            <Link href="/dashboard">
              <GlassButton variant="secondary" size="sm" className="w-full">
                Launch Live App
              </GlassButton>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-brand-seafoam/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-slate">
          <span>&copy; 2026 ClinicScribe Technologies. All rights reserved.</span>
          <span>Designed with Aqua & Deep Teal Glassmorphism.</span>
        </div>
      </footer>
    </div>
  );
}

