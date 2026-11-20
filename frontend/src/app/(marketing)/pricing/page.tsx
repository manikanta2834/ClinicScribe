import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

export default function PricingPage() {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "14 days",
      description: "For individual practitioners evaluating AI clinical documentation.",
      features: [
        "Up to 50 consultations",
        "Gemini 1.5 multilingual notes",
        "Patient consent management",
        "Single doctor seat",
        "PDF note exports",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Doctor Plan",
      price: "$49",
      period: "per month",
      description: "For active clinicians needing unlimited documentation assistance.",
      features: [
        "Unlimited consultations",
        "Multilingual Tamil, Hindi & English",
        "Patient-friendly summaries",
        "Dual-pane note review & diffs",
        "Audio recording storage",
        "Priority AI processing",
      ],
      cta: "Choose Doctor Plan",
      popular: true,
    },
    {
      name: "Clinic Plan",
      price: "$149",
      period: "per month",
      description: "For multi-doctor clinics requiring unified administration.",
      features: [
        "Up to 5 doctor seats included",
        "Centralized clinic management",
        "Clinic-level analytics & trends",
        "Role-based access control",
        "Shared patient directory",
        "Branded clinic letterheads",
      ],
      cta: "Choose Clinic Plan",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored billing",
      description: "For hospital chains and enterprise healthcare networks.",
      features: [
        "Unlimited doctor seats",
        "Custom Vertex AI deployment",
        "HIS / EHR integration APIs",
        "Dedicated account manager",
        "Custom SLA & DPDP audit logs",
        "On-premise / private cloud",
      ],
      cta: "Contact Enterprise",
      popular: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-brand-evergreen">
          Transparent, Predictable Pricing
        </h1>
        <p className="text-base text-brand-slate max-w-xl mx-auto">
          Choose the plan that fits your clinical practice. Scale seamlessly as your patient volume grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <GlassCard
            key={plan.name}
            className={`p-6 flex flex-col justify-between ${
              plan.popular ? "border-2 border-brand-mint shadow-xl relative" : ""
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-mint text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-brand-evergreen">
                  {plan.name}
                </h3>
                <p className="text-xs text-brand-slate mt-1 min-h-[32px]">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-brand-evergreen">
                  {plan.price}
                </span>
                <span className="text-xs text-brand-slate font-medium">
                  / {plan.period}
                </span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-brand-seafoam/30 text-xs text-brand-slate">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Link href="/dashboard">
                <GlassButton
                  variant={plan.popular ? "secondary" : "outline"}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

