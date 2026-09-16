"use client";
import React, { useState } from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import TrackSelector from "@/components/roadmap/TrackSelector";
import PillarAccordion from "@/components/roadmap/PillarAccordion";
import { 
  Sparkles, 
  Wand2, 
  X, 
  RefreshCw,
  BookOpen,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

export default function RoadmapPage() {
  const { 
    activeTrackId, 
    setActiveTrackId, 
    completedModules, 
    readinessPercentage,
    completedInTrack,
    totalTrackModules,
    currentTrack
  } = useProgress();

  const { lang, tObj } = useLanguage();

  const [tracks] = useState(ROADMAP_TRACKS);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  const displayTrack = generatedRoadmap || currentTrack || tracks.beginner || Object.values(tracks)[0];
  const trackName = tObj(displayTrack.name) || displayTrack.name || displayTrack.trackName;
  const trackTagline = tObj(displayTrack.tagline) || displayTrack.tagline;

  const handleGenerateAiRoadmap = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, weeks: 4, lang }),
      });
      const data = await res.json();
      if (data.success && data.roadmap) {
        setGeneratedRoadmap(data.roadmap);
        setIsAiModalOpen(false);
      }
    } catch (err) {
      console.error("AI Roadmap generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickTopics = lang === "hi" 
    ? ["स्कूल में शिक्षक से बातचीत (PTM)", "बैंक और डाकघर में अंग्रेजी", "डॉक्टर से बीमारी समझाना", "दैनिक घरेलू बातचीत"]
    : ["Parent-Teacher Meetings", "Bank & Post Office English", "Doctor Consultations", "Daily Home English"];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header with Bilingual Title, Badge, & AI Generator Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200">
              {displayTrack.badge || "A1 Level"}
            </span>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {completedInTrack} / {totalTrackModules} {lang === "hi" ? "पाठ पूर्ण" : "Lessons Done"}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {readinessPercentage}% {lang === "hi" ? "प्रगति" : "Progress"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {trackName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {trackTagline}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>{lang === "hi" ? "कस्टम AI रोडमैप बनाएं" : "Generate Custom AI Roadmap"}</span>
          </button>

          {generatedRoadmap && (
            <button
              onClick={() => setGeneratedRoadmap(null)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              {lang === "hi" ? "मानक ट्रैक पर लौटें" : "Reset to Standard Track"}
            </button>
          )}
        </div>
      </div>

      {/* Track Selector (Beginner / Conversational / Advanced) */}
      {!generatedRoadmap && (
        <TrackSelector
          activeTrackId={activeTrackId}
          onSelectTrack={setActiveTrackId}
        />
      )}

      {/* Bilingual Accordion of Pillars & Modules with Integrated YouTube Player */}
      <PillarAccordion />

      {/* AI Custom Roadmap Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    {lang === "hi" ? "कस्टम AI रोडमैप बनाएं" : "Generate Custom AI Roadmap"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === "hi" ? "सखी AI और Claude द्वारा संचालित" : "Powered by Sakhi AI & Claude"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiRoadmap} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono uppercase">
                  {lang === "hi" ? "आप क्या सीखना चाहते हैं? (Topic)" : "What do you want to learn?"}
                </label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder={lang === "hi" ? "जैसे: बच्चों के स्कूल में अंग्रेजी बोलना, डॉक्टर से बात करना..." : "e.g. Speaking with children's teachers, Bank conversations..."}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="text-slate-400 font-mono">
                  {lang === "hi" ? "सुझाव:" : "Ideas:"}
                </span>
                {quickTopics.map((idea, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAiTopic(idea)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !aiTopic.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>{lang === "hi" ? "रोडमैप तैयार हो रहा है..." : "Generating Roadmap..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === "hi" ? "रोडमैप बनाएं" : "Create Roadmap"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}