"use client";
import { useLanguage } from "@/context/LanguageContext";

/**
 * YouTubePlayer
 * Props:
 *   videoId  — YouTube video ID (string)
 *   title    — bilingual { en, hi } object or plain string
 *   autoplay — boolean (default false)
 */
export default function YouTubePlayer({ videoId, title, autoplay = false }) {
  const { lang, tObj } = useLanguage();

  if (!videoId) return null;

  const displayTitle = typeof title === "object" ? tObj(title) : title;

  // Build embed URL with language hints
  const params = new URLSearchParams({
    rel:            "0",
    modestbranding: "1",
    hl:             lang === "hi" ? "hi" : "en",   // YouTube UI language
    cc_lang_pref:   lang === "hi" ? "hi" : "en",   // Preferred caption language
    cc_load_policy: "1",                            // Auto-show captions
    ...(autoplay ? { autoplay: "1" } : {}),
  });

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-black shadow-xl">
      {displayTitle && (
        <div className="px-4 py-3 bg-slate-800 flex items-center gap-2">
          <span className="text-red-500 text-lg">▶</span>
          <span className="text-white font-medium text-sm truncate">{displayTitle}</span>
        </div>
      )}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={displayTitle || "Lesson Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}