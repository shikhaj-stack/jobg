"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Tv, 
  BookOpenCheck, 
  UserCircle2, 
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "KUCHNAYA Roadmap", icon: Map, badge: "Curriculum" },
  { href: "/live", label: "Live Tech Theater", icon: Tv, badge: "Live" },
  { href: "/notes", label: "Active Recall Notes", icon: BookOpenCheck },
  { href: "/profile", label: "Candidate Profile", icon: UserCircle2 },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { readinessPercentage, completedInTrack, totalTrackModules, currentTrack } = useProgress();

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-out shadow-xs ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200 bg-stone-50/70">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-xs shadow-amber-900/40 group-hover:scale-105 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-amber-700 font-serif font-bold text-base">
                KN
              </div>
            </div>
            <div>
              <span className="font-serif font-bold tracking-tight text-lg text-slate-900 block leading-tight">
                KUCHNAYA
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-700 font-semibold uppercase">
                Readiness Chamber
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">
            Platform Chamber
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? "bg-amber-500/10 text-amber-900 font-bold border border-amber-200/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-amber-600" : "text-slate-600 group-hover:text-amber-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badge === "Live"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50/50 border border-amber-200/60 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                  {currentTrack.name.split("/")[0]}
                </span>
                <span className="text-xs font-bold text-amber-900">{readinessPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-2.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${readinessPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {completedInTrack} of {totalTrackModules} Modules Mastered
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-stone-50/60">
          <div className="flex items-center gap-3">
            <img
              src={profile.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={profile.displayName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-300 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{profile.displayName || "Alex Rivera"}</p>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Active: {profile.lastActive || "Just now"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
