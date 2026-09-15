"use client";
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
      displayName: email.split('@')[0].replace('.', ' ').replace(/w/g, l => l.toUpperCase()),
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
