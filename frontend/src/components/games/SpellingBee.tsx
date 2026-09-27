"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { GameHeader, GameProps, GameResult, shuffle, speak } from "./common";

/** Hear a word, type it. Missed words come back at the end until they're right. */
export default function SpellingBee({ words, onExit }: GameProps) {
  const [round, setRound] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [firstTry, setFirstTry] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; word: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const current = queue[0];

  useEffect(() => {
    setQueue(shuffle(words).slice(0, 10));
    setFirstTry(new Set());
    setMissed(new Set());
    setFinished(false);
    setFeedback(null);
    setAnswer("");
  }, [round, words]);

  useEffect(() => {
    if (current && !finished) {
      const t = setTimeout(() => speak(current), 300);
      inputRef.current?.focus();
      return () => clearTimeout(t);
    }
  }, [current, finished]);

  const check = (e: FormEvent) => {
    e.preventDefault();
    if (!current || !answer.trim()) return;
    const ok = answer.trim().toLowerCase() === current.toLowerCase();
    setFeedback({ ok, word: current });
    setAnswer("");
    if (ok) {
      if (!missed.has(current)) setFirstTry((prev) => new Set(prev).add(current));
      const rest = queue.slice(1);
      setQueue(rest);
      if (rest.length === 0) setFinished(true);
    } else {
      setMissed((prev) => new Set(prev).add(current));
      setQueue([...queue.slice(1), current]);
    }
  };

  const total = Math.min(10, words.length);
  const score = firstTry.size * 10;

  if (finished) {
    return (
      <GameResult
        game="spelling_bee"
        score={score}
        detail={`${firstTry.size}/${total} first try`}
        onAgain={() => setRound((r) => r + 1)}
        onExit={onExit}
        summary={
          <>
            <p><b>{firstTry.size}</b> of {total} spelled right first time.</p>
            {missed.size > 0 && <p className="mt-1">Worth practising: {Array.from(missed).join(", ")}</p>}
          </>
        }
      />
    );
  }

  return (
    <div>
      <GameHeader title="🐝 Spelling Bee" onExit={onExit} right={<span className="text-sm font-bold text-[#6E5A46]">{total - queue.length}/{total}</span>} />
      <div className="py-6 text-center">
        <button onClick={() => current && speak(current)} className="rounded-full bg-brand-tint px-8 py-6 text-4xl shadow-sm active:scale-95" aria-label="Hear the word again">
          🔊
        </button>
        <p className="mt-3 text-sm text-[#6E5A46]">Listen, then type the word. Tap the speaker to hear it again.</p>
        <form onSubmit={check} className="mx-auto mt-6 flex max-w-sm gap-2">
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-center text-xl font-bold outline-none focus:border-brand-softsage"
            aria-label="Type the word"
          />
          <button type="submit" className="rounded-xl bg-brand-sage px-5 py-3 font-bold text-white">Check</button>
        </form>
        {feedback && (
          <p className={"mt-4 text-lg font-extrabold " + (feedback.ok ? "text-green-700" : "text-[#A64F42]")}>
            {feedback.ok ? "✓ Correct!" : `Not quite. It's spelled “${feedback.word}”. It'll come back later.`}
          </p>
        )}
      </div>
    </div>
  );
}
