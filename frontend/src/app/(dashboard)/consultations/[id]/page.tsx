"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Edit3,
  Save,
  Download,
  Share2,
  Volume2,
  Clock,
  ShieldCheck,
  User,
  Calendar,
  Languages,
  Check,
  HeartHandshake,
  Pill,
  HelpCircle,
  AlertOctagon,
} from "lucide-react";

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = (params?.id as string) || "cs-1092";

  // Tab View: Clinical Note vs Multilingual Patient Summary
  const [activeTab, setActiveTab] = useState<"clinical_note" | "patient_summary">("clinical_note");
  const [selectedLanguage, setSelectedLanguage] = useState<"Tamil" | "Hindi" | "English">("Tamil");

  // State for Doctor Review & Approval
  const [isApproved, setIsApproved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);

  // Editable Clinical Fields
  const [chiefComplaint, setChiefComplaint] = useState(
    "Dry cough and chest congestion for 3 days with nocturnal wheezing."
  );
  const [hpi, setHpi] = useState(
    "Patient reports mild low-grade fever starting 3 days ago accompanied by persistent dry cough. Sputum is minimal and clear. Aggravated at night and during early morning."
  );
  const [symptoms, setSymptoms] = useState([
    "Dry cough for 3 days",
    "Chest congestion",
    "Low-grade nocturnal fever",
    "General fatigue",
  ]);
  const [examFindings, setExamFindings] = useState(
    "BP 128/82 mmHg, Pulse 78 bpm, SpO2 98% on room air. Bilateral breath sounds present, mild wheezing on forced expiration. No cyanosis."
  );
  const [diagnosis, setDiagnosis] = useState("Acute Bronchitis (Doctor-Stated)");
  const [medications, setMedications] = useState([
    {
      name: "Paracetamol",
      dosage: "650 mg",
      frequency: "TDS (3 times/day) after food",
      duration: "5 days",
      instructions: "Take SOS if temperature > 100°F",
    },
    {
      name: "Levocetirizine + Montelukast",
      dosage: "5 mg / 10 mg",
      frequency: "Once daily (OD) at bedtime",
      duration: "5 days",
      instructions: "May cause mild drowsiness",
    },
    {
      name: "Steam Inhalation with Saline",
      dosage: "Warm Saline",
      frequency: "Twice daily (BD)",
      duration: "3 days",
      instructions: "Inhale deeply for 10 minutes",
    },
  ]);
  const [advice, setAdvice] = useState([
    "Maintain warm fluid hydration (> 2.5 Liters/day).",
    "Avoid cold beverages, ice creams, and dusty environments.",
    "Adequate vocal rest and room steam humidification.",
  ]);
  const [followUp, setFollowUp] = useState(
    "Review in 5 days if cough or fever persists; seek emergency care immediately if shortness of breath develops."
  );

  // Safety Callout / Guardrail flags
  const [missingInfo] = useState<string[]>([
    "Previous antibiotic allergy history not discussed during consultation.",
  ]);

  // Raw Transcript Data
  const rawTranscript = [
    {
      speaker: "Doctor",
      time: "00:03",
      text: "Vanakkam Priya, 3 days-ah severe chest congestion and dry cough irukku nu sonneenga.",
    },
    {
      speaker: "Patient",
      time: "00:12",
      text: "Aama doctor, night time fever kooda irundhudhu. Romba tired-ah irukku, thoonga mudiyala.",
    },
    {
      speaker: "Doctor",
      time: "00:25",
      text: "Okay, let me examine your chest. Please breathe in deeply... BP is 128/82 mmHg, Pulse 78, oxygen is 98%. Chest sounds show mild wheezing on expiration.",
    },
    {
      speaker: "Doctor",
      time: "00:48",
      text: "This is Acute Bronchitis. Nothing to panic. I will prescribe Paracetamol 650mg for fever and Levocetirizine with Montelukast at bedtime for 5 days. Do steam inhalation twice daily.",
    },
    {
      speaker: "Patient",
      time: "01:10",
      text: "Sure doctor, diet ethavathu follow pannanuma?",
    },
    {
      speaker: "Doctor",
      time: "01:18",
      text: "Drink plenty of warm water, at least 2.5 liters a day. Avoid ice water and dust. Come back for review in 5 days if cough persists.",
    },
  ];

  // Multilingual Patient Summary Data
  const patientSummaries = {
    Tamil: {
      title: "மருத்துவர் ஆலோசனைக் குறிப்பு & வழிமுறைகள் (Patient Care Guide)",
      greeting: "வணக்கம் Priya Sundaram, உங்கள் நலமே எங்களின் முதன்மை நோக்கம்.",
      diagnosisText:
        "மருத்துவர் உங்கள் பரிசோதனையின் முடிவில் மூச்சுக்குழாய் அழற்சி (Acute Bronchitis) உள்ளதாக குறிப்பிட்டுள்ளார். முறையான மாத்திரைகள், வெதுவெதுப்பான சுடுதண்ணீர் மற்றும் போதிய ஓய்வு மூலம் இது 4-5 நாட்களில் முழுமையாக குணமாகும்.",
      meds: [
        {
          name: "Paracetamol 650 mg",
          schedule: "காலை - மதியம் - இரவு (உணவுக்குப் பின்)",
          note: "காய்ச்சல் அல்லது தலைவலி இருக்கும் போது மட்டும் எடுத்துக்கொள்ளவும்.",
        },
        {
          name: "Levocetirizine + Montelukast",
          schedule: "இரவு தூங்கும் முன் (1 மாத்திரை)",
          note: "லேசான தூக்கக் கலக்கம் வரலாம்; இரவில் மட்டுமே உட்கொள்ளவும்.",
        },
        {
          name: "நீராவி பிடித்தல் (Steam Inhalation)",
          schedule: "காலை மற்றும் இரவு (10 நிமிடங்கள்)",
          note: "நெஞ்சு சளி குறைய வெதுவெதுப்பான நீரில் நீராவி பிடிக்கவும்.",
        },
      ],
      dos: [
        "தினமும் 2.5 லிட்டர் வெதுவெதுப்பான சுடுதண்ணீர் தவறாமல் குடிக்கவும்.",
        "குளிர்ந்த பானங்கள், ஐஸ்கிரீம் மற்றும் தூசி நிறைந்த இடங்களை முழுமையாக தவிர்க்கவும்.",
        "இருமல் குறையும் வரை தொண்டைக்கு ஓய்வு கொடுக்கவும்.",
      ],
      warning:
        "மூச்சு விடுவதில் அதிக சிரமம், நெஞ்சு வலி, அல்லது 3 நாட்களுக்கு மேல் காய்ச்சல் தொடர்ந்தால் உடனடியாக மருத்துவமனைக்கு வரவும்.",
      followUp: "5 நாட்களுக்குப் பிறகு மீண்டும் மருத்துவரை நேரில் சந்தித்து பரிசோதிக்கவும்.",
    },
    Hindi: {
      title: "डॉक्टर परामर्श और देखभाल गाइड (Patient Care Guide)",
      greeting: "नमस्ते Priya Sundaram जी, आपकी सेहत हमारी पहली प्राथमिकता है।",
      diagnosisText:
        "डॉक्टर ने जांच के बाद हल्की ब्रोंकाइटिस (Acute Bronchitis) पाई है। नियमित दवा, गुनगुने पानी और उचित आराम से यह 4-5 दिनों में पूरी तरह ठीक हो जाएगी।",
      meds: [
        {
          name: "Paracetamol 650 mg",
          schedule: "सुबह - दोपहर - रात (खाना खाने के बाद)",
          note: "बुखार या बदन दर्द होने पर ही लें।",
        },
        {
          name: "Levocetirizine + Montelukast",
          schedule: "रात को सोने से पहले (1 गोली)",
          note: "इससे हल्की नींद आ सकती है, केवल रात में लें।",
        },
        {
          name: "भाप लेना (Steam Inhalation)",
          schedule: "सुबह और शाम (10 मिनट)",
          note: "छाती की जकड़न दूर करने के लिए गर्म पानी की भाप लें।",
        },
      ],
      dos: [
        "दिन भर में कम से कम 2.5 लीटर गुनगुना पानी पिएं।",
        "ठंडे पेय पदार्थ, आइसक्रीम और धूल-मिट्टी से पूरी तरह परहेज करें।",
        "गले को आराम दें और तेज आवाज में बात करने से बचें।",
      ],
      warning:
        "यदि सांस लेने में भारी तकलीफ, सीने में दर्द, या 3 दिन बाद भी तेज बुखार रहे तो तुरंत अस्पताल आएं।",
      followUp: "5 दिनों के बाद क्लिनिक में फॉलो-अप जांच के लिए अवश्य पधारें।",
    },
    English: {
      title: "Doctor Consultation & Patient Care Guide",
      greeting: "Hello Priya Sundaram, here is your personalized consultation care plan.",
      diagnosisText:
        "The attending physician evaluated your symptoms and identified Acute Bronchitis. With regular medications, adequate hydration, and rest, full recovery is expected within 4 to 5 days.",
      meds: [
        {
          name: "Paracetamol 650 mg",
          schedule: "Morning - Afternoon - Night (After food)",
          note: "Take SOS if temperature exceeds 100°F or body pain develops.",
        },
        {
          name: "Levocetirizine + Montelukast",
          schedule: "Bedtime Once Daily (After food)",
          note: "May induce mild drowsiness; take exclusively before sleep.",
        },
        {
          name: "Steam Inhalation with Saline",
          schedule: "Twice Daily (Morning & Evening for 10 mins)",
          note: "Inhale warm steam to loosen chest congestion.",
        },
      ],
      dos: [
        "Drink at least 2.5 Liters of warm fluids/water throughout the day.",
        "Strictly avoid chilled beverages, cold desserts, and dusty environments.",
        "Ensure adequate vocal and physical rest.",
      ],
      warning:
        "Seek immediate emergency hospital care if you experience severe breathlessness, chest pain, or persistent high fever beyond 3 days.",
      followUp: "Return for follow-up review in 5 days or sooner if symptoms escalate.",
    },
  };

  const currentSummary = patientSummaries[selectedLanguage];

  const sectionLabels = {
    Tamil: {
      obs: "மருத்துவர் பரிசோதனை விளக்கம் (What Your Doctor Observed)",
      schedule: "மாத்திரைகள் உட்கொள்ளும் கால அட்டவணை (Medication Schedule)",
      precautions: "நலவாழ்வு & உணவு முறைகள் (Daily Precautions)",
      warning: "எச்சரிக்கை அறிகுறிகள் (When to Seek Immediate Help)",
      emergency: "அவசர உதவிக்கு அருகிலுள்ள மருத்துவமனையை அணுகவும்.",
      nextReview: "அடுத்த பரிசோதனை:",
    },
    Hindi: {
      obs: "डॉक्टर की सलाह और अवलोकन (What Your Doctor Observed)",
      schedule: "दवाइयों का समय और विवरण (Medication Schedule)",
      precautions: "दैनिक सावधानियां और खान-पान (Daily Precautions)",
      warning: "सावधानी और चेतावनी के संकेत (When to Seek Immediate Help)",
      emergency: "आपातकालीन स्थिति में तुरंत नजदीकी अस्पताल से संपर्क करें।",
      nextReview: "अगला फॉलो-अप जांच:",
    },
    English: {
      obs: "Clinical Evaluation Summary (What Your Doctor Observed)",
      schedule: "Prescribed Medication Schedule (Medication Schedule)",
      precautions: "Dietary & Daily Precautions (Daily Precautions)",
      warning: "Critical Warning Signs (When to Seek Immediate Help)",
      emergency: "For acute emergencies, visit the nearest emergency department immediately.",
      nextReview: "Next Follow-Up Review:",
    },
  };

  const currentLabels = sectionLabels[selectedLanguage];

  const handleApprove = () => {
    setIsApproved(true);
    setApprovalTimestamp(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  };

  const handleDownloadPDF = () => {
    window.open(`http://localhost:8000/api/v1/consultations/${consultationId}/prescription-pdf`, "_blank");
  };

  const handleDownloadCarePlanPDF = () => {
    window.open(`http://localhost:8000/api/v1/consultations/${consultationId}/patient-summary-pdf?language=${selectedLanguage}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/consultations">
            <GlassButton variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
              <ArrowLeft className="w-5 h-5 text-deep-teal" />
            </GlassButton>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-dark-evergreen">
                Consultation Review & Care Plan
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-seafoam-aqua/40 text-deep-teal border border-ocean-teal/30">
                {consultationId}
              </span>
              {isApproved ? (
                <PillBadge variant="mint" className="text-xs py-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved by Doctor
                </PillBadge>
              ) : (
                <PillBadge variant="warning" className="text-xs py-0.5">
                  <Clock className="w-3.5 h-3.5 mr-1" /> Awaiting Doctor Review
                </PillBadge>
              )}
            </div>
            <p className="text-xs text-muted-slate mt-0.5">
              Patient: <span className="font-semibold text-deep-teal">Priya Sundaram</span> (CS-P-1001) • Conducted in Tamil / English (Tanglish)
            </p>
          </div>
        </div>

        {/* Doctor Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeTab === "clinical_note" && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? "Save & Lock Edits" : "Edit Fields"}
            </GlassButton>
          )}

          {!isApproved ? (
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleApprove}
              className="flex items-center gap-1.5 shadow-md bg-deep-teal text-white hover:bg-dark-evergreen"
            >
              <Check className="w-4 h-4" />
              Approve & Finalize Note
            </GlassButton>
          ) : (
            <div className="flex items-center gap-2">
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 bg-dark-evergreen text-white hover:bg-deep-teal shadow-md"
              >
                <Download className="w-4 h-4" />
                Download Official Prescription PDF
              </GlassButton>
            </div>
          )}
        </div>
      </div>

      {/* Verified Consent & Audit Banner */}
      <div className="p-3.5 rounded-2xl bg-seafoam-aqua/25 border border-ocean-teal/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-muted-slate">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-deep-teal shrink-0" />
          <span>
            <strong className="text-dark-evergreen">Documented Patient Consent:</strong> Verified digital & verbal authorization on file (Dr. Sarah Sundaram).
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>AI Model: <strong className="text-deep-teal">Gemini 1.5 Pro</strong></span>
          <span>Prompt: <strong className="text-deep-teal">v1.2.0-clinical-safety</strong></span>
          {approvalTimestamp ? (
            <span className="text-mint-green font-semibold">
              Signed: {approvalTimestamp}
            </span>
          ) : (
            <span className="text-amber-700 italic">Unsigned Draft</span>
          )}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center justify-between border-b border-ocean-teal/20 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("clinical_note")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "clinical_note"
                ? "bg-deep-teal text-white shadow-sm"
                : "bg-white/50 text-muted-slate hover:bg-seafoam-aqua/30"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Doctor Clinical Note & Transcript
          </button>
          <button
            onClick={() => setActiveTab("patient_summary")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "patient_summary"
                ? "bg-deep-teal text-white shadow-sm"
                : "bg-white/50 text-muted-slate hover:bg-seafoam-aqua/30"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Multilingual Patient Care Plan
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-mint-green text-white">
              Tamil / Hindi / English
            </span>
          </button>
        </div>

        {activeTab === "patient_summary" && (
          <div className="flex items-center gap-1.5 bg-white/70 p-1 rounded-xl border border-ocean-teal/20 text-xs">
            <Languages className="w-3.5 h-3.5 text-deep-teal ml-1.5" />
            {(["Tamil", "Hindi", "English"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedLanguage === lang
                    ? "bg-deep-teal text-white shadow-xs"
                    : "text-muted-slate hover:text-dark-evergreen"
                }`}
              >
                {lang === "Tamil" ? "தமிழ்" : lang === "Hindi" ? "हिन्दी" : "English"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Clinical Note Review & Transcript */}
      {activeTab === "clinical_note" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pane: Consultation Audio & Raw Transcript (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-ocean-teal/15">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-deep-teal" />
                  <h2 className="font-bold text-dark-evergreen text-sm">
                    Audio & Raw Transcript
                  </h2>
                </div>
                <span className="text-[11px] font-medium text-deep-teal bg-pale-mist/60 px-2 py-0.5 rounded-full">
                  Tamil / English • 02:14
                </span>
              </div>

              {/* Audio Playback Bar */}
              <div className="p-3 rounded-xl bg-pale-mist/40 border border-ocean-teal/15 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-deep-teal font-medium">
                  <div className="w-2 h-2 rounded-full bg-mint-green animate-pulse" />
                  <span>Verified Recording on File</span>
                </div>
                <span className="text-xs font-mono text-muted-slate">02:14 / 02:14</span>
              </div>

              {/* Transcript Messages */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 text-xs">
                {rawTranscript.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      item.speaker === "Doctor"
                        ? "bg-seafoam-aqua/20 border-ocean-teal/20 text-dark-evergreen"
                        : "bg-white/70 border-pale-mist text-muted-slate"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-deep-teal">
                        {item.speaker}
                      </span>
                      <span className="text-[10px] text-muted-slate font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Pane: AI-Generated Structured Clinical Note (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Missing Guardrail Alert */}
            {missingInfo.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">
                    AI Guardrail Notice: Information Gap Flagged
                  </p>
                  <ul className="list-disc list-inside mt-1 text-amber-700 space-y-0.5">
                    {missingInfo.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <GlassCard className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-ocean-teal/15">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ocean-teal" />
                  <h2 className="font-bold text-dark-evergreen text-base">
                    Structured Clinical Note
                  </h2>
                </div>
                <span className="text-xs text-muted-slate italic">
                  {isEditing ? "Editing Mode Active" : "Doctor Review Mode"}
                </span>
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block mb-1">
                  Chief Complaint
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 focus:outline-none focus:ring-1 focus:ring-deep-teal"
                  />
                ) : (
                  <p className="text-xs text-dark-evergreen bg-pale-mist/30 p-2.5 rounded-xl border border-ocean-teal/15">
                    {chiefComplaint}
                  </p>
                )}
              </div>

              {/* History of Present Illness (HPI) */}
              <div>
                <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block mb-1">
                  History of Present Illness (HPI)
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={hpi}
                    onChange={(e) => setHpi(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 focus:outline-none focus:ring-1 focus:ring-deep-teal"
                  />
                ) : (
                  <p className="text-xs text-muted-slate leading-relaxed bg-pale-mist/30 p-2.5 rounded-xl border border-ocean-teal/15">
                    {hpi}
                  </p>
                )}
              </div>

              {/* Symptoms & Vitals Examination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block mb-1">
                    Extracted Symptoms
                  </label>
                  <div className="p-2.5 rounded-xl bg-pale-mist/30 border border-ocean-teal/15 space-y-1">
                    {symptoms.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-slate">
                        <div className="w-1.5 h-1.5 rounded-full bg-ocean-teal" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block mb-1">
                    Examination & Vitals
                  </label>
                  <p className="text-xs text-muted-slate bg-pale-mist/30 p-2.5 rounded-xl border border-ocean-teal/15">
                    {examFindings}
                  </p>
                </div>
              </div>

              {/* Doctor-Stated Assessment / Diagnosis */}
              <div>
                <label className="text-xs font-bold uppercase text-dark-evergreen tracking-wide block mb-1">
                  Assessment & Diagnosis (Doctor-Stated Only)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-ocean-teal/30 bg-white/80 text-dark-evergreen focus:outline-none"
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-seafoam-aqua/20 border border-ocean-teal/30 flex items-center justify-between">
                    <span className="text-sm font-bold text-dark-evergreen">{diagnosis}</span>
                    <PillBadge variant="mint" className="text-[10px]">Confirmed by Doctor</PillBadge>
                  </div>
                )}
              </div>

              {/* Prescribed Medications Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block">
                    Prescription Draft (Doctor-Reviewed)
                  </label>
                  <span className="text-[11px] text-muted-slate">3 items</span>
                </div>
                <div className="border border-ocean-teal/20 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-pale-mist/60 text-dark-evergreen font-semibold">
                      <tr>
                        <th className="p-2.5">Medication & Strength</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5">Special Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-teal/10 bg-white/60 text-muted-slate">
                      {medications.map((m, idx) => (
                        <tr key={idx} className="hover:bg-pale-mist/20">
                          <td className="p-2.5 font-medium text-dark-evergreen">
                            {m.name} <span className="text-[11px] font-normal text-muted-slate">({m.dosage})</span>
                          </td>
                          <td className="p-2.5">{m.frequency}</td>
                          <td className="p-2.5">{m.duration}</td>
                          <td className="p-2.5 text-[11px] italic">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advice & Follow-Up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block mb-1">
                    Lifestyle & Medical Advice
                  </label>
                  <ul className="p-2.5 rounded-xl bg-pale-mist/30 border border-ocean-teal/15 space-y-1 text-xs text-muted-slate">
                    {advice.map((a, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-mint-green shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-deep-teal tracking-wide block mb-1">
                    Follow-Up Instructions
                  </label>
                  <p className="text-xs text-muted-slate bg-pale-mist/30 p-2.5 rounded-xl border border-ocean-teal/15 leading-relaxed">
                    {followUp}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 2: Multilingual Patient Summary View */}
      {activeTab === "patient_summary" && (
        <div className="space-y-6">
          <GlassCard className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-ocean-teal/20">
              <div>
                <h2 className="text-xl font-bold text-dark-evergreen">
                  {currentSummary.title}
                </h2>
                <p className="text-xs text-muted-slate mt-1">
                  {currentSummary.greeting}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadCarePlanPDF}
                  className="bg-deep-teal text-white flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Export Care Plan PDF ({selectedLanguage})
                </GlassButton>
              </div>
            </div>

            {/* Diagnosis Explanation in Simple Language */}
            <div className="p-4 rounded-2xl bg-seafoam-aqua/20 border border-ocean-teal/25">
              <span className="text-xs font-bold uppercase tracking-wide text-dark-evergreen block mb-1">
                {currentLabels.obs}
              </span>
              <p className="text-xs text-dark-evergreen leading-relaxed">
                {currentSummary.diagnosisText}
              </p>
            </div>

            {/* Medicine Schedule Table */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-deep-teal" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-dark-evergreen">
                  {currentLabels.schedule}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSummary.meds.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/70 border border-ocean-teal/20 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-dark-evergreen block">
                        {med.name}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-pale-mist text-[11px] font-semibold text-deep-teal mt-1">
                        {med.schedule}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-slate mt-3 italic border-t border-ocean-teal/10 pt-2">
                      {med.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifestyle & Care Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-pale-mist/30 border border-ocean-teal/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wide text-dark-evergreen block">
                  {currentLabels.precautions}
                </span>
                <ul className="space-y-1.5 text-xs text-muted-slate">
                  {currentSummary.dos.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-mint-green shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warning Signs */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {currentLabels.warning}
                  </span>
                </div>
                <p className="text-xs text-rose-900/90 leading-relaxed">
                  {currentSummary.warning}
                </p>
                <div className="pt-2 text-[11px] font-semibold text-rose-700">
                  {currentLabels.emergency}
                </div>
              </div>
            </div>

            {/* Next Review Advice */}
            <div className="p-3.5 rounded-xl bg-pale-mist/50 border border-ocean-teal/20 flex items-center justify-between text-xs">
              <span className="text-muted-slate">
                {currentLabels.nextReview} <strong className="text-dark-evergreen">{currentSummary.followUp}</strong>
              </span>
              <span className="text-[11px] text-deep-teal font-medium">
                City Health Clinic • Dr. Sarah Sundaram
              </span>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
