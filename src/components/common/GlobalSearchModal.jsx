"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, Video, ExternalLink, Sparkles, Code2, AlertTriangle, Play, ChevronRight, Copy, Check, Compass } from "lucide-react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { LIVE_STREAMS } from "@/data/streamData";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [mode, setMode] = useState("all"); // 'all' | 'ai'
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        if (activeVideoId) {
          setActiveVideoId(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, activeVideoId]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setAiResult(null);
      setActiveVideoId(null);
      setMode("all");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allModules = Object.entries(ROADMAP_TRACKS).flatMap(([trackKey, track]) =>
    track.pillars.flatMap((pillar) =>
      pillar.modules.map((m) => ({
        ...m,
        trackName: track.name,
        trackKey,
        pillarTitle: pillar.title,
        type: "module",
      }))
    )
  );

  const filteredModules = query.trim()
    ? allModules.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.summary.toLowerCase().includes(query.toLowerCase()) ||
          m.topics.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : allModules.slice(0, 4);

  const filteredStreams = query.trim()
    ? LIVE_STREAMS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.channel.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      )
    : LIVE_STREAMS.slice(0, 2);

  const handleAiSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsAiLoading(true);
    setMode("ai");
    setActiveVideoId(null);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      }
    } catch (err) {
      console.error("AI Search failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeyDownInput = (e) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      handleAiSearch(query);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 md:pt-14 px-4 bg-slate-950/75 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search problems, FAANG concepts, system design, or freestyle topics..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (mode === "ai" && !e.target.value.trim()) {
                setMode("all");
                setAiResult(null);
              }
            }}
            onKeyDown={handleKeyDownInput}
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base font-sans outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setAiResult(null);
                setMode("all");
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Mode Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-amber-50/50 border-b border-amber-100 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-800 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              AI Problem Solver & Multi-LLM Engine
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500 font-medium hidden sm:inline">OpenAI / Claude / Neural Gateway</span>
          </div>

          {query.trim() && (
            <button
              onClick={() => handleAiSearch(query)}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLoading ? "Synthesizing..." : "Ask AI: Solve & Fetch Videos ⏎"}</span>
            </button>
          )}
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Active Inline Video Player */}
          {activeVideoId && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 animate-fade-in-up border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-red-400" />
                  Embedded Video Lecture
                </span>
                <button
                  onClick={() => setActiveVideoId(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                >
                  Close Player ✕
                </button>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                  title="YouTube video lecture player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          )}

          {/* AI Synthesis Loading Skeleton */}
          {isAiLoading && (
            <div className="p-6 rounded-3xl bg-amber-50/40 border border-amber-200/80 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-amber-200/60 rounded-lg"></div>
                <div className="h-5 w-24 bg-amber-200/60 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
              </div>
              <div className="h-24 w-full bg-slate-900/10 rounded-2xl"></div>
              <p className="text-xs text-amber-800 font-mono text-center">
                ✨ OpenAI / Claude LLM analyzing problem invariants, optimal time/space bounds, and fetching curated video lectures...
              </p>
            </div>
          )}

          {/* AI Result Card */}
          {aiResult?.result && !isAiLoading && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">
                        {aiResult.result.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {aiResult.result.category} • Engine: {aiResult.result.provider || "LLM Gateway"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Time: {aiResult.result.timeComplexity}
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Space: {aiResult.result.spaceComplexity}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {aiResult.result.difficulty}
                    </span>
                  </div>
                </div>

                {/* Mental Model / Intuition */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Core Intuition & FAANG Mental Model
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {aiResult.result.intuition}
                  </p>
                </div>

                {/* Algorithmic Phases */}
                {aiResult.result.algorithmSteps && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Execution Strategy
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {aiResult.result.algorithmSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                          <span className="font-mono text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Blueprint */}
                {aiResult.result.codeSnippet && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-amber-400" />
                        Optimal Blueprint
                      </span>
                      <button
                        onClick={() => handleCopyCode(aiResult.result.codeSnippet)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? "Copied" : "Copy Pattern"}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-2xl bg-black/80 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
                      {aiResult.result.codeSnippet}
                    </pre>
                  </div>
                )}

                {/* FAANG Pitfalls */}
                {aiResult.result.faangTrap && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-red-300">FAANG Failure Trap to Avoid:</span>
                      <span>{aiResult.result.faangTrap}</span>
                    </div>
                  </div>
                )}

                {/* Action Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/roadmap`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Generate Custom Multi-Week Roadmap</span>
                  </button>

                  <button
                    onClick={() => setMode("all")}
                    className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
                  >
                    ← View All Curriculum & Streams
                  </button>
                </div>
              </div>

              {/* Verified Video Lectures Section */}
              {aiResult.videos && aiResult.videos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>Curated Video Lectures & Deep Dives ({aiResult.videos.length})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Verified Playback</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aiResult.videos.map((vid, idx) => (
                      <div
                        key={idx}
                        className="group p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-2.5"
                      >
                        <div className="relative aspect-video w-full rounded-xl bg-slate-900 overflow-hidden border border-slate-100">
                          <img
                            src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => setActiveVideoId(vid.videoId)}
                            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                            aria-label="Play Video"
                          >
                            <Play className="w-4 h-4 fill-white translate-x-0.5" />
                          </button>
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-amber-800 transition-colors">
                            {vid.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-1">
                            {vid.channel}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => setActiveVideoId(vid.videoId)}
                            className="flex-1 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center transition-colors"
                          >
                            Watch Inside Chamber
                          </button>
                          <a
                            href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Open on YouTube"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standard Curriculum & Streams (When not in full AI view) */}
          {(mode === "all" || !aiResult) && !isAiLoading && (
            <div className="space-y-6">
              
              {/* AI Quick Suggestion Banner */}
              {query.trim() && (
                <button
                  onClick={() => handleAiSearch(query)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 hover:border-amber-400 transition-all text-left group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-amber-900">
                        Ask AI Copilot: Solve "{query}"
                      </p>
                      <p className="text-xs text-slate-500">
                        Synthesize FAANG mental models, $O(N)$ bounds, blueprint code & verified lectures.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Modules */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Curriculum Modules ({filteredModules.length})</span>
                </div>
                <div className="space-y-2">
                  {filteredModules.map((item) => (
                    <Link
                      key={item.id}
                      href="/roadmap"
                      onClick={onClose}
                      className="flex items-start justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">{item.summary}</p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.trackName} • {item.pillarTitle}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2 mt-1" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Live Streams */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
                  <Video className="w-3.5 h-3.5 text-amber-600" />
                  <span>Live Tech Theater ({filteredStreams.length})</span>
                </div>
                <div className="space-y-2">
                  {filteredStreams.map((stream) => (
                    <Link
                      key={stream.id}
                      href="/live"
                      onClick={onClose}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                            {stream.title}
                          </span>
                          {stream.isLive && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {stream.channel} • {stream.category} • {stream.duration}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium shrink-0">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> to close</span>
            <span>•</span>
            <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">Enter ⏎</kbd> for AI Solver</span>
          </div>
          <span className="text-amber-700 font-bold">KUCHNAYA Multi-LLM Search Enabled</span>
        </div>

      </div>
    </div>
  );
}
