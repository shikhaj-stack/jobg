import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/server";

const ENGLISH_VIDEO_POOLS = [
  { videoId: "ULrR_HVbBCU", title: "A to Z English Alphabet & Phonics" },
  { videoId: "BELlZKpi1Zs", title: "Basic English Pronunciation and Words" },
  { videoId: "oiNnNh3mEhI", title: "Everyday English Sentences for Daily Use" },
  { videoId: "dG4CJfgOGS0", title: "Self Introduction & Greetings in English" },
  { videoId: "KdGiCmE7iB8", title: "हिंदी से अंग्रेजी बोलना सीखें" },
  { videoId: "yLkdw4a8SZk", title: "दैनिक बातचीत के आसान अंग्रेजी वाक्य" }
];

export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAuthenticatedUser(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { topic, weeks = 4, lang = "hi" } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const anthropicKey = request.headers.get("x-anthropic-key") || body.anthropicKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

    const systemPrompt = `You are ParivarLearn's Bilingual AI English Curriculum Guide.
Generate a structured, family-friendly bilingual English learning roadmap for the requested topic.
Every title, summary, and topic MUST be a bilingual object with both "en" (English) and "hi" (Hindi) translations.

Schema required:
{
  "trackName": { "en": "string", "hi": "string" },
  "tagline": { "en": "string", "hi": "string" },
  "badge": "Custom Track",
  "totalWeeks": ${weeks},
  "pillars": [
    {
      "id": "p-custom-1",
      "number": "01",
      "title": { "en": "string", "hi": "string" },
      "subtitle": { "en": "string", "hi": "string" },
      "description": { "en": "string", "hi": "string" },
      "modules": [
        {
          "id": "m-c-1",
          "title": { "en": "string", "hi": "string" },
          "difficulty": "Easy | Medium | Hard",
          "estMinutes": 25,
          "summary": { "en": "string", "hi": "string" },
          "topics": [
            { "en": "string", "hi": "string" }
          ],
          "videoId": { "en": "ULrR_HVbBCU", "hi": "KdGiCmE7iB8" }
        }
      ]
    }
  ]
}`;

    if (anthropicKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 2500,
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: `Create a bilingual English learning roadmap for: "${topic}". Target duration: ${weeks} weeks. Return ONLY raw JSON without markdown code fences.`
              }
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.content?.[0]?.text || "";
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({
              success: true,
              topic,
              roadmap: parsed,
              modelUsed: data.model,
              provider: "Anthropic Claude",
            });
          }
        }
      } catch (err) {
        console.warn("Claude API call fallback:", err.message);
      }
    }

    // High quality bilingual fallback curriculum
    const dynamicRoadmap = {
      name: {
        en: `${topic} — English Course`,
        hi: `${topic} — अंग्रेजी सीखें`
      },
      tagline: {
        en: `Step-by-step practical English lessons for ${topic}`,
        hi: `${topic} के लिए कदम-दर-कदम व्यावहारिक अंग्रेजी पाठ`
      },
      badge: "AI Custom Roadmap",
      totalWeeks: weeks,
      stats: { totalModules: 4, estimatedWeeks: weeks },
      pillars: [
        {
          id: "custom-pillar-1",
          number: "01",
          title: {
            en: `Essential Vocabulary for ${topic}`,
            hi: `${topic} के लिए आवश्यक शब्द-भंडार`
          },
          subtitle: {
            en: "Words, meanings & correct pronunciation",
            hi: "शब्द, हिंदी अर्थ और सही उच्चारण"
          },
          description: {
            en: `Learn the most common words and expressions needed when dealing with ${topic}.`,
            hi: `${topic} में उपयोग होने वाले सबसे महत्वपूर्ण शब्द और वाक्यांश सीखें।`
          },
          modules: [
            {
              id: "mod-c1",
              title: {
                en: `Key Words & Greetings for ${topic}`,
                hi: `${topic} के प्रमुख शब्द और अभिवादन`
              },
              difficulty: "Easy",
              estMinutes: 20,
              summary: {
                en: `Master polite greetings, common questions, and essential terminology.`,
                hi: `विनम्र अभिवादन, आम प्रश्न और ज़रूरी शब्दों का अभ्यास करें।`
              },
              topics: [
                { en: "Key Vocabulary List", hi: "प्रमुख शब्दावली सूची" },
                { en: "Polite Request Phrases", hi: "विनम्र निवेदन के वाक्य" }
              ],
              videoId: { en: "ULrR_HVbBCU", hi: "KdGiCmE7iB8" }
            },
            {
              id: "mod-c2",
              title: {
                en: `Listening & Understanding Responses`,
                hi: `सामने वाले की बात सुनना और समझना`
              },
              difficulty: "Medium",
              estMinutes: 25,
              summary: {
                en: `Practice understanding what people say to you in ${topic} situations.`,
                hi: `${topic} के दौरान लोग क्या कह रहे हैं, उसे आसानी से समझना सीखें।`
              },
              topics: [
                { en: "Common Questions You Will Hear", hi: "अक्सर पूछे जाने वाले सवाल" },
                { en: "Keywords to Listen For", hi: "ध्यान देने योग्य शब्द" }
              ],
              videoId: { en: "BELlZKpi1Zs", hi: "TxDo4G6oNV8" }
            }
          ]
        },
        {
          id: "custom-pillar-2",
          number: "02",
          title: {
            en: `Practical Conversations for ${topic}`,
            hi: `${topic} में व्यावहारिक बातचीत`
          },
          subtitle: {
            en: "Speaking confidently without hesitation",
            hi: "बिना हिचकिचाहट के आत्मविश्वास से बोलें"
          },
          description: {
            en: `Complete dialogue practice with step-by-step Hindi explanations and audio practice.`,
            hi: `कदम-दर-कदम हिंदी व्याख्या और अभ्यास के साथ पूरी बातचीत का अभ्यास।`
          },
          modules: [
            {
              id: "mod-c3",
              title: {
                en: `Real-life Dialogue Practice`,
                hi: `वास्तविक बातचीत का अभ्यास`
              },
              difficulty: "Medium",
              estMinutes: 30,
              summary: {
                en: `Full conversation scripts with audio prompts and Sakhi AI voice practice.`,
                hi: `ऑडियो और सखी AI वॉयस अभ्यास के साथ पूर्ण बातचीत।`
              },
              topics: [
                { en: "Starting the Conversation", hi: "बातचीत शुरू करना" },
                { en: "Asking for Clarification", hi: "दोबारा पूछना जब समझ न आए" }
              ],
              videoId: { en: "oiNnNh3mEhI", hi: "yLkdw4a8SZk" }
            },
            {
              id: "mod-c4",
              title: {
                en: `Confidence & Fluency Drill`,
                hi: `आत्मविश्वास और धाराप्रवाह बोलने का अभ्यास`
              },
              difficulty: "Easy",
              estMinutes: 20,
              summary: {
                en: `Review your new phrases with Sakhi voice tutor to build speaking muscle memory.`,
                hi: `सखी वॉयस ट्यूटर के साथ बोलकर अभ्यास करें ताकि झिझक हमेशा के लिए दूर हो।`
              },
              topics: [
                { en: "Pronunciation Practice", hi: "उच्चारण का अभ्यास" },
                { en: "Self-Review Quiz", hi: "स्वयं-जाँच प्रश्नोत्तरी" }
              ],
              videoId: { en: "dG4CJfgOGS0", hi: "eRdeSFi4TXc" }
            }
          ]
        }
      ]
    };

    return NextResponse.json({
      success: true,
      topic,
      roadmap: dynamicRoadmap,
      modelUsed: "ParivarLearn-Synthesizer",
      provider: "Built-in Bilingual Engine",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}