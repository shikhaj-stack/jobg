"use client";
import React, { useState, useEffect } from "react";
import { LIVE_STREAMS } from "@/data/streamData";
import VideoPlayer from "@/components/theater/VideoPlayer";
import NotesPanel from "@/components/theater/NotesPanel";
import CommunityChat from "@/components/theater/CommunityChat";
import { Radio, Users, Sparkles, BookOpen, MessageSquare } from "lucide-react";

export default function LivePage() {
  const [streams, setStreams] = useState(LIVE_STREAMS);
  const [currentStream, setCurrentStream] = useState(LIVE_STREAMS[0]);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.streams && data.streams.length > 0) {
          setStreams(data.streams);
          setCurrentStream(data.streams[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              Live Broadcast Feeds
            </span>
            <span className="text-xs text-slate-500 font-mono">Continuous Tech Theater</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Live Tech Theater & Active Recall Chamber
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time live developer streams, distributed systems lectures, and live Markdown synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "notes" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Note Synthesizer</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "chat" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Community Stream</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer
            currentStream={currentStream}
            streams={streams}
            onSelectStream={setCurrentStream}
          />
        </div>

        <div className="lg:col-span-1 min-h-[500px]">
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
