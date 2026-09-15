"use client";
import React from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { ArrowRight, CheckCircle2, Cpu, Code2, Layers } from "lucide-react";
import Link from "next/link";

export default function Tracks() {
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
        return Cpu;
    }
  };

  return (
    <section id="tracks" className="py-20 bg-stone-100/60 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
            CHOOSE YOUR DISCIPLINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Three Elite, Role-Specific Career Tracks
          </h2>
          <p className="text-sm text-slate-600">
            Every module includes verified problem sets, architectural whitepapers, and live video breakdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = getIcon(track.id);
            return (
              <div
                key={track.id}
                className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                      {track.stats.salaryRange}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
                      {track.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {track.tagline}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Core Pillars:
                    </span>
                    {track.pillars.map((pillar) => (
                      <div key={pillar.id} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold">{pillar.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-slate-100">
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    <span>Enroll in Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
