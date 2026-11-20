"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { AudioRecorder } from "@/components/consultation/audio-recorder";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  User,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function NewConsultationPage() {
  const router = useRouter();

  // State
  const [selectedPatientId, setSelectedPatientId] = useState("pat-1001");
  const [consultationType, setConsultationType] = useState("General Consultation");
  const [languageMode, setLanguageMode] = useState("Tamil / English (Tanglish)");
  const [isConsentGranted, setIsConsentGranted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");

  const patientsList = [
    { id: "pat-1001", name: "Priya Sundaram", code: "CS-P-1001", lang: "Tamil" },
    { id: "pat-1002", name: "Aarav Sharma", code: "CS-P-1002", lang: "Hindi / English" },
    { id: "pat-1003", name: "Kavitha Raman", code: "CS-P-1003", lang: "Tamil / English" },
    { id: "pat-1004", name: "Siddharth Verma", code: "CS-P-1004", lang: "English" },
  ];

  const handleFinishRecording = async (transcript: string, duration: number) => {
    setIsProcessing(true);
    setProcessingStep("1/3: Storing verified consent & consultation record...");
    await new Promise((r) => setTimeout(r, 600));

    setProcessingStep("2/3: Invoking Google Gemini 1.5 Multilingual AI Engine...");
    await new Promise((r) => setTimeout(r, 900));

    setProcessingStep("3/3: Validating clinical schema & safety guardrails...");
    await new Promise((r) => setTimeout(r, 600));

    // Redirect to Doctor Note Review workspace
    router.push("/consultations/cs-1092");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-brand-slate hover:text-brand-evergreen flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-seafoam text-brand-evergreen text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            Gemini Multimodal Voice Workspace
          </span>
        </div>
      </div>

      {/* Consultation Metadata & Patient Selection */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-base font-bold text-brand-evergreen">
          Consultation Setup
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-brand-evergreen">
              Select Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2 glass-input text-brand-evergreen mt-1 bg-white"
            >
              {patientsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) - {p.lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-brand-evergreen">
              Consultation Type
            </label>
            <select
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              className="w-full px-3.5 py-2 glass-input text-brand-evergreen mt-1 bg-white"
            >
              <option value="General Consultation">General Consultation</option>
              <option value="Pulmonology Review">Pulmonology Review</option>
              <option value="Cardiology Review">Cardiology Review</option>
              <option value="Endocrinology Review">Endocrinology Review</option>
              <option value="Routine Follow-up">Routine Follow-up</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-brand-evergreen">
              Primary Language Mode
            </label>
            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value)}
              className="w-full px-3.5 py-2 glass-input text-brand-evergreen mt-1 bg-white"
            >
              <option value="Tamil / English (Tanglish)">Tamil / English (Tanglish)</option>
              <option value="Hindi / English (Hinglish)">Hindi / English (Hinglish)</option>
              <option value="English">English</option>
              <option value="Tamil Only">Tamil Only</option>
              <option value="Hindi Only">Hindi Only</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Mandatory Patient Consent Banner */}
      <GlassCard
        className={`p-5 transition-all ${
          isConsentGranted
            ? "border-2 border-brand-mint bg-brand-mist/60"
            : "border-2 border-amber-400 bg-amber-50/60"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isConsentGranted
                ? "bg-brand-mint text-white"
                : "bg-amber-400 text-amber-950"
            }`}
          >
            {isConsentGranted ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-brand-evergreen uppercase tracking-wider">
                Mandatory Patient Recording Consent
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConsentGranted
                    ? "bg-brand-mint/20 text-brand-evergreen"
                    : "bg-amber-200 text-amber-900"
                }`}
              >
                {isConsentGranted ? "Consent Granted & Documented" : "Action Required"}
              </span>
            </div>

            <p className="text-xs text-brand-slate leading-relaxed">
              In accordance with healthcare ethics and the Digital Personal Data Protection (DPDP) Act,
              voice recording requires explicit patient notification and consent. Audio is encrypted and
              subject to mandatory doctor review before finalization.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="consent-checkbox"
                checked={isConsentGranted}
                onChange={(e) => setIsConsentGranted(e.target.checked)}
                className="w-4 h-4 rounded border-brand-oceanTeal text-brand-evergreen focus:ring-brand-mint cursor-pointer"
              />
              <label
                htmlFor="consent-checkbox"
                className="text-xs font-bold text-brand-evergreen cursor-pointer select-none"
              >
                I confirm that the patient has provided informed consent for AI clinical documentation.
              </label>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Audio Recorder Module */}
      <AudioRecorder
        isConsentGranted={isConsentGranted}
        onFinishRecording={handleFinishRecording}
        disabled={isProcessing}
      />

      {/* Processing Progress Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <GlassCard className="p-8 max-w-md w-full bg-white text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-brand-mist text-brand-evergreen flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-brand-mint animate-spin" />
            </div>

            <h3 className="text-base font-bold text-brand-evergreen">
              Processing Clinical Consultation
            </h3>

            <p className="text-xs font-mono text-brand-slate">{processingStep}</p>

            <div className="w-full bg-brand-mist rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-mint h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
