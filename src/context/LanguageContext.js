"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import enTranslations from "@/i18n/en.json";
import hiTranslations from "@/i18n/hi.json";

const TRANSLATION_MAP = {
  en: enTranslations,
  hi: hiTranslations,
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  // On mount: read saved preference safely
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("lang") || "en";
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch (e) {}
  }, []);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lang", newLang);
        document.documentElement.lang = newLang;
      }
    } catch (e) {}
  }, []);

  // t("hero.headline") — resolves dot-notation keys synchronously
  const t = useCallback((key, fallback = "") => {
    if (!key || typeof key !== "string") return fallback || "";
    const activeDictionary = TRANSLATION_MAP[lang] || TRANSLATION_MAP.en;
    const parts = key.split(".");
    let val = activeDictionary;
    for (const part of parts) {
      if (val == null) {
        // Fallback to English dictionary if key missing in Hindi
        let fallbackVal = TRANSLATION_MAP.en;
        for (const fp of parts) {
          if (fallbackVal == null) return fallback || key;
          fallbackVal = fallbackVal[fp];
        }
        return (fallbackVal != null && fallbackVal !== "") ? fallbackVal : (fallback || key);
      }
      val = val[part];
    }
    return (val != null && val !== "") ? val : (fallback || key);
  }, [lang]);

  // For bilingual objects: { en: "...", hi: "..." }
  const tObj = useCallback((obj) => {
    if (!obj) return "";
    if (typeof obj !== "object") return String(obj);
    return obj[lang] || obj.en || obj.hi || Object.values(obj)[0] || "";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      lang: "en",
      setLang: () => {},
      t: (k, fb = "") => fb || k,
      tObj: (obj) => (typeof obj === "object" ? (obj?.en || obj?.hi || "") : String(obj || "")),
    };
  }
  return ctx;
}