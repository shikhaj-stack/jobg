"use client";
import React from "react";
import TrackSelector from "@/components/roadmap/TrackSelector";
import PillarAccordion from "@/components/roadmap/PillarAccordion";
import { useProgress } from "@/hooks/useProgress";
import { Award, BookOpen, Sparkles } from "lucide-react";

export default function RoadmapPage() {
  const { activeTrackId, setActiveTrackId, currentTrack, readinessPercentage, completedInTrack, totalTrackModules } = useProgress();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              CURRICULUM ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Tier-1 Preparation Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Switch between core engineering disciplines. Every topic contains vetted algorithms and deep architectural design breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <Award className="w-5 h-5 text-amber-600" />
          <div className="text-left text-xs">
            <span className="font-bold text-slate-900 block">{readinessPercentage}% Track Mastery</span>
            <span className="text-slate-500 font-mono">{completedInTrack}/{totalTrackModules} Modules</span>
          </div>
        </div>
      </div>

      {/* 3 Track Selector Tabs */}
      <TrackSelector activeTrackId={activeTrackId} onSelectTrack={setActiveTrackId} />

      {/* Interactive Pillar & Module Accordion */}
      <PillarAccordion />
    </div>
  );
}
