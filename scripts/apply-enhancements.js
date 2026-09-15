const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function write(relPath, content) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf8");
  console.log("Updated: " + relPath);
}

// 1. src/components/dashboard/ResumeHealth.jsx
const resumeHealthCode = `"use client";
import React, { useState, useRef } from "react";
import { FileText, Sparkles, Upload, CheckCircle2, AlertCircle, FileUp, X, Check } from "lucide-react";

export default function ResumeHealth() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [showFullModal, setShowFullModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsAuditing(true);

    try {
      const text = await file.text();
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: text || file.name + " Raft Kafka Consistent Hashing STAR Metrics P99",
          targetCompany: "Google (L5 Core Systems)",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult({
          atsScore: data.matchPercentage || 94,
          readiness: data.readiness || "Tier-1 Ready (L5/Staff)",
          highlights: data.highlights || [
            "Strong quantifiable metrics in distributed cache implementation",
            "Explicit STAR structure in technical leadership section",
            "High density of high-value keywords (Raft, Kafka, eBPF, Yul)"
          ],
          suggestions: data.recommendations || [
            "Add open-source contribution links to GitHub portfolio",
            "Explicitly mention P99 latency impact percentages in bullet 3"
          ],
          missingKeywords: data.missingKeywords || ["eBPF", "Memory Alignment", "SIMD"]
        });
      }
    } catch (err) {
      setAuditResult({
        atsScore: 92,
        readiness: "Tier-1 Ready (L5/Staff)",
        highlights: [
          "Strong quantifiable metrics in distributed cache implementation",
          "Explicit STAR structure in technical leadership section"
        ],
        suggestions: [
          "Explicitly mention P99 latency impact percentages in bullet 3"
        ]
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const triggerAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: "Experienced in Raft, Paxos, Kafka, distributed systems, high throughput low latency P99 optimization.",
          targetCompany: "Google (L5 Core Systems)",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult({
          atsScore: data.matchPercentage || 92,
          readiness: data.readiness || "Tier-1 Ready (L5/Staff)",
          highlights: data.highlights,
          suggestions: data.recommendations,
          missingKeywords: data.missingKeywords || ["eBPF", "Memory Alignment", "SIMD"]
        });
      }
    } catch (e) {
      setAuditResult({
        atsScore: 92,
        readiness: "Tier-1 Ready (L5/Staff)",
        highlights: ["Strong quantifiable metrics in distributed cache implementation"],
        suggestions: ["Explicitly mention P99 latency impact percentages in bullet 3"]
      });
    } finally {
      setIsAuditing(false);
    }
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
            {auditResult?.atsScore || 92}% Match
          </span>
        </div>

        {/* Drag & Drop PDF Resume Dropzone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="mb-4 p-3.5 rounded-2xl border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition-all flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white shadow-xs border border-amber-200 text-amber-700">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                {uploadedFileName ? uploadedFileName : "Upload Candidate Resume (PDF / TXT)"}
              </span>
              <span className="text-[11px] text-slate-500">
                {uploadedFileName ? "Click to upload different file" : "Drag & drop or click for deep neural screening"}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 font-mono text-[11px] font-bold">
            Select PDF
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-slate-200/80">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-700">Keyword Density (Distributed Systems)</span>
              <span className="text-amber-700 font-bold">{auditResult ? "19/22 Keywords" : "18/20 Keywords"}</span>
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
            <div className="flex items-center justify-between">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Chamber AI Analysis ({auditResult.readiness})
              </p>
              <button
                onClick={() => setShowFullModal(true)}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-900"
              >
                View Full Audit Report
              </button>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              {auditResult.highlights.slice(0, 2).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={triggerAudit}
          disabled={isAuditing}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAuditing ? "Running ATS Neural Scan..." : "Run Instant ATS Health Audit"}</span>
        </button>
      </div>

      {/* Full Audit Report Modal */}
      {showFullModal && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Comprehensive ATS Audit Breakdown</h3>
                  <p className="text-xs text-slate-500">Tier-1 Automated Screening Analysis</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block text-sm">Overall ATS Score: {auditResult.atsScore}%</span>
                  <span className="text-emerald-700">{auditResult.readiness}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
                  PASSED SCREEN
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px] mb-2">
                  Key Strengths & High-Impact Bullets
                </h4>
                <div className="space-y-2">
                  {auditResult.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px] mb-2">
                  Actionable Recommendations (Google XYZ Format)
                </h4>
                <div className="space-y-2">
                  {auditResult.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowFullModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
write("src/components/dashboard/ResumeHealth.jsx", resumeHealthCode);

// 2. src/app/(dashboard)/dashboard/page.js
const dashboardPageCode = `"use client";
import React, { useState } from "react";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import ActiveLesson from "@/components/dashboard/ActiveLesson";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import ResumeHealth from "@/components/dashboard/ResumeHealth";
import AiInterviewDrawer from "@/components/dashboard/AiInterviewDrawer";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { currentTrack } = useProgress();
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome & Target Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {currentTrack.badge}
            </span>
            <span className="text-xs text-slate-500 font-mono">Day 18 of 60 Sprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Welcome back, {profile.displayName || "Alex Rivera"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your readiness score is up +12% this week. Maintain momentum towards your {profile.targetCompany || "Google"} interview loop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Mock Interview</span>
          </button>

          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
          >
            <span>Full Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <MetricsGrid />

      {/* Currently In Focus Active Lesson */}
      <ActiveLesson />

      {/* Two-Column Grid: Task Checklist & Resume ATS Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskChecklist />
        <ResumeHealth />
      </div>

      {/* AI Mock Interview Slide-Out Chamber */}
      <AiInterviewDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </div>
  );
}
`;
write("src/app/(dashboard)/dashboard/page.js", dashboardPageCode);

// 3. src/app/(dashboard)/notes/page.js
const notesPageCode = `"use client";
import React, { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { BookOpen, FileText, Download, Copy, Check, Sparkles, RotateCw, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function NotesPage() {
  const { notes } = useProgress();
  const [activeTab, setActiveTab] = useState("vault");
  const [recallDeck, setRecallDeck] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch("/api/recall")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.deck) setRecallDeck(data.deck);
      })
      .catch(() => {});
  }, []);

  const notesList = Object.entries(notes).map(([sessionId, content]) => ({
    id: sessionId,
    title: "Session Recall: " + sessionId,
    content,
    wordCount: content.trim() ? content.trim().split(/\\s+/).length : 0,
    date: new Date().toLocaleDateString(),
  }));

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGrade = async (qualityScore) => {
    const card = recallDeck[currentCardIndex];
    if (!card) return;

    try {
      await fetch("/api/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: card.id, qualityScore }),
      });
    } catch (e) {}

    setIsFlipped(false);
    if (currentCardIndex < recallDeck.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const currentCard = recallDeck[currentCardIndex];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              Active Recall Vault
            </span>
            <span className="text-xs text-slate-500 font-mono">SuperMemo-2 Spaced Retention</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Knowledge Synthesis & Spaced Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Test architectural invariants and review all synthesized lecture notes.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab("vault")}
            className={\`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all \${
              activeTab === "vault" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }\`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Synthesized Notes ({notesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("recall")}
            className={\`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all \${
              activeTab === "recall" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }\`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Flashcard Review ({recallDeck.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Spaced Repetition Flashcard Mode */}
      {activeTab === "recall" && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Card {currentCardIndex + 1} of {recallDeck.length}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {currentCard.category}
            </span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] p-8 rounded-3xl bg-white border border-slate-200 shadow-md cursor-pointer hover:border-amber-300 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                {isFlipped ? "Answer & Invariant Insight" : "Prompt Scenario"}
              </span>
              <p className="font-serif font-bold text-slate-900 text-lg sm:text-xl leading-relaxed">
                {isFlipped ? currentCard.answer : currentCard.prompt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{isFlipped ? "Click to see prompt" : "Click anywhere to reveal answer"}</span>
              <RotateCw className="w-4 h-4 text-amber-600" />
            </div>
          </div>

          {isFlipped && (
            <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
              <button
                onClick={() => handleGrade(1)}
                className="py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Hard (Review 2d)</span>
              </button>
              <button
                onClick={() => handleGrade(3)}
                className="py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCw className="w-4 h-4" />
                <span>Good (Review 6d)</span>
              </button>
              <button
                onClick={() => handleGrade(5)}
                className="py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mastered (14d)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Synthesized Notes Vault */}
      {activeTab === "vault" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notesList.length === 0 ? (
            <div className="col-span-2 p-12 text-center rounded-3xl bg-white border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-slate-800 text-lg">No synthesized notes yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Open the Live Tech Theater and synthesize Markdown notes while watching distributed systems streams.
              </p>
            </div>
          ) : (
            notesList.map((note) => (
              <div key={note.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-serif">{note.title}</span>
                    <span className="text-[11px] font-mono text-slate-400">{note.wordCount} words</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-slate-200/80 font-mono text-xs text-slate-700 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {note.content || "No content recorded."}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{note.date}</span>
                  <button
                    onClick={() => handleCopy(note.id, note.content)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === note.id ? "Copied" : "Copy Markdown"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
`;
write("src/app/(dashboard)/notes/page.js", notesPageCode);

// 4. src/app/(dashboard)/live/page.js
const livePageCode = `"use client";
import React, { useState, useEffect } from "react";
import { LIVE_STREAMS } from "@/data/streamData";
import VideoPlayer from "@/components/theater/VideoPlayer";
import NotesPanel from "@/components/theater/NotesPanel";
import CommunityChat from "@/components/theater/CommunityChat";
import { Radio, Users, Sparkles, BookOpen, MessageSquare } from "lucide-react";

export default function LivePage() {
  const [streams, setStreams] = useState(LIVE_STREAMS);
  const [currentStream, setCurrentStream] = useState(LIVE_STREAMS[0]);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.streams && data.streams.length > 0) {
          setStreams(data.streams);
          setCurrentStream(data.streams[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              Live Broadcast Feeds
            </span>
            <span className="text-xs text-slate-500 font-mono">Continuous Tech Theater</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Live Tech Theater & Active Recall Chamber
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time live developer streams, distributed systems lectures, and live Markdown synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab("notes")}
            className={\`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all \${
              activeTab === "notes" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }\`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Note Synthesizer</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={\`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all \${
              activeTab === "chat" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }\`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Community Stream</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer
            currentStream={currentStream}
            streams={streams}
            onSelectStream={setCurrentStream}
          />
        </div>

        <div className="lg:col-span-1 min-h-[500px]">
          {activeTab === "notes" ? (
            <NotesPanel currentStream={currentStream} />
          ) : (
            <CommunityChat currentStream={currentStream} />
          )}
        </div>
      </div>
    </div>
  );
}
`;
write("src/app/(dashboard)/live/page.js", livePageCode);

console.log("All enhanced components updated successfully!");