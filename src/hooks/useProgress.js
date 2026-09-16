"use client";
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
  const [activeTrackId, setActiveTrackId] = useState('kuchnaya');
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
      await fetch(`/api/tasks/${taskId}`, {
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
      await fetch(`/api/tasks/${taskId}`, {
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

  const currentTrack = ROADMAP_TRACKS[activeTrackId] || ROADMAP_TRACKS.kuchnaya || Object.values(ROADMAP_TRACKS)[0];
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
