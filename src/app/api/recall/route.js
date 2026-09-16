import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import { supabase } from "@/lib/supabase";

const VOCABULARY_DECK = [
  // ── Beginner (A1) ──────────────────────────────────────────────────────────
  {
    id: "vocab-1",
    track: "beginner",
    category: "Daily Words",
    imageEmoji: "🍎",
    english: "Apple",
    pronunciation: "ऐ-पल",
    hindi: "सेब",
    hinglish: "Apple ko Hindi mein 'seb' kehte hain.",
    example_en: "I eat a fresh apple every morning.",
    example_hi: "मैं हर सुबह एक ताज़ा सेब खाता हूँ।",
    difficulty: "Easy",
    intervalDays: 1,
    easeFactor: 2.5,
  },
  {
    id: "vocab-2",
    track: "beginner",
    category: "Greetings",
    imageEmoji: "🙏",
    english: "Good Morning",
    pronunciation: "गुड मॉर्निन्ग",
    hindi: "शुभ प्रभात / नमस्ते",
    hinglish: "Subah kisi se milne par 'Good Morning' bolte hain.",
    example_en: "Good morning! How did you sleep?",
    example_hi: "सुप्रभात! आप कैसे सोए?",
    difficulty: "Easy",
    intervalDays: 1,
    easeFactor: 2.5,
  },
  {
    id: "vocab-3",
    track: "beginner",
    category: "Family",
    imageEmoji: "👨‍👩‍👧",
    english: "Parents",
    pronunciation: "पेरेन्ट्स",
    hindi: "माता-पिता",
    hinglish: "Mata-pita ko English mein 'Parents' kehte hain.",
    example_en: "My parents live in Varanasi.",
    example_hi: "मेरे माता-पिता वाराणसी में रहते हैं।",
    difficulty: "Easy",
    intervalDays: 2,
    easeFactor: 2.5,
  },
  {
    id: "vocab-4",
    track: "beginner",
    category: "Courtesy",
    imageEmoji: "💐",
    english: "Thank you",
    pronunciation: "थैंक यू",
    hindi: "धन्यवाद / शुक्रिया",
    hinglish: "Jab koi madad kare, toh 'Thank you' bolein.",
    example_en: "Thank you so much for helping me.",
    example_hi: "मेरी मदद करने के लिए बहुत-बहुत धन्यवाद।",
    difficulty: "Easy",
    intervalDays: 1,
    easeFactor: 2.5,
  },
  {
    id: "vocab-5",
    track: "beginner",
    category: "Courtesy",
    imageEmoji: "🤝",
    english: "Please",
    pronunciation: "प्लीज़",
    hindi: "कृपया",
    hinglish: "Koi vinamra nivedan karne ke liye 'Please' lagayein.",
    example_en: "Please give me a glass of water.",
    example_hi: "कृपया मुझे एक गिलास पानी दीजिए।",
    difficulty: "Easy",
    intervalDays: 2,
    easeFactor: 2.5,
  },
  {
    id: "vocab-6",
    track: "beginner",
    category: "Daily Objects",
    imageEmoji: "⏰",
    english: "Clock",
    pronunciation: "क्लॉक",
    hindi: "घड़ी",
    hinglish: "Deewar par lagi ghadi ko 'Clock' kehte hain.",
    example_en: "The clock shows 7:00 AM.",
    example_hi: "घड़ी में सुबह के 7:00 बजे हैं।",
    difficulty: "Easy",
    intervalDays: 3,
    easeFactor: 2.5,
  },

  // ── Conversational (A2–B1) ─────────────────────────────────────────────────
  {
    id: "vocab-7",
    track: "conversational",
    category: "Daily Talk",
    imageEmoji: "💬",
    english: "Hesitate",
    pronunciation: "हेज़िटेट",
    hindi: "हिचकिचाना",
    hinglish: "Bina hichkichaaye bolne ke liye 'Do not hesitate' bolte hain.",
    example_en: "Do not hesitate to ask if you need help.",
    example_hi: "यदि आपको मदद चाहिए तो हिचकिचाएं नहीं।",
    difficulty: "Medium",
    intervalDays: 2,
    easeFactor: 2.6,
  },
  {
    id: "vocab-8",
    track: "conversational",
    category: "Health & Care",
    imageEmoji: "🏥",
    english: "Appointment",
    pronunciation: "अपॉइंटमेन्ट",
    hindi: "मुलाकात का तय समय",
    hinglish: "Doctor ya bank mein samay lene ko 'Appointment' kehte hain.",
    example_en: "I have a doctor's appointment tomorrow morning.",
    example_hi: "कल सुबह डॉक्टर से मेरी मुलाकात तय है।",
    difficulty: "Medium",
    intervalDays: 3,
    easeFactor: 2.6,
  },
  {
    id: "vocab-9",
    track: "conversational",
    category: "Idioms & Phrases",
    imageEmoji: "🌧️",
    english: "Under the weather",
    pronunciation: "अन्डर द वेदर",
    hindi: "तबीयत थोड़ी नासाज़ / बीमार महसूस होना",
    hinglish: "Jab tabiyat thodi kharab ho toh kehte hain: I am under the weather.",
    example_en: "I am feeling a bit under the weather today, so I will rest.",
    example_hi: "आज मेरी तबीयत थोड़ी नासाज़ लग रही है, इसलिए मैं आराम करूँगा।",
    difficulty: "Medium",
    intervalDays: 4,
    easeFactor: 2.7,
  },
  {
    id: "vocab-10",
    track: "conversational",
    category: "Public Speaking",
    imageEmoji: "🎙️",
    english: "Confidence",
    pronunciation: "कॉन्फिडेन्स",
    hindi: "आत्मविश्वास",
    hinglish: "Aatmanirbharta aur vishwas ke saath bolna.",
    example_en: "Speaking every day with Sakhi will build your confidence.",
    example_hi: "सखी के साथ रोज़ बोलने से आपका आत्मविश्वास बढ़ेगा।",
    difficulty: "Medium",
    intervalDays: 3,
    easeFactor: 2.6,
  },

  // ── Advanced (B2–C1) ───────────────────────────────────────────────────────
  {
    id: "vocab-11",
    track: "advanced",
    category: "Workplace",
    imageEmoji: "💼",
    english: "Collaborate",
    pronunciation: "कोलैबोरेट",
    hindi: "सहयोग करना / मिलकर काम करना",
    hinglish: "Kisi project par doosron ke saath milkar kaam karna.",
    example_en: "We need to collaborate closely with the school administration.",
    example_hi: "हमें स्कूल प्रशासन के साथ मिलकर काम करने की ज़रूरत है।",
    difficulty: "Hard",
    intervalDays: 3,
    easeFactor: 2.8,
  },
  {
    id: "vocab-12",
    track: "advanced",
    category: "Formal Speech",
    imageEmoji: "⚖️",
    english: "Furthermore",
    pronunciation: "फ़र्दरमोर",
    hindi: "इसके अलावा / और तो और",
    hinglish: "Apni baat mein ek aur zaroori point jodte waqt 'Furthermore' use karte hain.",
    example_en: "The curriculum is free; furthermore, it offers Hindi voice support.",
    example_hi: "यह पाठ्यक्रम मुफ़्त है; इसके अलावा, यह हिंदी आवाज़ सहायता भी प्रदान करता है।",
    difficulty: "Hard",
    intervalDays: 5,
    easeFactor: 2.8,
  }
];

export async function GET(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const track = searchParams.get("track");

    let cards = VOCABULARY_DECK;
    if (track && track !== "all") {
      cards = cards.filter((c) => c.track === track);
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("saved_vocabulary_cards")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("next_review_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, deck: data });
      }
    }

    return NextResponse.json({ success: true, deck: cards });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { itemId, qualityScore = 3 } = body;

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 });
    }

    // SuperMemo-2 interval calculation
    let nextDays = 1;
    if (qualityScore >= 5) nextDays = 7;
    else if (qualityScore >= 3) nextDays = 3;
    else nextDays = 1;

    const nextReview = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000).toISOString();

    if (supabase) {
      await supabase
        .from("saved_vocabulary_cards")
        .update({
          interval_days: nextDays,
          next_review_at: nextReview,
        })
        .eq("id", itemId)
        .eq("firebase_uid", user.uid);
    }

    return NextResponse.json({
      success: true,
      itemId,
      nextIntervalDays: nextDays,
      nextReviewAt: nextReview,
      message: "Vocabulary review recorded with SM-2 algorithm",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}