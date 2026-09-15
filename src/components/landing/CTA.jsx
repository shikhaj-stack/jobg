"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-10 md:p-16 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOIN THOUSANDS OF TIER-1 CANDIDATES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Transform Your Engineering Trajectory Today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Zero subscription walls. Zero predatory ISAs. Step into the JOBG chamber and prepare for your dream role with precision.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm transition-all"
            >
              <span>Log In Directly</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
