"use client";
import React from "react";
import { Play, BookOpen, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

export default function ActiveLesson() {
  const { currentTrack, completedModules, toggleModuleCompletion } = useProgress();

  // Pick first incomplete module or first module
  const allModules = currentTrack.pillars.flatMap((p) => p.modules);
  const activeModule = allModules.find((m) => !completedModules.includes(m.id)) || allModules[0];
  const isCompleted = completedModules.includes(activeModule.id);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 md:p-8 text-white shadow-xl">
      {/* Subtle architectural background */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              CURRENT FOCUS • {activeModule.difficulty}
            </span>
            <span className="text-xs text-slate-400">~{activeModule.estHours} hrs prep time</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
            {activeModule.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {activeModule.summary}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeModule.topics.map((topic, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/10 text-slate-200 border border-white/5"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link
            href="/live"
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-102 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Tech Theater</span>
          </Link>

          <button
            onClick={() => toggleModuleCompletion(activeModule.id)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${
              isCompleted
                ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? "Completed ✓" : "Mark Mastered"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
