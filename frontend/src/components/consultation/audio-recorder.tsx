"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Mic, Square, Pause, Play, Upload, Sparkles, CheckCircle2 } from "lucide-react";

interface AudioRecorderProps {
  isConsentGranted: boolean;
  onFinishRecording: (transcript: string, duration: number) => void;
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isConsentGranted,
  onFinishRecording,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<"tanglish" | "hinglish" | "english">("tanglish");

  // Sample consultation dialogues for immediate live demonstration
  const PRESET_DIALOGUES = {
    tanglish: {
      label: "Tamil / English (Tanglish) - Acute Bronchitis",
      duration: 134,
      text: "Doctor: Vanakkam Priya, 3 days-ah severe chest congestion and dry cough irukku nu sonneenga.\nPatient: Aama doctor, night time fever kooda irundhudhu. Romba tired-ah irukku.\nDoctor: Okay, let me examine your chest. Blood pressure is 128/82 mmHg. Lungs are clear. This is Acute Bronchitis. I will prescribe Paracetamol 650mg and Levocetirizine for 5 days. Drink warm water.",
    },
    hinglish: {
      label: "Hindi / English (Hinglish) - Cardiology Review",
      duration: 156,
      text: "Doctor: Namaste Aarav ji, aapka blood pressure check kar lete hain. Koi chest pain ya shortness of breath?\nPatient: Doctor, thoda exertion par saas phoolti hai, especially stairs chadhne par.\nDoctor: Blood pressure is 142/90 mmHg. Heart sounds normal. I am increasing Telmisartan to 40mg once daily in the morning. Please get an ECG done.",
    },
    english: {
      label: "English - Migraine Cephalea",
      duration: 110,
      text: "Doctor: Hello Siddharth, how long have you had this unilateral throbbing headache?\nPatient: It started yesterday morning with severe photophobia and mild nausea.\nDoctor: Neurological examination is unremarkable. Assessment is Migraine without aura. Prescribing Naproxen 250mg twice daily with food.",
    },
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!isConsentGranted) return;
    setIsRecording(true);
    setIsPaused(false);
    setSeconds(0);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);
    const preset = PRESET_DIALOGUES[selectedPreset];
    onFinishRecording(preset.text, seconds || preset.duration);
  };

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6 border-2 border-brand-oceanTeal/30">
      {/* Waveform / Visualizer Canvas */}
      <div className="h-28 rounded-2xl bg-brand-evergreen flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
        {/* Animated Soundwave Bars */}
        <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md">
          {Array.from({ length: 28 }).map((_, i) => {
            const isPlaying = isRecording && !isPaused;
            const heights = ["h-3", "h-8", "h-14", "h-6", "h-12", "h-4", "h-16", "h-10"];
            const hClass = isPlaying ? heights[i % heights.length] : "h-2";
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${hClass} ${
                  isPlaying ? "bg-brand-mint animate-pulse" : "bg-white/30"
                }`}
                style={{
                  animationDelay: `${(i * 0.05).toFixed(2)}s`,
                }}
              />
            );
          })}
        </div>

        {/* Status / Timer Overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRecording && !isPaused
                ? "bg-rose-500 animate-ping"
                : isPaused
                ? "bg-amber-400"
                : "bg-white/40"
            }`}
          />
          <span className="text-[11px] font-mono text-white tracking-widest uppercase">
            {isRecording ? (isPaused ? "PAUSED" : "RECORDING") : "STANDBY"}
          </span>
        </div>

        <div className="absolute top-3 right-4 font-mono text-xs font-bold text-brand-seafoam">
          {formatTime(seconds)} / 15:00
        </div>
      </div>

      {/* Preset Dialogue Selector for Live Multilingual Demo */}
      <div className="p-3.5 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/50 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-brand-evergreen flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            Multilingual Audio Demonstration Preset:
          </span>
          <span className="text-[10px] uppercase font-bold text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full">
            Gemini 1.5 Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(["tanglish", "hinglish", "english"] as const).map((key) => (
            <button
              key={key}
              type="button"
              disabled={isRecording}
              onClick={() => setSelectedPreset(key)}
              className={`p-2 rounded-xl text-left border transition-all text-[11px] font-medium ${
                selectedPreset === key
                  ? "bg-brand-evergreen text-white border-brand-evergreen shadow-sm"
                  : "bg-white text-brand-slate border-brand-seafoam hover:bg-brand-softWhite"
              }`}
            >
              {PRESET_DIALOGUES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Recorder Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <GlassButton
              type="button"
              variant="primary"
              size="lg"
              onClick={handleStart}
              disabled={!isConsentGranted || disabled}
              className="gap-2 shadow-md"
            >
              <Mic className="w-4 h-4" />
              Start Audio Recording
            </GlassButton>
          ) : (
            <>
              <GlassButton
                type="button"
                variant="outline"
                size="md"
                onClick={handlePauseResume}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? "Resume" : "Pause"}
              </GlassButton>

              <GlassButton
                type="button"
                variant="secondary"
                size="md"
                onClick={handleStop}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Square className="w-4 h-4" />
                Stop & Process with AI
              </GlassButton>
            </>
          )}
        </div>

        {/* Upload Audio Fallback */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*,.wav,.mp3,.m4a,.webm"
              disabled={!isConsentGranted || isRecording || disabled}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const preset = PRESET_DIALOGUES[selectedPreset];
                  onFinishRecording(preset.text, 120);
                }
              }}
              className="hidden"
            />
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                isConsentGranted && !isRecording
                  ? "bg-white hover:bg-brand-softWhite text-brand-evergreen border-brand-oceanTeal/30 cursor-pointer shadow-sm"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Audio File
            </span>
          </label>
        </div>
      </div>
    </GlassCard>
  );
};

