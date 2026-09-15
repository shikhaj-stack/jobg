"use client";
import React, { useState } from "react";
import { 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Play, 
  BookOpen, 
  ExternalLink,
  Flame,
  Search,
  Filter
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import Link from "next/link";

export default function PillarAccordion() {
  const { currentTrack, completedModules, toggleModuleCompletion } = useProgress();
  const [openPillars, setOpenPillars] = useState(["pillar-dsa", "pillar-system-design", "pillar-frontend", "pillar-solidity"]);
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const togglePillar = (pillarId) => {
    setOpenPillars((prev) =>
      prev.includes(pillarId) ? prev.filter((id) => id !== pillarId) : [...prev, pillarId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Difficulty Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter topics in this track..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase font-mono mr-1">Difficulty:</span>
          {["ALL", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                difficultyFilter === diff
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {diff}
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
          const pillarProgressPct = Math.round((pillarCompletedCount / pillar.modules.length) * 100);

          const visibleModules = pillar.modules.filter((m) => {
            const matchesDifficulty = difficultyFilter === "ALL" || m.difficulty === difficultyFilter;
            const matchesSearch =
              !searchTerm.trim() ||
              m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
              m.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesDifficulty && matchesSearch;
          });

          if (visibleModules.length === 0 && (searchTerm || difficultyFilter !== "ALL")) {
            return null;
          }

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
                        {pillar.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{pillar.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-bold text-slate-800 block">
                      {pillarCompletedCount}/{pillar.modules.length} Completed
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
                    return (
                      <div
                        key={module.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isDone
                            ? "bg-white/90 border-emerald-300 shadow-2xs"
                            : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => toggleModuleCompletion(module.id)}
                                className="text-slate-400 hover:text-amber-600 transition-colors shrink-0"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300 hover:text-amber-600" />
                                )}
                              </button>
                              <h4
                                className={`text-base font-bold font-serif ${
                                  isDone ? "text-slate-900" : "text-slate-900"
                                }`}
                              >
                                {module.title}
                              </h4>
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                                  module.difficulty === "Hard"
                                    ? "bg-red-100 text-red-700"
                                    : module.difficulty === "Medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {module.difficulty}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed pl-7">
                              {module.summary}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                              {module.topics.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pl-7 md:pl-0 shrink-0">
                            <Link
                              href="/live"
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 fill-amber-900" />
                              <span>Watch Theater</span>
                            </Link>

                            <button
                              onClick={() => toggleModuleCompletion(module.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                isDone
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-slate-900 hover:bg-slate-800 text-white"
                              }`}
                            >
                              {isDone ? "Mastered ✓" : "Mark Done"}
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
    </div>
  );
}
