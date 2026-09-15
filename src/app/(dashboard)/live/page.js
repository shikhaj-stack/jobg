"use client";
import React, { useState } from "react";
import VideoPlayer from "@/components/theater/VideoPlayer";
import NotesPanel from "@/components/theater/NotesPanel";
import { LIVE_STREAMS } from "@/data/streamData";
import { Tv, Radio, Sparkles } from "lucide-react";

export default function LiveTheaterPage() {
  const [currentStream, setCurrentStream] = useState(LIVE_STREAMS[0]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              REAL-TIME BROADCAST ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Live Tech Theater & Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Watch live architectural teardowns and take timestamped markdown notes without leaving your preparation chamber.
          </p>
        </div>
      </div>

      {/* Theater 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Video Stream */}
        <div className="lg:col-span-7 xl:col-span-8">
          <VideoPlayer
            currentStream={currentStream}
            streams={LIVE_STREAMS}
            onSelectStream={setCurrentStream}
          />
        </div>

        {/* Right Active Recall Notes */}
        <div className="lg:col-span-5 xl:col-span-4">
          <NotesPanel currentStream={currentStream} />
        </div>
      </div>
    </div>
  );
}
