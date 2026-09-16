"use client";
import React from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, MessageCircle, Award, CheckCircle2, Clock, BookOpen } from "lucide-react";

export default function TrackSelector({ activeTrackId, onSelectTrack }) {
  const { lang, tObj, t } = useLanguage();
  const tracks = Object.values(ROADMAP_TRACKS);

  const getIcon = (id) => {
    switch (id) {
      case "beginner":
        return BookOpen;
      case "conversational":
        return MessageCircle;
      case "advanced":
        return Award;
      default:
        return Sparkles;
    }
  };

  return (
    <div className={`grid gap-4 mb-8 ${tracks.length === 1 ? "grid-cols-1 max-w-2xl" : "grid-cols-1 md:grid-cols-3"}`}>
      {tracks.map((track) => {
        const Icon = getIcon(track.id);
        const isActive = activeTrackId === track.id;
        const trackName = tObj(track.name);
        const trackTagline = tObj(track.tagline);

        return (
          <button
            key={track.id}
            onClick={() => onSelectTrack(track.id)}
            className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden group ${
              isActive
                ? "bg-white border-amber-400 shadow-md ring-2 ring-amber-400/20"
                : "bg-stone-50/90 border-slate-200/80 hover:bg-white hover:border-slate-300"
            }`}
          >
            {isActive && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-8 -mt-8 pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2.5 rounded-2xl ${
                  isActive ? "bg-amber-100 text-amber-800" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  isActive ? "bg-amber-500 text-slate-950 font-extrabold" : "bg-slate-200/80 text-slate-700"
                }`}
              >
                {track.badge}
              </span>
            </div>

            <h4 className="font-serif font-bold text-slate-900 text-base mb-1 group-hover:text-amber-800 transition-colors">
              {trackName}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {trackTagline}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-mono">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {track.stats.totalModules} {lang === "hi" ? "पाठ" : "Lessons"}
              </span>
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                {track.stats.estimatedWeeks} {lang === "hi" ? "हफ़्ते" : "Weeks"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}