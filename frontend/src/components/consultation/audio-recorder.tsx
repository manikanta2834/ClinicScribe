"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import {
  Mic,
  MicOff,
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
  RefreshCw,
  Edit3,
  ArrowRight,
  ShieldCheck,
  Info,
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
  const speechLanguageRef = useRef<string>("en-IN");
  speechLanguageRef.current = speechLanguage;

  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [interimText, setInterimText] = useState<string>("");
  const [activeSpeaker, setActiveSpeaker] = useState<"Doctor" | "Patient">("Doctor");
  const activeSpeakerRef = useRef<"Doctor" | "Patient">("Doctor");
  activeSpeakerRef.current = activeSpeaker;

  const [micVolume, setMicVolume] = useState<number>(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [languageSwitchedNotice, setLanguageSwitchedNotice] = useState<string | null>(null);

  // Fallback demo preset selector
  const [selectedPreset, setSelectedPreset] = useState<"tanglish" | "hinglish" | "english">("tanglish");

  // Refs for audio context and recognition
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false);
  const restartTimeoutRef = useRef<any>(null);
  const restartAttemptsRef = useRef<number>(0);

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

  // Keyboard shortcut to toggle speaker (Ctrl + Space or Alt + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.code === "Space") || (e.altKey && e.code === "KeyS")) {
        e.preventDefault();
        setActiveSpeaker((prev) => (prev === "Doctor" ? "Patient" : "Doctor"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
  const updateVolumeMeter = useCallback(() => {
    if (analyserRef.current && isRecordingRef.current && !isPausedRef.current) {
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
  }, []);

  // Safe Speech Recognition Factory & Continuous Session Manager
  const startSpeechRecognitionSession = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    // Clean up any stale recognition instance before starting fresh
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLanguageRef.current;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interim = "";
        let newFinalText = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            const rawTranscript = res[0].transcript.trim();
            if (rawTranscript) {
              // Sanitize trailing periods and cleanly format with active speaker tag
              const sanitized = rawTranscript.replace(/[.,!?;:]+$/, "");
              newFinalText += `${activeSpeakerRef.current}: ${sanitized}.\n`;
            }
          } else {
            interim += res[0].transcript;
          }
        }

        if (newFinalText) {
          setLiveTranscript((prev) => {
            const cleanPrev = prev.trim();
            return cleanPrev ? `${cleanPrev}\n${newFinalText.trim()}` : newFinalText.trim();
          });
        }
        setInterimText(interim);
      };

      recognition.onerror = (e: any) => {
        // "no-speech" is a benign silence event in Chromium; recognition.onend will restart it cleanly
        if (e.error === "no-speech") return;

        // "aborted" happens during manual pause/stop or language switch; suppress alarm
        if (e.error === "aborted") return;

        if (e.error === "not-allowed" || e.error === "permission-denied") {
          setAudioError("Microphone permission denied. Please click the lock/settings icon in your browser URL bar and allow microphone access.");
        } else if (e.error === "network") {
          setAudioError("Google Speech Cloud timeout. Reconnecting automatically... (You can also type notes directly below).");
        } else {
          console.warn("Speech recognition notice:", e.error);
        }
      };

      recognition.onend = () => {
        // Continuous Listening Loop:
        // Chromium ends recognition after ~3-5 seconds of silence. If user is still recording,
        // we create and start a FRESH instance to avoid the "already started" DOMException.
        if (isRecordingRef.current && !isPausedRef.current) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isRecordingRef.current && !isPausedRef.current) {
              restartAttemptsRef.current += 1;
              if (restartAttemptsRef.current < 500) {
                startSpeechRecognitionSession();
              }
            }
          }, 150);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      restartAttemptsRef.current = 0;
    } catch (err: any) {
      console.warn("Failed to initialize SpeechRecognition instance:", err);
    }
  }, []);

  // Handle dynamic language switching while recording
  const handleLanguageChange = (newLang: string) => {
    setSpeechLanguage(newLang);
    speechLanguageRef.current = newLang;

    const langLabels: Record<string, string> = {
      "en-IN": "English (India)",
      "ta-IN": "Tamil (தமிழ்)",
      "hi-IN": "Hindi (हिन्दी)",
      "en-US": "English (US)",
    };

    setLanguageSwitchedNotice(`Voice model switched to ${langLabels[newLang] || newLang}`);
    setTimeout(() => setLanguageSwitchedNotice(null), 3000);

    // If actively recording, seamlessly restart speech recognition on the new language model
    if (isRecordingRef.current && !isPausedRef.current) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      setTimeout(() => {
        if (isRecordingRef.current && !isPausedRef.current) {
          startSpeechRecognitionSession();
        }
      }, 150);
    }
  };

  // Start Real Voice Recording & Speech Recognition
  const handleStart = async () => {
    if (!isConsentGranted) return;
    setAudioError(null);
    setLiveTranscript("");
    setInterimText("");
    setSeconds(0);
    setIsReviewMode(false);

    // 1. Start Web Audio API for Live Waveform Metering
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
      }

      isRecordingRef.current = true;
      isPausedRef.current = false;
      setIsRecording(true);
      setIsPaused(false);
      animFrameRef.current = requestAnimationFrame(updateVolumeMeter);
    } catch (err: any) {
      console.warn("Microphone access denied or unattached:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setAudioError("Microphone permission denied. Please allow microphone permissions in your browser URL bar.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setAudioError("No physical microphone device found. You can type notes or use clinical demo presets.");
      } else {
        setAudioError("Could not access microphone. You can type clinical notes or use the demo presets.");
      }
      isRecordingRef.current = true;
      isPausedRef.current = false;
      setIsRecording(true);
      setIsPaused(false);
    }

    // 2. Start Live Speech Recognition Session
    startSpeechRecognitionSession();
  };

  // Pause / Resume
  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      isPausedRef.current = false;
      animFrameRef.current = requestAnimationFrame(updateVolumeMeter);
      startSpeechRecognitionSession();
    } else {
      setIsPaused(true);
      isPausedRef.current = true;
      setMicVolume(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    }
  };

  // Stop Recording and Switch to Review / Edit Mode
  const handleStopRecordingOnly = () => {
    isRecordingRef.current = false;
    isPausedRef.current = false;
    setIsRecording(false);
    setIsPaused(false);
    setMicVolume(0);

    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    // Merge any pending interim text into final transcript
    if (interimText.trim()) {
      const sanitizedInterim = interimText.trim().replace(/[.,!?;:]+$/, "");
      setLiveTranscript((prev) => {
        const line = `${activeSpeaker}: ${sanitizedInterim}.`;
        return prev.trim() ? `${prev.trim()}\n${line}` : line;
      });
      setInterimText("");
    }

    setIsReviewMode(true);
  };

  // Final confirmation to send reviewed transcript to AI
  const handleProceedToAI = () => {
    let finalPayload = liveTranscript.trim();
    if (interimText.trim()) {
      const sanitizedInterim = interimText.trim().replace(/[.,!?;:]+$/, "");
      finalPayload = finalPayload
        ? `${finalPayload}\n${activeSpeaker}: ${sanitizedInterim}.`
        : `${activeSpeaker}: ${sanitizedInterim}.`;
    }

    if (!finalPayload) {
      setAudioError("No speech detected or typed. Please speak into the mic, type clinical dialogue in the box, or select a preset dialogue before proceeding.");
      return;
    }

    onFinishRecording(finalPayload, seconds || 120);
  };

  // Combined Stop & Process (One-Click)
  const handleQuickStopAndProcess = () => {
    handleStopRecordingOnly();
    // Allow React state to flush
    setTimeout(() => {
      let finalPayload = liveTranscript.trim();
      if (interimText.trim()) {
        const sanitizedInterim = interimText.trim().replace(/[.,!?;:]+$/, "");
        finalPayload = finalPayload
          ? `${finalPayload}\n${activeSpeaker}: ${sanitizedInterim}.`
          : `${activeSpeaker}: ${sanitizedInterim}.`;
      }

      if (!finalPayload) {
        setAudioError("No speech detected. Please speak into the mic, type notes, or select a demo dialogue.");
        return;
      }

      onFinishRecording(finalPayload, seconds || 120);
    }, 100);
  };

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      isPausedRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6 border-2 border-brand-oceanTeal/30">
      {/* Browser Speech API Compatibility Warning Banner */}
      {!speechSupported && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Live Speech Recognition is not supported by your current browser (Firefox / Safari).
            </p>
            <p className="text-[11px] text-amber-700">
              For real-time speech-to-text, please open ClinicScribe in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>. In the meantime, you can directly type or edit notes in the consultation box below, or upload an audio file.
            </p>
          </div>
        </div>
      )}

      {/* Waveform / Visualizer Canvas */}
      <div className="h-32 rounded-2xl bg-brand-evergreen flex flex-col justify-between p-4 relative overflow-hidden shadow-inner">
        {/* Animated Soundwave Bars Driven by Real Mic Frequency or Fallback Pulse */}
        <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md mx-auto my-auto">
          {Array.from({ length: 32 }).map((_, i) => {
            const isPlaying = isRecording && !isPaused;
            const baseHeights = [8, 18, 32, 14, 28, 10, 40, 22, 12, 36, 16, 26, 44, 20];
            const baseH = baseHeights[i % baseHeights.length];
            const dynamicH = isPlaying
              ? Math.max(6, Math.min(60, Math.round(baseH * (1 + micVolume / 35))))
              : 4;

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
                  : isReviewMode
                  ? "bg-emerald-400"
                  : "bg-white/40"
              }`}
            />
            <span className="text-[11px] font-mono text-white tracking-widest uppercase">
              {isRecording
                ? isPaused
                  ? "PAUSED"
                  : "LIVE LISTENING"
                : isReviewMode
                ? "RECORDING COMPLETE - REVIEW NOTES"
                : "STANDBY"}
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

      {/* Real-Time Live Speech-to-Text Transcript Display & Direct Editor */}
      <div className="p-4 rounded-2xl bg-white border border-brand-oceanTeal/30 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-brand-seafoam/20 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-evergreen flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-mint animate-pulse" />
              Live Consultation Dialogue Stream:
            </span>
            {speechSupported ? (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Speech-to-Text Active
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Manual Edit Mode
              </span>
            )}
          </div>

          {/* Active Speaker Switcher with Hotkey notice */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-brand-slate">Active Speaker:</span>
            <button
              type="button"
              onClick={() => setActiveSpeaker(activeSpeaker === "Doctor" ? "Patient" : "Doctor")}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                activeSpeaker === "Doctor"
                  ? "bg-brand-deepTeal text-white border-brand-deepTeal hover:bg-brand-evergreen"
                  : "bg-brand-oceanTeal text-white border-brand-oceanTeal hover:bg-brand-oceanTeal/80"
              }`}
              title="Click or press Ctrl+Space / Alt+S to toggle active speaker"
            >
              <User className="w-3 h-3" />
              {activeSpeaker} <span className="opacity-70 text-[10px]">(Ctrl+Space)</span>
            </button>
          </div>
        </div>

        {/* Editable Transcript Area */}
        <div className="relative">
          <textarea
            value={liveTranscript}
            onChange={(e) => setLiveTranscript(e.target.value)}
            placeholder="Live spoken dialogue will appear here in real-time as you speak... You can also type, correct, or paste consultation dialogue directly into this box."
            rows={5}
            className="w-full text-xs text-brand-evergreen font-mono leading-relaxed bg-brand-mist/20 p-3 rounded-xl border border-brand-oceanTeal/20 outline-none focus:ring-2 focus:ring-brand-deepTeal resize-y"
          />

          {/* Real-time Interim Streaming Bubble */}
          {interimText && (
            <div className="absolute bottom-3 left-3 right-3 p-1.5 px-3 rounded-lg bg-white/90 border border-brand-mint shadow-sm text-xs text-brand-deepTeal italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-mint animate-ping" />
              <span>
                <strong>{activeSpeaker}:</strong> {interimText}...
              </span>
            </div>
          )}
        </div>

        {/* Empty State Assistant Options */}
        {!liveTranscript && !interimText && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <p className="text-brand-slate italic text-[11px]">
              Speak clearly into your microphone in English, Tamil, or Hindi...
            </p>
            <button
              type="button"
              onClick={() => {
                const preset = PRESET_DIALOGUES[selectedPreset];
                setLiveTranscript(preset.text);
              }}
              className="text-[10px] text-brand-deepTeal bg-white hover:bg-brand-mist px-2.5 py-1 rounded-lg border border-brand-seafoam font-semibold self-start flex items-center gap-1 shadow-sm transition-colors"
            >
              <Sparkles className="w-3 h-3 text-brand-mint" />
              Insert Clinical Preset Dialogue
            </button>
          </div>
        )}

        {/* Transcript quick tools */}
        {liveTranscript && (
          <div className="flex items-center justify-between pt-1 text-[11px] text-brand-slate">
            <span>
              {liveTranscript.split("\n").filter((l) => l.trim().length > 0).length} dialogue lines &bull; {liveTranscript.length} characters
            </span>
            <button
              type="button"
              onClick={() => setLiveTranscript("")}
              className="text-rose-600 hover:text-rose-700 hover:underline font-medium"
            >
              Clear Transcript
            </button>
          </div>
        )}
      </div>

      {/* Language Switching & Voice Settings */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-brand-deepTeal shrink-0" />
          <span className="font-semibold text-brand-evergreen">Voice Recognition Mode:</span>
          <select
            value={speechLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-1.5 px-2.5 rounded-xl border border-brand-oceanTeal/30 bg-white text-xs text-brand-evergreen outline-none focus:ring-1 focus:ring-brand-deepTeal cursor-pointer"
          >
            <option value="en-IN">English (India - en-IN)</option>
            <option value="ta-IN">Tamil (தமிழ் - ta-IN)</option>
            <option value="hi-IN">Hindi (हिन्दी - hi-IN)</option>
            <option value="en-US">English (US - en-US)</option>
          </select>

          {languageSwitchedNotice && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-fade-in">
              {languageSwitchedNotice}
            </span>
          )}
        </div>

        {audioError && (
          <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{audioError}</span>
          </div>
        )}
      </div>

      {/* Preset Dialogue Selector for Instant Live Testing */}
      <div className="p-3.5 rounded-2xl bg-brand-mist/50 border border-brand-seafoam/50 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-brand-evergreen flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            Multilingual Audio Demonstration Presets:
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
              onClick={() => {
                setSelectedPreset(key);
                if (!isRecording && !liveTranscript) {
                  setLiveTranscript(PRESET_DIALOGUES[key].text);
                }
              }}
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
        <div className="flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <>
              <GlassButton
                type="button"
                variant="primary"
                size="lg"
                onClick={handleStart}
                disabled={!isConsentGranted || disabled}
                className="gap-2 shadow-md bg-brand-deepTeal text-white hover:bg-brand-evergreen"
              >
                <Mic className="w-4 h-4" />
                {isReviewMode ? "Record Again" : "Start Voice Recording"}
              </GlassButton>

              {/* In Review Mode or if Transcript has text, show button to Proceed to AI */}
              {(isReviewMode || liveTranscript.trim().length > 0) && (
                <GlassButton
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleProceedToAI}
                  disabled={!isConsentGranted || disabled}
                  className="gap-2 shadow-md bg-brand-evergreen text-white hover:bg-brand-deepTeal"
                >
                  <Sparkles className="w-4 h-4 text-brand-mint" />
                  Generate AI Clinical Notes
                  <ArrowRight className="w-4 h-4" />
                </GlassButton>
              )}
            </>
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
                variant="outline"
                size="md"
                onClick={handleStopRecordingOnly}
                className="border-brand-oceanTeal text-brand-evergreen hover:bg-brand-mist"
              >
                <Square className="w-4 h-4 text-brand-slate" />
                Stop & Review Notes
              </GlassButton>

              <GlassButton
                type="button"
                variant="secondary"
                size="md"
                onClick={handleQuickStopAndProcess}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Sparkles className="w-4 h-4" />
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
                  setLiveTranscript(preset.text);
                  setIsReviewMode(true);
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
