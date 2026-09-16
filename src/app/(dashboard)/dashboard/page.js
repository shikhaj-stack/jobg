"use client";
import React, { useState } from "react";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import ActiveLesson from "@/components/dashboard/ActiveLesson";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, ArrowRight, Mic, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { currentTrack, readinessPercentage, completedInTrack, totalTrackModules } = useProgress();
  const { lang, tObj } = useLanguage();

  const trackName = currentTrack ? (tObj(currentTrack.name) || currentTrack.name) : "Beginner English";
  const userName = (typeof window !== "undefined" && localStorage.getItem("jobg_user_name")) || profile.displayName || (lang === "hi" ? "शिक्षार्थी" : "Learner");

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome & Target Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200">
              {currentTrack?.badge || "A1 Level"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {trackName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {lang === "hi" ? `स्वागत है, ${userName} जी!` : `Welcome back, ${userName}!`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "hi" 
              ? `आपकी प्रगति ${readinessPercentage}% है। आज का पाठ पूरा करें और सखी के साथ बोलकर अभ्यास करें।` 
              : `Your learning progress is ${readinessPercentage}%. Complete today's lesson and practice speaking with Sakhi.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === "hi" ? "रोडमैप देखें" : "View Roadmap"}</span>
          </Link>

          <Link
            href="/notes"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
          >
            <span>{lang === "hi" ? "शब्दावली तिजोरी" : "Vocabulary Vault"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <MetricsGrid />

      {/* Currently In Focus Active Lesson */}
      <ActiveLesson />

      {/* Daily Practice & Task Checklist */}
      <div className="grid grid-cols-1 gap-6">
        <TaskChecklist />
      </div>
    </div>
  );
}