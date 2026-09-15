"use client";
import React, { useState } from "react";
import { FileText, ShieldAlert, Sparkles, Check, AlertCircle, ArrowUpRight } from "lucide-react";

export default function ResumeHealth() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const triggerAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        atsScore: 92,
        readiness: "Tier-1 Ready (L5/Staff)",
        highlights: [
          "Strong quantifiable metrics in distributed cache implementation",
          "Explicit STAR structure in technical leadership section",
          "High density of high-value keywords (Raft, Kafka, eBPF, Yul)"
        ],
        suggestions: [
          "Add open-source contribution links to GitHub portfolio",
          "Explicitly mention P99 latency impact percentages in bullet 3"
        ]
      });
    }, 900);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-base">ATS Resume Health Radar</h3>
              <p className="text-[11px] text-slate-500">Tier-1 Automated Keyword Screening</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            92% Match
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-slate-200/80">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-700">Keyword Density (Distributed Systems)</span>
              <span className="text-amber-700 font-bold">18/20 Keywords</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[90%]" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-slate-200/80">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-700">Quantifiable Business Impact</span>
              <span className="text-emerald-700 font-bold">95% (High Impact)</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[95%]" />
            </div>
          </div>
        </div>

        {auditResult && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 animate-fade-in-up">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Chamber AI Audit Analysis
            </p>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              {auditResult.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-5 mt-4 border-t border-slate-100">
        <button
          onClick={triggerAudit}
          disabled={isAuditing}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAuditing ? "Running ATS Neural Scan..." : "Run Instant ATS Health Audit"}</span>
        </button>
      </div>
    </div>
  );
}
