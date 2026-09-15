"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingNavbar() {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-sm group-hover:scale-105 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-amber-700 font-serif font-bold text-base">
              JG
            </div>
          </div>
          <div>
            <span className="font-serif font-bold tracking-tight text-lg text-slate-900 block leading-tight">
              JOBG
            </span>
            <span className="text-[10px] font-mono tracking-widest text-amber-700 font-semibold uppercase">
              Job Readiness Ecosystem
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#mission" className="hover:text-amber-800 transition-colors">Mission</a>
          <a href="#tracks" className="hover:text-amber-800 transition-colors">Career Tracks</a>
          <a href="#innovations" className="hover:text-amber-800 transition-colors">Innovations</a>
          <a href="#theater" className="hover:text-amber-800 transition-colors">Tech Theater</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all"
            >
              <span>Enter Chamber</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-amber-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
