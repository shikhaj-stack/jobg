"use client";
import React from "react";
import { ROADMAP_TRACKS } from "@/data/roadmapData";
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Clock, Award } from "lucide-react";
import Link from "next/link";

export default function Tracks() {
  const tracks = Object.values(ROADMAP_TRACKS);
  const singleTrack = tracks[0];

  return (
    <section id="tracks" className="py-20 bg-stone-100/60 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
            THE UNIFIED CURRICULUM
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            KUCHNAYA Single-Track Roadmap
          </h2>
          <p className="text-sm text-slate-600">
            A unified, battle-tested engineering curriculum designed to take you from algorithmic fundamentals to high-scale distributed systems and Staff+ impact.
          </p>
        </div>

        {singleTrack && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 block">
                        {singleTrack.badge || "Single-Track Target"}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-slate-900">
                        {singleTrack.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {singleTrack.stats?.salaryRange || "$180k - $350k+"}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {singleTrack.tagline}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 border-y border-slate-100 text-xs font-mono text-slate-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>{singleTrack.stats?.totalModules || 12} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{singleTrack.stats?.estimatedWeeks || 12} Weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Staff+ Readiness</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Core Curriculum Pillars:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {singleTrack.pillars.map((pillar) => (
                      <div key={pillar.id} className="p-3.5 rounded-2xl bg-stone-50/80 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900">{pillar.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{pillar.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md transition-all"
                >
                  <span>Enroll in KUCHNAYA Single-Track</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
