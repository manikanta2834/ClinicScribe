"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Lock, Stethoscope, Building2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { signUp, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"DOCTOR" | "CLINIC_ADMIN">("DOCTOR");
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    await signUp(email, password, fullName, role);
  };

  return (
    <div className="w-full max-w-md">
      <GlassCard className="p-8 sm:p-10 shadow-2xl border-2 border-brand-oceanTeal/30">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-brand-evergreen">
            Create Practice Account
          </h1>
          <p className="text-xs text-brand-slate">
            Start your 14-day free trial with AI-powered clinical scribe documentation
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("DOCTOR")}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
              role === "DOCTOR"
                ? "bg-brand-evergreen text-white border-brand-evergreen shadow-sm"
                : "bg-white/80 text-brand-slate border-brand-seafoam/50 hover:bg-white"
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="text-xs font-bold">I am a Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("CLINIC_ADMIN")}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
              role === "CLINIC_ADMIN"
                ? "bg-brand-evergreen text-white border-brand-evergreen shadow-sm"
                : "bg-white/80 text-brand-slate border-brand-seafoam/50 hover:bg-white"
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs font-bold">Clinic Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-evergreen">
              Full Name (with Dr. prefix)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Sarah Sundaram"
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input text-brand-evergreen"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-evergreen">
              Professional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.sarah@hospital.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input text-brand-evergreen"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-evergreen">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input text-brand-evergreen"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-brand-oceanTeal text-brand-evergreen focus:ring-brand-mint"
            />
            <label htmlFor="terms" className="text-[11px] text-brand-slate leading-tight cursor-pointer">
              I agree to the Doctor-in-Control Clinical Review Protocol and Patient Consent Mandate.
            </label>
          </div>

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              className="w-full shadow-md"
              disabled={loading || !agreed}
            >
              {loading ? "Creating Account..." : "Continue to Clinic Setup"}
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-brand-seafoam/30 text-center">
          <p className="text-xs text-brand-slate">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-bold text-brand-deepTeal hover:text-brand-mint transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

