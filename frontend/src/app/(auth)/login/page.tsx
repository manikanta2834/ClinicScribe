"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { useAuth } from "@/hooks/use-auth";
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const { signIn, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("dr.sarah@cityhealth.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="w-full max-w-md">
      <GlassCard className="p-8 sm:p-10 shadow-2xl border-2 border-brand-oceanTeal/30 relative">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-seafoam text-brand-evergreen text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            <span>Doctor & Clinic Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-evergreen">
            Welcome Back
          </h1>
          <p className="text-xs text-brand-slate">
            Sign in to access your consultations and AI clinical records
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full py-3 px-4 rounded-full bg-white hover:bg-brand-softWhite border border-brand-oceanTeal/30 text-xs font-semibold text-brand-evergreen flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all mb-6 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-brand-seafoam/40 w-full" />
          <span className="bg-white/80 px-3 text-[11px] text-brand-slate uppercase font-medium absolute">
            or email sign in
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-evergreen">
              Medical Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@clinic.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input text-brand-evergreen"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-evergreen">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] text-brand-mint hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input text-brand-evergreen"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-brand-oceanTeal text-brand-evergreen focus:ring-brand-mint"
            />
            <label htmlFor="remember" className="text-xs text-brand-slate cursor-pointer">
              Remember this device for 30 days
            </label>
          </div>

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              className="w-full shadow-md"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to ClinicScribe"}
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-seafoam/30 text-center">
          <p className="text-xs text-brand-slate">
            New to ClinicScribe?{" "}
            <Link
              href="/register"
              className="font-bold text-brand-deepTeal hover:text-brand-mint transition-colors"
            >
              Register clinic or doctor account
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

