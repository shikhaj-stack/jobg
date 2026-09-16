"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ArrowRight, Github, Mail, Lock, User, Target, Building } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle, loginWithGithub, demoLogin } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("maang");
  const [targetCompany, setTargetCompany] = useState("Google, Meta, Apple");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      await signupWithEmail(email, password, {
        displayName,
        targetRole,
        targetCompany,
      });
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account");
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

  return (
    <div className="min-h-screen flex">
      {/* Left Hero */}
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
            <span>60-DAY SPRINT ENROLLMENT</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight">
            Structure your preparation. Master real-time systems. Get hired at top-tier compensation.
          </h2>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Choose your target company, set your sprint countdown, and unlock verified curriculums across MAANG, Full-Stack, and Web3 protocol engineering.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono">
          Free Forever for candidates. Open Educational Platform.
        </div>
      </div>

      {/* Right Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Create Candidate Account
            </h1>
            <p className="text-xs text-slate-500">
              Join the chamber and start your personalized readiness roadmap.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocial(loginWithGoogle)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-stone-50 text-xs font-medium text-slate-700"
            >
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocial(loginWithGithub)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-stone-50 text-xs font-medium text-slate-700"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-mono text-slate-400 uppercase">
              Or email signup
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase font-mono">
                Full Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@engineer.io"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase font-mono">
                  Target Track
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="maang">MAANG / Tier-1</option>
                  <option value="webdev">Full-Stack Cloud</option>
                  <option value="web3">Web3 Protocol</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase font-mono">
                  Target Company
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="Google, Meta, Uber"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Creating..." : "Initialize 60-Day Sprint"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-amber-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
