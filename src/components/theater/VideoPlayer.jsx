"use client";
import React from "react";
import { Tv, Radio, Users, Sparkles, ExternalLink } from "lucide-react";

export default function VideoPlayer({ currentStream, streams, onSelectStream }) {
  const currentVideoId = currentStream?.videoId || "bUHFg8CZFws";

  return (
    <div className="space-y-4">
      {/* 16:9 Cinema Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black border border-slate-800 shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`}
          title={currentStream?.title || "Live Tech Chamber Broadcast"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* Stream Info Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {currentStream?.isLive && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                LIVE BROADCAST
              </span>
            )}
            <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {currentStream?.category || "Engineering"}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-serif font-bold text-slate-900 leading-tight">
            {currentStream?.title}
          </h2>

          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span>By {currentStream?.instructor || "Senior Staff Engineer"}</span>
            <span>•</span>
            <span>Channel: {currentStream?.channel}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600 font-semibold">
              <Users className="w-3.5 h-3.5" />
              {currentStream?.viewers?.toLocaleString() || "1,250"} Watching
            </span>
          </p>
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${currentVideoId}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-slate-600" />
          <span>Open on YouTube</span>
        </a>
      </div>

      {/* Recommended Feeds / Stream Switcher */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Active Broadcasts & Feeds
          </span>
          <span className="text-xs text-slate-400">Auto-synced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {streams?.map((stream) => (
            <button
              key={stream.id}
              onClick={() => onSelectStream(stream)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                stream.id === currentStream?.id
                  ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="relative shrink-0 w-24 h-16 rounded-xl bg-slate-900 overflow-hidden border border-slate-200 flex items-center justify-center">
                <img
                  src={`https://img.youtube.com/vi/${stream.videoId}/mqdefault.jpg`}
                  alt={stream.title}
                  className="w-full h-full object-cover"
                />
                {stream.isLive && (
                  <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded">
                    LIVE
                  </span>
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {stream.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{stream.channel}</p>
                <span className="inline-block text-[10px] font-mono text-amber-800 font-bold bg-amber-100/60 px-1.5 py-0.2 rounded">
                  {stream.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
