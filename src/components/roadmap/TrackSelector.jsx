"use client";
import React from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { Sparkles, Layers, Cpu, Code2 } from "lucide-react";

export default function TrackSelector({ activeTrackId, onSelectTrack }) {
  const tracks = Object.values(ROADMAP_TRACKS);

  const getIcon = (id) => {
    switch (id) {
      case "maang":
        return Cpu;
      case "webdev":
        return Code2;
      case "web3":
        return Layers;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {tracks.map((track) => {
        const Icon = getIcon(track.id);
        const isActive = activeTrackId === track.id;
        return (
          <button
            key={track.id}
            onClick={() => onSelectTrack(track.id)}
            className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden group ${
              isActive
                ? "bg-white border-amber-400/90 shadow-md ring-2 ring-amber-400/20"
                : "bg-stone-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
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
              {track.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {track.tagline}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-mono">
              <span>{track.stats.totalModules} Master Modules</span>
              <span className="font-bold text-amber-700">{track.stats.salaryRange}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
