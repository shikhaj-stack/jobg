"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Flame, CheckCircle, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 text-amber-900 text-xs font-bold font-mono tracking-wide animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>NEXT-GEN MAANG & WEB3 JOB READINESS</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-slate-950 tracking-tight max-w-5xl mx-auto leading-[1.15]">
          Bridging the Gap Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-copper-600">Unstructured Content</span> and Top-Tier Employment.
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-sans leading-relaxed">
          The internet is flooded with tutorials, yet thousands of engineers fail to get hired because they lack structure, consistency, and real-time guidance. KUCHNAYA provides the accountability of a $20k bootcamp without the predatory income share agreements.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:scale-102 transition-all"
          >
            <span>Start Your 60-Day Sprint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-stone-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all"
          >
            <span>Explore Demo Chamber</span>
          </Link>
        </div>

        {/* Feature Pill Matrix */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="font-serif font-bold text-xl text-slate-900">Single-Track</div>
            <p className="text-xs text-slate-500">KUCHNAYA Roadmap</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="font-serif font-bold text-xl text-slate-900">Live Theater</div>
            <p className="text-xs text-slate-500">Curated Real-time Streams</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="font-serif font-bold text-xl text-slate-900">Active Recall</div>
            <p className="text-xs text-slate-500">Live Markdown Note Synthesizer</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="font-serif font-bold text-xl text-slate-900">ATS Neural Radar</div>
            <p className="text-xs text-slate-500">92%+ Resume Match Health</p>
          </div>
        </div>
      </div>
    </section>
  );
}
