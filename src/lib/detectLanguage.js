/**
 * Lightweight local language detection — no API call needed.
 * Returns: "hi" | "en" | "hinglish"
 */

// Devanagari Unicode range: U+0900 to U+097F
const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

// Common Hinglish trigger words (Hindi words written in Latin script)
const HINGLISH_WORDS = new Set([
  "kya","hai","hain","mera","meri","main","mujhe","aap","tum","kaise",
  "kab","kahan","kyun","nahi","nahin","bahut","accha","theek","bilkul",
  "samajh","seekh","bolna","sikhna","angrezi","hindi","batao","batana",
  "matlab","samajhna","padhna","sunna","likhna","chahiye","chahta","chahti",
]);

export function detectLanguage(text = "") {
  if (!text.trim()) return "en";

  // If Devanagari chars present → Hindi
  if (DEVANAGARI_REGEX.test(text)) return "hi";

  const words = text.toLowerCase().split(/\s+/);
  const hinglishCount = words.filter((w) => HINGLISH_WORDS.has(w)).length;

  // If > 20% words are Hinglish trigger words → classify as Hinglish
  if (hinglishCount / words.length > 0.2) return "hinglish";

  return "en";
}

/**
 * Returns Google STT languageCode and alternativeLanguageCodes for the
 * detected language, supporting Hinglish via multi-language recognition.
 */
export function getSpeechConfig(detectedLang) {
  if (detectedLang === "hi") {
    return {
      languageCode: "hi-IN",
      alternativeLanguageCodes: ["en-IN"],
    };
  }
  if (detectedLang === "hinglish") {
    return {
      languageCode: "hi-IN",
      alternativeLanguageCodes: ["en-IN"],
    };
  }
  // Default: English (Indian accent)
  return {
    languageCode: "en-IN",
    alternativeLanguageCodes: ["hi-IN"],
  };
}