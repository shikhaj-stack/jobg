"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, ShieldCheck, Target, Building, Calendar, Save, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { profile, saveProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [targetCompany, setTargetCompany] = useState(profile.targetCompany || "");
  const [targetRole, setTargetRole] = useState(profile.targetRole || "maang");
  const [sprintDuration, setSprintDuration] = useState(profile.sprintDurationDays || 60);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveProfile({
      displayName,
      targetCompany,
      targetRole,
      sprintDurationDays: parseInt(sprintDuration, 10),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in-up">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Candidate Profile & Sprint Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure your target dream role, countdown deadlines, and personal chamber attributes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Candidate Identity Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-sm"
            />
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">{profile.displayName || "Alex Rivera"}</h3>
              <p className="text-xs text-slate-500">{profile.email}</p>
              <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Chamber Tier-1 Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                Primary Target Role Track
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="maang">MAANG / Tier-1 Core Engineering</option>
                <option value="webdev">Modern Full-Stack & Cloud Architecture</option>
                <option value="web3">Web3 & Blockchain Protocol Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                Target Companies
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="Google (L5), Meta (E5), Apple"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                Sprint Duration (Days)
              </label>
              <select
                value={sprintDuration}
                onChange={(e) => setSprintDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="30">30-Day Intensive Crash Sprint</option>
                <option value="60">60-Day Comprehensive Tier-1 Sprint</option>
                <option value="90">90-Day Deep Architectural Mastery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fade-in-up">
                <CheckCircle2 className="w-4 h-4" />
                Profile & Sprint preferences updated!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
