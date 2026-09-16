"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white font-serif font-bold text-xs">
            KN
          </div>
          <div>
            <p className="font-serif font-bold text-slate-900">KUCHNAYA // Classical Chamber</p>
            <p className="text-[10px] text-slate-400">© 2026 KUCHNAYA Ecosystem. Open Educational Platform.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <Link href="/roadmap" className="hover:text-amber-800 transition-colors">Curriculum</Link>
          <Link href="/live" className="hover:text-amber-800 transition-colors">Tech Theater</Link>
          <Link href="/login" className="hover:text-amber-800 transition-colors">Member Chamber</Link>
        </div>
      </div>
    </footer>
  );
}
