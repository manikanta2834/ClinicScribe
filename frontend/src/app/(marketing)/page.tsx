import React from "react";
import Link from "next/link";
import {
  Mic,
  Sparkles,
  FileCheck2,
  Languages,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { PillBadge } from "@/components/ui/pill-badge";
import { AnalyticsRectificationShowcase } from "@/components/marketing/analytics-rectification-showcase";

export default function MarketingPage() {
  return (
    <div className="space-y-28 py-12">
      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-oceanTeal/30 shadow-sm text-xs font-semibold text-brand-evergreen">
          <Sparkles className="w-4 h-4 text-brand-mint" />
          <span>Powered by Google Gemini 1.5 Multilingual Audio AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-evergreen max-w-4xl mx-auto leading-[1.15]">
          Less Paperwork. <br className="hidden sm:inline" />
          <span className="text-brand-mint">More Patient Care.</span>
        </h1>

        <p className="text-lg sm:text-xl text-brand-slate max-w-2xl mx-auto font-normal leading-relaxed">
          Transform doctor-patient conversations into structured clinical documentation
          with AI-powered multilingual assistance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <GlassButton variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </Link>
          <Link href="/dashboard">
            <GlassButton variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Platform
            </GlassButton>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 pt-6 text-xs font-medium text-brand-slate">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-mint" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-mint" /> Tamil, Hindi & English
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-mint" /> Doctor-in-Control
          </span>
        </div>
      </section>

      {/* 2. Interactive Product Preview Showcase */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="glass-card p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-brand-oceanTeal/30">
          <div className="flex items-center justify-between pb-6 border-b border-brand-seafoam/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-brand-slate ml-2">
                ClinicScribe Consultation Workspace
              </span>
            </div>
            <PillBadge variant="mint">Live AI Processing Demo</PillBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Left Box: Multilingual Audio Speech */}
            <div className="p-5 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-evergreen flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-brand-mint" /> Doctor-Patient Dialogue (Tanglish)
                </span>
                <span className="text-[11px] font-mono text-brand-slate">02:14 / 05:00</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/90 border border-brand-seafoam/40 text-xs text-brand-evergreen leading-relaxed space-y-2">
                <p>
                  <strong className="text-brand-deepTeal">Doctor:</strong> Vanakkam Ramesh, enna problem ungalluku?
                </p>
                <p>
                  <strong className="text-brand-slate">Patient:</strong> Doctor, 3 days-ah severe chest congestion and dry cough irukku. Night time fever kooda irundhudhu.
                </p>
                <p>
                  <strong className="text-brand-deepTeal">Doctor:</strong> Okay, let me examine your chest. Blood pressure is 128/82. Lungs are clear. I will prescribe Paracetamol and an inhaler.
                </p>
              </div>
            </div>

            {/* Right Box: Gemini Structured Clinical Output */}
            <div className="p-5 rounded-2xl bg-white border border-brand-oceanTeal/30 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-evergreen flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-mint" /> Gemini Structured Extraction
                </span>
                <span className="text-[10px] font-semibold text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full">
                  Doctor Review Pending
                </span>
              </div>
              <div className="text-xs space-y-2 text-brand-evergreen">
                <div className="p-2.5 rounded-lg bg-brand-mist/40">
                  <span className="font-bold text-brand-deepTeal">Chief Complaint:</span> Dry cough & chest congestion for 3 days.
                </div>
                <div className="p-2.5 rounded-lg bg-brand-mist/40">
                  <span className="font-bold text-brand-deepTeal">Vitals:</span> BP 128/82 mmHg. Lungs clear on auscultation.
                </div>
                <div className="p-2.5 rounded-lg bg-brand-mist/40">
                  <span className="font-bold text-brand-deepTeal">Prescription Draft:</span> Paracetamol 650mg, Inhaler as instructed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How ClinicScribe Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-brand-evergreen">
            How ClinicScribe Works
          </h2>
          <p className="text-sm text-brand-slate max-w-xl mx-auto">
            A seamless, doctor-in-control 3-step workflow engineered for high patient volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="text-left space-y-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-evergreen text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-brand-evergreen">
              Patient Consent & Voice Recording
            </h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              Verify patient consent digitally with one click. Record naturally in Tamil,
              Hindi, English, or code-mixed speech without changing your consultation rhythm.
            </p>
          </GlassCard>

          <GlassCard className="text-left space-y-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-mint text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-brand-evergreen">
              Gemini AI Structured Extraction
            </h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              Google Gemini parses symptoms, vitals, doctor-stated diagnoses, and medication instructions
              into a clean, standardized clinical note.
            </p>
          </GlassCard>

          <GlassCard className="text-left space-y-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-oceanTeal text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-brand-evergreen">
              Doctor Review & 1-Click Approval
            </h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              You inspect the note side-by-side with the transcript, edit any field,
              and approve. Generate branded prescription PDFs and patient summaries instantly.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 4. Clinical Intelligence & Analytics Rectification Showcase */}
      <AnalyticsRectificationShowcase />

      {/* 5. Core Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-brand-evergreen">
            Built for Clinical Excellence
          </h2>
          <p className="text-sm text-brand-slate max-w-xl mx-auto">
            Engineered with strict clinical safety constraints and healthcare-grade data isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="space-y-3 p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-mist text-brand-evergreen flex items-center justify-center">
              <Languages className="w-5 h-5 text-brand-deepTeal" />
            </div>
            <h4 className="text-sm font-bold text-brand-evergreen">
              Multilingual & Code-Mixed
            </h4>
            <p className="text-xs text-brand-slate leading-relaxed">
              Native comprehension of Tanglish (Tamil-English) and Hinglish. Doctors speak naturally
              while the AI captures medical precision.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3 p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-mist text-brand-evergreen flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-brand-deepTeal" />
            </div>
            <h4 className="text-sm font-bold text-brand-evergreen">
              Doctor-in-Control
            </h4>
            <p className="text-xs text-brand-slate leading-relaxed">
              AI never decides or prescribes independently. Every clinical note requires explicit
              doctor review and approval before finalization.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3 p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-mist text-brand-evergreen flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-brand-deepTeal" />
            </div>
            <h4 className="text-sm font-bold text-brand-evergreen">
              Zero Fabrication Guarantee
            </h4>
            <p className="text-xs text-brand-slate leading-relaxed">
              Strict negative prompting prevents hallucinated dosages or imaginary symptoms.
              Uncertain speech is flagged immediately for review.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <GlassCard className="p-10 rounded-3xl bg-gradient-to-r from-brand-evergreen to-brand-mint text-white space-y-6 shadow-2xl">
          <h2 className="text-3xl font-extrabold">
            Ready to spend less time typing and more time caring?
          </h2>
          <p className="text-sm text-brand-seafoam max-w-xl mx-auto">
            Join forward-thinking doctors and clinics. Start your free trial today.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <GlassButton variant="outline" size="lg" className="bg-white text-brand-evergreen hover:bg-brand-softWhite">
                Get Started with ClinicScribe
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

