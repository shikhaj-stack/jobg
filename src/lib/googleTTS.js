/**
 * Google Cloud Text-to-Speech wrapper
 * Uses WaveNet voices for natural Hindi/English Indian accent output.
 *
 * Requires env var: GOOGLE_TTS_API_KEY
 * Returns base64-encoded MP3 audio string.
 */

const TTS_API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

const VOICES = {
  hi: { languageCode: "hi-IN", name: "hi-IN-Wavenet-D", ssmlGender: "FEMALE" },
  en: { languageCode: "en-IN", name: "en-IN-Wavenet-A", ssmlGender: "FEMALE" },
};

/**
 * Converts text to speech audio (base64 MP3).
 * @param {string} text — the text to speak
 * @param {"hi"|"en"} lang — language of the text
 * @returns {Promise<string|null>} — base64 MP3 or null on failure
 */
export async function textToSpeech(text, lang = "hi") {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;

  if (!apiKey) {
    console.warn("[googleTTS] GOOGLE_TTS_API_KEY not set — TTS skipped");
    return null;
  }

  const voice = VOICES[lang] || VOICES["hi"];

  const body = {
    input:       { text },
    voice,
    audioConfig: { audioEncoding: "MP3", speakingRate: 0.9, pitch: 0 },
  };

  const res = await fetch(`${TTS_API_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[googleTTS] TTS error:", err);
    return null;
  }

  const data = await res.json();
  return data.audioContent || null; // base64 MP3
}