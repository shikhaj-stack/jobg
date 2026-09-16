"use client";
import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  BookOpen, 
  Clock, 
  ChevronDown, 
  Video, 
  ExternalLink, 
  Sparkles, 
  X,
  Layers,
  Award,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import YouTubePlayer from "@/components/ui/YouTubePlayer";

export default function LevelProgressionView({ levels, completedModules = [], toggleModuleCompletion }) {
  const { lang, tObj } = useLanguage();
  const [openLevels, setOpenLevels] = useState([1, 2]); // default open Level 1 & 2
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [videoLang, setVideoLang] = useState(lang || "hi");

  if (!levels || levels.length === 0) return null;

  const toggleLevel = (lvlNum) => {
    setOpenLevels((prev) =>
      prev.includes(lvlNum) ? prev.filter((n) => n !== lvlNum) : [...prev, lvlNum]
    );
  };

  const handleOpenVideo = (videoInfo) => {
    setActiveVideoModal(videoInfo);
    setVideoLang(lang === "en" ? "en" : "hi");
  };

  return (
    <div id="level-progression-container" className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {lang === "hi" ? "चरणबद्ध सीखने की यात्रा (Level 1 to 4)" : "Progressive Learning Journey (Level 1 to 4)"}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === "hi" 
              ? "हर लेवल में विशेष वीडियो प्लेलिस्ट और चरणबद्ध पाठ दिए गए हैं — बुनियादी से उन्नत स्तर तक" 
              : "Each level provides a dedicated video playlist and actionable lesson modules."}
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
          {levels.length} {lang === "hi" ? "स्तर उपलब्ध" : "Levels Total"}
        </span>
      </div>

      {levels.map((lvl) => {
        const lvlNum = lvl.levelNumber || lvl.number || 1;
        const isOpen = openLevels.includes(lvlNum);
        const lvlTitle = tObj(lvl.levelTitle || lvl.title);
        const lvlGoal = tObj(lvl.levelGoal || lvl.description);
        const modules = lvl.modules || [];
        const playlist = lvl.playlist || [];

        const completedCount = modules.filter((m) => completedModules.includes(m.id)).length;
        const progressPct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

        return (
          <div
            key={lvlNum}
            className={`rounded-3xl bg-white border transition-all shadow-xs overflow-hidden ${
              isOpen ? "border-amber-300 ring-1 ring-amber-300/30" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Level Header Button */}
            <button
              onClick={() => toggleLevel(lvlNum)}
              className="w-full p-5 md:p-7 text-left flex items-start justify-between gap-4 hover:bg-stone-50/70 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-mono font-extrabold text-base shadow-md shadow-amber-500/20">
                  L{lvlNum}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                      {lvlNum === 1 ? (lang === "hi" ? "बुनियादी स्तर (Foundations)" : "Level 1 • Foundations") :
                       lvlNum === 2 ? (lang === "hi" ? "मूल सिद्धांत (Core Concepts)" : "Level 2 • Core Concepts") :
                       lvlNum === 3 ? (lang === "hi" ? "मध्यवर्ती अभ्यास (Intermediate)" : "Level 3 • Intermediate") :
                       (lang === "hi" ? "उन्नत महारत (Advanced Mastery)" : "Level 4 • Advanced Mastery")}
                    </span>
                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      {completedCount}/{modules.length} {lang === "hi" ? "पूर्ण" : "Done"}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                    {lvlTitle}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {lvlGoal}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-mono font-bold text-amber-700 block">{progressPct}%</span>
                  <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-amber-600" : ""
                  }`}
                />
              </div>
            </button>

            {/* Level Content: Playlist + Actionable Modules */}
            {isOpen && (
              <div className="border-t border-slate-100 bg-stone-50/50 p-5 md:p-7 space-y-6">
                
                {/* 1. Curated YouTube Playlist Section */}
                {playlist.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-600" />
                      <h5 className="font-serif font-bold text-slate-900 text-sm">
                        {lang === "hi" ? `लेवल ${lvlNum} के लिए अनुशंसित वीडियो प्लेलिस्ट:` : `Curated Video Playlist for Level ${lvlNum}:`}
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {playlist.map((video, vIdx) => (
                        <div
                          key={vIdx}
                          onClick={() => handleOpenVideo(video)}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-14 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                              <Play className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="min-w-0">
                              <h6 className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-800">
                                {video.title}
                              </h6>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>{video.channel || "Curated Lecture"}</span>
                                <span>•</span>
                                <span>{video.duration || "40 min"}</span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold shrink-0">
                            {video.lang === "hi" ? "हिंदी" : "English"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Step-by-step Modules List */}
                <div className="space-y-3 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <h5 className="font-serif font-bold text-slate-900 text-sm">
                        {lang === "hi" ? `अभ्यास और पाठ मॉड्यूल:` : `Actionable Learning Modules:`}
                      </h5>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {modules.length} {lang === "hi" ? "पाठ" : "Lessons"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {modules.map((m) => {
                      const isDone = completedModules.includes(m.id);
                      const mTitle = tObj(m.title);
                      const mSummary = tObj(m.summary);

                      return (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isDone
                              ? "bg-white/95 border-emerald-300 shadow-2xs"
                              : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={() => toggleModuleCompletion && toggleModuleCompletion(m.id)}
                                  className="text-slate-400 hover:text-amber-600 transition-colors shrink-0"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300 hover:text-amber-600" />
                                  )}
                                </button>
                                <h6 className="text-sm font-bold font-serif text-slate-900">
                                  {mTitle}
                                </h6>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                                    m.difficulty === "Hard"
                                      ? "bg-red-100 text-red-700"
                                      : m.difficulty === "Medium"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {m.difficulty || "Easy"}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                                {mSummary}
                              </p>

                              {/* Topics */}
                              {m.topics && m.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                                  {m.topics.map((tItem, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60"
                                    >
                                      {tObj(tItem)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pl-7 md:pl-0 shrink-0">
                              {m.videoId && (
                                <button
                                  onClick={() => handleOpenVideo(m)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors shadow-2xs"
                                >
                                  <Play className="w-3 h-3 fill-amber-900" />
                                  <span>{lang === "hi" ? "वीडियो देखें" : "Watch Lecture"}</span>
                                </button>
                              )}

                              <button
                                onClick={() => toggleModuleCompletion && toggleModuleCompletion(m.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  isDone
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                <span>{isDone ? (lang === "hi" ? "पूर्ण ✓" : "Done ✓") : (lang === "hi" ? "पूरा करें" : "Mark Done")}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Embedded YouTube Player Modal with EN/HI Option */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl space-y-4 p-4 md:p-6 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  {lang === "hi" ? "अनुशंसित यूट्यूब वीडियो लेक्चर" : "Curated YouTube Lecture"}
                </span>
                <h3 className="font-serif font-bold text-base text-slate-100">
                  {activeVideoModal.title ? tObj(activeVideoModal.title) : "Lecture Video"}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language toggle if videoId is an object with { en, hi } */}
            {typeof activeVideoModal.videoId === "object" && (
              <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 text-xs">
                <span className="text-slate-300 font-medium">
                  {lang === "hi" ? "वीडियो की भाषा:" : "Video Language:"}
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setVideoLang("hi")}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      videoLang === "hi" ? "bg-amber-500 text-slate-950 shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    हिन्दी में समझें
                  </button>
                  <button
                    onClick={() => setVideoLang("en")}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      videoLang === "en" ? "bg-amber-500 text-slate-950 shadow-xs" : "text-slate-400 hover:text-white"
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
                : (activeVideoModal.videoId || "ULrR_HVbBCU");

              return (
                <YouTubePlayer
                  videoId={vid}
                  title={tObj(activeVideoModal.title)}
                  autoplay={true}
                />
              );
            })()}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                {lang === "hi" ? "सखी के साथ बोलकर अभ्यास करें" : "Practice aloud with Sakhi"}
              </span>
              {(() => {
                const vid = typeof activeVideoModal.videoId === "object"
                  ? (activeVideoModal.videoId[videoLang] || activeVideoModal.videoId.hi || activeVideoModal.videoId.en)
                  : activeVideoModal.videoId;
                return (
                  <a
                    href={`https://www.youtube.com/watch?v=${vid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
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