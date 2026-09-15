"use client";
import React, { useState, useEffect } from "react";
import { Search, X, BookOpen, Video, ExternalLink } from "lucide-react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { LIVE_STREAMS } from "@/data/streamData";
import Link from "next/link";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allModules = Object.entries(ROADMAP_TRACKS).flatMap(([trackKey, track]) =>
    track.pillars.flatMap((pillar) =>
      pillar.modules.map((m) => ({
        ...m,
        trackName: track.name,
        trackKey,
        pillarTitle: pillar.title,
        type: "module",
      }))
    )
  );

  const filteredModules = query.trim()
    ? allModules.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.summary.toLowerCase().includes(query.toLowerCase()) ||
          m.topics.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : allModules.slice(0, 4);

  const filteredStreams = query.trim()
    ? LIVE_STREAMS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.channel.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      )
    : LIVE_STREAMS.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="Search algorithms, system design, streams, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Curriculum Modules ({filteredModules.length})</span>
            </div>
            <div className="space-y-2">
              {filteredModules.map((item) => (
                <Link
                  key={item.id}
                  href="/roadmap"
                  onClick={onClose}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{item.summary}</p>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.trackName} • {item.pillarTitle}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2 mt-1" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              <Video className="w-3.5 h-3.5 text-copper-600" />
              <span>Live Tech Theater ({filteredStreams.length})</span>
            </div>
            <div className="space-y-2">
              {filteredStreams.map((stream) => (
                <Link
                  key={stream.id}
                  href="/live"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-copper-200 hover:bg-copper-50/40 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-copper-800 transition-colors">
                        {stream.title}
                      </span>
                      {stream.isLive && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {stream.channel} • {stream.category} • {stream.duration}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-copper-600 shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Press ESC to close</span>
          <span>Tip: Select any item to jump directly</span>
        </div>
      </div>
    </div>
  );
}
