"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-family-primary to-family-accent flex items-center justify-center text-white font-bold text-sm shadow-lg">
              P
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-sm tracking-wide">ParivarLearn</div>
              <div className="text-white/40 text-[10px] font-hindi">परिवार सीखे</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link href="/roadmap" className="text-white/70 hover:text-white text-sm font-medium transition-colors">{t("nav.roadmap")}</Link>
                <Link href="/live"    className="text-white/70 hover:text-white text-sm font-medium transition-colors">{t("nav.live")}</Link>
                <Link href="/notes"   className="text-white/70 hover:text-white text-sm font-medium transition-colors">{t("nav.notes")}</Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {user ? (
              <button
                onClick={signOut}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 border border-white/20 transition-all"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-sm font-semibold bg-family-accent hover:bg-orange-500 text-white transition-all shadow"
              >
                {t("nav.signup")}
              </Link>
            )}
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && user && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-white/10 mt-2 pt-3">
            <Link href="/roadmap" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>{t("nav.roadmap")}</Link>
            <Link href="/live"    className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>{t("nav.live")}</Link>
            <Link href="/notes"   className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>{t("nav.notes")}</Link>
          </div>
        )}
      </div>
    </nav>
  );
}