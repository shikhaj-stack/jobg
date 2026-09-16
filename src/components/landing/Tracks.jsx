"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const TRACKS = [
  {
    id:        "beginner",
    emoji:     "🌱",
    nameKey:   "tracks.beginner_name",
    tagKey:    "tracks.beginner_tagline",
    badgeKey:  "tracks.beginner_badge",
    color:     "from-blue-600 to-blue-800",
    border:    "border-blue-500/40",
    weeks:     4,
    lessons:   10,
  },
  {
    id:        "conversational",
    emoji:     "💬",
    nameKey:   "tracks.conversational_name",
    tagKey:    "tracks.conversational_tagline",
    badgeKey:  "tracks.conversational_badge",
    color:     "from-orange-600 to-amber-700",
    border:    "border-orange-500/40",
    weeks:     8,
    lessons:   12,
    featured:  true,
  },
  {
    id:        "advanced",
    emoji:     "🏆",
    nameKey:   "tracks.advanced_name",
    tagKey:    "tracks.advanced_tagline",
    badgeKey:  "tracks.advanced_badge",
    color:     "from-emerald-600 to-teal-800",
    border:    "border-emerald-500/40",
    weeks:     10,
    lessons:   10,
  },
];

export default function Tracks() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#0f172a] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t("tracks.title")}</h2>
          <p className="text-white/60 max-w-xl mx-auto">{t("tracks.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TRACKS.map((track) => (
            <div
              key={track.id}
              className={`relative rounded-2xl border ${track.border} bg-slate-800/60 backdrop-blur overflow-hidden hover:scale-[1.02] transition-all duration-200 ${track.featured ? "ring-2 ring-family-accent/50" : ""}`}
            >
              {track.featured && (
                <div className="absolute top-0 right-0 bg-family-accent text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  Most Popular
                </div>
              )}
              {/* Gradient header */}
              <div className={`bg-gradient-to-br ${track.color} p-6`}>
                <div className="text-5xl mb-3">{track.emoji}</div>
                <h3 className="text-xl font-bold text-white">{t(track.nameKey)}</h3>
                <p className="text-white/70 text-sm mt-1">{t(track.tagKey)}</p>
              </div>
              {/* Body */}
              <div className="p-6">
                <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-white/70 mb-4">
                  {t(track.badgeKey)}
                </div>
                <div className="flex gap-4 text-sm text-white/50 mb-6">
                  <span>📅 {track.weeks} {t("tracks.weeks")}</span>
                  <span>📖 {track.lessons} {t("tracks.lessons")}</span>
                </div>
                <Link
                  href={`/roadmap?track=${track.id}`}
                  id={`track-cta-${track.id}`}
                  className="block w-full text-center py-2.5 rounded-xl bg-white/10 hover:bg-family-accent text-white font-semibold text-sm border border-white/10 hover:border-family-accent transition-all duration-200"
                >
                  {t("tracks.cta")} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}