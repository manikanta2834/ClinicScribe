"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  Users,
  CreditCard,
  Building2,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowUpRight,
  Languages,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function SettingsHubPage() {
  const [activeTab, setActiveTab] = useState<"team" | "subscription" | "profile" | "audit">("team");

  // State: Team Members
  const [members, setMembers] = useState([
    {
      id: "mem-1",
      name: "Dr. Sarah Sundaram",
      email: "dr.sarah@cityhealth.in",
      role: "CLINIC_OWNER",
      specialization: "General Medicine / Pulmonology",
      license: "TNMC-84920",
      status: "Active",
    },
    {
      id: "mem-2",
      name: "Dr. Rajesh Kumar",
      email: "dr.rajesh@cityhealth.in",
      role: "DOCTOR",
      specialization: "Cardiology",
      license: "TNMC-91024",
      status: "Active",
    },
    {
      id: "mem-3",
      name: "Kavitha Selvam",
      email: "kavitha.admin@cityhealth.in",
      role: "STAFF",
      specialization: "Front Desk & Records",
      license: "N/A",
      status: "Active",
    },
  ]);

  // State: Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("DOCTOR");
  const [inviteSpec, setInviteSpec] = useState("General Physician");
  const [inviteLicense, setInviteLicense] = useState("");

  // State: Subscriptions & Usage
  const [currentTier, setCurrentTier] = useState<"FREE_TRIAL" | "DOCTOR_PLAN" | "CLINIC_PLAN" | "ENTERPRISE">("FREE_TRIAL");
  const [consultationsUsed, setConsultationsUsed] = useState(18);

  const TIER_CONFIG = {
    FREE_TRIAL: {
      name: "Free Trial",
      limit: 50,
      price: "₹0 / mo",
      desc: "For individual trial and validation of Gemini AI multilingual scribe.",
    },
    DOCTOR_PLAN: {
      name: "Doctor Starter Plan",
      limit: 200,
      price: "₹2,999 / mo",
      desc: "Ideal for solo practitioners with regular outpatient schedules.",
    },
    CLINIC_PLAN: {
      name: "Clinic Pro Plan",
      limit: 1000,
      price: "₹7,999 / mo",
      desc: "Multi-doctor clinics with unlimited patient records & priority AI latency.",
    },
    ENTERPRISE: {
      name: "Enterprise Health Network",
      limit: 5000,
      price: "Custom",
      desc: "Hospital chains with dedicated VPCs, custom EHR integrations & SLA.",
    },
  };

  const activePlan = TIER_CONFIG[currentTier];
  const percentUsed = Math.round((consultationsUsed / activePlan.limit) * 100);

  // State: Clinic Profile
  const [clinicName, setClinicName] = useState("City Health Clinic");
  const [clinicPhone, setClinicPhone] = useState("+91 98401 23456");
  const [clinicAddress, setClinicAddress] = useState("No. 42 Anna Salai, Chennai, Tamil Nadu 600002");
  const [defaultLanguage, setDefaultLanguage] = useState("Tamil / English (Tanglish)");
  const [profileSaved, setProfileSaved] = useState(false);

  // State: Audit Logs
  const auditLogs = [
    {
      action: "Doctor Note Approved",
      user: "dr.sarah@cityhealth.in",
      entity: "Consultation #CS-1092",
      details: "Approved acute bronchitis structured clinical note for Priya Sundaram",
      time: "Today, 10:48 AM",
    },
    {
      action: "Prescription PDF Generated",
      user: "dr.sarah@cityhealth.in",
      entity: "Prescription #CS-P-1001",
      details: "Exported clinic-branded PDF with digital seal CS-SIG-92841",
      time: "Today, 10:50 AM",
    },
    {
      action: "Patient Consent Verified",
      user: "dr.sarah@cityhealth.in",
      entity: "Patient #CS-P-1002",
      details: "Recorded digital informed consent for Gemini AI audio transcription",
      time: "Today, 09:15 AM",
    },
    {
      action: "Team Member Added",
      user: "dr.sarah@cityhealth.in",
      entity: "DoctorProfile #TNMC-91024",
      details: "Invited Dr. Rajesh Kumar (Cardiologist) to clinic tenant",
      time: "Yesterday, 04:30 PM",
    },
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    setMembers([
      ...members,
      {
        id: `mem-${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        specialization: inviteSpec,
        license: inviteLicense || "TNMC-Pending",
        status: "Active",
      },
    ]);

    setInviteName("");
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-evergreen">
          Clinic Administration & Settings
        </h1>
        <p className="text-xs text-muted-slate mt-0.5">
          Manage clinical staff, subscription tiers, multi-tenant boundaries, and compliance audit logs.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ocean-teal/20 pb-1">
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "team"
              ? "bg-deep-teal text-white shadow-sm"
              : "bg-white/50 text-muted-slate hover:bg-seafoam-aqua/30"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Team & Staff Management
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {members.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "subscription"
              ? "bg-deep-teal text-white shadow-sm"
              : "bg-white/50 text-muted-slate hover:bg-seafoam-aqua/30"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          SaaS Subscriptions & Quota
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-mint-green text-white">
            {percentUsed}% Used
          </span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-deep-teal text-white shadow-sm"
              : "bg-white/50 text-muted-slate hover:bg-seafoam-aqua/30"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Clinic Profile & Language
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "audit"
              ? "bg-deep-teal text-white shadow-sm"
              : "bg-white/50 text-muted-slate hover:bg-seafoam-aqua/30"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          DPDP Compliance & Audit Logs
        </button>
      </div>

      {/* TAB 1: Team & Staff Management */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-dark-evergreen">
                Authorized Clinic Members
              </h2>
              <p className="text-xs text-muted-slate">
                Practitioners and administrative personnel with access to patient consultations.
              </p>
            </div>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => setShowInviteModal(true)}
              className="bg-deep-teal text-white flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Invite Clinician or Staff
            </GlassButton>
          </div>

          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-pale-mist/60 text-dark-evergreen font-semibold border-b border-ocean-teal/15">
                  <tr>
                    <th className="p-3.5 pl-5">Clinician / Staff Member</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Specialization</th>
                    <th className="p-3.5">Medical Council License</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-teal/10 bg-white/50 text-muted-slate">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-pale-mist/20 transition-colors">
                      <td className="p-3.5 pl-5 font-medium text-dark-evergreen">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-ocean-teal/20 text-deep-teal font-bold flex items-center justify-center text-xs">
                            {m.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-dark-evergreen">{m.name}</p>
                            <p className="text-[11px] text-muted-slate">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <PillBadge
                          variant={
                            m.role === "CLINIC_OWNER"
                              ? "mint"
                              : m.role === "DOCTOR"
                              ? "teal"
                              : "slate"
                          }
                          className="text-[10px]"
                        >
                          {m.role}
                        </PillBadge>
                      </td>
                      <td className="p-3.5">{m.specialization}</td>
                      <td className="p-3.5 font-mono text-[11px] text-deep-teal">
                        {m.license}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-mint-green font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-green" />
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <span className="text-[11px] text-deep-teal hover:underline cursor-pointer">
                          Manage Permissions
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: SaaS Subscriptions & Quota Metering */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          {/* Active Tier Meter */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-deep-teal tracking-wider">
                  Active Subscription Tier
                </span>
                <h2 className="text-xl font-bold text-dark-evergreen mt-0.5">
                  {activePlan.name}
                </h2>
                <p className="text-xs text-muted-slate">{activePlan.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-dark-evergreen">
                  {activePlan.price}
                </span>
                <p className="text-[11px] text-muted-slate">Auto-renews 01 Dec 2026</p>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-dark-evergreen">
                  Monthly Consultation Quota Utilization
                </span>
                <span className="font-bold text-deep-teal">
                  {consultationsUsed} / {activePlan.limit} consultations ({percentUsed}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-pale-mist overflow-hidden border border-ocean-teal/20">
                <div
                  className="h-full bg-gradient-to-r from-ocean-teal to-deep-teal transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, percentUsed)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-slate">
                Remaining this billing cycle: <strong className="text-mint-green">{activePlan.limit - consultationsUsed} consultations</strong>
              </p>
            </div>
          </GlassCard>

          {/* Tier Selection Grid */}
          <div>
            <h3 className="text-sm font-bold text-dark-evergreen mb-3">
              Available SaaS Subscription Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(["FREE_TRIAL", "DOCTOR_PLAN", "CLINIC_PLAN", "ENTERPRISE"] as const).map((tierKey) => {
                const plan = TIER_CONFIG[tierKey];
                const isCurrent = currentTier === tierKey;
                return (
                  <GlassCard
                    key={tierKey}
                    className={`p-5 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? "ring-2 ring-deep-teal bg-white/90 shadow-md"
                        : "hover:bg-white/80"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-deep-teal uppercase">
                          {tierKey.replace("_", " ")}
                        </span>
                        {isCurrent && (
                          <PillBadge variant="mint" className="text-[10px]">
                            Current
                          </PillBadge>
                        )}
                      </div>
                      <h4 className="font-bold text-dark-evergreen text-base">
                        {plan.name}
                      </h4>
                      <p className="text-lg font-bold text-deep-teal">{plan.price}</p>
                      <p className="text-[11px] text-muted-slate leading-relaxed">
                        {plan.desc}
                      </p>
                      <div className="pt-2 text-xs text-dark-evergreen font-medium">
                        • Limit: <strong>{plan.limit}</strong> consults/mo
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-ocean-teal/15">
                      {isCurrent ? (
                        <GlassButton
                          variant="outline"
                          size="sm"
                          disabled
                          className="w-full text-xs font-semibold opacity-70"
                        >
                          Active Plan
                        </GlassButton>
                      ) : (
                        <GlassButton
                          variant="primary"
                          size="sm"
                          onClick={() => setCurrentTier(tierKey)}
                          className="w-full text-xs bg-deep-teal text-white hover:bg-dark-evergreen"
                        >
                          Switch to {plan.name.split(" ")[0]}
                        </GlassButton>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Clinic Profile & Localization Settings */}
      {activeTab === "profile" && (
        <GlassCard className="p-6 max-w-3xl">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h2 className="text-base font-bold text-dark-evergreen pb-2 border-b border-ocean-teal/15">
              Clinic Organization Profile
            </h2>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-mint-green/15 border border-mint-green/30 text-xs text-mint-green font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Clinic configuration and multilingual preferences saved successfully!
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-deep-teal block mb-1">
                Clinic Name (Displays on Prescriptions & Care Plans)
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 text-xs focus:ring-1 focus:ring-deep-teal outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-deep-teal block mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 text-xs focus:ring-1 focus:ring-deep-teal outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-deep-teal block mb-1">
                  Default Consultation Language Mode
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 text-xs focus:ring-1 focus:ring-deep-teal outline-none"
                >
                  <option value="Tamil / English (Tanglish)">Tamil / English (Tanglish)</option>
                  <option value="Hindi / English (Hinglish)">Hindi / English (Hinglish)</option>
                  <option value="English Only">English Only</option>
                  <option value="Tamil Only">Tamil Only</option>
                  <option value="Hindi Only">Hindi Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-deep-teal block mb-1">
                Physical Clinic Address (Appears on Official PDF Header)
              </label>
              <textarea
                rows={2}
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 text-xs focus:ring-1 focus:ring-deep-teal outline-none"
              />
            </div>

            <div className="pt-2">
              <GlassButton
                variant="primary"
                size="sm"
                type="submit"
                className="bg-deep-teal text-white hover:bg-dark-evergreen"
              >
                Save Clinic Settings
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* TAB 4: DPDP Compliance & Immutable Audit Trail */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-dark-evergreen">
                Healthcare SaaS Audit Trail (DPDP Act Compliance)
              </h2>
              <p className="text-xs text-muted-slate">
                Immutable, timestamped event log tracking patient consent, clinical note approvals, and document exports.
              </p>
            </div>
            <PillBadge variant="mint" className="text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Audit Logging Active
            </PillBadge>
          </div>

          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-pale-mist/60 text-dark-evergreen font-semibold border-b border-ocean-teal/15">
                  <tr>
                    <th className="p-3.5 pl-5">Event Action</th>
                    <th className="p-3.5">Clinician / User</th>
                    <th className="p-3.5">Target Entity</th>
                    <th className="p-3.5">Details</th>
                    <th className="p-3.5 pr-5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-teal/10 bg-white/50 text-muted-slate">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-pale-mist/20 transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-dark-evergreen">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-mint-green shrink-0" />
                          <span>{log.action}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-deep-teal">{log.user}</td>
                      <td className="p-3.5 font-mono text-[11px]">{log.entity}</td>
                      <td className="p-3.5 max-w-xs truncate">{log.details}</td>
                      <td className="p-3.5 pr-5 text-right font-mono text-[11px]">
                        {log.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-ocean-teal/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ocean-teal/15">
              <h3 className="font-bold text-dark-evergreen text-base">
                Invite Clinician or Staff Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-muted-slate hover:text-dark-evergreen text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-deep-teal block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-ocean-teal/30 text-xs outline-none focus:ring-1 focus:ring-deep-teal"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-deep-teal block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="doctor@clinic.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-ocean-teal/30 text-xs outline-none focus:ring-1 focus:ring-deep-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-deep-teal block mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ocean-teal/30 text-xs outline-none focus:ring-1 focus:ring-deep-teal"
                  >
                    <option value="DOCTOR">Doctor</option>
                    <option value="CLINIC_ADMIN">Clinic Admin</option>
                    <option value="STAFF">Clinical Staff</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep-teal block mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={inviteSpec}
                    onChange={(e) => setInviteSpec(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ocean-teal/30 text-xs outline-none focus:ring-1 focus:ring-deep-teal"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-deep-teal block mb-1">
                  Medical Council License (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TNMC-91024"
                  value={inviteLicense}
                  onChange={(e) => setInviteLicense(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-ocean-teal/30 text-xs outline-none focus:ring-1 focus:ring-deep-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="sm"
                  type="submit"
                  className="bg-deep-teal text-white hover:bg-dark-evergreen"
                >
                  Send Invitation
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
