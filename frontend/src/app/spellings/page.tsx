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
  getChildren,
} from "@/lib/api";
import Navbar from "@/components/Navbar";
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns";

interface SpellingWord { id: number; word: string; position: number; week_start: string; }
interface SpellingResult { id: number; child_id: number; week_start: string; score: number; total: number; wrong_words: string[]; taken_at: string; }
interface Child { id: number; username: string; }
interface TestEntry { word: string; answer: string; correct: boolean; }

type TestView = "idle" | "testing" | "done";

export default function SpellingsPage() {
  const router = useRouter();
  const role = typeof window !== "undefined" ? getRole() : "";
  const isParent = role === "parent";

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [words, setWords] = useState<SpellingWord[]>([]);
  const [results, setResults] = useState<SpellingResult[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  // Parent word management
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);

  // Test state
  const [testView, setTestView] = useState<TestView>("idle");
  const [testIndex, setTestIndex] = useState(0);
  const [testInput, setTestInput] = useState("");
  const [testEntries, setTestEntries] = useState<TestEntry[]>([]);
  const [checked, setChecked] = useState(false);
  const [peekCountdown, setPeekCountdown] = useState(0);
  const [saveChildId, setSaveChildId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const weekStartStr = format(weekStart, "yyyy-MM-dd");

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
        if (kids.length > 0) setSaveChildId(kids[0].id);
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

  // Reset test when week changes
  useEffect(() => {
    setTestView("idle");
    setTestIndex(0);
    setTestInput("");
    setTestEntries([]);
    setChecked(false);
    setPeekCountdown(0);
    setSaved(false);
  }, [weekStartStr]);

  // Peek countdown
  useEffect(() => {
    if (peekCountdown <= 0) return;
    const timer = setTimeout(() => setPeekCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [peekCountdown]);

  const handleAddWord = async () => {
    const trimmed = newWord.trim();
    if (!trimmed || words.length >= 10) return;
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

  const startTest = () => {
    if (words.length === 0) return;
    setTestIndex(0);
    setTestInput("");
    setTestEntries([]);
    setChecked(false);
    setPeekCountdown(0);
    setSaved(false);
    setTestView("testing");
  };

  const handleCheck = () => {
    const word = words[testIndex].word;
    const answer = testInput.trim();
    const correct = answer.toLowerCase() === word.toLowerCase();
    setTestEntries(prev => [...prev, { word, answer, correct }]);
    setChecked(true);
  };

  const handleNext = () => {
    const next = testIndex + 1;
    if (next >= words.length) {
      setTestView("done");
    } else {
      setTestIndex(next);
      setTestInput("");
      setChecked(false);
      setPeekCountdown(0);
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
  const currentWord = testView === "testing" ? words[testIndex]?.word ?? "" : "";
  const isPeeking = peekCountdown > 0;
  const lastEntry = testEntries[testEntries.length - 1];

  const scoreMsg = score === words.length
    ? "Perfect score! Amazing! 🏆"
    : score >= words.length * 0.8
    ? "Great job! ⭐"
    : score >= words.length * 0.5
    ? "Good effort — keep practising! 💪"
    : "Keep practising — you'll get there! 💪";

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2F5D3A] to-[#6EA76E] text-white">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-5xl mb-2">🔤</p>
          <h1 className="text-3xl font-extrabold mb-1">Weekly Spellings</h1>
          <p className="text-white/70 font-semibold">
            {isParent ? "Set words and track scores" : "Study your words, then test yourself!"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Week picker */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setWeekStart(d => subWeeks(d, 1))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors">
            ← Prev
          </button>
          <span className="text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            Week of {format(weekStart, "d MMM yyyy")}
          </span>
          <button onClick={() => setWeekStart(d => addWeeks(d, 1))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors">
            Next →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {/* ─── PARENT: Word management ─── */}
            {isParent && testView === "idle" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-extrabold text-gray-900">📝 Word List</h2>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${words.length >= 10 ? "bg-red-100 text-red-600" : "bg-[#A8C67A]/30 text-[#2F5D3A]"}`}>
                    {words.length}/10 words
                  </span>
                </div>

                {words.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No words added yet for this week.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {words.map((w, i) => (
                      <div key={w.id} className="flex items-center gap-1.5 bg-[#A8C67A]/15 border border-[#A8C67A]/40 rounded-xl px-3 py-1.5">
                        <span className="text-xs text-gray-400 font-bold w-4 shrink-0">{i + 1}.</span>
                        <span className="text-sm font-semibold text-gray-800">{w.word}</span>
                        <button onClick={() => handleDeleteWord(w.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors ml-0.5 text-xs leading-none">✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {words.length < 10 && (
                  <div className="flex gap-2">
                    <input
                      value={newWord}
                      onChange={e => setNewWord(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddWord()}
                      placeholder="Type a word and press Enter…"
                      className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E] transition-colors"
                    />
                    <button onClick={handleAddWord} disabled={adding || !newWord.trim()}
                      className="px-4 py-2 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                      {adding ? "…" : "+ Add"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── CHILD: Study list (idle only) ─── */}
            {!isParent && testView === "idle" && words.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
                <h2 className="font-extrabold text-gray-900 mb-4">📖 This Week&apos;s Words</h2>
                <div className="grid grid-cols-2 gap-2">
                  {words.map((w, i) => (
                    <div key={w.id} className="flex items-center gap-2 bg-[#A8C67A]/10 rounded-xl px-3 py-2.5">
                      <span className="text-xs text-gray-400 font-bold w-5 shrink-0">{i + 1}.</span>
                      <span className="text-sm font-bold text-gray-800">{w.word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── No words placeholder (idle) ─── */}
            {testView === "idle" && words.length === 0 && (
              <div className="text-center py-14 bg-white rounded-2xl border border-dashed border-gray-200 mb-5">
                <p className="text-4xl mb-2">🔤</p>
                <p className="font-bold text-gray-500">No words set for this week</p>
                <p className="text-sm text-gray-400 mt-1">
                  {isParent ? "Add up to 10 words above to get started" : "Ask your parent to add spelling words"}
                </p>
              </div>
            )}

            {/* ─── Start test button (idle) ─── */}
            {testView === "idle" && words.length > 0 && (
              <div className="text-center mb-6">
                <button onClick={startTest}
                  className="px-10 py-4 bg-gradient-to-r from-[#2F5D3A] to-[#6EA76E] text-white font-extrabold text-lg rounded-2xl shadow-lg hover:scale-105 transition-all active:scale-100">
                  ✏️ Start Spelling Test
                </button>
                {!isParent && (
                  <p className="text-xs text-gray-400 mt-2">Your score will be saved when you finish</p>
                )}
              </div>
            )}

            {/* ─── TEST MODE ─── */}
            {testView === "testing" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 mb-5">
                {/* Progress header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Word {testIndex + 1} of {words.length}
                  </span>
                  <div className="flex gap-1">
                    {words.map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i < testEntries.length
                          ? testEntries[i].correct ? "bg-emerald-400" : "bg-red-400"
                          : i === testIndex ? "bg-[#2F5D3A]" : "bg-gray-200"
                      }`} />
                    ))}
                  </div>
                </div>

                {/* Word reveal */}
                <div className="text-center mb-8">
                  {isPeeking ? (
                    <div>
                      <p className="text-5xl font-extrabold text-[#2F5D3A] mb-2 tracking-wide">{currentWord}</p>
                      <p className="text-sm text-[#6EA76E] font-bold">Hiding in {peekCountdown}s…</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl font-extrabold text-gray-200 mb-3 tracking-[0.3em]">
                        {"•".repeat(Math.min(currentWord.length, 8))}
                      </p>
                      <button
                        onClick={() => !checked && setPeekCountdown(5)}
                        disabled={checked}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        👁 Peek at word (5 seconds)
                      </button>
                    </div>
                  )}
                </div>

                {/* Input + check / feedback + next */}
                {!checked ? (
                  <div className="space-y-3">
                    <input
                      key={testIndex}
                      autoFocus
                      value={testInput}
                      onChange={e => setTestInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && testInput.trim() && handleCheck()}
                      placeholder="Type the word here…"
                      className="w-full text-center text-2xl font-bold border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#6EA76E] transition-colors"
                    />
                    <button onClick={handleCheck} disabled={!testInput.trim()}
                      className="w-full py-3.5 bg-[#2F5D3A] text-white font-extrabold text-base rounded-xl hover:bg-[#6EA76E] disabled:opacity-40 transition-colors">
                      Check Answer ✓
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lastEntry?.correct ? (
                      <div className="text-center py-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                        <p className="text-4xl mb-1">✅</p>
                        <p className="font-extrabold text-emerald-700 text-lg">Correct!</p>
                      </div>
                    ) : (
                      <div className="text-center py-5 bg-red-50 rounded-2xl border border-red-200">
                        <p className="text-4xl mb-1">❌</p>
                        <p className="font-bold text-red-600">Not quite!</p>
                        <p className="text-sm text-gray-500 mt-2">
                          You wrote: <span className="font-bold text-gray-700">{lastEntry?.answer || "(nothing)"}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Correct spelling: <span className="font-extrabold text-[#2F5D3A] text-base">{currentWord}</span>
                        </p>
                      </div>
                    )}
                    <button onClick={handleNext}
                      className="w-full py-3.5 bg-[#2F5D3A] text-white font-extrabold text-base rounded-xl hover:bg-[#6EA76E] transition-colors">
                      {testIndex + 1 >= words.length ? "See Results →" : "Next Word →"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── DONE SCREEN ─── */}
            {testView === "done" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 mb-5">
                <div className="text-center mb-6">
                  <p className="text-5xl mb-3">
                    {score === testEntries.length ? "🏆" : score >= testEntries.length * 0.7 ? "⭐" : "💪"}
                  </p>
                  <p className="text-5xl font-extrabold text-[#2F5D3A] mb-2">
                    {score}/{testEntries.length}
                  </p>
                  <p className="text-gray-500 font-semibold">{scoreMsg}</p>
                </div>

                {/* Wrong words */}
                {testEntries.some(e => !e.correct) && (
                  <div className="mb-5 p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">Words to practise more:</p>
                    <div className="flex flex-wrap gap-2">
                      {testEntries.filter(e => !e.correct).map((e, i) => (
                        <span key={i} className="bg-white border border-red-200 text-red-700 text-sm font-bold px-3 py-1 rounded-lg">
                          {e.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parent child selector */}
                {isParent && children.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Save score for:</label>
                    <select
                      value={saveChildId ?? ""}
                      onChange={e => setSaveChildId(Number(e.target.value))}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#6EA76E] bg-gray-50">
                      {children.map(c => (
                        <option key={c.id} value={c.id}>{c.username}</option>
                      ))}
                    </select>
                  </div>
                )}

                {isParent && children.length === 0 && (
                  <p className="text-xs text-gray-400 text-center mb-4">
                    <Link href="/parent/children" className="text-[#6EA76E] hover:underline">Add a child account</Link> to save scores.
                  </p>
                )}

                <div className="flex gap-2">
                  {!saved ? (
                    <button
                      onClick={handleSave}
                      disabled={saving || (isParent && !saveChildId)}
                      className="flex-1 py-3.5 bg-[#2F5D3A] text-white font-extrabold rounded-xl hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                      {saving ? "Saving…" : "💾 Save Score"}
                    </button>
                  ) : (
                    <div className="flex-1 py-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold rounded-xl text-center">
                      ✓ Score Saved!
                    </div>
                  )}
                  <button onClick={startTest}
                    className="px-5 py-3.5 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Try Again
                  </button>
                  <button onClick={() => setTestView("idle")}
                    className="px-5 py-3.5 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* ─── PARENT: Results this week ─── */}
            {isParent && testView === "idle" && results.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-extrabold text-gray-900 mb-4">📊 Test Results This Week</h2>
                <div className="space-y-2">
                  {results.map(r => {
                    const child = children.find(c => c.id === r.child_id);
                    const pct = Math.round((r.score / r.total) * 100);
                    const takenAt = new Date(r.taken_at);
                    return (
                      <div key={r.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 ${
                          pct === 100 ? "bg-emerald-500" : pct >= 70 ? "bg-[#6EA76E]" : "bg-orange-400"
                        }`}>
                          {pct}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm">{child?.username ?? "Child"}</p>
                          <p className="text-xs text-gray-400">
                            {r.score}/{r.total} correct · {format(takenAt, "d MMM, HH:mm")}
                          </p>
                        </div>
                        {r.wrong_words.length > 0 && (
                          <div className="flex gap-1 flex-wrap justify-end max-w-[45%]">
                            {r.wrong_words.map((w, i) => (
                              <span key={i} className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-semibold">{w}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
