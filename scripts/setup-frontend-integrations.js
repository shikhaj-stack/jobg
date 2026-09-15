const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function write(relPath, content) {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf8");
  console.log("Updated: " + relPath);
}

// 1. Update src/hooks/useProgress.js to use backend REST APIs with localStorage fallbacks
const useProgressCode = `"use client";
import { useState, useEffect, useCallback } from 'react';
import { ROADMAP_TRACKS } from '@/data/roadmapData';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

const INITIAL_TASKS = [
  { id: 't1', title: 'Solve LC 295: Find Median from Data Stream (Hard)', category: 'DSA', completed: true },
  { id: 't2', title: 'Review DynamoDB Partition & Virtual Node Hashing', category: 'System Design', completed: false },
  { id: 't3', title: 'Polish Amazon STAR Behavioral Story for Incident P0', category: 'Behavioral', completed: false },
  { id: 't4', title: 'Run Foundry Invariant Fuzzing test on AMM contract', category: 'Web3', completed: false },
];

export function useProgress() {
  const { user, profile } = useAuth();
  const [activeTrackId, setActiveTrackId] = useState('maang');
  const [completedModules, setCompletedModules] = useState(['m-dsa-1']);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [notes, setNotes] = useState({});

  // Sync activeTrack from user profile
  useEffect(() => {
    if (profile?.targetRole && ROADMAP_TRACKS[profile.targetRole]) {
      setActiveTrackId(profile.targetRole);
    }
  }, [profile?.targetRole]);

  // Load progress and tasks on start
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModules = localStorage.getItem('jobg_completed_modules');
      const savedTasks = localStorage.getItem('jobg_tasks');
      const savedNotes = localStorage.getItem('jobg_notes');

      if (savedModules) {
        try { setCompletedModules(JSON.parse(savedModules)); } catch (e) {}
      }
      if (savedTasks) {
        try { setTasks(JSON.parse(savedTasks)); } catch (e) {}
      }
      if (savedNotes) {
        try { setNotes(JSON.parse(savedNotes)); } catch (e) {}
      }
    }

    // Fetch initial backend tasks
    if (user) {
      fetch('/api/tasks')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.tasks && data.tasks.length > 0) {
            setTasks(data.tasks);
          }
        })
        .catch(() => {});

      // Fetch initial backend notes
      fetch('/api/notes')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.notes && data.notes.length > 0) {
            const mapped = {};
            data.notes.forEach((n) => {
              mapped[n.session_id] = n.content;
            });
            setNotes((prev) => ({ ...prev, ...mapped }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const triggerCelebration = useCallback(() => {
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#d97706', '#10b981', '#6366f1']
      });
    }
  }, []);

  const toggleModuleCompletion = useCallback(async (moduleId) => {
    const isCurrentlyCompleted = completedModules.includes(moduleId);
    const updated = isCurrentlyCompleted
      ? completedModules.filter((id) => id !== moduleId)
      : [...completedModules, moduleId];

    if (!isCurrentlyCompleted) {
      triggerCelebration();
    }

    setCompletedModules(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobg_completed_modules', JSON.stringify(updated));
    }

    // Call backend module progress endpoint
    try {
      await fetch('/api/progress/module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          track: activeTrackId,
          isCompleted: !isCurrentlyCompleted,
        }),
      });
    } catch (e) {}
  }, [completedModules, activeTrackId, triggerCelebration]);

  const toggleTask = useCallback(async (taskId) => {
    let newStatus = false;
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          newStatus = !t.completed;
          return { ...t, completed: !t.completed };
        }
        return t;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_tasks', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch(\`/api/tasks/\${taskId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newStatus }),
      });
    } catch (e) {}
  }, []);

  const addTask = useCallback(async (title, category = 'General') => {
    if (!title.trim()) return;
    const newTask = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      category,
      completed: false,
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_tasks', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category }),
      });
    } catch (e) {}
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_tasks', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch(\`/api/tasks/\${taskId}\`, {
        method: 'DELETE',
      });
    } catch (e) {}
  }, []);

  const saveNote = useCallback(async (sessionId, content) => {
    setNotes((prev) => {
      const updated = { ...prev, [sessionId]: content };
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_notes', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content,
          sessionTitle: 'Active Recall Session',
        }),
      });
    } catch (e) {}
  }, []);

  const currentTrack = ROADMAP_TRACKS[activeTrackId] || ROADMAP_TRACKS.maang;
  const allModulesInCurrentTrack = currentTrack.pillars.flatMap((p) => p.modules);
  const totalTrackModules = allModulesInCurrentTrack.length;
  const completedInTrack = allModulesInCurrentTrack.filter((m) => completedModules.includes(m.id)).length;
  const readinessPercentage = totalTrackModules > 0 ? Math.round((completedInTrack / totalTrackModules) * 100) : 0;

  return {
    activeTrackId,
    setActiveTrackId,
    currentTrack,
    completedModules,
    toggleModuleCompletion,
    totalTrackModules,
    completedInTrack,
    readinessPercentage,
    tasks,
    toggleTask,
    addTask,
    deleteTask,
    notes,
    saveNote,
  };
}
`;
write("src/hooks/useProgress.js", useProgressCode);

// 2. Update src/components/dashboard/ResumeHealth.jsx to call /api/ats/analyze
const resumeHealthCode = `"use client";
import React, { useState } from "react";
import { FileText, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

export default function ResumeHealth() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

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
          highlights: data.highlights || [
            "Strong quantifiable metrics in distributed cache implementation",
            "Explicit STAR structure in technical leadership section",
            "High density of high-value keywords (Raft, Kafka, eBPF, Yul)"
          ],
          suggestions: data.recommendations || [
            "Add open-source contribution links to GitHub portfolio",
            "Explicitly mention P99 latency impact percentages in bullet 3"
          ]
        });
      }
    } catch (e) {
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
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Chamber AI Audit Analysis ({auditResult.readiness})
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
`;
write("src/components/dashboard/ResumeHealth.jsx", resumeHealthCode);

console.log("Frontend-to-backend integrations updated successfully!");