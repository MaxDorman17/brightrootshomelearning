"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, startOfWeek } from "date-fns";
import Navbar from "@/components/Navbar";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getGamesSummary, getSpellingWords } from "@/lib/api";
import { FALLBACK_WORDS } from "@/components/games/common";
import SpellingBee from "@/components/games/SpellingBee";
import WordScramble from "@/components/games/WordScramble";
import { MathsSprint, TimesTables } from "@/components/games/QuickFire";
import MemoryMatch from "@/components/games/MemoryMatch";

type GameId = "spelling_bee" | "word_scramble" | "times_tables" | "maths_sprint" | "memory_match";
type Summary = Record<GameId, { best: number | null; played_this_week: number }>;

const GAMES: { id: GameId; emoji: string; title: string; blurb: string; colour: string }[] = [
  { id: "spelling_bee", emoji: "🐝", title: "Spelling Bee", blurb: "Listen to a word, then spell it.", colour: "bg-yellow-100" },
  { id: "word_scramble", emoji: "🔤", title: "Word Scramble", blurb: "Unjumble your spelling words.", colour: "bg-purple-100" },
  { id: "times_tables", emoji: "✖️", title: "Times Tables Blast", blurb: "How many can you do in 60 seconds?", colour: "bg-blue-100" },
  { id: "maths_sprint", emoji: "➕", title: "Maths Sprint", blurb: "Quick adding and taking away.", colour: "bg-green-100" },
  { id: "memory_match", emoji: "🧠", title: "Memory Match", blurb: "Flip the cards to find the pairs.", colour: "bg-pink-100" },
];

export default function GamesPage() {
  const router = useRouter();
  const [playing, setPlaying] = useState<GameId | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [words, setWords] = useState<string[]>(FALLBACK_WORDS);
  const [ownWords, setOwnWords] = useState(false);

  const loadSummary = useCallback(() => {
    getGamesSummary()
      .then((res) => setSummary(res.data.games))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") {
      router.replace("/login");
      return;
    }
    loadSummary();
    const monday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
    getSpellingWords(monday)
      .then((res) => {
        const list = (res.data as { word: string }[]).map((w) => w.word.trim()).filter(Boolean);
        if (list.length >= 3) {
          setWords(list);
          setOwnWords(true);
        }
      })
      .catch(() => {});
  }, [loadSummary, router]);

  const exit = () => {
    setPlaying(null);
    loadSummary();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {playing ? (
          <div className="brand-card p-5 sm:p-6">
            {playing === "spelling_bee" && <SpellingBee words={words} onExit={exit} />}
            {playing === "word_scramble" && <WordScramble words={words} onExit={exit} />}
            {playing === "times_tables" && <TimesTables onExit={exit} />}
            {playing === "maths_sprint" && <MathsSprint onExit={exit} />}
            {playing === "memory_match" && <MemoryMatch onExit={exit} />}
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Play and learn</p>
            <h1 className="mt-1 text-3xl font-bold text-brand-charcoal sm:text-4xl">Games</h1>
            <p className="mt-2 text-sm text-[#6E5A46]">
              {ownWords ? "The spelling games use this week's spelling words." : "The spelling games use practice words until this week's spellings are added."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {GAMES.map((g) => {
                const s = summary?.[g.id];
                return (
                  <button key={g.id} onClick={() => setPlaying(g.id)} className="brand-card flex items-center gap-4 p-4 text-left transition-shadow hover:shadow-md">
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${g.colour}`}>{g.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold text-brand-charcoal">{g.title}</span>
                      <span className="block text-sm text-[#6E5A46]">{g.blurb}</span>
                      <span className="mt-1 block text-xs font-bold text-brand-sage">
                        {s?.best != null ? `🏆 Best: ${s.best}` : "Not played yet"}
                        {s?.played_this_week ? ` · ${s.played_this_week} this week` : ""}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
