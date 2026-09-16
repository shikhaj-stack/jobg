"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle({ className = "" }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/20 ${className}`}>
      <button
        onClick={() => setLang("en")}
        aria-label="Switch to English"
        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
          lang === "en"
            ? "bg-family-accent text-white shadow"
            : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        aria-label="हिंदी में बदलें"
        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 font-hindi ${
          lang === "hi"
            ? "bg-family-accent text-white shadow"
            : "text-white/60 hover:text-white"
        }`}
      >
        हिं
      </button>
    </div>
  );
}