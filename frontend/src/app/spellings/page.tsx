"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  getSpellingWords,
  addSpellingWord,
  deleteSpellingWord,
  saveSpellingResult,
  getSpellingResults,
  getWeakWords,
  getChildren,
} from "@/lib/api";
import Navbar from "@/components/Navbar";
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns";

interface SpellingWord { id: number; word: string; position: number; week_start: string; }
interface SpellingResult { id: number; child_id: number; week_start: string; score: number; total: number; wrong_words: string[]; is_practice_round: boolean; taken_at: string; }
interface Child { id: number; username: string; }
interface TestEntry { word: string; answer: string; correct: boolean; }

type TestView = "idle" | "learning" | "testing" | "done";

const MAX_WORDS = 50;

export default function SpellingsPage() {
  const router = useRouter();
  const role = typeof window !== "undefined" ? getRole() : "";
  const isParent = role === "parent";

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [words, setWords] = useState<SpellingWord[]>([]);
  const [results, setResults] = useState<SpellingResult[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Parent word management
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [copying, setCopying] = useState(false);
  const [weakWordsChildId, setWeakWordsChildId] = useState<number | null>(null);
  const [loadingWeak, setLoadingWeak] = useState(false);

  // Learn mode state
  const [learnIndex, setLearnIndex] = useState(0);
  const [learnPracticeInput, setLearnPracticeInput] = useState("");

  // Test state — operates on testWords, which is either the full weekly list
  // (normal test) or a synthetic subset of just the previously-wrong words
  // (weak-word practice round). words itself is never mutated by testing.
  const [testView, setTestView] = useState<TestView>("idle");
  const [testWords, setTestWords] = useState<SpellingWord[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [testIndex, setTestIndex] = useState(0);
  const [testInput, setTestInput] = useState("");
  const [testEntries, setTestEntries] = useState<TestEntry[]>([]);
  const [checked, setChecked] = useState(false);
  const [saveChildId, setSaveChildId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  useEffect(() => {
    setSpeechSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-GB";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const wordsRes = await getSpellingWords(weekStartStr);
      setWords(wordsRes.data);
      if (isParent) {
        const [resultsRes, childrenRes] = await Promise.all([
          getSpellingResults({ week_start: weekStartStr }),
          getChildren(),
        ]);
        setResults(resultsRes.data);
        const kids: Child[] = childrenRes.data;
        setChildren(kids);
        if (kids.length > 0) {
          setSaveChildId(kids[0].id);
          setWeakWordsChildId(prev => prev ?? kids[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [weekStartStr, isParent]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    loadData();
  }, [loadData, router]);

  // Reset test/learn state when week changes
  useEffect(() => {
    setTestView("idle");
    setTestWords([]);
    setPracticeMode(false);
    setTestIndex(0);
    setTestInput("");
    setTestEntries([]);
    setChecked(false);
    setSaved(false);
    setLearnIndex(0);
    setLearnPracticeInput("");
  }, [weekStartStr]);

  // Speak the current test word whenever a new word is reached (not yet checked)
  useEffect(() => {
    if (testView === "testing" && !checked) {
      const w = testWords[testIndex]?.word;
      if (w) speak(w);
    }
  }, [testView, testIndex, testWords, checked, speak]);

  const handleAddWord = async () => {
    const trimmed = newWord.trim();
    if (!trimmed || words.length >= MAX_WORDS) return;
    setAdding(true);
    try {
      const res = await addSpellingWord({ week_start: weekStartStr, word: trimmed });
      setWords(prev => [...prev, res.data]);
      setNewWord("");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteWord = async (id: number) => {
    await deleteSpellingWord(id);
    setWords(prev => prev.filter(w => w.id !== id));
  };

  const handleCopyLastWeek = async () => {
    setCopying(true);
    try {
      const prevWeekStr = format(subWeeks(weekStart, 1), "yyyy-MM-dd");
      const prevRes = await getSpellingWords(prevWeekStr);
      const existingLower = new Set(words.map(w => w.word.toLowerCase()));
      const room = Math.max(0, MAX_WORDS - words.length);
      const toAdd = (prevRes.data as SpellingWord[])
        .filter(w => !existingLower.has(w.word.toLowerCase()))
        .slice(0, room);
      for (const w of toAdd) {
        const res = await addSpellingWord({ week_start: weekStartStr, word: w.word });
        setWords(prev => [...prev, res.data]);
      }
    } finally {
      setCopying(false);
    }
  };

  const handleAddWeakWords = async () => {
    if (!weakWordsChildId) return;
    setLoadingWeak(true);
    try {
      const res = await getWeakWords(weakWordsChildId, 10);
      const existingLower = new Set(words.map(w => w.word.toLowerCase()));
      const room = Math.max(0, MAX_WORDS - words.length);
      const toAdd = (res.data as { word: string; times_wrong: number }[])
        .filter(w => !existingLower.has(w.word.toLowerCase()))
        .slice(0, room);
      for (const w of toAdd) {
        const added = await addSpellingWord({ week_start: weekStartStr, word: w.word });
        setWords(prev => [...prev, added.data]);
      }
    } finally {
      setLoadingWeak(false);
    }
  };

  const startLearning = () => {
    if (words.length === 0) return;
    setLearnIndex(0);
    setLearnPracticeInput("");
    setTestView("learning");
  };

  const learnNext = () => {
    setLearnPracticeInput("");
    setLearnIndex(i => Math.min(i + 1, words.length - 1));
  };

  const learnPrev = () => {
    setLearnPracticeInput("");
    setLearnIndex(i => Math.max(i - 1, 0));
  };

  const startTest = (wordList: SpellingWord[], practice: boolean = false) => {
    if (wordList.length === 0) return;
    setTestWords(wordList);
    setPracticeMode(practice);
    setTestIndex(0);
    setTestInput("");
    setTestEntries([]);
    setChecked(false);
    setSaved(false);
    setTestView("testing");
  };

  const startWeakWordPractice = () => {
    const wrong = testEntries.filter(e => !e.correct);
    if (wrong.length === 0) return;
    const weakWords: SpellingWord[] = wrong.map((e, i) => ({
      id: -1 - i,
      word: e.word,
      position: i,
      week_start: weekStartStr,
    }));
    startTest(weakWords, true);
  };

  const handleCheck = () => {
    const current = testWords[testIndex];
    if (!current) return;
    const answer = testInput.trim();
    const correct = answer.toLowerCase() === current.word.toLowerCase();
    setTestEntries(prev => [...prev, { word: current.word, answer, correct }]);
    setChecked(true);
  };

  const handleNext = () => {
    const next = testIndex + 1;
    if (next >= testWords.length) {
      setTestView("done");
    } else {
      setTestIndex(next);
      setTestInput("");
      setChecked(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const score = testEntries.filter(e => e.correct).length;
    const wrongWords = testEntries.filter(e => !e.correct).map(e => e.word);
    try {
      await saveSpellingResult({
        week_start: weekStartStr,
        score,
        total: testEntries.length,
        wrong_words: wrongWords,
        is_practice_round: practiceMode,
        ...(isParent && saveChildId ? { child_id: saveChildId } : {}),
      });
      setSaved(true);
      if (isParent) {
        const res = await getSpellingResults({ week_start: weekStartStr });
        setResults(res.data);
      }
    } finally {
      setSaving(false);
    }
  };

  const score = testEntries.filter(e => e.correct).length;
  const currentWord = testView === "testing" ? testWords[testIndex]?.word ?? "" : "";
  const lastEntry = testEntries[testEntries.length - 1];
  const wrongCount = testEntries.filter(e => !e.correct).length;

  const scoreMsg = score === testWords.length
    ? "Perfect score! Amazing!"
    : score >= testWords.length * 0.8
    ? "Great job!"
    : score >= testWords.length * 0.5
    ? "Good effort, keep practising!"
    : "Keep practising, you'll get there!";

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Learning Tools
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">
                Weekly Spellings
              </h1>

              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                {isParent
                  ? "Set weekly words, practise tricky spellings and track progress over time."
                  : "Learn this week's words, hear them aloud and test yourself when you're ready."}
              </p>
            </div>

            <div className="brand-card px-4 py-3 flex items-center gap-3 self-start lg:self-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8FA382]">
                  Current week
                </p>
                <p className="text-sm font-bold text-[#2E342F] mt-0.5">
                  {format(weekStart, "d MMM yyyy")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-card p-3 mb-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setWeekStart(d => subWeeks(d, 1))}
              className="px-4 py-2.5 rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] text-sm font-semibold text-[#6E5A46] hover:border-[#8FA382] hover:text-[#3F5D46] transition-colors"
            >
              Previous
            </button>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide font-bold text-[#8FA382]">
                Week of
              </p>
              <p className="text-sm sm:text-base font-bold text-[#2E342F]">
                {format(weekStart, "d MMMM yyyy")}
              </p>
            </div>

            <button
              onClick={() => setWeekStart(d => addWeeks(d, 1))}
              className="px-4 py-2.5 rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] text-sm font-semibold text-[#6E5A46] hover:border-[#8FA382] hover:text-[#3F5D46] transition-colors"
            >
              Next
            </button>
          </div>
        </section>

        {loading ? (
          <div className="brand-card py-16 text-center text-sm text-[#8FA382]">
            Loading...
          </div>
        ) : (
          <>
            {isParent && testView === "idle" && (
              <section className="brand-card overflow-hidden mb-6">
                <div className="px-5 sm:px-6 py-5 border-b border-[#E7DFD1] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                      Weekly List
                    </p>
                    <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                      Spelling Words
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#F7F2E8] px-3 py-1.5 text-xs font-bold text-[#6E5A46]">
                    {words.length} / {MAX_WORDS}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  {words.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#D9D1C4] bg-[#FFFDF8] py-10 px-5 text-center mb-5">
                      <p className="font-bold text-[#2E342F]">No words added yet</p>
                      <p className="text-sm text-[#6E5A46] mt-1">
                        Add the first spelling word for this week below.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {words.map((word, index) => (
                        <div
                          key={word.id}
                          className="flex items-center gap-2 rounded-xl border border-[#D9E1D4] bg-[#F4F7F1] px-3 py-2"
                        >
                          <span className="text-[10px] font-bold text-[#8FA382]">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-[#2E342F]">
                            {word.word}
                          </span>
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="ml-1 w-5 h-5 rounded-full text-xs font-bold text-[#B45F50] hover:bg-[#FBEFEB] transition-colors"
                            aria-label={`Remove ${word.word}`}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {words.length < MAX_WORDS && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        value={newWord}
                        onChange={e => setNewWord(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddWord()}
                        placeholder="Type a spelling word..."
                        className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-3 text-sm text-[#2E342F] outline-none focus:border-[#8FA382] focus:ring-2 focus:ring-[#8FA382]/20"
                      />

                      <button
                        onClick={handleAddWord}
                        disabled={adding || !newWord.trim()}
                        className="px-5 py-3 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-50 transition-colors"
                      >
                        {adding ? "Adding..." : "Add Word"}
                      </button>
                    </div>
                  )}

                  <div className="mt-5 pt-5 border-t border-[#EEE6D9]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-3">
                      Quick Add
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleCopyLastWeek}
                        disabled={copying || words.length >= MAX_WORDS}
                        className="px-3.5 py-2 rounded-xl border border-[#D9D1C4] bg-[#FFFDF8] text-xs font-semibold text-[#6E5A46] hover:border-[#8FA382] disabled:opacity-40 transition-colors"
                      >
                        {copying ? "Copying..." : "Copy last week's words"}
                      </button>

                      {children.length > 0 && (
                        <>
                          <select
                            value={weakWordsChildId ?? ""}
                            onChange={e =>
                              setWeakWordsChildId(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                            className="px-3.5 py-2 rounded-xl border border-[#D9D1C4] bg-white text-xs font-semibold text-[#6E5A46] outline-none focus:border-[#8FA382]"
                          >
                            {children.map(child => (
                              <option key={child.id} value={child.id}>
                                {child.username}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={handleAddWeakWords}
                            disabled={
                              loadingWeak ||
                              !weakWordsChildId ||
                              words.length >= MAX_WORDS
                            }
                            className="px-3.5 py-2 rounded-xl border border-[#D9D1C4] bg-[#FFFDF8] text-xs font-semibold text-[#6E5A46] hover:border-[#8FA382] disabled:opacity-40 transition-colors"
                          >
                            {loadingWeak ? "Loading..." : "Add tricky words"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!isParent && testView === "idle" && words.length > 0 && (
              <section className="brand-card overflow-hidden mb-6">
                <div className="px-5 sm:px-6 py-5 border-b border-[#E7DFD1]">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                    Study List
                  </p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                    This Week&apos;s Words
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 sm:p-6">
                  {words.map((word, index) => (
                    <div
                      key={word.id}
                      className="flex items-center gap-3 rounded-2xl border border-[#E7DFD1] bg-[#FFFDF8] px-4 py-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#E8EDE4] flex items-center justify-center text-xs font-bold text-[#3F5D46]">
                        {index + 1}
                      </div>
                      <span className="font-bold text-[#2E342F]">
                        {word.word}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {testView === "idle" && words.length === 0 && !isParent && (
              <section className="brand-card px-6 py-14 text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F7F2E8] flex items-center justify-center text-[#3F5D46] font-bold">
                  Aa
                </div>
                <h2 className="text-lg font-bold text-[#2E342F] mt-4">
                  No words set for this week
                </h2>
                <p className="text-sm text-[#6E5A46] mt-2">
                  Your spelling words will appear here when they are ready.
                </p>
              </section>
            )}

            {testView === "idle" && words.length > 0 && (
              <section className="grid sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={startLearning}
                  className="brand-card p-6 text-left hover:border-[#8FA382] transition-colors"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                    Step One
                  </p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                    Learn the Words
                  </h2>
                  <p className="text-sm text-[#6E5A46] mt-2">
                    Read, hear and practise each spelling before taking the test.
                  </p>
                  <p className="text-sm font-bold text-[#3F5D46] mt-4">
                    Start learning
                  </p>
                </button>

                <button
                  onClick={() => startTest(words)}
                  className="rounded-2xl border border-[#3F5D46] bg-[#3F5D46] p-6 text-left text-white hover:bg-[#354F3B] transition-colors"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-white/65">
                    Step Two
                  </p>
                  <h2 className="text-xl font-bold mt-1">
                    Spelling Test
                  </h2>
                  <p className="text-sm text-white/75 mt-2">
                    Hear each word, type your answer and see your score at the end.
                  </p>
                  <p className="text-sm font-bold mt-4">
                    Start test
                  </p>
                </button>
              </section>
            )}

            {testView === "learning" && words.length > 0 && (
              <section className="brand-card overflow-hidden mb-6">
                <div className="px-5 sm:px-6 py-5 border-b border-[#E7DFD1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                      Learn Mode
                    </p>
                    <h2 className="text-lg font-bold text-[#2E342F] mt-1">
                      Word {learnIndex + 1} of {words.length}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {words.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full ${
                          index === learnIndex
                            ? "bg-[#3F5D46]"
                            : index < learnIndex
                            ? "bg-[#8FA382]"
                            : "bg-[#E7DFD1]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="text-center">
                    <p className="text-4xl sm:text-5xl font-bold text-[#3F5D46] tracking-wide">
                      {words[learnIndex]?.word}
                    </p>

                    {speechSupported && (
                      <button
                        onClick={() => speak(words[learnIndex]?.word ?? "")}
                        className="mt-4 px-5 py-2.5 rounded-xl border border-[#D9E1D4] bg-[#F4F7F1] text-sm font-bold text-[#3F5D46] hover:bg-[#E8EDE4] transition-colors"
                      >
                        Hear word
                      </button>
                    )}
                  </div>

                  <div className="mt-8 max-w-xl mx-auto">
                    <label className="block text-sm font-semibold text-[#6E5A46] mb-2 text-center">
                      Practise typing it
                    </label>

                    <input
                      key={learnIndex}
                      value={learnPracticeInput}
                      onChange={e => setLearnPracticeInput(e.target.value)}
                      placeholder="Type the word..."
                      className={`w-full text-center text-2xl font-bold rounded-xl border-2 px-4 py-3.5 outline-none transition-colors ${
                        learnPracticeInput.length === 0
                          ? "border-[#D9D1C4] focus:border-[#8FA382]"
                          : words[learnIndex]?.word
                              .toLowerCase()
                              .startsWith(learnPracticeInput.toLowerCase())
                          ? "border-emerald-400"
                          : "border-[#D88C64]"
                      }`}
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={learnPrev}
                      disabled={learnIndex === 0}
                      className="px-4 py-3 rounded-xl border border-[#D9D1C4] text-sm font-semibold text-[#6E5A46] disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {learnIndex + 1 < words.length ? (
                      <button
                        onClick={learnNext}
                        className="flex-1 py-3 rounded-xl bg-[#3F5D46] text-white font-bold hover:bg-[#354F3B] transition-colors"
                      >
                        Next Word
                      </button>
                    ) : (
                      <button
                        onClick={() => startTest(words)}
                        className="flex-1 py-3 rounded-xl bg-[#3F5D46] text-white font-bold hover:bg-[#354F3B] transition-colors"
                      >
                        Start Test
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setTestView("idle")}
                    className="w-full mt-4 text-xs font-semibold text-[#8FA382] hover:text-[#6E5A46]"
                  >
                    Back to word list
                  </button>
                </div>
              </section>
            )}

            {testView === "testing" && (
              <section className="brand-card overflow-hidden mb-6">
                <div className="px-5 sm:px-6 py-5 border-b border-[#E7DFD1]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                        {practiceMode ? "Practice Round" : "Spelling Test"}
                      </p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">
                        Word {testIndex + 1} of {testWords.length}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {testWords.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2.5 h-2.5 rounded-full ${
                            index < testEntries.length
                              ? testEntries[index].correct
                                ? "bg-emerald-500"
                                : "bg-[#D88C64]"
                              : index === testIndex
                              ? "bg-[#3F5D46]"
                              : "bg-[#E7DFD1]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 max-w-2xl mx-auto w-full">
                  <div className="text-center mb-7">
                    {speechSupported ? (
                      <>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F4F7F1] border border-[#D9E1D4] flex items-center justify-center text-[#3F5D46] text-xl font-bold">
                          Aa
                        </div>

                        <p className="text-sm text-[#6E5A46] mt-3">
                          Listen carefully, then type the word below.
                        </p>

                        <button
                          onClick={() => speak(currentWord)}
                          disabled={checked}
                          className="mt-3 px-5 py-2.5 rounded-xl border border-[#D9E1D4] bg-[#F4F7F1] text-sm font-bold text-[#3F5D46] disabled:opacity-40"
                        >
                          Repeat word
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[#A36A43] rounded-xl border border-[#E8C9A9] bg-[#FFF7ED] px-4 py-3">
                          Speech is not available on this device, so the word is shown below.
                        </p>
                        <p className="text-4xl font-bold text-[#3F5D46] mt-5">
                          {currentWord}
                        </p>
                      </>
                    )}
                  </div>

                  {!checked ? (
                    <div className="space-y-3">
                      <input
                        key={testIndex}
                        autoFocus
                        value={testInput}
                        onChange={e => setTestInput(e.target.value)}
                        onKeyDown={e =>
                          e.key === "Enter" &&
                          testInput.trim() &&
                          handleCheck()
                        }
                        placeholder="Type the word here..."
                        className="w-full text-center text-2xl font-bold rounded-xl border-2 border-[#D9D1C4] px-4 py-3.5 outline-none focus:border-[#8FA382]"
                      />

                      <button
                        onClick={handleCheck}
                        disabled={!testInput.trim()}
                        className="w-full py-3.5 rounded-xl bg-[#3F5D46] text-white font-bold hover:bg-[#354F3B] disabled:opacity-40 transition-colors"
                      >
                        Check Answer
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lastEntry?.correct ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                          <p className="text-xl font-bold text-emerald-700">
                            Correct!
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-[#E9B8AE] bg-[#FBEFEB] px-5 py-6 text-center">
                          <p className="text-xl font-bold text-[#A64F42]">
                            Not quite
                          </p>
                          <p className="text-sm text-[#6E5A46] mt-3">
                            You wrote:{" "}
                            <span className="font-bold text-[#2E342F]">
                              {lastEntry?.answer || "(nothing)"}
                            </span>
                          </p>
                          <p className="text-sm text-[#6E5A46] mt-1">
                            Correct spelling:{" "}
                            <span className="font-bold text-[#3F5D46]">
                              {currentWord}
                            </span>
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleNext}
                        className="w-full py-3.5 rounded-xl bg-[#3F5D46] text-white font-bold hover:bg-[#354F3B]"
                      >
                        {testIndex + 1 >= testWords.length
                          ? "See Results"
                          : "Next Word"}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {testView === "done" && (
              <section className="brand-card overflow-hidden mb-6">
                <div className="p-6 sm:p-8 text-center border-b border-[#E7DFD1]">
                  {practiceMode && (
                    <span className="inline-block rounded-full bg-[#F3EDF7] text-[#765887] px-3 py-1 text-xs font-bold mb-3">
                      Practice round
                    </span>
                  )}

                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                    Your Score
                  </p>

                  <p className="text-5xl font-bold text-[#3F5D46] mt-2">
                    {score}/{testWords.length}
                  </p>

                  <p className="text-sm font-semibold text-[#6E5A46] mt-2">
                    {scoreMsg}
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  {wrongCount > 0 && (
                    <div className="rounded-2xl border border-[#E9B8AE] bg-[#FBEFEB] p-4 mb-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#A64F42]">
                        Words to practise
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {testEntries
                          .filter(entry => !entry.correct)
                          .map((entry, index) => (
                            <span
                              key={index}
                              className="rounded-xl border border-[#E9B8AE] bg-white px-3 py-1.5 text-sm font-bold text-[#A64F42]"
                            >
                              {entry.word}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {!practiceMode && wrongCount > 0 && (
                    <button
                      onClick={startWeakWordPractice}
                      className="w-full mb-5 py-3 rounded-xl border border-[#CDBBDD] bg-[#F7F2FA] text-[#765887] font-bold hover:bg-[#F1E8F5]"
                    >
                      Practise {wrongCount} tricky word{wrongCount !== 1 ? "s" : ""}
                    </button>
                  )}

                  {isParent && children.length > 0 && (
                    <div className="mb-5">
                      <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                        Save score for
                      </label>

                      <select
                        value={saveChildId ?? ""}
                        onChange={e => setSaveChildId(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#D9D1C4] bg-white px-4 py-3 text-sm font-semibold text-[#2E342F] outline-none focus:border-[#8FA382]"
                      >
                        {children.map(child => (
                          <option key={child.id} value={child.id}>
                            {child.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isParent && children.length === 0 && (
                    <p className="text-sm text-[#6E5A46] text-center mb-5">
                      <Link
                        href="/parent/children"
                        className="font-bold text-[#3F5D46] hover:underline"
                      >
                        Add a child account
                      </Link>{" "}
                      to save scores.
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {!saved ? (
                      <button
                        onClick={handleSave}
                        disabled={saving || (isParent && !saveChildId)}
                        className="flex-1 py-3 rounded-xl bg-[#3F5D46] text-white font-bold hover:bg-[#354F3B] disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Score"}
                      </button>
                    ) : (
                      <div className="flex-1 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-center font-bold">
                        Score Saved
                      </div>
                    )}

                    <button
                      onClick={() => startTest(testWords, practiceMode)}
                      className="px-5 py-3 rounded-xl border border-[#D9D1C4] bg-white text-sm font-semibold text-[#6E5A46]"
                    >
                      Try Again
                    </button>

                    <button
                      onClick={() => setTestView("idle")}
                      className="px-5 py-3 rounded-xl border border-[#D9D1C4] bg-white text-sm font-semibold text-[#6E5A46]"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </section>
            )}

            {isParent && testView === "idle" && results.length > 0 && (
              <section className="brand-card overflow-hidden">
                <div className="px-5 sm:px-6 py-5 border-b border-[#E7DFD1]">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                    Results
                  </p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                    Test Results This Week
                  </h2>
                </div>

                <div className="divide-y divide-[#EEE6D9]">
                  {[...results]
                    .sort(
                      (a, b) =>
                        new Date(a.taken_at).getTime() -
                        new Date(b.taken_at).getTime()
                    )
                    .map(result => {
                      const child = children.find(
                        item => item.id === result.child_id
                      );

                      const pct = Math.round(
                        (result.score / result.total) * 100
                      );

                      const takenAt = new Date(result.taken_at);

                      const firstNormal = results
                        .filter(
                          item =>
                            item.child_id === result.child_id &&
                            !item.is_practice_round
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.taken_at).getTime() -
                            new Date(b.taken_at).getTime()
                        )[0];

                      const isFirstNormal =
                        !result.is_practice_round &&
                        firstNormal?.id === result.id;

                      const delta =
                        !result.is_practice_round &&
                        !isFirstNormal &&
                        firstNormal
                          ? pct -
                            Math.round(
                              (firstNormal.score / firstNormal.total) * 100
                            )
                          : null;

                      return (
                        <div
                          key={result.id}
                          className="px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                          <div
                            className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-sm font-bold ${
                              pct === 100
                                ? "bg-emerald-100 text-emerald-700"
                                : pct >= 70
                                ? "bg-[#E8EDE4] text-[#3F5D46]"
                                : "bg-[#FCE9DF] text-[#A65D3D]"
                            }`}
                          >
                            {pct}%
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-[#2E342F]">
                                {child?.username ?? "Child"}
                              </p>

                              {result.is_practice_round && (
                                <span className="text-[10px] font-bold rounded-full bg-[#F3EDF7] text-[#765887] px-2 py-1">
                                  Practice
                                </span>
                              )}

                              {delta !== null && (
                                <span
                                  className={`text-[10px] font-bold rounded-full px-2 py-1 ${
                                    delta > 0
                                      ? "bg-emerald-100 text-emerald-700"
                                      : delta < 0
                                      ? "bg-[#FBEFEB] text-[#A64F42]"
                                      : "bg-[#F7F2E8] text-[#6E5A46]"
                                  }`}
                                >
                                  {delta > 0
                                    ? `Up ${delta}%`
                                    : delta < 0
                                    ? `Down ${Math.abs(delta)}%`
                                    : "No change"}{" "}
                                  vs first attempt
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[#8FA382] mt-1">
                              {result.score}/{result.total} correct ·{" "}
                              {format(takenAt, "d MMM, HH:mm")}
                            </p>

                            {result.wrong_words.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {result.wrong_words.map((word, index) => (
                                  <span
                                    key={index}
                                    className="text-[11px] rounded-lg border border-[#E9B8AE] bg-[#FBEFEB] px-2 py-1 font-semibold text-[#A64F42]"
                                  >
                                    {word}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}