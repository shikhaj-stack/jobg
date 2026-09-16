"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [translations, setTranslations] = useState({});

  // Load translations for the given language
  const loadTranslations = useCallback(async (language) => {
    try {
      const mod = await import(`@/i18n/${language}.json`);
      setTranslations(mod.default || mod);
    } catch {
      // fallback to empty obj — no crash
      setTranslations({});
    }
  }, []);

  // On mount: read saved preference
  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem("lang") || "en"
      : "en";
    setLangState(saved);
    loadTranslations(saved);
    // Set html[lang] attribute for CSS font switching
    document.documentElement.lang = saved;
  }, [loadTranslations]);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
    loadTranslations(newLang);
  }, [loadTranslations]);

  // t("hero.headline") — resolves dot-notation keys
  const t = useCallback((key, fallback = "") => {
    const parts = key.split(".");
    let val = translations;
    for (const part of parts) {
      if (val == null) return fallback || key;
      val = val[part];
    }
    return (val != null && val !== "") ? val : (fallback || key);
  }, [translations]);

  // For bilingual objects: { en: "...", hi: "..." }
  const tObj = useCallback((obj) => {
    if (!obj || typeof obj !== "object") return obj ?? "";
    return obj[lang] ?? obj["en"] ?? "";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}