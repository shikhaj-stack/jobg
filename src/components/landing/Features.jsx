"use client";
import React from "react";
import { Zap, Tv, FileText, CheckCircle, Trophy, BarChart3 } from "lucide-react";

export default function Features() {
  const innovations = [
    {
      title: "Active-Recall Live Theater",
      description: "Embed live YouTube streams directly into an interactive code & markdown synthesis environment. Never lose focus switching tabs.",
      icon: Tv,
    },
    {
      title: "ATS Neural Keyword Radar",
      description: "Real-time algorithmic resume auditor. Instant feedback on keyword density and STAR leadership structure.",
      icon: FileText,
    },
    {
      title: "Non-Intrusive Progress Engine",
      description: "Track your 60-day sprint with zero friction. One-click module mastery with instant milestone celebrations.",
      icon: Zap,
    },
    {
      title: "Multi-Track Fluidity",
      description: "Seamlessly pivot between MAANG Algorithmic core, Full-Stack Next.js cloud, and Web3 Smart Contract tracks.",
      icon: BarChart3,
    },
    {
      title: "Autonomous Sprint Loop",
      description: "Custom sprint task planner with real-time countdown to your target mock interview loop.",
      icon: CheckCircle,
    },
    {
      title: "Chamber Community & Leaderboard",
      description: "Anonymized streak rankings and peer accountability to keep you disciplined throughout the 60-day sprint.",
      icon: Trophy,
    },
  ];

  return (
    <section id="innovations" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
          DESIGNED FOR SERIOUS PREPARATION
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Engineered for Deep Focus & Accountability
        </h2>
        <p className="text-sm text-slate-600">
          Everything you need to transform raw tutorials into an interview-dominating engineering portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {innovations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
