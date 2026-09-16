"use client";
import React, { useState, useEffect } from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { useProgress } from "@/hooks/useProgress";
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Play, 
  Clock, 
  HelpCircle, 
  TrendingUp, 
  ChevronRight, 
  Wand2, 
  X, 
  Send, 
  RefreshCw,
  Video,
  ExternalLink
} from "lucide-react";

export default function RoadmapPage() {
  const { 
    activeTrackId, 
    setActiveTrackId, 
    completedModules, 
    toggleModuleCompletion,
    readinessPercentage,
    completedInTrack,
    totalTrackModules
  } = useProgress();

  const [tracks, setTracks] = useState(ROADMAP_TRACKS);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  const currentTrack = generatedRoadmap || tracks[activeTrackId] || tracks.kuchnaya || Object.values(tracks)[0];

  const handleGenerateAiRoadmap = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, weeks: 8 }),
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

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header with AI Generator Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {currentTrack.badge || "Tier-1 Curriculum"}
            </span>
            <span className="text-xs text-slate-500 font-mono">{totalTrackModules} Modules Required</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {currentTrack.name || currentTrack.trackName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            {currentTrack.tagline}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Custom AI Roadmap</span>
          </button>

          {generatedRoadmap && (
            <button
              onClick={() => setGeneratedRoadmap(null)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Reset to Standard Track
            </button>
          )}
        </div>
      </div>

      {/* Track Selector Tabs (if not viewing custom AI roadmap) */}
      {!generatedRoadmap && (
        <div className={`grid gap-3 ${Object.keys(tracks).length === 1 ? "grid-cols-1 max-w-xl" : "grid-cols-1 sm:grid-cols-3"}`}>
          {Object.entries(tracks).map(([key, track]) => (
            <button
              key={key}
              onClick={() => setActiveTrackId(key)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                activeTrackId === key
                  ? "bg-white border-amber-400 shadow-md ring-2 ring-amber-400/20"
                  : "bg-stone-50 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-slate-900 text-sm">{track.name}</span>
                {activeTrackId === key && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{track.tagline}</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                <span>{track.stats?.totalModules || 16} Modules</span>
                <span>•</span>
                <span>{track.stats?.estimatedWeeks || 12} Weeks</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active Roadmap Pillars & Module Grid */}
      <div className="space-y-8">
        {currentTrack.pillars?.map((pillar) => (
          <div key={pillar.id} className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    Pillar {pillar.number}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase font-mono">{pillar.subtitle}</span>
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">{pillar.title}</h3>
                <p className="text-xs text-slate-500">{pillar.description}</p>
              </div>
            </div>

            {/* Modules List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillar.modules?.map((m) => {
                const isCompleted = completedModules.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isCompleted
                        ? "bg-emerald-50/50 border-emerald-200 shadow-xs"
                        : "bg-stone-50 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-serif font-bold text-slate-900 text-sm leading-snug">{m.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            m.difficulty === "Hard"
                              ? "bg-red-100 text-red-800"
                              : m.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {m.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{m.summary}</p>

                      {/* Invariant Topic Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.topics?.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-600 font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions: Complete Toggle + Watch Curated Video */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {m.estHours}h Prep
                        </span>

                        {m.videoId && (
                          <button
                            onClick={() => setActiveVideoModal(m)}
                            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                          >
                            <Play className="w-3 h-3 fill-amber-700" />
                            <span>Watch Lecture</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => toggleModuleCompletion(m.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCompleted
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                        <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl space-y-4 p-4 md:p-6 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Curated Architecture Lecture</span>
                <h3 className="font-serif font-bold text-base text-slate-100">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <p>{activeVideoModal.summary}</p>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoModal.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:underline shrink-0 ml-4 font-bold"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AI Custom Roadmap Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Generate Custom AI Roadmap</h3>
                  <p className="text-xs text-slate-500">Powered by Anthropic Claude</p>
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
                  Target Technical Topic / Specialization
                </label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Distributed Consensus in Go, Zero Knowledge Proofs, Cloud Microservices..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="text-slate-400 font-mono">Quick ideas:</span>
                {["Kubernetes & DevOps", "DeFi Flash Loans", "LLM Inference at Scale", "Golang Concurrency"].map((idea, i) => (
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !aiTopic.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Generating with Claude...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generate Roadmap & Lectures</span>
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
