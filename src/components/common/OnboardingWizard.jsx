"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useProgress } from "@/hooks/useProgress";
import { 
  Languages, 
  Sparkles, 
  Mic, 
  User, 
  ArrowRight, 
  Check, 
  X,
  Volume2
} from "lucide-react";

export default function OnboardingWizard() {
  const { lang, setLang } = useLanguage();
  const { setActiveTrackId } = useProgress();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState("hi");
  const [selectedTrack, setSelectedTrack] = useState("beginner");
  const [userName, setUserName] = useState("");
  const [micState, setMicState] = useState("prompt"); // "prompt" | "granted" | "denied"

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("jobg_onboarding_completed");
      if (!completed) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleLangChoice = (l) => {
    setSelectedLang(l);
    setLang(l);
  };

  const handleRequestMic = async () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setMicState("granted");
      } catch (err) {
        setMicState("denied");
      }
    } else {
      setMicState("denied");
    }
  };

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jobg_onboarding_completed", "true");
      if (userName.trim()) {
        localStorage.setItem("jobg_user_name", userName.trim());
      }
    }
    setActiveTrackId(selectedTrack);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? "w-8 bg-amber-500" : s < step ? "w-4 bg-emerald-500" : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Language Preference */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200">
                <Languages className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  आप किस भाषा में सीखना चाहते हैं?
                </h3>
                <p className="text-xs text-slate-500">
                  Which language do you prefer to learn in?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleLangChoice("hi")}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  selectedLang === "hi"
                    ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs"
                    : "bg-stone-50 border-slate-200 hover:bg-white"
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">हिन्दी + अंग्रेजी (Hinglish)</div>
                  <div className="text-xs text-slate-500">हिंदी में समझें, अंग्रेजी में बोलना सीखें (अनुशंसित)</div>
                </div>
                {selectedLang === "hi" && <Check className="w-5 h-5 text-amber-700" />}
              </button>

              <button
                type="button"
                onClick={() => handleLangChoice("en")}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  selectedLang === "en"
                    ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs"
                    : "bg-stone-50 border-slate-200 hover:bg-white"
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">English</div>
                  <div className="text-xs text-slate-500">Learn purely in English with video lectures</div>
                </div>
                {selectedLang === "en" && <Check className="w-5 h-5 text-amber-700" />}
              </button>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>{selectedLang === "hi" ? "आगे बढ़ें" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: English Level */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {selectedLang === "hi" ? "आपका अंग्रेजी स्तर क्या है?" : "What is your English level?"}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLang === "hi" ? "कोई भी स्तर चुनें, आप कभी भी बदल सकते हैं" : "Choose a starting point; you can switch anytime"}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  id: "beginner",
                  badge: "A1 Level",
                  title: selectedLang === "hi" ? "शुरुआती (Beginner)" : "Beginner",
                  desc: selectedLang === "hi" ? "वर्णमाला, बुनियादी शब्द और छोटे-छोटे वाक्य सीखना है।" : "Alphabet, phonics & basic everyday words."
                },
                {
                  id: "conversational",
                  badge: "A2–B1 Level",
                  title: selectedLang === "hi" ? "बातचीत (Conversational)" : "Conversational",
                  desc: selectedLang === "hi" ? "थोड़ी अंग्रेजी आती है, बिना झिझक रोज़ाना बोलना सीखना है।" : "Daily phrases, tenses & speaking with confidence."
                },
                {
                  id: "advanced",
                  badge: "B2–C1 Level",
                  title: selectedLang === "hi" ? "उन्नत (Advanced)" : "Advanced",
                  desc: selectedLang === "hi" ? "व्याकरण में महारत, व्यावसायिक अंग्रेजी और साक्षात्कार।" : "Grammar mastery, workplace communication & fluency."
                }
              ].map((trk) => (
                <button
                  key={trk.id}
                  type="button"
                  onClick={() => setSelectedTrack(trk.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    selectedTrack === trk.id
                      ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs"
                      : "bg-stone-50 border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{trk.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                        {trk.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{trk.desc}</p>
                  </div>
                  {selectedTrack === trk.id && <Check className="w-5 h-5 text-amber-700 shrink-0 mt-1" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                {selectedLang === "hi" ? "पीछे जाएं" : "Back"}
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>{selectedLang === "hi" ? "आगे बढ़ें" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Voice Assistant Sakhi Intro */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {selectedLang === "hi" ? "सखी AI वॉयस ट्यूटर से मिलें" : "Meet Sakhi — AI Voice Tutor"}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLang === "hi" ? "हिंदी या अंग्रेजी में बोलें, सखी हमेशा धैर्य से सिखाएगी" : "Speak in Hindi or English; Sakhi patiently helps you practice"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>{selectedLang === "hi" ? "सखी का स्वागत संदेश:" : "Sakhi greeting:"}</span>
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                &ldquo;नमस्ते! मैं सखी हूँ। आप मुझसे हिंदी, अंग्रेजी या हिंग्लिश में कुछ भी पूछ सकते हैं — जैसे किसी शब्द का अर्थ, सही उच्चारण या वाक्य बनाना!&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-stone-50 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {selectedLang === "hi" ? "माइक की अनुमति दें" : "Microphone Permission"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {micState === "granted"
                    ? (selectedLang === "hi" ? "माइक सक्रिय है ✓" : "Microphone active ✓")
                    : (selectedLang === "hi" ? "बोलकर सीखने के लिए ज़रूरी" : "Required for voice conversation")}
                </div>
              </div>

              {micState === "granted" ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedLang === "hi" ? "सक्षम" : "Granted"}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestMic}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-2xs"
                >
                  {selectedLang === "hi" ? "अनुमति दें" : "Allow Mic"}
                </button>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                {selectedLang === "hi" ? "पीछे जाएं" : "Back"}
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>{selectedLang === "hi" ? "आगे बढ़ें" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Personal Greeting */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {selectedLang === "hi" ? "आपका नाम क्या है?" : "What is your name?"}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLang === "hi" ? "ताकि सखी आपको नाम से पुकार सके" : "So Sakhi can greet you personally"}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                {selectedLang === "hi" ? "आपका नाम" : "Your Name"}
              </label>
              <input
                type="text"
                placeholder={selectedLang === "hi" ? "जैसे: राजेश शर्मा / सीमा" : "e.g. Rajesh Kumar"}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-amber-400 text-slate-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
              <Check className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                {selectedLang === "hi" 
                  ? "सब तैयार है! आपका व्यक्तिगत रोडमैप और शब्दावली तिजोरी तैयार हैं।" 
                  : "All set! Your customized roadmap and vocabulary vault are ready."}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                {selectedLang === "hi" ? "पीछे जाएं" : "Back"}
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <span>{selectedLang === "hi" ? "सीखना शुरू करें 🚀" : "Start Learning 🚀"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}