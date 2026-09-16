"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-family-primary to-slate-900 py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {t("hero.cta_primary")}
        </h2>
        <p className="text-white/70 mb-8 text-lg">{t("hero.sub")}</p>
        <Link
          href="/signup"
          id="cta-section-signup"
          className="inline-block px-10 py-4 rounded-full bg-family-accent hover:bg-orange-500 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all duration-200"
        >
          {t("hero.cta_primary")} →
        </Link>
      </div>
    </section>
  );
}