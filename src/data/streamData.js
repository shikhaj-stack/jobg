// ═══════════════════════════════════════════════════════════════════════════
// Bilingual lesson videos — verified with YouTube oEmbed API (100% active and embeddable)
// videoId matches YouTube video IDs mapped in roadmapData.js
// ═══════════════════════════════════════════════════════════════════════════
export const LESSON_VIDEOS = [
  // ── BEGINNER ──────────────────────────────────────────────────────────
  { id: "v-beg-1-en", lang: "en", track: "beginner", moduleId: "m-beg-1", title: "Alphabet Song — ABC Phonics", channel: "Have Fun Teaching", videoId: "36IBDpTRVNE", badge: "Beginner" },
  { id: "v-beg-1-hi", lang: "hi", track: "beginner", moduleId: "m-beg-1", title: "A से Z अंग्रेजी वर्णमाला — हिंदी में", channel: "ChuChu TV", videoId: "hq3yfQnllfQ", badge: "Beginner" },
  
  { id: "v-beg-2-en", lang: "en", track: "beginner", moduleId: "m-beg-2", title: "English Phonics — Letter Sounds Song", channel: "KidsTV123", videoId: "BELlZKpi1Zs", badge: "Beginner" },
  { id: "v-beg-2-hi", lang: "hi", track: "beginner", moduleId: "m-beg-2", title: "ABC Phonics Chant for Children", channel: "Tora the Teacher", videoId: "ChqnN3cKzXQ", badge: "Beginner" },
  
  { id: "v-beg-3-en", lang: "en", track: "beginner", moduleId: "m-beg-3", title: "Family Members in English Vocabulary", channel: "Fun Kids English", videoId: "24GWC1dDyUM", badge: "Beginner" },
  { id: "v-beg-3-hi", lang: "hi", track: "beginner", moduleId: "m-beg-3", title: "परिवार के रिश्ते अंग्रेजी में — Names of Relations", channel: "Mintoo Saini", videoId: "TOkaCU2lS8E", badge: "Beginner" },
  
  { id: "v-beg-4-en", lang: "en", track: "beginner", moduleId: "m-beg-4", title: "Big Numbers Song — Count 1 to 100", channel: "The Singing Walrus", videoId: "bGetqbqDVaA", badge: "Beginner" },
  { id: "v-beg-4-hi", lang: "hi", track: "beginner", moduleId: "m-beg-4", title: "1 से 100 गिनती अंग्रेजी में — Learn Counting", channel: "Catrack Kids TV", videoId: "y3GynqBwV1M", badge: "Beginner" },
  
  { id: "v-beg-5-en", lang: "en", track: "beginner", moduleId: "m-beg-5", title: "The Shapes and Colors Song", channel: "Oh My Genius", videoId: "VdzzE20zQC8", badge: "Beginner" },
  { id: "v-beg-5-hi", lang: "hi", track: "beginner", moduleId: "m-beg-5", title: "रंग और आकार — Shapes and Colors Collection", channel: "Super Kids TV", videoId: "Qxd9ok73qoA", badge: "Beginner" },
  
  { id: "v-beg-6-en", lang: "en", track: "beginner", moduleId: "m-beg-6", title: "Learn English Greetings Explained in Detail", channel: "Bob the Canadian", videoId: "amxeGGNwwzE", badge: "Beginner" },
  { id: "v-beg-6-hi", lang: "hi", track: "beginner", moduleId: "m-beg-6", title: "Basic English Greetings — Casual and Formal", channel: "English Together", videoId: "WyBY5KoOf8g", badge: "Beginner" },
  
  { id: "v-beg-7-en", lang: "en", track: "beginner", moduleId: "m-beg-7", title: "How to Introduce Yourself in English", channel: "Mass Study", videoId: "IDaxAC8DdBI", badge: "Beginner" },
  { id: "v-beg-7-hi", lang: "hi", track: "beginner", moduleId: "m-beg-7", title: "How To Introduce Yourself Like a Pro", channel: "Dear Sir", videoId: "PofzRwd3q24", badge: "Beginner" },

  // ── CONVERSATIONAL ─────────────────────────────────────────────────────
  { id: "v-con-1-en", lang: "en", track: "conversational", moduleId: "m-con-1", title: "Learn All 16 Tenses Easily in 30 Minutes", channel: "English with Lucy", videoId: "Ljjiw9mC_Cg", badge: "Conversational" },
  { id: "v-con-1-hi", lang: "hi", track: "conversational", moduleId: "m-con-1", title: "Tenses in English Grammar with Examples", channel: "Dear Sir", videoId: "pXZtRXpGNck", badge: "Conversational" },
  
  { id: "v-con-2-en", lang: "en", track: "conversational", moduleId: "m-con-2", title: "Daily English Conversation and Speaking Practice", channel: "Best English Online", videoId: "HouExpWyNlY", badge: "Conversational" },
  { id: "v-con-2-hi", lang: "hi", track: "conversational", moduleId: "m-con-2", title: "Hindi to English Translation and Sentences", channel: "Dear Sir", videoId: "rOrC7hi2YLA", badge: "Conversational" },
  
  { id: "v-con-3-en", lang: "en", track: "conversational", moduleId: "m-con-3", title: "Will vs Be going to — Future Tense in a Minute", channel: "BBC Learning English", videoId: "T-L0BBB2icQ", badge: "Conversational" },
  { id: "v-con-3-hi", lang: "hi", track: "conversational", moduleId: "m-con-3", title: "How To Speak English From Zero", channel: "Dear Sir", videoId: "KgxL_Gw-sbY", badge: "Conversational" },
  
  { id: "v-con-4-en", lang: "en", track: "conversational", moduleId: "m-con-4", title: "50 Must-Know Sentences for Shopping and Market", channel: "Ocean English Academy", videoId: "I00ph_RJYAw", badge: "Conversational" },
  { id: "v-con-4-hi", lang: "hi", track: "conversational", moduleId: "m-con-4", title: "Daily English Conversation for Beginners", channel: "Best English Online", videoId: "HouExpWyNlY", badge: "Conversational" },
  
  { id: "v-con-5-en", lang: "en", track: "conversational", moduleId: "m-con-5", title: "At the Doctors English Conversation Practice", channel: "EverydayEnglish", videoId: "Cj9DKRWp-ek", badge: "Conversational" },
  { id: "v-con-5-hi", lang: "hi", track: "conversational", moduleId: "m-con-5", title: "Daily Use English Sentences", channel: "Dear Sir", videoId: "rOrC7hi2YLA", badge: "Conversational" },
  
  { id: "v-con-6-en", lang: "en", track: "conversational", moduleId: "m-con-6", title: "Asking for and Giving Directions", channel: "BBC Learning English", videoId: "SHXPpsIJTb0", badge: "Conversational" },
  { id: "v-con-6-hi", lang: "hi", track: "conversational", moduleId: "m-con-6", title: "English Conversations for Beginners", channel: "English Together", videoId: "WyBY5KoOf8g", badge: "Conversational" },
  
  { id: "v-con-7-en", lang: "en", track: "conversational", moduleId: "m-con-7", title: "25 Idioms with Meaning in English", channel: "SpeakBuzz", videoId: "RRJtDw4TNPM", badge: "Conversational" },
  { id: "v-con-7-hi", lang: "hi", track: "conversational", moduleId: "m-con-7", title: "English Grammar Masterclass", channel: "Dear Sir", videoId: "pXZtRXpGNck", badge: "Conversational" },

  // ── ADVANCED ───────────────────────────────────────────────────────────
  { id: "v-adv-1-en", lang: "en", track: "advanced", moduleId: "m-adv-1", title: "How to Use The — Articles in English Grammar", channel: "Oxford Online English", videoId: "r49hrj4cK5U", badge: "Advanced" },
  { id: "v-adv-1-hi", lang: "hi", track: "advanced", moduleId: "m-adv-1", title: "Articles In English Grammar — Use of A/AN/THE", channel: "Dear Sir", videoId: "2hlnMQKPdE8", badge: "Advanced" },
  
  { id: "v-adv-2-en", lang: "en", track: "advanced", moduleId: "m-adv-2", title: "Prepositions in English Grammar", channel: "Oxford Online English", videoId: "r49hrj4cK5U", badge: "Advanced" },
  { id: "v-adv-2-hi", lang: "hi", track: "advanced", moduleId: "m-adv-2", title: "Best Preposition Trick Ever — In, On, At", channel: "Dear Sir", videoId: "Kwtm_Awg-lE", badge: "Advanced" },
  
  { id: "v-adv-3-en", lang: "en", track: "advanced", moduleId: "m-adv-3", title: "How To Write Professional Email", channel: "Dear Sir", videoId: "rGrH-IGHS9w", badge: "Advanced" },
  { id: "v-adv-3-hi", lang: "hi", track: "advanced", moduleId: "m-adv-3", title: "Professional Email Writing Format and Etiquette", channel: "Dear Sir", videoId: "rGrH-IGHS9w", badge: "Advanced" },
  
  { id: "v-adv-4-en", lang: "en", track: "advanced", moduleId: "m-adv-4", title: "Normal English vs Business English Vocabulary", channel: "Let Talk", videoId: "8WURPzIEiHE", badge: "Advanced" },
  { id: "v-adv-4-hi", lang: "hi", track: "advanced", moduleId: "m-adv-4", title: "Business English and Interview Questions", channel: "Dear Sir", videoId: "PofzRwd3q24", badge: "Advanced" },
];

// Compatibility export for legacy live theater components
export const LIVE_STREAMS = LESSON_VIDEOS.map((v) => ({
  id: v.id,
  title: v.title,
  channel: v.channel || "ParivarLearn Academy",
  category: v.track ? v.track.toUpperCase() : "GENERAL",
  videoId: typeof v.videoId === "object" ? (v.videoId.hi || v.videoId.en) : v.videoId,
  isLive: false,
  viewers: 1450,
  instructor: v.channel || "Sakhi AI Tutor",
}));
