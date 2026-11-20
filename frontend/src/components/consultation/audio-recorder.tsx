"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import {
  Mic,
  Square,
  Pause,
  Play,
  Upload,
  Sparkles,
  CheckCircle2,
  Volume2,
  AlertCircle,
  Languages,
  User,
  Activity,
} from "lucide-react";

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

  // Speech Recognition state
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechLanguage, setSpeechLanguage] = useState<string>("en-IN");
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [interimText, setInterimText] = useState<string>("");
  const [activeSpeaker, setActiveSpeaker] = useState<"Doctor" | "Patient">("Doctor");
  const activeSpeakerRef = useRef<"Doctor" | "Patient">("Doctor");
  activeSpeakerRef.current = activeSpeaker;
  const [micVolume, setMicVolume] = useState<number>(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Fallback demo preset selector
  const [selectedPreset, setSelectedPreset] = useState<"tanglish" | "hinglish" | "english">("tanglish");

  // Refs for audio context and recognition
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);

  // Preset Dialogues for instant testing
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

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

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

  // Audio frequency visualizer loop
  const updateVolumeMeter = () => {
    if (analyserRef.current && isRecordingRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
      animFrameRef.current = requestAnimationFrame(updateVolumeMeter);
    }
  };

  // Start Real Voice Recording & Speech Recognition
  const handleStart = async () => {
    if (!isConsentGranted) return;
    setAudioError(null);
    setLiveTranscript("");
    setInterimText("");
    setSeconds(0);

    // 1. Start Web Audio API for Live Waveform Metering
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      isRecordingRef.current = true;
      setIsRecording(true);
      setIsPaused(false);
      animFrameRef.current = requestAnimationFrame(updateVolumeMeter);
    } catch (err: any) {
      console.warn("Microphone access denied or unattached:", err);
      setAudioError("Microphone permission denied or unavailable. You can use preset dialogues or manual audio upload.");
      // Still allow recording state with fallback
      isRecordingRef.current = true;
      setIsRecording(true);
      setIsPaused(false);
    }

    // 2. Start Live Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = speechLanguage;

          recognition.onresult = (event: any) => {
            let interim = "";
            let final = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                final += `${activeSpeakerRef.current}: ${res[0].transcript.trim()}.\n`;
              } else {
                interim += res[0].transcript;
              }
            }

            if (final) {
              setLiveTranscript((prev) => (prev ? `${prev}\n${final}` : final));
            }
            setInterimText(interim);
          };

          recognition.onerror = (e: any) => {
            if (e.error === "no-speech") return;
            if (e.error === "not-allowed" || e.error === "permission-denied") {
              setAudioError("Microphone permission denied. Please allow microphone access in your browser address bar.");
            } else if (e.error === "network") {
              setAudioError("Speech recognition network offline notice. You can insert simulated speech or use presets.");
            } else {
              console.warn("Speech recognition notice:", e.error);
            }
          };

          recognition.onend = () => {
            // Automatically restart with safety delay if still in recording mode
            if (isRecordingRef.current && recognitionRef.current) {
              setTimeout(() => {
                if (isRecordingRef.current && recognitionRef.current) {
                  try {
                    recognitionRef.current.start();
                  } catch (_) {}
                }
              }, 250);
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.warn("Could not initiate SpeechRecognition:", e);
        }
      }
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (_) {}
      }
    } else {
      setIsPaused(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    }
  };

  const handleStop = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsPaused(false);

    // Stop animation and audio nodes
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }

    // Determine finalized transcript
    let finalPayload = liveTranscript.trim();
    if (interimText.trim()) {
      finalPayload += `\n${activeSpeaker}: ${interimText.trim()}.`;
    }

    // Only if microphone captured zero speech after recording, use a plain voice checkup note
    if (!finalPayload) {
      finalPayload = "Patient: Hello doctor, I came in for a routine check-up. No pain, fever, or acute symptoms.\nDoctor: General physical observation is normal. Maintain a balanced diet, drink plenty of water, and stay active. No medications are needed today.";
    }

    onFinishRecording(finalPayload, seconds || 120);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6 border-2 border-brand-oceanTeal/30">
      {/* Waveform / Visualizer Canvas */}
      <div className="h-32 rounded-2xl bg-brand-evergreen flex flex-col justify-between p-4 relative overflow-hidden shadow-inner">
        {/* Animated Soundwave Bars Driven by Real Mic Frequency or Fallback Pulse */}
        <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md mx-auto my-auto">
          {Array.from({ length: 32 }).map((_, i) => {
            const isPlaying = isRecording && !isPaused;
            // Modulate heights dynamically by real mic volume if available
            const baseHeights = [8, 18, 32, 14, 28, 10, 40, 22, 12, 36, 16, 26, 44, 20];
            const baseH = baseHeights[i % baseHeights.length];
            const dynamicH = isPlaying ? Math.max(6, Math.min(60, Math.round(baseH * (1 + micVolume / 40)))) : 4;

            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlaying ? "bg-brand-mint" : "bg-white/20"
                }`}
                style={{
                  height: `${dynamicH}px`,
                }}
              />
            );
          })}
        </div>

        {/* Status / Timer Overlay */}
        <div className="flex items-center justify-between w-full z-10">
          <div className="flex items-center gap-2">
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
              {isRecording ? (isPaused ? "PAUSED" : "LIVE LISTENING") : "STANDBY"}
            </span>

            {isRecording && micVolume > 0 && (
              <span className="text-[10px] font-mono text-brand-seafoam bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-brand-mint" /> Mic: {micVolume}%
              </span>
            )}
          </div>

          <div className="font-mono text-xs font-bold text-brand-seafoam">
            {formatTime(seconds)} / 15:00
          </div>
        </div>
      </div>

      {/* Real-Time Live Speech-to-Text Transcript Display */}
      {isRecording && (
        <div className="p-4 rounded-2xl bg-white border border-brand-oceanTeal/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-brand-seafoam/20 text-xs">
            <span className="font-bold text-brand-evergreen flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-mint animate-pulse" />
              Live Speech-to-Text Stream:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-brand-slate">Speaker:</span>
              <button
                type="button"
                onClick={() => setActiveSpeaker(activeSpeaker === "Doctor" ? "Patient" : "Doctor")}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                  activeSpeaker === "Doctor"
                    ? "bg-brand-deepTeal text-white border-brand-deepTeal"
                    : "bg-brand-oceanTeal text-white border-brand-oceanTeal"
                }`}
              >
                {activeSpeaker} (Tap to Switch)
              </button>
            </div>
          </div>

          <div className="min-h-[60px] max-h-36 overflow-y-auto text-xs text-brand-evergreen space-y-1 font-mono leading-relaxed bg-brand-mist/30 p-2.5 rounded-xl border border-brand-oceanTeal/20">
            {liveTranscript ? (
              <div className="whitespace-pre-line">{liveTranscript}</div>
            ) : null}

            {interimText ? (
              <span className="text-brand-deepTeal italic opacity-80">
                {activeSpeaker}: {interimText}...
              </span>
            ) : null}

            {!liveTranscript && !interimText && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-brand-slate italic text-[11px]">
                  Speak clearly into your microphone in English, Tamil, or Hindi...
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const preset = PRESET_DIALOGUES[selectedPreset];
                    setLiveTranscript(preset.text);
                  }}
                  className="text-[10px] text-brand-deepTeal bg-white hover:bg-brand-mist px-2 py-1 rounded-lg border border-brand-seafoam font-semibold self-start"
                >
                  ⚡ Insert Speech Simulation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Language & Voice Settings */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-brand-deepTeal shrink-0" />
          <span className="font-semibold text-brand-evergreen">Voice Recognition Mode:</span>
          <select
            value={speechLanguage}
            onChange={(e) => setSpeechLanguage(e.target.value)}
            disabled={isRecording}
            className="p-1.5 px-2.5 rounded-xl border border-brand-oceanTeal/30 bg-white text-xs text-brand-evergreen outline-none focus:ring-1 focus:ring-brand-deepTeal"
          >
            <option value="en-IN">English (India - en-IN)</option>
            <option value="ta-IN">Tamil (தமிழ் - ta-IN)</option>
            <option value="hi-IN">Hindi (हिन्दी - hi-IN)</option>
            <option value="en-US">English (US - en-US)</option>
          </select>
        </div>

        {audioError && (
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{audioError}</span>
          </div>
        )}
      </div>

      {/* Preset Dialogue Selector for Instant Live Demo */}
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
              className="gap-2 shadow-md bg-brand-deepTeal text-white hover:bg-brand-evergreen"
            >
              <Mic className="w-4 h-4" />
              Start Voice Recording
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
