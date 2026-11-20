"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { useAuth } from "@/hooks/use-auth";
import {
  Stethoscope,
  Building2,
  Languages,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const { user, completeOnboarding, loading } = useAuth();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    doctor_full_name: user?.full_name || "Dr. Sarah Sundaram",
    medical_license_number: "TN-MC-84920",
    specialization: "General Medicine",
    qualifications: "MBBS, MD",
    clinic_name: "Apex Healthcare Clinic",
    clinic_email: "contact@apexclinic.com",
    clinic_phone: "+91 98765 43210",
    clinic_address: "142 Anna Salai, Chennai, Tamil Nadu",
    preferred_languages: "Tamil, English, Hindi",
    subscription_tier: "DOCTOR_PLAN",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    await completeOnboarding(formData);
  };

  const stepsList = [
    { num: 1, title: "Doctor Profile", icon: Stethoscope },
    { num: 2, title: "Clinic Details", icon: Building2 },
    { num: 3, title: "Multilingual Setup", icon: Languages },
    { num: 4, title: "Confirmation", icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-2xl py-6">
      {/* Step Stepper Header */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {stepsList.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? "bg-brand-evergreen text-white border-brand-evergreen shadow-md"
                  : isDone
                  ? "bg-brand-seafoam text-brand-evergreen border-brand-mint/40"
                  : "bg-white/70 text-brand-slate border-brand-seafoam/30"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold">Step {s.num}</span>
              </div>
              <div className="text-[11px] font-medium truncate">{s.title}</div>
            </div>
          );
        })}
      </div>

      <GlassCard className="p-8 sm:p-10 shadow-2xl border-2 border-brand-oceanTeal/30">
        {/* STEP 1: Doctor Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-evergreen">
                Doctor Professional Profile
              </h2>
              <p className="text-xs text-brand-slate">
                Your credentials appear on doctor-reviewed clinical notes and prescription headers.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-brand-evergreen">
                  Full Name with Credentials
                </label>
                <input
                  type="text"
                  value={formData.doctor_full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor_full_name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-brand-evergreen">
                    Medical Council Reg. / License No.
                  </label>
                  <input
                    type="text"
                    value={formData.medical_license_number}
                    onChange={(e) =>
                      setFormData({ ...formData, medical_license_number: e.target.value })
                    }
                    className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-evergreen">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) =>
                      setFormData({ ...formData, qualifications: e.target.value })
                    }
                    className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-evergreen">
                  Primary Clinical Specialty
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1 bg-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="ENT">ENT</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <GlassButton variant="primary" size="md" onClick={nextStep}>
                Next: Clinic Details
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        )}

        {/* STEP 2: Clinic Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-evergreen">
                Clinic & Hospital Details
              </h2>
              <p className="text-xs text-brand-slate">
                Multi-tenant healthcare organization configuration and patient boundary.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-brand-evergreen">
                  Clinic / Hospital Name
                </label>
                <input
                  type="text"
                  value={formData.clinic_name}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-brand-evergreen">
                    Clinic Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.clinic_email}
                    onChange={(e) =>
                      setFormData({ ...formData, clinic_email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-evergreen">
                    Clinic Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.clinic_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, clinic_phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-evergreen">
                  Clinic Physical Address
                </label>
                <input
                  type="text"
                  value={formData.clinic_address}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 glass-input text-brand-evergreen mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <GlassButton variant="outline" size="md" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </GlassButton>
              <GlassButton variant="primary" size="md" onClick={nextStep}>
                Next: Language Preferences
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        )}

        {/* STEP 3: Multilingual Practice Settings */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-evergreen">
                Multilingual AI Configuration
              </h2>
              <p className="text-xs text-brand-slate">
                Select your preferred consultation language combinations for Google Gemini AI.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "Tamil, English, Hindi",
                  title: "Trilingual (Tamil, English, Hindi & Tanglish)",
                  desc: "Ideal for South Indian clinics with code-mixed medical dialogue.",
                },
                {
                  id: "Hindi, English",
                  title: "Hindi & English (Hinglish)",
                  desc: "Optimized for North & Central Indian clinical consultations.",
                },
                {
                  id: "English Only",
                  title: "English Only",
                  desc: "Standard international clinical terminology.",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() =>
                    setFormData({ ...formData, preferred_languages: opt.id })
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.preferred_languages === opt.id
                      ? "bg-brand-mist/70 border-brand-deepTeal shadow-sm"
                      : "bg-white/80 border-brand-seafoam/40 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-evergreen">
                      {opt.title}
                    </span>
                    <input
                      type="radio"
                      name="lang"
                      checked={formData.preferred_languages === opt.id}
                      onChange={() => {}}
                      className="text-brand-evergreen"
                    />
                  </div>
                  <p className="text-[11px] text-brand-slate mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <GlassButton variant="outline" size="md" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </GlassButton>
              <GlassButton variant="primary" size="md" onClick={nextStep}>
                Next: Review & Launch
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation & Launch */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-mint/20 text-brand-evergreen flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-brand-mint" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-evergreen">
                Ready to Launch ClinicScribe!
              </h2>
              <p className="text-xs text-brand-slate max-w-md mx-auto mt-1">
                Your clinic workspace has been configured with multilingual AI capabilities and tenant isolation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/50 text-xs text-left space-y-2 max-w-md mx-auto">
              <div>
                <strong className="text-brand-deepTeal">Doctor:</strong>{" "}
                {formData.doctor_full_name} ({formData.specialization})
              </div>
              <div>
                <strong className="text-brand-deepTeal">Clinic:</strong>{" "}
                {formData.clinic_name}
              </div>
              <div>
                <strong className="text-brand-deepTeal">Languages:</strong>{" "}
                {formData.preferred_languages}
              </div>
              <div>
                <strong className="text-brand-deepTeal">Subscription:</strong>{" "}
                14-Day Free Trial (50 Consultations)
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <GlassButton variant="outline" size="md" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </GlassButton>
              <GlassButton
                variant="primary"
                size="lg"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? "Provisioning..." : "Launch Doctor Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

