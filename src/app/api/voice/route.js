import { NextResponse } from "next/server";
import { convertAudioToText } from "@/lib/googleSpeech";
import { textToSpeech }       from "@/lib/googleTTS";
import { detectLanguage, getSpeechConfig } from "@/lib/detectLanguage";

// System prompt for Sakhi — bilingual English tutor AI
const SAKHI_SYSTEM_PROMPT = `You are Sakhi, a kind and encouraging English tutor for Indian families.
Your learners speak Hindi, English, or a mix (Hinglish).
Rules:
1. Always reply in BOTH Hindi AND English — Hindi explanation first, then English equivalent.
2. Use simple words. Avoid complicated grammar terminology without explaining it in Hindi.
3. Be warm, patient, and encouraging like a family elder.
4. Use everyday Indian examples (chai, roti, bazaar, railway station).
5. Keep replies concise — 3 to 5 sentences per language.
6. If the user makes a grammar mistake, gently correct it.
Format your reply as:
[Hindi explanation]
---
[English explanation]`;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");      // Blob
    const userLang  = formData.get("lang") || "hi"; // "en" | "hi"

    if (!audioFile) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // ── Step 1: Convert audio blob to base64 ─────────────────────────────
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64");

    // ── Step 2: Speech-to-Text (Google STT with Hinglish support) ────────
    const { languageCode, alternativeLanguageCodes } = getSpeechConfig(userLang === "hi" ? "hi" : "en");
    let transcript = await convertAudioToText(audioBase64, languageCode, alternativeLanguageCodes);

    // Fallback if STT key not configured
    if (!transcript) {
      return NextResponse.json({
        transcript: null,
        reply:      { hi: "माफ़ करें, आवाज़ सुनाई नहीं दी। कृपया दोबारा बोलें।", en: "Sorry, could not hear you. Please try again." },
        audioBase64: null,
        sttAvailable: false,
      });
    }

    // ── Step 3: Detect language of the transcript ─────────────────────────
    const detectedLang = detectLanguage(transcript);

    // ── Step 4: Send to Claude/LLM ────────────────────────────────────────
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    let replyText = "";

    if (anthropicKey) {
      const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key":         anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type":      "application/json",
        },
        body: JSON.stringify({
          model:      "claude-haiku-20240307",
          max_tokens: 400,
          system:     SAKHI_SYSTEM_PROMPT,
          messages:   [{ role: "user", content: transcript }],
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        replyText = aiData.content?.[0]?.text || "";
      }
    }

    // Fallback reply if no API key
    if (!replyText) {
      replyText = `आपने पूछा: "${transcript}" — बहुत अच्छा सवाल!\n---\nYou asked: "${transcript}" — Great question! Please configure ANTHROPIC_API_KEY for full AI responses.`;
    }

    // ── Step 5: Split reply into Hindi + English parts ────────────────────
    const [hiPart, enPart] = replyText.split("---").map((s) => s.trim());

    // ── Step 6: Text-to-Speech (speak the Hindi part if user is in Hindi mode) ──
    const ttsLang    = detectedLang === "en" ? "en" : "hi";
    const ttsText    = ttsLang === "hi" ? (hiPart || replyText) : (enPart || replyText);
    const audioBase64Out = await textToSpeech(ttsText, ttsLang);

    return NextResponse.json({
      transcript,
      detectedLang,
      reply: {
        hi: hiPart || replyText,
        en: enPart || replyText,
      },
      audioBase64: audioBase64Out,  // base64 MP3 — client plays via <audio>
      sttAvailable: true,
    });

  } catch (error) {
    console.error("[voice route]", error);
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 }
    );
  }
}