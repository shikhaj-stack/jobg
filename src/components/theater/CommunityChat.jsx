"use client";
import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

const INITIAL_MESSAGES = [
  { id: 1, user: "Elena Rostova", role: "Staff Candidate", text: "Look at the LSM-tree compaction diagram on min 14:20. The write amplification trade-off is crucial for Google L5 rounds.", time: "Just now" },
  { id: 2, user: "Devon Chen", role: "L6 Target", text: "In distributed consensus, remember to mention Raft joint consensus for reconfiguration instead of stopping the cluster.", time: "2m ago" },
  { id: 3, user: "Marcus Vance", role: "Protocol Engineer", text: "For Web3 contracts, always place reentrancy guards before external state modifications.", time: "5m ago" },
];

export default function CommunityChat({ currentStream }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      user: "Alex Rivera (You)",
      role: "Candidate",
      text: input.trim(),
      time: "Just now",
    };

    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base">Chamber Live Discussion</h3>
            <p className="text-[11px] text-slate-500">Real-Time Engineering Community Stream</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>48 Engineers Live</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        {messages.map((m) => (
          <div key={m.id} className="p-3 rounded-2xl bg-stone-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{m.user}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                  {m.role}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">{m.time}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share an architecture insight or question..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-stone-50 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}