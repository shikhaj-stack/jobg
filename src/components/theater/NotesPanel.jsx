"use client";
import React, { useState, useEffect } from "react";
import { BookOpen, Download, Copy, Check, Save, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export default function NotesPanel({ currentStream }) {
  const { notes, saveNote } = useProgress();
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");

  // Load existing note when currentStream changes
  useEffect(() => {
    if (currentStream?.id) {
      const existingNote = notes[currentStream.id] || "";
      setContent(existingNote);
    }
  }, [currentStream?.id, notes]);

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setSaveStatus("Saving...");
    saveNote(currentStream.id, text);
    setTimeout(() => {
      setSaveStatus("Auto-Saved");
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const markdownContent = `# Active Recall: ${currentStream.title}\n**Channel**: ${currentStream.channel}\n**Date**: ${new Date().toLocaleDateString()}\n\n---\n\n${content}`;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JOBG-Notes-${currentStream.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base">Active Recall Chamber</h3>
            <p className="text-[11px] text-slate-500">Live Markdown Note Synthesizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {saveStatus}
          </span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        <textarea
          value={content}
          onChange={handleNoteChange}
          placeholder="Synthesize critical architecture patterns, trade-offs, algorithmic complexities (O(N)), and failure modes here..."
          className="w-full flex-1 min-h-[300px] p-4 rounded-2xl bg-stone-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:bg-white focus:border-amber-400 transition-all resize-none leading-relaxed"
        />

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4 text-xs">
          <span className="font-mono text-slate-500">{wordCount} Words</span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
