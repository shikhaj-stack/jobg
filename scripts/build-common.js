const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const fullPath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[GEN] ${filePath}`);
}

// ==========================================
// 1. BASE CONFIGS & LIBS
// ==========================================

writeFile('src/app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #f8fafc;
    --foreground: #0f172a;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
}

/* Custom Warm Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Classic ambient grain overlay */
.bg-grain {
  background-image: radial-gradient(rgba(100, 116, 139, 0.05) 1px, transparent 0);
  background-size: 24px 24px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`);

writeFile('src/app/layout.js', `import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'JOBG // Ultimate MAANG & Web3 Job Readiness Platform',
  description: 'Bridging the gap between unstructured content and top-tier employment. Curated roadmaps, real-time live tech theater, and AI-powered job readiness.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-[#f8fafc] text-slate-900 selection:bg-amber-500/20 selection:text-amber-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#f8fafc] font-sans text-slate-800 antialiased relative overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[#f8fafc] bg-grain opacity-60"></div>
        </div>
        <AuthProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
`);

writeFile('src/lib/firebase.js', `import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let googleProvider = null;
let githubProvider = null;

if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
  } catch (error) {
    console.warn('Firebase initialization error:', error);
  }
}

export { 
  app, 
  auth, 
  googleProvider, 
  githubProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  updateProfile 
};
`);

writeFile('src/lib/supabase.js', `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase client init note:', err);
  }
}

export { supabase };
`);

// ==========================================
// 2. COMMON & NAVIGATION COMPONENTS
// ==========================================

writeFile('src/components/common/AuthGuard.jsx', `"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          <p className="text-sm font-medium text-slate-600">Entering JOBG Chamber...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
`);

writeFile('src/components/common/GlobalSearchModal.jsx', `"use client";
import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Video, ExternalLink, Sparkles, Flame } from 'lucide-react';
import { ROADMAP_TRACKS } from '@/data/roadmapData';
import { LIVE_STREAMS } from '@/data/streamData';
import Link from 'next/link';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten all modules
  const allModules = Object.entries(ROADMAP_TRACKS).flatMap(([trackKey, track]) =>
    track.pillars.flatMap((pillar) =>
      pillar.modules.map((m) => ({
        ...m,
        trackName: track.name,
        trackKey,
        pillarTitle: pillar.title,
        type: 'module',
      }))
    )
  );

  const filteredModules = query.trim()
    ? allModules.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.summary.toLowerCase().includes(query.toLowerCase()) ||
          m.topics.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : allModules.slice(0, 4);

  const filteredStreams = query.trim()
    ? LIVE_STREAMS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.channel.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      )
    : LIVE_STREAMS.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="Search algorithms, system design, streams, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Modules Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Curriculum Modules ({filteredModules.length})</span>
            </div>
            <div className="space-y-2">
              {filteredModules.map((item) => (
                <Link
                  key={item.id}
                  href="/roadmap"
                  onClick={onClose}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{item.summary}</p>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.trackName} • {item.pillarTitle}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2 mt-1" />
                </Link>
              ))}
            </div>
          </div>

          {/* Live Streams Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              <Video className="w-3.5 h-3.5 text-copper-600" />
              <span>Live Tech Theater ({filteredStreams.length})</span>
            </div>
            <div className="space-y-2">
              {filteredStreams.map((stream) => (
                <Link
                  key={stream.id}
                  href="/live"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-copper-200 hover:bg-copper-50/40 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-copper-800 transition-colors">
                        {stream.title}
                      </span>
                      {stream.isLive && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {stream.channel} • {stream.category} • {stream.duration}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-copper-600 shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Press ESC to close</span>
          <span>Tip: Select any item to jump directly</span>
        </div>
      </div>
    </div>
  );
}
`);

writeFile('src/components/common/Header.jsx', `"use client";
import React, { useState } from 'react';
import { Search, Flame, Bell, User, LogOut, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';
import Link from 'next/link';

export default function Header({ onToggleSidebar }) {
  const { profile, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-8 backdrop-blur-xl shadow-xs">
        {/* Left: Mobile Toggle & Global Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-amber-300 text-slate-400 text-sm transition-all text-left shadow-2xs group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            <span className="flex-1 font-sans text-slate-500">Search roadmap, algorithms, streams...</span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-md text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Streak, Target Company Badge & User Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Active Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 text-amber-900">
            <Flame className="w-4 h-4 text-amber-600 animate-flicker-flame" />
            <span className="text-xs font-bold tracking-tight">{profile.streak || 14} Day Streak</span>
          </div>

          {/* Target Company Badge (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Target: {profile.targetCompany || 'Google (L5 Core Systems)'}</span>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={profile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={profile.displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/40 shadow-xs"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{profile.displayName || 'Alex Rivera'}</p>
                <p className="text-[11px] text-amber-700 font-medium capitalize">{profile.targetRole || 'MAANG'} Candidate</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-in-up"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{profile.displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  Candidate Profile & Settings
                </Link>
                <Link
                  href="/roadmap"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  3-Track Curriculum
                </Link>
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Chamber
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
`);

writeFile('src/components/common/Sidebar.jsx', `"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Tv, 
  BookOpenCheck, 
  UserCircle2, 
  Sparkles, 
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/hooks/useProgress';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/roadmap', label: '3-Track Roadmap', icon: Map, badge: 'Curriculum' },
  { href: '/live', label: 'Live Tech Theater', icon: Tv, badge: 'Live' },
  { href: '/notes', label: 'Active Recall Notes', icon: BookOpenCheck },
  { href: '/profile', label: 'Candidate Profile', icon: UserCircle2 },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { readinessPercentage, completedInTrack, totalTrackModules, currentTrack } = useProgress();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-out shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200 bg-stone-50/70">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-xs shadow-amber-900/40 group-hover:scale-105 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-amber-700 font-serif font-bold text-base">
                JG
              </div>
            </div>
            <div>
              <span className="font-serif font-bold tracking-tight text-lg text-slate-900 block leading-tight">
                JOBG
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-700 font-semibold uppercase">
                Readiness Chamber
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">
            Platform Chamber
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-600' : 'text-slate-600 group-hover:text-amber-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badge === 'Live'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Active Track Progress Card in Sidebar */}
          <div className="pt-6 pb-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50/50 border border-amber-200/60 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                  {currentTrack.name.split('/')[0]}
                </span>
                <span className="text-xs font-bold text-amber-900">{readinessPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-2.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${readinessPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {completedInTrack} of {totalTrackModules} Modules Mastered
              </p>
            </div>
          </div>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-slate-200 bg-stone-50/60">
          <div className="flex items-center gap-3">
            <img
              src={profile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={profile.displayName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-300 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{profile.displayName || 'Alex Rivera'}</p>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Active: {profile.lastActive || 'Just now'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
`);

console.log('Common components generated.');
