"use client";
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
    wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
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
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "vault" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Synthesized Notes ({notesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("recall")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "recall" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
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
