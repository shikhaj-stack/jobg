"use client";
import React from "react";
import { Award, BookOpen, Flame, Calendar, ArrowUpRight } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/context/AuthContext";

export default function MetricsGrid() {
  const { readinessPercentage, completedInTrack, totalTrackModules } = useProgress();
  const { profile } = useAuth();

  const metrics = [
    {
      title: "Chamber Readiness",
      value: `${readinessPercentage}%`,
      subtitle: `${completedInTrack} of ${totalTrackModules} topics verified`,
      icon: Award,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/80",
    },
    {
      title: "Mastered Modules",
      value: `${completedInTrack}/${totalTrackModules}`,
      subtitle: "Tier-1 curriculum mastery",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200/80",
    },
    {
      title: "Active Sprint Streak",
      value: `${profile.streak || 14} Days`,
      subtitle: "Continuous problem solving",
      icon: Flame,
      color: "from-orange-500 to-red-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200/80",
    },
    {
      title: "Sprint Milestone",
      value: "Day 18 / 60",
      subtitle: "Target: Onsite Mock Loop",
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 font-sans">{m.title}</span>
              <div className={`p-2.5 rounded-xl ${m.bgColor} ${m.borderColor} border`}>
                <Icon className={`w-4 h-4 ${m.textColor}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                {m.value}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>{m.subtitle}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
