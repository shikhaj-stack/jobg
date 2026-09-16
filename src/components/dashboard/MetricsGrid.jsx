"use client";
import React from "react";
import { Award, BookOpen, Flame, Calendar, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function MetricsGrid() {
  const { readinessPercentage, completedInTrack, totalTrackModules } = useProgress();
  const { profile } = useAuth();
  const { lang } = useLanguage();

  const metrics = [
    {
      title: lang === "hi" ? "सीखने की प्रगति" : "Learning Progress",
      value: `${readinessPercentage}%`,
      subtitle: lang === "hi" ? `${completedInTrack} में से ${totalTrackModules} पाठ पूर्ण` : `${completedInTrack} of ${totalTrackModules} lessons done`,
      icon: Award,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/80",
    },
    {
      title: lang === "hi" ? "पूरे किए गए पाठ" : "Completed Lessons",
      value: `${completedInTrack}/${totalTrackModules}`,
      subtitle: lang === "hi" ? "कदम-दर-कदम सफलता" : "Step-by-step progress",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200/80",
    },
    {
      title: lang === "hi" ? "दैनिक स्ट्रीक" : "Day Streak",
      value: `${profile.streak || 5} ${lang === "hi" ? "दिन" : "Days"}`,
      subtitle: lang === "hi" ? "लगातार सीखने की आदत" : "Consistent daily learning",
      icon: Flame,
      color: "from-orange-500 to-red-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200/80",
    },
    {
      title: lang === "hi" ? "आज का लक्ष्य" : "Today's Goal",
      value: lang === "hi" ? "1 पाठ + 5 शब्द" : "1 Lesson + 5 Words",
      subtitle: lang === "hi" ? "सखी के साथ 5 मिनट बोलें" : "Practice 5 min with Sakhi",
      icon: Sparkles,
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