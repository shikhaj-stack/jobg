"use client";
import React, { useState } from "react";
import { Search, Sparkles, Wand2, RefreshCw, ArrowRight, BookOpen, Code2, MessageCircle, TrendingUp, Cpu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function UniversalLearningSearch({ onRoadmapGenerated, isGenerating: externalLoading }) {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");

  const isGenerating = externalLoading || internalLoading;

  const quickPills = [
    { label: "DSA (C++ / Java / Python)", icon: Code2, query: "Data Structures & Algorithms (DSA)" },
    { label: lang === "hi" ? "अंग्रेजी बोलना (English Speaking)" : "English Speaking for Beginners", icon: MessageCircle, query: "Conversational English Speaking" },
    { label: "Full Stack Web Development", icon: BookOpen, query: "Full Stack Web Development" },
    { label: "Machine Learning & AI", icon: Cpu, query: "Machine Learning and AI" },
    { label: lang === "hi" ? "शेयर बाज़ार और फाइनेंस" : "Personal Finance & Stock Market", icon: TrendingUp, query: "Stock Market and Personal Finance" }
  ];

  const handleSearch = async (searchTopic) => {
    const topicToSearch = (searchTopic || query).trim();
    if (!topicToSearch || isGenerating) return;

    setInternalLoading(true);
    setLoadingPhase(lang === "hi" ? "विषय का विश्लेषण हो रहा है..." : "Analyzing learning topic...");

    try {
      setTimeout(() => {
        setLoadingPhase(lang === "hi" ? "लेवल 1 से 4 का वर्कफ़्लो बन रहा है..." : "Building Level 1 to 4 progression...");
      }, 1200);

      setTimeout(() => {
        setLoadingPhase(lang === "hi" ? "यूट्यूब वीडियो प्लेलिस्ट जोड़ी जा रही है..." : "Curating YouTube lecture playlists...");
      }, 2400);

      const res = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToSearch, lang }),
      });
      const data = await res.json();
      if (data.success && data.roadmap) {
        if (onRoadmapGenerated) {
          onRoadmapGenerated(data.roadmap, topicToSearch);
        }
      }
    } catch (err) {
      console.error("Universal search error:", err);
    } finally {
      setInternalLoading(false);
      setLoadingPhase("");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-blue-500/15 p-1 sm:p-1.5 shadow-xl">
      <div className="w-full rounded-[22px] bg-white p-5 md:p-7 shadow-xs space-y-4">
        {/* Title / Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 tracking-tight">
                {lang === "hi" ? "आप आज क्या सीखना चाहते हैं?" : "What do you want to learn today?"}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === "hi" 
                  ? "कोई भी विषय लिखें (जैसे DSA, अंग्रेजी, कोडिंग, फाइनेंस) — AI पूरा वर्कफ़्लो + वीडियो प्लेलिस्ट बनाएगा" 
                  : "Type any skill (DSA, English, Web Dev, Finance) — AI creates step-by-step workflow & playlists"}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 self-start sm:self-center border border-amber-200">
            {lang === "hi" ? "ChatGPT से बेहतर: वर्कफ़्लो + वीडियो" : "Beyond ChatGPT: Workflow + Playlists"}
          </span>
        </div>

        {/* Floating Input Box */}
        <form onSubmit={onSubmit} className="relative flex items-center">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isGenerating}
              placeholder={lang === "hi" ? "जैसे: DSA in C++, English speaking from scratch, Machine Learning, Stock Market..." : "e.g. Master DSA in C++, English conversation for parents, Full Stack Web Dev..."}
              className="w-full pl-12 pr-32 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:shadow-md transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !query.trim()}
            className="absolute right-2 sm:right-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span className="hidden sm:inline">{lang === "hi" ? "तैयार हो रहा है..." : "Generating..."}</span>
              </>
            ) : (
              <>
                <span>{lang === "hi" ? "रोडमैप बनाएं" : "Generate"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </>
            )}
          </button>
        </form>

        {/* Live Loading Phase Feedback */}
        {isGenerating && loadingPhase && (
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>{loadingPhase}</span>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase shrink-0">
            {lang === "hi" ? "लोकप्रिय:" : "Popular:"}
          </span>
          {quickPills.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <button
                key={idx}
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setQuery(pill.query);
                  handleSearch(pill.query);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 hover:text-amber-950 text-slate-700 font-medium text-xs whitespace-nowrap border border-slate-200/70 transition-all shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}