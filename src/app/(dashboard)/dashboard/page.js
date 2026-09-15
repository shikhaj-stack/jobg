"use client";
import React, { useState } from "react";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import ActiveLesson from "@/components/dashboard/ActiveLesson";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import ResumeHealth from "@/components/dashboard/ResumeHealth";
import AiInterviewDrawer from "@/components/dashboard/AiInterviewDrawer";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { currentTrack } = useProgress();
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome & Target Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {currentTrack.badge}
            </span>
            <span className="text-xs text-slate-500 font-mono">Day 18 of 60 Sprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Welcome back, {profile.displayName || "Alex Rivera"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your readiness score is up +12% this week. Maintain momentum towards your {profile.targetCompany || "Google"} interview loop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Mock Interview</span>
          </button>

          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
          >
            <span>Full Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <MetricsGrid />

      {/* Currently In Focus Active Lesson */}
      <ActiveLesson />

      {/* Two-Column Grid: Task Checklist & Resume ATS Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskChecklist />
        <ResumeHealth />
      </div>

      {/* AI Mock Interview Slide-Out Chamber */}
      <AiInterviewDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </div>
  );
}
