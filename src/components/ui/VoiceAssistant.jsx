"use client";
import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

const STATE = {
  IDLE:       "idle",
  LISTENING:  "listening",
  PROCESSING: "processing",
  SPEAKING:   "speaking",
  ERROR:      "error",
};

export default function VoiceAssistant() {
  const { t, lang } = useLanguage();
  const [status, setStatus]       = useState(STATE.IDLE);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply]         = useState(null);
  const [expanded, setExpanded]   = useState(false);
  const [errorMsg, setErrorMsg]   = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const audioRef         = useRef(null);

  // ── Start recording ─────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    setErrorMsg("");
    setReply(null);
    setTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus(STATE.LISTENING);
    } catch {
      setStatus(STATE.ERROR);
      setErrorMsg(t("voice.no_mic"));
    }
  }, [lang, t]);

  // ── Stop recording ──────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setStatus(STATE.PROCESSING);
    }
  }, []);

  // ── Send audio to /api/voice ────────────────────────────────────────────
  const processAudio = useCallback(async (blob) => {
    setStatus(STATE.PROCESSING);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("lang", lang);

      const res  = await fetch("/api/voice", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setTranscript(data.transcript || "");
      setReply(data.reply);
      setExpanded(true);

      // Play audio response if available
      if (data.audioBase64) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
          { type: "audio/mp3" }
        );
        const url = URL.createObjectURL(audioBlob);
        setStatus(STATE.SPEAKING);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.onended = () => {
            setStatus(STATE.IDLE);
            URL.revokeObjectURL(url);
          };
          audioRef.current.play();
        }
      } else {
        setStatus(STATE.IDLE);
      }
    } catch (err) {
      console.error("[VoiceAssistant]", err);
      setStatus(STATE.ERROR);
      setErrorMsg(t("voice.error"));
    }
  }, [lang, t]);

  // ── Toggle mic ──────────────────────────────────────────────────────────
  const handleMic = useCallback(() => {
    if (status === STATE.LISTENING) {
      stopListening();
    } else if (status === STATE.IDLE || status === STATE.ERROR) {
      startListening();
    }
  }, [status, startListening, stopListening]);

  // ── Mic button colors ───────────────────────────────────────────────────
  const micColors = {
    [STATE.IDLE]:       "bg-family-accent hover:bg-orange-500 animate-mic-pulse",
    [STATE.LISTENING]:  "bg-red-500 hover:bg-red-600 animate-pulse",
    [STATE.PROCESSING]: "bg-family-primary cursor-wait",
    [STATE.SPEAKING]:   "bg-emerald-500 cursor-default",
    [STATE.ERROR]:      "bg-red-500 hover:bg-red-600",
  };

  const statusLabel = {
    [STATE.IDLE]:       t("voice.tap"),
    [STATE.LISTENING]:  t("voice.listening"),
    [STATE.PROCESSING]: t("voice.thinking"),
    [STATE.SPEAKING]:   t("voice.speaking"),
    [STATE.ERROR]:      errorMsg || t("voice.error"),
  };

  return (
    <>
      {/* Hidden audio player */}
      <audio ref={audioRef} className="hidden" />

      {/* Floating container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Reply bubble */}
        {expanded && reply && (
          <div className="w-72 rounded-2xl bg-slate-800 border border-white/10 shadow-2xl p-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-family-accent flex items-center justify-center text-white text-xs font-bold">S</div>
                <span className="text-white text-sm font-semibold">Sakhi</span>
              </div>
              <button onClick={() => setExpanded(false)} className="text-white/40 hover:text-white text-xs">✕</button>
            </div>

            {/* You said */}
            {transcript && (
              <div className="mb-3 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white/40 text-xs mb-1">{t("voice.you_said")}</div>
                <div className="text-white/80 text-sm">{transcript}</div>
              </div>
            )}

            {/* Sakhi reply */}
            <div className="text-white/40 text-xs mb-1">{t("voice.sakhi_said")}</div>
            {lang === "hi" ? (
              <p className="text-white text-sm leading-relaxed font-hindi">{reply.hi}</p>
            ) : (
              <p className="text-white text-sm leading-relaxed">{reply.en}</p>
            )}
          </div>
        )}

        {/* Status label */}
        <div className="px-3 py-1 rounded-full bg-slate-800/80 text-white/60 text-xs border border-white/10 backdrop-blur">
          {status === STATE.LISTENING
            ? <span className="flex items-center gap-2">
                <span className="wave-bars"><span/><span/><span/><span/><span/></span>
                {statusLabel[status]}
              </span>
            : statusLabel[status]
          }
        </div>

        {/* Mic button */}
        <button
          id="voice-assistant-mic-btn"
          onClick={handleMic}
          disabled={status === STATE.PROCESSING || status === STATE.SPEAKING}
          aria-label={statusLabel[status]}
          className={`w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center text-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${micColors[status]}`}
        >
          {status === STATE.PROCESSING ? (
            <svg className="w-7 h-7 animate-spin-slow" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
          ) : status === STATE.SPEAKING ? (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          ) : status === STATE.LISTENING ? (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <rect x="9" y="3" width="6" height="10" rx="3"/>
              <path d="M5 10a7 7 0 0014 0h-2a5 5 0 01-10 0H5zm7 10v-2"/>
            </svg>
          ) : (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4z"/>
              <path d="M19 10a7 7 0 01-14 0H3a9 9 0 008 8.94V21h2v-2.06A9 9 0 0021 10h-2z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}