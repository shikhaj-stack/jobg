"use client";
import React from "react";
import { Play, BookOpen, ExternalLink, Sparkles, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";

export default function ActiveLesson() {
  const { currentTrack, completedModules, toggleModuleCompletion } = useProgress();
  const { lang, tObj } = useLanguage();

  if (!currentTrack || !currentTrack.pillars) return null;

  // Pick first incomplete module or first module
  const allModules = currentTrack.pillars.flatMap((p) => p.modules);
  const activeModule = allModules.find((m) => !completedModules.includes(m.id)) || allModules[0];
  if (!activeModule) return null;

  const isCompleted = completedModules.includes(activeModule.id);
  const moduleTitle = tObj(activeModule.title);
  const moduleSummary = tObj(activeModule.summary);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 md:p-8 text-white shadow-xl">
      {/* Subtle warm background glow */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {lang === "hi" ? "वर्तमान पाठ" : "Current Lesson"} • {activeModule.difficulty === "Easy" ? (lang === "hi" ? "आसान" : "Easy") : activeModule.difficulty}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {activeModule.estMinutes || 20} {lang === "hi" ? "मिनट" : "min"}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
            {moduleTitle}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {moduleSummary}
          </p>

          {activeModule.topics && activeModule.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {activeModule.topics.map((tItem, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/10 text-slate-200 border border-white/10"
                >
                  {tObj(tItem)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link
            href="/roadmap"
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{lang === "hi" ? "पाठ शुरू करें / वीडियो देखें" : "Start Lesson / Watch Video"}</span>
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
            <span>{isCompleted ? (lang === "hi" ? "पूरा हुआ ✓" : "Completed ✓") : (lang === "hi" ? "पूरा मार्क करें" : "Mark Completed")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}