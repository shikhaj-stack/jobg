// ═══════════════════════════════════════════════════════════════════════════
// Bilingual English Learning Roadmap Data
// Each module has { en, hi } for title, summary, topics, and videoId
// ═══════════════════════════════════════════════════════════════════════════

export const ROADMAP_TRACKS = {

  // ─── TRACK 1: BEGINNER (A1) ─────────────────────────────────────────────
  beginner: {
    id: "beginner",
    name:    { en: "Beginner English",    hi: "शुरुआती अंग्रेजी" },
    tagline: { en: "Alphabet, basic words & simple sentences", hi: "वर्णमाला, सरल शब्द और छोटे वाक्य" },
    badge:   "A1 Level",
    accentColor: "blue",
    stats: { totalModules: 10, estimatedWeeks: 4 },
    pillars: [
      {
        id: "pillar-alphabet",
        number: "01",
        title:    { en: "Alphabet & Phonics",        hi: "वर्णमाला और ध्वनि" },
        subtitle: { en: "Letters, sounds & writing", hi: "अक्षर, आवाज़ और लिखावट" },
        description: { en: "Master every letter with its sound and shape.", hi: "हर अक्षर की आवाज़ और आकार सीखें।" },
        modules: [
          {
            id: "m-beg-1",
            title:   { en: "A to Z — Sounds & Writing", hi: "A से Z — आवाज़ और लिखावट" },
            summary: { en: "Learn each letter's sound with picture examples. Practice writing uppercase and lowercase.", hi: "हर अक्षर की आवाज़ तस्वीरों के साथ सीखें। बड़े और छोटे अक्षर लिखने का अभ्यास करें।" },
            difficulty: "Easy",
            estMinutes: 20,
            videoId: { en: "36IBDpTRVNE", hi: "hq3yfQnllfQ" },
            topics: [
              { en: "Vowels: A, E, I, O, U",  hi: "स्वर: A, E, I, O, U" },
              { en: "Consonants B to Z",       hi: "व्यंजन B से Z" },
              { en: "Capital vs Small letters", hi: "बड़े और छोटे अक्षर" },
            ],
          },
          {
            id: "m-beg-2",
            title:   { en: "Phonics — Letter Sounds",        hi: "Phonics — अक्षरों की आवाज़" },
            summary: { en: "Learn how each letter sounds in words. Practice cat, bat, hat, man, fan, ran.", hi: "शब्दों में हर अक्षर कैसे बोला जाता है। cat, bat, hat जैसे शब्दों का अभ्यास।" },
            difficulty: "Easy",
            estMinutes: 25,
            videoId: { en: "BELlZKpi1Zs", hi: "ChqnN3cKzXQ" },
            topics: [
              { en: "Short vowel sounds (a, e, i, o, u)", hi: "छोटी स्वर ध्वनियाँ" },
              { en: "Simple CVC words (cat, dog, sun)",  hi: "सरल CVC शब्द" },
            ],
          },
        ],
      },
      {
        id: "pillar-vocabulary",
        number: "02",
        title:    { en: "Basic Vocabulary",        hi: "बुनियादी शब्द-भंडार" },
        subtitle: { en: "Everyday words with Hindi meanings", hi: "रोज़मर्रा के शब्द हिंदी अर्थ के साथ" },
        description: { en: "Build your first 200 essential English words.", hi: "अपने पहले 200 ज़रूरी अंग्रेजी शब्द बनाएं।" },
        modules: [
          {
            id: "m-beg-3",
            title:   { en: "Family & Relationships",        hi: "परिवार और रिश्ते" },
            summary: { en: "Mother, father, sister, brother — learn family words with pronunciation.", hi: "माँ, पिता, बहन, भाई — परिवार के शब्द उच्चारण के साथ सीखें।" },
            difficulty: "Easy",
            estMinutes: 20,
            videoId: { en: "24GWC1dDyUM", hi: "TOkaCU2lS8E" },
            topics: [
              { en: "Nuclear family words",  hi: "मूल परिवार के शब्द" },
              { en: "Extended family words", hi: "बड़े परिवार के शब्द" },
            ],
          },
          {
            id: "m-beg-4",
            title:   { en: "Numbers 1 to 100",    hi: "1 से 100 तक गिनती" },
            summary: { en: "Count, say, and write numbers 1–100 in English.", hi: "अंग्रेजी में 1 से 100 तक गिनना, बोलना और लिखना।" },
            difficulty: "Easy",
            estMinutes: 20,
            videoId: { en: "bGetqbqDVaA", hi: "y3GynqBwV1M" },
            topics: [
              { en: "1–20 with pronunciation", hi: "1 से 20 उच्चारण सहित" },
              { en: "Tens: 20, 30, 40...",     hi: "दहाई: बीस, तीस, चालीस..." },
            ],
          },
          {
            id: "m-beg-5",
            title:   { en: "Colors, Shapes & Sizes", hi: "रंग, आकार और माप" },
            summary: { en: "Describe the world around you — red, blue, circle, square, big, small.", hi: "अपने आस-पास की दुनिया का वर्णन करें — लाल, नीला, गोल, चौकोर, बड़ा, छोटा।" },
            difficulty: "Easy",
            estMinutes: 20,
            videoId: { en: "VdzzE20zQC8", hi: "Qxd9ok73qoA" },
            topics: [
              { en: "12 basic colors",  hi: "12 मूल रंग" },
              { en: "Basic shapes",     hi: "बुनियादी आकार" },
              { en: "Size adjectives",  hi: "आकार विशेषण" },
            ],
          },
        ],
      },
      {
        id: "pillar-greetings",
        number: "03",
        title:    { en: "Greetings & Simple Sentences", hi: "अभिवादन और सरल वाक्य" },
        subtitle: { en: "Say hello, thank you & introduce yourself", hi: "नमस्ते, धन्यवाद और अपना परिचय दें" },
        description: { en: "Speak your first sentences with confidence.", hi: "आत्मविश्वास के साथ पहले वाक्य बोलें।" },
        modules: [
          {
            id: "m-beg-6",
            title:   { en: "Greetings & Polite Phrases", hi: "अभिवादन और शिष्ट वाक्यांश" },
            summary: { en: "Hello, Good morning, How are you? Please, Thank you, Sorry — everyday politeness.", hi: "नमस्ते, सुप्रभात, आप कैसे हैं? कृपया, धन्यवाद, माफ़ी — रोज़ की शिष्टता।" },
            difficulty: "Easy",
            estMinutes: 15,
            videoId: { en: "amxeGGNwwzE", hi: "WyBY5KoOf8g" },
            topics: [
              { en: "Greetings by time of day", hi: "दिन के समय अनुसार अभिवादन" },
              { en: "Polite requests",           hi: "विनम्र अनुरोध" },
            ],
          },
          {
            id: "m-beg-7",
            title:   { en: "Introduce Yourself in English", hi: "अंग्रेजी में अपना परिचय दें" },
            summary: { en: "My name is..., I am from..., I like... — build a simple self-introduction.", hi: "मेरा नाम है..., मैं ... से हूँ..., मुझे ... पसंद है — सरल आत्म-परिचय बनाएं।" },
            difficulty: "Easy",
            estMinutes: 20,
            videoId: { en: "IDaxAC8DdBI", hi: "PofzRwd3q24" },
            topics: [
              { en: "Name, age, city", hi: "नाम, उम्र, शहर" },
              { en: "Hobbies & likes", hi: "शौक और पसंद" },
            ],
          },
        ],
      },
    ],
  },

  // ─── TRACK 2: CONVERSATIONAL (A2–B1) ─────────────────────────────────────
  conversational: {
    id: "conversational",
    name:    { en: "Conversational English",     hi: "बातचीत की अंग्रेजी" },
    tagline: { en: "Tenses, daily talk & common phrases", hi: "काल, रोज़मर्रा की बातें और वाक्यांश" },
    badge:   "A2–B1 Level",
    accentColor: "orange",
    stats: { totalModules: 12, estimatedWeeks: 8 },
    pillars: [
      {
        id: "pillar-tenses",
        number: "01",
        title:    { en: "Tenses Made Simple",    hi: "काल — आसान तरीके से" },
        subtitle: { en: "Present, Past & Future explained in Hindi", hi: "वर्तमान, भूत और भविष्य हिंदी में समझाया" },
        description: { en: "Never confuse tenses again — learn with Hindi explanations.", hi: "काल से कभी भ्रमित न हों — हिंदी में समझाया गया।" },
        modules: [
          {
            id: "m-con-1",
            title:   { en: "Simple Present Tense",  hi: "सामान्य वर्तमान काल" },
            summary: { en: "I eat, She reads, They play — when do we use simple present? Rules with Hindi examples.", hi: "मैं खाता हूँ, वह पढ़ती है — Simple Present कब उपयोग करें? हिंदी उदाहरणों के साथ नियम।" },
            difficulty: "Medium",
            estMinutes: 30,
            videoId: { en: "Ljjiw9mC_Cg", hi: "pXZtRXpGNck" },
            topics: [
              { en: "Subject + Verb rules",     hi: "Subject + Verb के नियम" },
              { en: "He/She/It + s/es",         hi: "He/She/It के साथ s/es" },
              { en: "Negative & Question form", hi: "नकारात्मक और प्रश्न रूप" },
            ],
          },
          {
            id: "m-con-2",
            title:   { en: "Simple Past Tense",  hi: "सामान्य भूत काल" },
            summary: { en: "I went, She cooked, They arrived — past tense rules and irregular verbs.", hi: "मैं गया, उसने पकाया — भूत काल के नियम और अनियमित क्रियाएं।" },
            difficulty: "Medium",
            estMinutes: 30,
            videoId: { en: "HouExpWyNlY", hi: "rOrC7hi2YLA" },
            topics: [
              { en: "Regular verbs + -ed",  hi: "नियमित क्रियाएं + -ed" },
              { en: "Top 50 irregular verbs", hi: "50 अनियमित क्रियाएं" },
            ],
          },
          {
            id: "m-con-3",
            title:   { en: "Future Tense — will & going to", hi: "भविष्य काल — will और going to" },
            summary: { en: "I will call you. I am going to visit Delhi. When to use which?", hi: "मैं आपको call करूंगा। मैं दिल्ली जाने वाला हूँ। कौन सा कब उपयोग करें?" },
            difficulty: "Medium",
            estMinutes: 25,
            videoId: { en: "T-L0BBB2icQ", hi: "KgxL_Gw-sbY" },
            topics: [
              { en: "will vs going to",     hi: "will बनाम going to" },
              { en: "Making predictions",   hi: "भविष्यवाणियाँ करना" },
            ],
          },
        ],
      },
      {
        id: "pillar-daily",
        number: "02",
        title:    { en: "Daily Life Conversations", hi: "रोज़ की बातचीत" },
        subtitle: { en: "Shopping, doctor, travel & office", hi: "खरीदारी, डॉक्टर, सफर और दफ्तर" },
        description: { en: "Real-world conversations you will use every day.", hi: "असली ज़िंदगी की बातचीत जो आप हर दिन करेंगे।" },
        modules: [
          {
            id: "m-con-4",
            title:   { en: "At the Market & Shopping", hi: "बाज़ार और खरीदारी में" },
            summary: { en: "How much does this cost? Do you have a discount? I want to return this.", hi: "इसकी कीमत क्या है? क्या छूट मिलेगी? मुझे यह वापस करना है।" },
            difficulty: "Medium",
            estMinutes: 25,
            videoId: { en: "I00ph_RJYAw", hi: "HouExpWyNlY" },
            topics: [
              { en: "Asking prices", hi: "कीमत पूछना" },
              { en: "Bargaining phrases", hi: "मोलभाव के वाक्य" },
            ],
          },
          {
            id: "m-con-5",
            title:   { en: "At the Doctor",  hi: "डॉक्टर के पास" },
            summary: { en: "I have a fever. My stomach hurts. How many times a day should I take this?", hi: "मुझे बुखार है। मेरे पेट में दर्द है। दिन में कितनी बार लेनी है?" },
            difficulty: "Medium",
            estMinutes: 25,
            videoId: { en: "Cj9DKRWp-ek", hi: "rOrC7hi2YLA" },
            topics: [
              { en: "Describing symptoms", hi: "लक्षण बताना" },
              { en: "Understanding prescriptions", hi: "दवाई की पर्ची समझना" },
            ],
          },
          {
            id: "m-con-6",
            title:   { en: "Directions & Travel", hi: "रास्ता और यात्रा" },
            summary: { en: "How do I get to the station? Turn left, go straight, take the second right.", hi: "स्टेशन कैसे जाएं? बाईं तरफ मुड़ें, सीधे जाएं, दूसरी दाईं तरफ लें।" },
            difficulty: "Medium",
            estMinutes: 20,
            videoId: { en: "SHXPpsIJTb0", hi: "WyBY5KoOf8g" },
            topics: [
              { en: "Giving directions", hi: "रास्ता बताना" },
              { en: "Transport vocabulary", hi: "परिवहन शब्दावली" },
            ],
          },
        ],
      },
      {
        id: "pillar-idioms",
        number: "03",
        title:    { en: "Common Idioms & Phrases", hi: "आम मुहावरे और वाक्यांश" },
        subtitle: { en: "Sound natural in English conversations", hi: "अंग्रेजी बातचीत में स्वाभाविक लगें" },
        description: { en: "Use idioms to speak like a native — explained in Hindi.", hi: "मुहावरों का उपयोग करके ऐसे बोलें जैसे मातृभाषी — हिंदी में समझाया गया।" },
        modules: [
          {
            id: "m-con-7",
            title:   { en: "25 Most Used Idioms",    hi: "25 सबसे ज़्यादा उपयोग होने वाले मुहावरे" },
            summary: { en: "Break a leg, Hit the nail, Under the weather — with Hindi meaning & example sentences.", hi: "Break a leg, Hit the nail — हिंदी अर्थ और उदाहरण वाक्यों के साथ।" },
            difficulty: "Medium",
            estMinutes: 35,
            videoId: { en: "RRJtDw4TNPM", hi: "pXZtRXpGNck" },
            topics: [
              { en: "Work & career idioms", hi: "काम और करियर के मुहावरे" },
              { en: "Feeling & emotion idioms", hi: "भावना के मुहावरे" },
            ],
          },
        ],
      },
    ],
  },

  // ─── TRACK 3: ADVANCED (B2–C1) ───────────────────────────────────────────
  advanced: {
    id: "advanced",
    name:    { en: "Advanced English",      hi: "उन्नत अंग्रेजी" },
    tagline: { en: "Grammar mastery, writing & business English", hi: "व्याकरण, लेखन और व्यापारिक अंग्रेजी" },
    badge:   "B2–C1 Level",
    accentColor: "emerald",
    stats: { totalModules: 10, estimatedWeeks: 10 },
    pillars: [
      {
        id: "pillar-grammar",
        number: "01",
        title:    { en: "Grammar Mastery",         hi: "व्याकरण में महारत" },
        subtitle: { en: "Articles, prepositions & complex tenses", hi: "Articles, prepositions और जटिल काल" },
        description: { en: "Eliminate grammar errors and write correctly.", hi: "व्याकरण की गलतियाँ दूर करें और सही लिखें।" },
        modules: [
          {
            id: "m-adv-1",
            title:   { en: "Articles — A, An, The",  hi: "Articles — A, An, The" },
            summary: { en: "The trickiest part of English — when to use a, an, or the? Explained with Hindi rules.", hi: "अंग्रेजी का सबसे मुश्किल हिस्सा — a, an, या the कब लगाएं? हिंदी नियमों के साथ।" },
            difficulty: "Hard",
            estMinutes: 40,
            videoId: { en: "r49hrj4cK5U", hi: "2hlnMQKPdE8" },
            topics: [
              { en: "Definite vs Indefinite article", hi: "निश्चित बनाम अनिश्चित article" },
              { en: "When to use NO article",         hi: "article कब न लगाएं" },
            ],
          },
          {
            id: "m-adv-2",
            title:   { en: "Prepositions — In, On, At & more", hi: "Prepositions — In, On, At और अधिक" },
            summary: { en: "I am at home. She sat on the chair. The keys are in the drawer. Master all prepositions.", hi: "मैं घर पर हूँ। वह कुर्सी पर बैठी। चाबियाँ दराज में हैं। सभी prepositions सीखें।" },
            difficulty: "Hard",
            estMinutes: 35,
            videoId: { en: "r49hrj4cK5U", hi: "Kwtm_Awg-lE" },
            topics: [
              { en: "Place prepositions",  hi: "स्थान prepositions" },
              { en: "Time prepositions",   hi: "समय prepositions" },
            ],
          },
        ],
      },
      {
        id: "pillar-writing",
        number: "02",
        title:    { en: "Writing Skills",          hi: "लेखन कौशल" },
        subtitle: { en: "Emails, letters & paragraphs", hi: "ईमेल, पत्र और अनुच्छेद" },
        description: { en: "Write professional emails and formal letters in English.", hi: "अंग्रेजी में पेशेवर ईमेल और औपचारिक पत्र लिखें।" },
        modules: [
          {
            id: "m-adv-3",
            title:   { en: "Writing a Formal Email", hi: "औपचारिक ईमेल कैसे लिखें" },
            summary: { en: "Subject line, greeting, body, closing — structure a professional email from scratch.", hi: "Subject line, अभिवादन, मुख्य भाग, समापन — शुरू से एक पेशेवर ईमेल बनाएं।" },
            difficulty: "Hard",
            estMinutes: 40,
            videoId: { en: "rGrH-IGHS9w", hi: "rGrH-IGHS9w" },
            topics: [
              { en: "Email structure & format",      hi: "ईमेल की संरचना और प्रारूप" },
              { en: "Professional vocabulary",       hi: "पेशेवर शब्दावली" },
              { en: "Common email phrases",          hi: "आम ईमेल वाक्यांश" },
            ],
          },
        ],
      },
      {
        id: "pillar-business",
        number: "03",
        title:    { en: "Business English",      hi: "व्यापारिक अंग्रेजी" },
        subtitle: { en: "Meetings, presentations & office talk", hi: "मीटिंग, प्रेज़ेंटेशन और दफ्तर की बातें" },
        description: { en: "Speak with confidence in professional settings.", hi: "पेशेवर माहौल में आत्मविश्वास के साथ बोलें।" },
        modules: [
          {
            id: "m-adv-4",
            title:   { en: "Office Vocabulary & Small Talk", hi: "दफ्तर की शब्दावली और छोटी बातचीत" },
            summary: { en: "Deadline, presentation, agenda, minutes of meeting — plus water-cooler small talk.", hi: "Deadline, प्रेज़ेंटेशन, agenda — और दफ्तर में की जाने वाली आम बातचीत।" },
            difficulty: "Medium",
            estMinutes: 35,
            videoId: { en: "8WURPzIEiHE", hi: "PofzRwd3q24" },
            topics: [
              { en: "Meeting vocabulary",  hi: "मीटिंग की शब्दावली" },
              { en: "Professional small talk", hi: "पेशेवर छोटी बातचीत" },
            ],
          },
        ],
      },
    ],
  },
};