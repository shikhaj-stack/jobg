/**
 * Google Cloud Speech-to-Text wrapper
 * Supports Hindi, English, and Hinglish (hi-IN + en-IN alternative)
 *
 * Requires env var: GOOGLE_SPEECH_API_KEY
 * Fallback: if key is not set, resolves with null (browser fallback handles it)
 */

const SPEECH_API_URL = "https://speech.googleapis.com/v1/speech:recognize";

/**
 * Converts an audio buffer (base64) to text using Google STT.
 * @param {string} audioBase64 — base64-encoded audio (WebM/OGG/WAV)
 * @param {string} languageCode — e.g. "hi-IN", "en-IN"
 * @param {string[]} alternativeLanguageCodes — for Hinglish support
 * @returns {Promise<string|null>} — transcript text or null on failure
 */
export async function convertAudioToText(audioBase64, languageCode = "hi-IN", alternativeLanguageCodes = ["en-IN"]) {
  const apiKey = process.env.GOOGLE_SPEECH_API_KEY;

  if (!apiKey) {
    console.warn("[googleSpeech] GOOGLE_SPEECH_API_KEY not set — STT skipped");
    return null;
  }

  const body = {
    config: {
      encoding:                  "WEBM_OPUS",
      sampleRateHertz:           48000,
      languageCode,
      alternativeLanguageCodes,
      enableAutomaticPunctuation: true,
      model:                     "latest_long",
    },
    audio: { content: audioBase64 },
  };

  const res = await fetch(`${SPEECH_API_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[googleSpeech] STT error:", err);
    return null;
  }

  const data = await res.json();
  const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || null;
  return transcript;
}