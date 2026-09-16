"use client";
import React from "react";
import { Compass, Lightbulb, Target, Clock, CheckCircle2, ArrowDown, Sparkles, Volume2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WorkflowGuideCard({ workflowGuide, topicTitle, onStartLevel1 }) {
  const { lang, tObj } = useLanguage();

  if (!workflowGuide) return null;

  const whereToStart = tObj(workflowGuide.whereToStart);
  const howToLearn = tObj(workflowGuide.howToLearn);
  const prerequisites = tObj(workflowGuide.prerequisites);
  const estimatedTimeline = tObj(workflowGuide.estimatedTimeline);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 border-2 border-amber-300/80 p-6 md:p-8 shadow-lg space-y-6 animate-fade-in relative overflow-hidden">
      {/* Decorative accent background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md border border-amber-300">
              <Compass className="w-3.5 h-3.5" />
              {lang === "hi" ? "कार्यप्रणाली और शुरुआत गाइड" : "AI Workflow & Strategy Guide"}
            </span>
            <span className="text-xs text-amber-700 font-mono font-medium">
              {estimatedTimeline}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {lang === "hi" ? `${topicTitle}: कहाँ से और कैसे शुरू करें?` : `${topicTitle}: Where & How to Start?`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === "hi" 
              ? "ChatGPT केवल टेक्स्ट चैट देता है — यहाँ आपको स्पष्ट कार्यप्रणाली, चरणबद्ध लेवल और वीडियो प्लेलिस्ट मिलेगी।" 
              : "Beyond text chat: structured methodology, progressive levels, and curated video playlists."}
          </p>
        </div>

        {onStartLevel1 && (
          <button
            onClick={onStartLevel1}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-102 transition-all self-start md:self-center shrink-0"
          >
            <span>{lang === "hi" ? "लेवल 1 से शुरू करें" : "Start from Level 1"}</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3 Core Workflow Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Where to start */}
        <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/70 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Target className="w-4 h-4" />
            </div>
            <span>{lang === "hi" ? "1. कहाँ से शुरू करें?" : "1. Where to Start?"}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pt-1">
            {whereToStart}
          </p>
        </div>

        {/* Pillar 2: How to learn */}
        <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/70 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>{lang === "hi" ? "2. कैसे सीखें और अभ्यास करें?" : "2. How to Practice?"}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pt-1">
            {howToLearn}
          </p>
        </div>

        {/* Pillar 3: Timeline & Prerequisites */}
        <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/70 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Clock className="w-4 h-4" />
            </div>
            <span>{lang === "hi" ? "3. समय और तैयारी" : "3. Timeline & Prep"}</span>
          </div>
          <div className="space-y-1.5 pt-1 text-xs text-slate-700">
            <div>
              <span className="font-bold text-slate-900">{lang === "hi" ? "पूर्वापेक्षाएँ: " : "Prerequisites: "}</span>
              <span>{prerequisites}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">{lang === "hi" ? "समय सीमा: " : "Timeline: "}</span>
              <span className="font-mono text-amber-800 font-bold">{estimatedTimeline}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}