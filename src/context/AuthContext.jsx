"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  googleProvider, 
  githubProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  updateProfile
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
  const [idToken, setIdToken] = useState(null);

  // Sync server demo session cookie
  const syncServerDemoSession = useCallback(async (userData) => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', userData }),
      });
    } catch (e) {
      console.warn('Server session sync notice:', e);
    }
  }, []);

  const clearServerDemoSession = useCallback(async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (e) {
      console.warn('Server session clear notice:', e);
    }
  }, []);

  // Initialize auth & load saved local profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('jobg_user_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(prev => ({ ...prev, ...parsed }));
        } catch (e) {}
      }

      const isDemoLoggedIn = localStorage.getItem('jobg_demo_logged_in');
      if (isDemoLoggedIn === 'true') {
        const demoUser = {
          uid: profile.uid || 'demo-user-101',
          email: profile.email || 'alex.rivera@engineer.io',
          displayName: profile.displayName || 'Alex Rivera',
          photoURL: profile.photoURL || DEFAULT_PROFILE.photoURL,
          isDemo: true,
        };
        setUser(demoUser);
        syncServerDemoSession(demoUser);
      }
    }

    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const token = await firebaseUser.getIdToken();
            setIdToken(token);
          } catch (e) {}

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
  }, [syncServerDemoSession]);

  const saveProfile = useCallback((newProfileData) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfileData, lastActive: 'Just now' };
      if (typeof window !== 'undefined') {
        localStorage.setItem('jobg_user_profile', JSON.stringify(updated));
      }
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
  }, [user]);

  const demoLogin = useCallback((customData = {}) => {
    const newUser = {
      uid: customData.uid || ('demo-user-' + Date.now()),
      email: customData.email || 'alex.rivera@engineer.io',
      displayName: customData.displayName || 'Alex Rivera',
      photoURL: customData.photoURL || DEFAULT_PROFILE.photoURL,
      isDemo: true,
    };
    setUser(newUser);
    saveProfile(customData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobg_demo_logged_in', 'true');
    }
    syncServerDemoSession(newUser);
    return newUser;
  }, [saveProfile, syncServerDemoSession]);

  const loginWithGoogle = async () => {
    if (auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        setIdToken(token);
        return result.user;
      } catch (err) {
        console.warn('Firebase Google Auth notice, switching to demo:', err.message);
      }
    }
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
        const token = await result.user.getIdToken();
        setIdToken(token);
        return result.user;
      } catch (err) {
        console.warn('Firebase GitHub Auth notice, switching to demo:', err.message);
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
        const token = await result.user.getIdToken();
        setIdToken(token);
        return result.user;
      } catch (err) {
        console.warn('Firebase Email Auth notice, falling back to demo session:', err.message);
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
        const token = await result.user.getIdToken();
        setIdToken(token);
        saveProfile({ ...extraData, email, displayName: extraData.displayName || email.split('@')[0] });
        return result.user;
      } catch (err) {
        console.warn('Firebase Signup notice, falling back to demo session:', err.message);
      }
    }
    return demoLogin({
      email,
      displayName: extraData.displayName || email.split('@')[0],
      ...extraData
    });
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(null);
    setIdToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jobg_demo_logged_in');
    }
    await clearServerDemoSession();
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      idToken,
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
