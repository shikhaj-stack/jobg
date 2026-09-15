const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const fullPath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[GEN] ${filePath}`);
}

// ----------------------------------------------------
// 1. src/context/AuthContext.jsx
// ----------------------------------------------------
writeFile('src/context/AuthContext.jsx', `"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  githubProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut 
} from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  uid: 'demo-user-101',
  email: 'alex.rivera@engineer.io',
  displayName: 'Alex Rivera',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetRole: 'maang',
  targetCompany: 'Google (L5 Core Systems)',
  sprintStartDate: new Date().toISOString(),
  sprintDurationDays: 60,
  streak: 14,
  lastActive: 'Just now',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  // Initialize auth & load saved local profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('jobg_user_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Error loading profile from localStorage', e);
        }
      }

      // Check for demo or firebase user
      const isDemoLoggedIn = localStorage.getItem('jobg_demo_logged_in');
      if (isDemoLoggedIn === 'true') {
        setUser({
          uid: profile.uid || 'demo-user-101',
          email: profile.email || 'alex.rivera@engineer.io',
          displayName: profile.displayName || 'Alex Rivera',
          photoURL: profile.photoURL,
        });
      }
    }

    // Firebase Auth listener if auth initialized
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          const updated = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL || DEFAULT_PROFILE.photoURL,
          };
          setProfile(prev => {
            const next = { ...prev, ...updated };
            localStorage.setItem('jobg_user_profile', JSON.stringify(next));
            return next;
          });
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const saveProfile = (newProfileData) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfileData, lastActive: 'Just now' };
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_user_profile', JSON.stringify(updated));
      }
      // Sync to Supabase if connected
      if (supabase && user?.uid) {
        supabase
          .from('users')
          .upsert({
            firebase_uid: user.uid,
            email: updated.email,
            display_name: updated.displayName,
            target_role: updated.targetRole,
            target_company: updated.targetCompany,
            updated_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase profile sync notice:', error.message);
          });
      }
      return updated;
    });
  };

  const loginWithGoogle = async () => {
    if (auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (err) {
        console.warn('Firebase Google Auth error, switching to demo auth:', err.message);
      }
    }
    // Fallback demo login
    return demoLogin({
      email: 'alex.rivera@gmail.com',
      displayName: 'Alex Rivera (Google)',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
  };

  const loginWithGithub = async () => {
    if (auth && githubProvider) {
      try {
        const result = await signInWithPopup(auth, githubProvider);
        return result.user;
      } catch (err) {
        console.warn('Firebase GitHub Auth error, switching to demo auth:', err.message);
      }
    }
    return demoLogin({
      email: 'alex.rivera@github.com',
      displayName: 'Alex Rivera (GitHub)',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
    });
  };

  const loginWithEmail = async (email, password) => {
    if (auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
      } catch (err) {
        console.warn('Firebase Email Auth error, falling back to local session:', err.message);
      }
    }
    return demoLogin({
      email,
      displayName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    });
  };

  const signupWithEmail = async (email, password, extraData = {}) => {
    if (auth) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (extraData.displayName) {
          await updateProfile(result.user, { displayName: extraData.displayName });
        }
        saveProfile({ ...extraData, email, displayName: extraData.displayName || email.split('@')[0] });
        return result.user;
      } catch (err) {
        console.warn('Firebase Signup error, falling back to local session:', err.message);
      }
    }
    return demoLogin({
      email,
      displayName: extraData.displayName || email.split('@')[0],
      ...extraData
    });
  };

  const demoLogin = (customData = {}) => {
    const newUser = {
      uid: customData.uid || 'demo-user-' + Date.now(),
      email: customData.email || 'alex.rivera@engineer.io',
      displayName: customData.displayName || 'Alex Rivera',
      photoURL: customData.photoURL || DEFAULT_PROFILE.photoURL,
    };
    setUser(newUser);
    saveProfile(customData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobg_demo_logged_in', 'true');
    }
    return newUser;
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Firebase signout error', e);
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobg_demo_logged_in');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      loginWithGoogle,
      loginWithGithub,
      loginWithEmail,
      signupWithEmail,
      demoLogin,
      logout,
      saveProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
`);

// ----------------------------------------------------
// 2. src/hooks/useProgress.js
// ----------------------------------------------------
writeFile('src/hooks/useProgress.js', `"use client";
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
`);

console.log('AuthContext and useProgress created.');
