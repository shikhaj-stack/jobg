"use client";
import React, { useState, useEffect } from "react";
import UniversalLearningSearch from "@/components/dashboard/UniversalLearningSearch";
import WorkflowGuideCard from "@/components/roadmap/WorkflowGuideCard";
import LevelProgressionView from "@/components/roadmap/LevelProgressionView";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import ActiveLesson from "@/components/dashboard/ActiveLesson";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, ArrowRight, BookOpen, RotateCcw, Check, Star } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { 
    currentTrack, 
    readinessPercentage, 
    completedInTrack, 
    totalTrackModules,
    completedModules,
    toggleModuleCompletion
  } = useProgress();
  const { lang, tObj } = useLanguage();

  const [activeCustomRoadmap, setActiveCustomRoadmap] = useState(null);
  const [searchedTopicName, setSearchedTopicName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Restore any previously generated custom roadmap from localStorage
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
    setIsSaved(false);
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
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const userName = (typeof window !== "undefined" && localStorage.getItem("jobg_user_name")) || profile.displayName || (lang === "hi" ? "शिक्षार्थी" : "Learner");

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 1. Universal Floating AI Learning Search Bar (Front & Center) */}
      <UniversalLearningSearch onRoadmapGenerated={handleRoadmapGenerated} />

      {/* 2. If a Custom Roadmap was searched (e.g. DSA, Web Dev, Spanish, Finance) */}
      {activeCustomRoadmap ? (
        <div className="space-y-8 animate-fade-in">
          {/* Custom Roadmap Active Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                  {activeCustomRoadmap.badge || "Universal AI Roadmap"}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {searchedTopicName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {tObj(activeCustomRoadmap.name)}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {tObj(activeCustomRoadmap.tagline)}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                onClick={handleResetRoadmap}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "मानक ट्रैक पर लौटें" : "Reset Track"}</span>
              </button>
            </div>
          </div>

          {/* ChatGPT-style Workflow Guide Card: Where & How to Start */}
          <WorkflowGuideCard
            workflowGuide={activeCustomRoadmap.workflowGuide}
            topicTitle={searchedTopicName || tObj(activeCustomRoadmap.name)}
            onStartLevel1={handleStartLevel1}
          />

          {/* Progressive Level 1 to 4 Roadmap with Curated YouTube Playlists */}
          <LevelProgressionView
            levels={activeCustomRoadmap.levels || activeCustomRoadmap.pillars}
            completedModules={completedModules}
            toggleModuleCompletion={toggleModuleCompletion}
          />
        </div>
      ) : (
        /* 3. Default Learning Dashboard View */
        <div className="space-y-8 animate-fade-in">
          {/* Welcome & Target Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {currentTrack?.badge || "A1 Level"}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentTrack ? tObj(currentTrack.name) : "English Track"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                {lang === "hi" ? `नमस्ते, ${userName} जी!` : `Welcome back, ${userName}!`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {lang === "hi" 
                  ? `आपकी सीखने की प्रगति ${readinessPercentage}% है। ऊपर दिए गए सर्च बार में कोई भी नया विषय खोजें या आज का पाठ जारी रखें।` 
                  : `Your learning progress is ${readinessPercentage}%. Type any topic in the search bar above or continue today's lesson.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/roadmap"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === "hi" ? "पूरा रोडमैप देखें" : "View Curriculum"}</span>
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

          {/* Daily Checklist */}
          <div className="grid grid-cols-1 gap-6">
            <TaskChecklist />
          </div>
        </div>
      )}
    </div>
  );
}