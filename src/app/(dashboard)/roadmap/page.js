"use client";
import React, { useState, useEffect } from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import UniversalLearningSearch from "@/components/dashboard/UniversalLearningSearch";
import WorkflowGuideCard from "@/components/roadmap/WorkflowGuideCard";
import LevelProgressionView from "@/components/roadmap/LevelProgressionView";
import TrackSelector from "@/components/roadmap/TrackSelector";
import PillarAccordion from "@/components/roadmap/PillarAccordion";
import { 
  Sparkles, 
  Wand2, 
  RotateCcw,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Compass
} from "lucide-react";

export default function RoadmapPage() {
  const { 
    activeTrackId, 
    setActiveTrackId, 
    completedModules, 
    readinessPercentage,
    completedInTrack, 
    totalTrackModules,
    currentTrack,
    toggleModuleCompletion
  } = useProgress();

  const { lang, tObj } = useLanguage();

  const [tracks] = useState(ROADMAP_TRACKS);
  const [activeCustomRoadmap, setActiveCustomRoadmap] = useState(null);
  const [searchedTopicName, setSearchedTopicName] = useState("");

  // Load custom roadmap from localStorage if any
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jobg_active_custom_roadmap");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveCustomRoadmap(parsed.roadmap);
          setSearchedTopicName(parsed.topic);
        } catch (e) {}
      }
    }
  }, []);

  const handleRoadmapGenerated = (roadmap, topic) => {
    setActiveCustomRoadmap(roadmap);
    setSearchedTopicName(topic);
    if (typeof window !== "undefined") {
      localStorage.setItem("jobg_active_custom_roadmap", JSON.stringify({ roadmap, topic }));
    }
  };

  const handleResetRoadmap = () => {
    setActiveCustomRoadmap(null);
    setSearchedTopicName("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("jobg_active_custom_roadmap");
    }
  };

  const handleStartLevel1 = () => {
    const el = document.getElementById("level-progression-container");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const displayTrack = activeCustomRoadmap || currentTrack || tracks.beginner;
  const trackName = tObj(displayTrack.name) || displayTrack.name;
  const trackTagline = tObj(displayTrack.tagline) || displayTrack.tagline;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 1. Universal AI Learning Search Bar */}
      <UniversalLearningSearch onRoadmapGenerated={handleRoadmapGenerated} />

      {/* 2. Custom Roadmap or Standard Track Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200">
              {displayTrack.badge || "Learning Track"}
            </span>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {completedInTrack} / {totalTrackModules} {lang === "hi" ? "पाठ पूर्ण" : "Lessons Done"}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {readinessPercentage}% {lang === "hi" ? "प्रगति" : "Progress"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {trackName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {trackTagline}
          </p>
        </div>

        {activeCustomRoadmap && (
          <button
            onClick={handleResetRoadmap}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start md:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === "hi" ? "मानक ट्रैक पर लौटें" : "Reset to Standard Track"}</span>
          </button>
        )}
      </div>

      {/* 3. Render either the Custom Generated Roadmap or the Standard Track */}
      {activeCustomRoadmap ? (
        <div className="space-y-8 animate-fade-in">
          {/* ChatGPT-style Workflow Guide */}
          <WorkflowGuideCard
            workflowGuide={activeCustomRoadmap.workflowGuide}
            topicTitle={searchedTopicName || trackName}
            onStartLevel1={handleStartLevel1}
          />

          {/* Progressive Level 1 to 4 Roadmap with Curated Playlists */}
          <LevelProgressionView
            levels={activeCustomRoadmap.levels || activeCustomRoadmap.pillars}
            completedModules={completedModules}
            toggleModuleCompletion={toggleModuleCompletion}
          />
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Standard English Track Selector */}
          <TrackSelector
            activeTrackId={activeTrackId}
            onSelectTrack={setActiveTrackId}
          />

          {/* Bilingual Pillar Accordion */}
          <PillarAccordion />
        </div>
      )}
    </div>
  );
}