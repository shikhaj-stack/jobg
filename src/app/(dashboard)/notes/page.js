"use client";
import React, { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { 
  BookOpen, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ChevronRight,
  Filter
} from "lucide-react";

export default function NotesPage() {
  const { notes, saveNote } = useProgress();
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState("recall"); // "recall" | "notes"
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [recallDeck, setRecallDeck] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // New Note state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const fetchDeck = (track = "all") => {
    fetch(`/api/recall?track=${track}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.deck) {
          setRecallDeck(data.deck);
          setCurrentCardIndex(0);
          setIsFlipped(false);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchDeck(selectedTrack);
  }, [selectedTrack]);

  const speakWord = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN"; // Indian English pronunciation
    utterance.rate = 0.85;    // clear and accessible speed
    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleGrade = async (qualityScore) => {
    const card = recallDeck[currentCardIndex];
    if (!card) return;

    try {
      await fetch("/api/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: card.id, qualityScore }),
      });
    } catch (e) {}

    setIsFlipped(false);
    if (currentCardIndex < recallDeck.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleCopy = (id, text) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    const sessionId = (newNoteTitle.trim() || "Note") + " (" + new Date().toLocaleDateString() + ")";
    await saveNote(sessionId, newNoteContent.trim());
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsAddingNote(false);
  };

  const currentCard = recallDeck[currentCardIndex];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200">
              {lang === "hi" ? "शब्दावली तिजोरी" : "Vocabulary Vault"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {lang === "hi" ? "सुपरमेमो-2 वैज्ञानिक दोहराव" : "SM-2 Spaced Retention"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {lang === "hi" ? "शब्दावली अभ्यास और व्यक्तिगत नोट्स" : "Vocabulary Practice & Learning Notes"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === "hi" 
              ? "रोज़ाना 5 मिनट फ़्लैशकार्ड दोहराएं और बोलकर उच्चारण का अभ्यास करें।" 
              : "Review 5 minutes of flashcards daily with audio pronunciation."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab("recall")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "recall" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === "hi" ? "फ़्लैशकार्ड दोहराव" : "Flashcard Review"} ({recallDeck.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "notes" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === "hi" ? "मेरे नोट्स" : "My Notes"} ({Object.keys(notes).length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Spaced Repetition Vocabulary Flashcards */}
      {activeTab === "recall" && (
        <div className="space-y-6">
          {/* Level Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-1">
              {lang === "hi" ? "स्तर:" : "Level:"}
            </span>
            {[
              { id: "all", label: lang === "hi" ? "सभी शब्द" : "All Words" },
              { id: "beginner", label: lang === "hi" ? "शुरुआती (A1)" : "Beginner (A1)" },
              { id: "conversational", label: lang === "hi" ? "बातचीत (A2-B1)" : "Conversational (A2-B1)" },
              { id: "advanced", label: lang === "hi" ? "उन्नत (B2-C1)" : "Advanced (B2-C1)" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedTrack(lvl.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTrack === lvl.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {currentCard ? (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Card Meta Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>
                  {lang === "hi" ? "कार्ड" : "Card"} {currentCardIndex + 1} / {recallDeck.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                    {currentCard.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {currentCard.difficulty}
                  </span>
                </div>
              </div>

              {/* Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[290px] p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md cursor-pointer hover:border-amber-400/80 transition-all flex flex-col justify-between relative group"
              >
                {!isFlipped ? (
                  /* FRONT: English Word + Emoji + Pronunciation */
                  <div className="space-y-4 text-center my-auto">
                    <div className="text-5xl mb-2">{currentCard.imageEmoji || "📖"}</div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                        English Word
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                        {currentCard.english}
                      </h2>
                    </div>

                    {currentCard.pronunciation && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                        <span>उच्चारण:</span>
                        <span className="font-bold">{currentCard.pronunciation}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* BACK: Hindi Meaning + Hinglish + Examples */
                  <div className="space-y-4 my-auto animate-fade-in text-left">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Hindi Meaning</span>
                        <h3 className="text-2xl font-serif font-bold text-amber-900">
                          {currentCard.hindi}
                        </h3>
                      </div>
                      <span className="text-3xl">{currentCard.imageEmoji}</span>
                    </div>

                    {currentCard.hinglish && (
                      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 font-medium leading-relaxed">
                        💡 {currentCard.hinglish}
                      </div>
                    )}

                    {currentCard.example_en && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Example Sentence:</span>
                        <p className="text-sm font-semibold text-slate-900">
                          &ldquo;{currentCard.example_en}&rdquo;
                        </p>
                        <p className="text-xs text-slate-600">
                          &ldquo;{currentCard.example_hi}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Controls of the card */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentCard.english);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 font-bold transition-all shadow-2xs"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "text-amber-600 animate-pulse" : "text-slate-600"}`} />
                    <span>{lang === "hi" ? "उच्चारण सुनें" : "Listen Audio"}</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <span>{isFlipped ? (lang === "hi" ? "क्लिक करके सामने देखें" : "Click to view front") : (lang === "hi" ? "अर्थ देखने के लिए क्लिक करें" : "Click to flip")}</span>
                    <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* SM-2 Retention Buttons (visible after flip) */}
              {isFlipped && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
                  <button
                    onClick={() => handleGrade(1)}
                    className="py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? "मुश्किल" : "Hard"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-600">
                      {lang === "hi" ? "कल दोहराएं (1d)" : "Review 1d"}
                    </span>
                  </button>

                  <button
                    onClick={() => handleGrade(3)}
                    className="py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lang === "hi" ? "ठीक है" : "Good"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-700">
                      {lang === "hi" ? "3 दिन बाद (3d)" : "Review 3d"}
                    </span>
                  </button>

                  <button
                    onClick={() => handleGrade(5)}
                    className="py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === "hi" ? "याद हो गया" : "Mastered"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600">
                      {lang === "hi" ? "7 दिन बाद (7d)" : "Review 7d"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <p className="text-slate-500">
                {lang === "hi" ? "इस स्तर के लिए कोई कार्ड नहीं मिला।" : "No cards found for this track."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Notes Vault */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-slate-900 text-lg">
              {lang === "hi" ? "मेरे सहेजे गए नोट्स" : "My Saved Learning Notes"}
            </h3>
            <button
              onClick={() => setIsAddingNote(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "hi" ? "नया नोट जोड़ें" : "Add Note"}</span>
            </button>
          </div>

          {/* Add Note Modal/Form */}
          {isAddingNote && (
            <form onSubmit={handleCreateNote} className="p-6 rounded-3xl bg-white border border-amber-300 shadow-md space-y-4 animate-fade-in">
              <h4 className="font-serif font-bold text-slate-900 text-sm">
                {lang === "hi" ? "नया नोट लिखें" : "Write a New Note"}
              </h4>
              <input
                type="text"
                placeholder={lang === "hi" ? "नोट का शीर्षक (e.g. आज सीखे गए 5 नए शब्द)" : "Note title (e.g. 5 words I practiced today)"}
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-amber-400"
              />
              <textarea
                rows={4}
                required
                placeholder={lang === "hi" ? "यहाँ अपना नोट या वाक्य लिखें..." : "Type your note, translation notes, or sentences here..."}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-all"
                >
                  {lang === "hi" ? "नोट सहेजें" : "Save Note"}
                </button>
              </div>
            </form>
          )}

          {/* Notes List */}
          {Object.entries(notes).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-slate-800 text-lg">
                {lang === "hi" ? "अभी कोई नोट नहीं है" : "No notes yet"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {lang === "hi" 
                  ? "पाठ पढ़ते समय या सखी वॉयस ट्यूटर से बात करते समय अपने मनपसंद शब्द यहाँ सहेजें।" 
                  : "Save your favorite words and practice sentences while learning."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(notes).map(([sessionId, content]) => (
                <div key={sessionId} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 font-serif block truncate">
                      {sessionId}
                    </span>
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-slate-200/80 text-xs text-slate-700 max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {content || "No content recorded."}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs">
                    <button
                      onClick={() => handleCopy(sessionId, content)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    >
                      {copiedId === sessionId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === sessionId ? (lang === "hi" ? "कॉपी हो गया" : "Copied") : (lang === "hi" ? "कॉपी करें" : "Copy")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}