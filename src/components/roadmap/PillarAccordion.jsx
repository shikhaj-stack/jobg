"use client";
import React, { useState } from "react";
import { 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Play, 
  BookOpen, 
  Clock,
  Search,
  Filter,
  X,
  ExternalLink,
  Sparkles,
  Volume2
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import YouTubePlayer from "@/components/ui/YouTubePlayer";

export default function PillarAccordion() {
  const { currentTrack, completedModules, toggleModuleCompletion } = useProgress();
  const { lang, tObj, t } = useLanguage();

  const [openPillars, setOpenPillars] = useState([
    "pillar-alphabet", "pillar-vocabulary", "pillar-tenses", "pillar-grammar"
  ]);
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [videoLang, setVideoLang] = useState(lang || "hi");

  const togglePillar = (pillarId) => {
    setOpenPillars((prev) =>
      prev.includes(pillarId) ? prev.filter((id) => id !== pillarId) : [...prev, pillarId]
    );
  };

  const handleOpenVideo = (module) => {
    setActiveVideoModal(module);
    setVideoLang(lang === "en" ? "en" : "hi");
  };

  if (!currentTrack || !currentTrack.pillars) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-500 font-medium">
          {lang === "hi" ? "कोई रोडमैप डेटा उपलब्ध नहीं है।" : "No roadmap data available."}
        </p>
      </div>
    );
  }

  const difficultyOptions = [
    { key: "ALL", label: lang === "hi" ? "सभी" : "All" },
    { key: "Easy", label: lang === "hi" ? "आसान (Easy)" : "Easy" },
    { key: "Medium", label: lang === "hi" ? "मध्यम (Medium)" : "Medium" },
    { key: "Hard", label: lang === "hi" ? "मुश्किल (Hard)" : "Hard" },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Difficulty Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === "hi" ? "पाठ या विषय खोजें (Search topics)..." : "Search lessons or topics..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-400 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase font-mono mr-1 shrink-0">
            {lang === "hi" ? "स्तर:" : "Level:"}
          </span>
          {difficultyOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setDifficultyFilter(opt.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                difficultyFilter === opt.key
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pillars List */}
      <div className="space-y-5">
        {currentTrack.pillars.map((pillar) => {
          const isOpen = openPillars.includes(pillar.id);
          const pillarCompletedCount = pillar.modules.filter((m) =>
            completedModules.includes(m.id)
          ).length;
          const pillarProgressPct = pillar.modules.length > 0
            ? Math.round((pillarCompletedCount / pillar.modules.length) * 100)
            : 0;

          const visibleModules = pillar.modules.filter((m) => {
            const matchesDifficulty = difficultyFilter === "ALL" || m.difficulty === difficultyFilter;
            const term = searchTerm.toLowerCase().trim();
            if (!term) return matchesDifficulty;

            const titleEn = (m.title?.en || (typeof m.title === "string" ? m.title : "")).toLowerCase();
            const titleHi = (m.title?.hi || "").toLowerCase();
            const sumEn = (m.summary?.en || (typeof m.summary === "string" ? m.summary : "")).toLowerCase();
            const sumHi = (m.summary?.hi || "").toLowerCase();
            const topicsMatch = m.topics?.some((t) => {
              const tEn = (typeof t === "object" ? t.en : t || "").toLowerCase();
              const tHi = (typeof t === "object" ? t.hi : "").toLowerCase();
              return tEn.includes(term) || tHi.includes(term);
            });

            return matchesDifficulty && (titleEn.includes(term) || titleHi.includes(term) || sumEn.includes(term) || sumHi.includes(term) || topicsMatch);
          });

          if (visibleModules.length === 0 && (searchTerm || difficultyFilter !== "ALL")) {
            return null;
          }

          const pillarTitle = tObj(pillar.title);
          const pillarSubtitle = tObj(pillar.subtitle);
          const pillarDescription = tObj(pillar.description);

          return (
            <div
              key={pillar.id}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              {/* Pillar Header */}
              <button
                onClick={() => togglePillar(pillar.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-stone-50/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 font-mono font-bold text-sm">
                    {pillar.number}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-bold text-slate-900 text-lg md:text-xl">
                        {pillarTitle}
                      </h3>
                      {pillarSubtitle && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                          {pillarSubtitle}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{pillarDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-bold text-slate-800 block">
                      {pillarCompletedCount}/{pillar.modules.length} {lang === "hi" ? "पूरा" : "Done"}
                    </span>
                    <span className="text-[11px] font-mono text-amber-700 font-semibold">{pillarProgressPct}%</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Modules List inside Pillar */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-stone-50/40 p-4 md:p-6 space-y-4">
                  {visibleModules.map((module) => {
                    const isDone = completedModules.includes(module.id);
                    const moduleTitle = tObj(module.title);
                    const moduleSummary = tObj(module.summary);

                    // Resolve video ID
                    const hasVideo = Boolean(module.videoId);

                    return (
                      <div
                        key={module.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isDone
                            ? "bg-white/95 border-emerald-300 shadow-2xs"
                            : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => toggleModuleCompletion(module.id)}
                                className="text-slate-400 hover:text-amber-600 transition-colors shrink-0"
                                title={isDone ? (lang === "hi" ? "अपूर्ण करें" : "Mark incomplete") : (lang === "hi" ? "पूरा करें" : "Mark complete")}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300 hover:text-amber-600" />
                                )}
                              </button>
                              <h4 className="text-base font-bold font-serif text-slate-900">
                                {moduleTitle}
                              </h4>
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                                  module.difficulty === "Hard"
                                    ? "bg-red-100 text-red-700"
                                    : module.difficulty === "Medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {module.difficulty === "Easy" ? (lang === "hi" ? "आसान" : "Easy") :
                                 module.difficulty === "Medium" ? (lang === "hi" ? "मध्यम" : "Medium") :
                                 (lang === "hi" ? "मुश्किल" : "Hard")}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed pl-7">
                              {moduleSummary}
                            </p>

                            {/* Bilingual Topic Badges */}
                            {module.topics && module.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                                {module.topics.map((tItem, idx) => {
                                  const topicLabel = tObj(tItem);
                                  return (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60"
                                    >
                                      {topicLabel}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Watch Video + Mark Done */}
                          <div className="flex items-center gap-2 pl-7 md:pl-0 shrink-0">
                            {hasVideo && (
                              <button
                                onClick={() => handleOpenVideo(module)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors shadow-2xs"
                              >
                                <Play className="w-3.5 h-3.5 fill-amber-900" />
                                <span>{lang === "hi" ? "वीडियो देखें" : "Watch Video"}</span>
                              </button>
                            )}

                            <button
                              onClick={() => toggleModuleCompletion(module.id)}
                              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                isDone
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs"
                                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              <span>{isDone ? (lang === "hi" ? "पूरा हुआ ✓" : "Completed ✓") : (lang === "hi" ? "पूरा मार्क करें" : "Mark Done")}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Embedded YouTube Player Modal with EN/HI Toggle */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl space-y-4 p-4 md:p-6 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    {lang === "hi" ? "अनुशंसित पाठ वीडियो" : "Curated Lesson Video"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    • {activeVideoModal.estMinutes || 20} {lang === "hi" ? "मिनट" : "min"}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-100">
                  {tObj(activeVideoModal.title)}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Language Selector */}
            {typeof activeVideoModal.videoId === "object" && (
              <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 text-xs">
                <span className="text-slate-300 font-medium">
                  {lang === "hi" ? "वीडियो की भाषा चुनें:" : "Choose Video Language:"}
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setVideoLang("hi")}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      videoLang === "hi"
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    हिन्दी में समझें
                  </button>
                  <button
                    onClick={() => setVideoLang("en")}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      videoLang === "en"
                        ? "bg-amber-500 text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    English Explanation
                  </button>
                </div>
              </div>
            )}

            {/* Render YouTubePlayer */}
            {(() => {
              const vid = typeof activeVideoModal.videoId === "object"
                ? (activeVideoModal.videoId[videoLang] || activeVideoModal.videoId.hi || activeVideoModal.videoId.en)
                : activeVideoModal.videoId;

              return (
                <YouTubePlayer
                  videoId={vid}
                  title={tObj(activeVideoModal.title)}
                  autoplay={true}
                />
              );
            })()}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <p className="line-clamp-2">{tObj(activeVideoModal.summary)}</p>
              {(() => {
                const vid = typeof activeVideoModal.videoId === "object"
                  ? (activeVideoModal.videoId[videoLang] || activeVideoModal.videoId.hi || activeVideoModal.videoId.en)
                  : activeVideoModal.videoId;
                return (
                  <a
                    href={`https://www.youtube.com/watch?v=${vid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-amber-400 hover:underline shrink-0 font-bold ml-auto"
                  >
                    <span>{lang === "hi" ? "YouTube पर खोलें" : "Open in YouTube"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}