"use client";
import React, { useState, useEffect } from "react";
import { LESSON_VIDEOS, LIVE_STREAMS } from "@/data/streamData";
import VideoPlayer from "@/components/theater/VideoPlayer";
import NotesPanel from "@/components/theater/NotesPanel";
import CommunityChat from "@/components/theater/CommunityChat";
import { Video, BookOpen, MessageSquare, Sparkles, Filter, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LivePage() {
  const { lang, t } = useLanguage();
  const initialStreams = LIVE_STREAMS && LIVE_STREAMS.length > 0 ? LIVE_STREAMS : (LESSON_VIDEOS || []);
  const [streams, setStreams] = useState(initialStreams);
  const [currentStream, setCurrentStream] = useState(initialStreams[0] || {
    id: "default",
    title: "English Alphabet and Phonics",
    channel: "ParivarLearn",
    videoId: "ULrR_HVbBCU",
    category: "BEGINNER"
  });
  const [activeTab, setActiveTab] = useState("notes");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.videos && data.videos.length > 0) {
          const mapped = data.videos.map((v) => ({
            id: v.id,
            title: v.title,
            channel: v.channel,
            category: v.track ? v.track.toUpperCase() : "GENERAL",
            videoId: typeof v.videoId === "object" ? (v.videoId.hi || v.videoId.en) : v.videoId,
            isLive: false,
            viewers: 1250,
            instructor: "Sakhi AI Tutor"
          }));
          setStreams(mapped);
          setCurrentStream(mapped[0]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredStreams = selectedFilter === "all" 
    ? streams 
    : streams.filter((s) => s.category?.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              {lang === "hi" ? "वीडियो थियेटर" : "Watch & Learn Theater"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {lang === "hi" ? "सखी के साथ सीखें" : "Curated Video Lectures"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {lang === "hi" ? "वीडियो देखें और सीखें (Watch & Learn)" : "Watch & Learn Video Theater"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === "hi" 
              ? "हिंदी और अंग्रेजी में वीडियो व्याख्यान देखें और साथ ही अपने नोट्स बनाएं।" 
              : "Watch curated video lectures with auto-captions and take notes side-by-side."}
          </p>
        </div>

        {/* Tab switcher: Notes vs Community */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-center">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "notes" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === "hi" ? "नोट्स बनाएं" : "Notes"}</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "chat" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === "hi" ? "चर्चा मंच" : "Community"}</span>
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase shrink-0">
          {lang === "hi" ? "श्रेणी:" : "Filter:"}
        </span>
        {[
          { id: "all", label: lang === "hi" ? "सभी वीडियो" : "All Videos" },
          { id: "beginner", label: lang === "hi" ? "शुरुआती (Beginner)" : "Beginner (A1)" },
          { id: "conversational", label: lang === "hi" ? "बातचीत (Conversational)" : "Conversational (A2-B1)" },
          { id: "advanced", label: lang === "hi" ? "उन्नत (Advanced)" : "Advanced (B2-C1)" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === f.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-stone-100 text-slate-600 hover:bg-stone-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Video Player + Notes / Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer
            currentStream={currentStream}
            streams={filteredStreams}
            onSelectStream={(s) => setCurrentStream(s)}
          />
        </div>

        <div className="lg:col-span-1 h-[650px]">
          {activeTab === "notes" ? (
            <NotesPanel currentStream={currentStream} />
          ) : (
            <CommunityChat currentStream={currentStream} />
          )}
        </div>
      </div>
    </div>
  );
}