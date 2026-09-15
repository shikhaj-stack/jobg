"use client";
import { useState, useEffect, useCallback } from 'react';
import { ROADMAP_TRACKS } from '@/data/roadmapData';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
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

  // Sync activeTrack from user profile if changed
  useEffect(() => {
    if (profile?.targetRole && ROADMAP_TRACKS[profile.targetRole]) {
      setActiveTrackId(profile.targetRole);
    }
  }, [profile?.targetRole]);

  // Load progress from localStorage on start
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
  }, []);

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

  const toggleModuleCompletion = useCallback((moduleId) => {
    setCompletedModules((prev) => {
      const isCurrentlyCompleted = prev.includes(moduleId);
      let updated;
      if (isCurrentlyCompleted) {
        updated = prev.filter((id) => id !== moduleId);
      } else {
        updated = [...prev, moduleId];
        triggerCelebration();
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_completed_modules', JSON.stringify(updated));
      }

      // Sync to Supabase if available
      if (supabase && user?.uid) {
        supabase
          .from('user_progress')
          .upsert({
            firebase_uid: user.uid,
            module_id: moduleId,
            track: activeTrackId,
            pillar: 'general',
            is_completed: !isCurrentlyCompleted,
            completed_at: !isCurrentlyCompleted ? new Date().toISOString() : null,
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase sync notice:', error.message);
          });
      }

      return updated;
    });
  }, [triggerCelebration, user, activeTrackId]);

  const toggleTask = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_tasks', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const addTask = useCallback((title, category = 'General') => {
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
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_tasks', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const saveNote = useCallback((sessionId, content) => {
    setNotes((prev) => {
      const updated = { ...prev, [sessionId]: content };
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_notes', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Compute track analytics
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
