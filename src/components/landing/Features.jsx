"use client";
import { useLanguage } from "@/context/LanguageContext";

const FEATURES = [
  {
    icon: "🎙️",
    titleKey: "features.voice_title",
    descKey:  "features.voice_desc",
    color:    "from-orange-500/20 to-orange-600/5",
    border:   "border-orange-500/30",
    badge:    "AI Powered",
  },
  {
    icon: "🗺️",
    titleKey: "features.roadmap_title",
    descKey:  "features.roadmap_desc",
    color:    "from-blue-500/20 to-blue-600/5",
    border:   "border-blue-500/30",
    badge:    "Structured",
  },
  {
    icon: "▶️",
    titleKey: "features.video_title",
    descKey:  "features.video_desc",
    color:    "from-emerald-500/20 to-emerald-600/5",
    border:   "border-emerald-500/30",
    badge:    "Bilingual Videos",
  },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section className="bg-slate-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t("features.title")}</h2>
          <p className="text-white/60 max-w-xl mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.titleKey}
              className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border ${f.border} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-white/70 mb-3">
                {f.badge}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t(f.titleKey)}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}