"use client";
import React, { useState } from "react";
import { Search, Flame, User, LogOut, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GlobalSearchModal from "./GlobalSearchModal";
import Link from "next/link";

export default function Header({ onToggleSidebar }) {
  const { profile, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-8 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-amber-300 text-slate-400 text-sm transition-all text-left shadow-2xs group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            <span className="flex-1 font-sans text-slate-500">Search roadmap, algorithms, streams...</span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-md text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 text-amber-900">
            <Flame className="w-4 h-4 text-amber-600 animate-flicker-flame" />
            <span className="text-xs font-bold tracking-tight">{profile.streak || 14} Day Streak</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Target: {profile.targetCompany || "Google (L5 Core Systems)"}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={profile.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={profile.displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/40 shadow-xs"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{profile.displayName || "Alex Rivera"}</p>
                <p className="text-[11px] text-amber-700 font-medium capitalize">{profile.targetRole || "MAANG"} Candidate</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-in-up"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{profile.displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  Candidate Profile & Settings
                </Link>
                <Link
                  href="/roadmap"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  KUCHNAYA Roadmap
                </Link>
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Chamber
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
