"use client";
import React from "react";
import { useProgress } from "@/hooks/useProgress";
import { BookOpen, Download, Trash2, Calendar, FileText } from "lucide-react";
import { LIVE_STREAMS } from "@/data/streamData";

export default function NotesPage() {
  const { notes, saveNote } = useProgress();

  const noteEntries = Object.entries(notes);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Active Recall Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            All your synthesized architectural notes and algorithmic insights saved across live sessions.
          </p>
        </div>
      </div>

      {noteEntries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900">No Synthesized Notes Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Open the Live Tech Theater to watch system design teardowns and write structured markdown notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {noteEntries.map(([sessionId, content]) => {
            const stream = LIVE_STREAMS.find((s) => s.id === sessionId);
            const title = stream ? stream.title : `Session ${sessionId}`;
            return (
              <div
                key={sessionId}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      {stream?.category || "Tech Session"}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-base">{title}</h3>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-slate-100 font-mono text-xs text-slate-700 whitespace-pre-wrap line-clamp-6">
                    {content || "No content recorded."}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-mono">
                  <span>{content.split(/\s+/).filter(Boolean).length} Words</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
