"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const stats = [
  { keyLabel: "hero.stats_learners", value: "50,000+" },
  { keyLabel: "hero.stats_lessons",  value: "300+" },
  { keyLabel: "hero.stats_languages", value: "2" },
];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen bg-slate-900 flex items-center overflow-hidden pt-16">
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-family-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-family-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-family-primary/20 border border-family-primary/30 text-family-light text-sm font-medium mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-family-accent animate-pulse" />
          {t("hero.badge")}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
          {t("hero.headline")}{" "}
          <span className="bg-gradient-to-r from-family-accent to-amber-400 bg-clip-text text-transparent">
            {t("hero.headline_accent")}
          </span>
        </h1>

        {/* Sub */}
        <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-10 animate-fade-in-up">
          {t("hero.sub")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up">
          <Link
            href="/signup"
            id="hero-cta-primary"
            className="px-8 py-3.5 rounded-full bg-family-accent hover:bg-orange-500 text-white font-semibold text-base shadow-lg hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
          >
            {t("hero.cta_primary")} →
          </Link>
          <Link
            href="/live"
            id="hero-cta-demo"
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-all duration-200"
          >
            {t("hero.cta_secondary")}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16 animate-fade-in-up">
          {stats.map(({ keyLabel, value }) => (
            <div key={keyLabel} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-white/50">{t(keyLabel)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}