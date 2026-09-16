"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0c0a09] border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-white font-bold text-lg mb-1">ParivarLearn</div>
            <div className="text-white/40 text-sm font-hindi">परिवार सीखे</div>
            <p className="text-white/40 text-xs mt-2 max-w-xs">{t("footer.tagline")}</p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/roadmap" className="hover:text-white transition-colors">{t("nav.roadmap")}</Link>
            <Link href="/live"    className="hover:text-white transition-colors">{t("nav.live")}</Link>
            <Link href="/notes"   className="hover:text-white transition-colors">{t("nav.notes")}</Link>
          </div>

          {/* Language toggle + credit */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <LanguageToggle />
            <p className="text-white/30 text-xs">{t("footer.made_with")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}