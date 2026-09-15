"use client";
import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw } from "lucide-react";

export default function AiInterviewDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Greetings, candidate. I am your Tier-1 AI Technical Interviewer (L5/Staff bar). Select a round below or type a problem scenario to begin your architectural grilling."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [roundType, setRoundType] = useState("interview");

  if (!isOpen) return null;

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const newMsgs = [...messages, { role: "user", content: textToSend }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          type: roundType,
          track: "maang"
        }),
      });
      const data = await res.json();
      if (data.success && data.guidance) {
        setMessages([...newMsgs, { role: "assistant", content: data.guidance }]);
      } else {
        setMessages([...newMsgs, { role: "assistant", content: "Analyze trade-offs: Consider write-heavy workloads, partition tolerance, and failover latency." }]);
      }
    } catch (e) {
      setMessages([...newMsgs, { role: "assistant", content: "Focus on P99 latency SLA and consistent hashing virtual nodes." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: "Design Rate Limiter", query: "Design a distributed rate limiter for 10M QPS with sub-millisecond latency. Compare Redis token bucket with Envoy sliding window." },
    { label: "LeetCode Hard Edge Cases", query: "What are the critical hidden edge cases in LeetCode 295 (Find Median from Data Stream) with 10^9 duplicate stream elements?" },
    { label: "Amazon STAR Incident", query: "How should I structure a story for 'Tell me about a time you made a high-risk technical decision under severe ambiguity'?" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 text-white flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                Chamber AI Mock Interviewer
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  L5/L6 Bar
                </span>
              </h2>
              <p className="text-xs text-slate-400">Real-time architectural feedback & algorithmic grilling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Round Switcher */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 bg-slate-900/50 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Round:</span>
          <button
            onClick={() => setRoundType("interview")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${roundType === 'interview' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Distributed Systems
          </button>
          <button
            onClick={() => setRoundType("resume")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${roundType === 'resume' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            STAR Behavioral
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-600 text-white font-medium rounded-tr-xs'
                    : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-tl-xs'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-400 animate-pulse">
                Evaluating architectural tradeoffs and calculating Big-O constraints...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 border-t border-slate-800/80 bg-slate-950/40 flex flex-nowrap overflow-x-auto gap-2 text-[11px]">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp.query)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors text-left"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an architecture question or propose a system design..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}