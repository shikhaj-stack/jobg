"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ArrowRight, Github, Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithGithub, loginWithEmail, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      await loginWithEmail(email, password);
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (providerFn) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await providerFn();
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    demoLogin();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Chamber Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-serif font-bold text-base">
              KN
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white">
              KUCHNAYA // Chamber
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE ELITE PREPARATION STANDARD</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight">
            "KUCHNAYA gave me the exact mental discipline required to crack the Google L5 bar."
          </h2>

          <p className="text-xs text-slate-400 font-mono">
            — Staff Software Engineer, Mountain View (Ex-Tier 1 Candidate)
          </p>

          <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 text-xs">
            <div>
              <div className="font-bold text-white text-base">14 Days</div>
              <div className="text-slate-400">Avg Streak</div>
            </div>
            <div>
              <div className="font-bold text-white text-base">92%</div>
              <div className="text-slate-400">ATS Pass Rate</div>
            </div>
            <div>
              <div className="font-bold text-white text-base">4 Pillars</div>
              <div className="text-slate-400">Mastery Loop</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono">
          Protected with end-to-end zero-latency state sync.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white font-serif font-bold text-sm">
                KN
              </div>
              <span className="font-serif font-bold text-slate-900">KUCHNAYA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Welcome Back to Chamber
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Continue your 60-day sprint where you left off.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Social Logins */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocial(loginWithGoogle)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-stone-50 font-medium text-xs text-slate-700 transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocial(loginWithGithub)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-stone-50 font-medium text-xs text-slate-700 transition-all shadow-2xs"
            >
              <Github className="w-4 h-4" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-mono text-slate-400 uppercase">
              Or email login
            </span>
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@engineer.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Instant 1-Click Demo Login */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
            <p className="text-xs font-semibold text-amber-900">
              Want to preview instantly without typing credentials?
            </p>
            <button
              onClick={handleQuickDemo}
              className="w-full py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              🚀 Instant 1-Click Demo Login
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/signup" className="font-bold text-amber-700 hover:underline">
              Start Free 60-Day Sprint
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
