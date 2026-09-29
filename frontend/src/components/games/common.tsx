"use client";

import { useEffect, useRef, useState } from "react";
import { saveGameScore } from "@/lib/api";
import Emoji, { EmojiText } from "@/components/Emoji";

export type GameProps = { onExit: () => void; words: string[] };

export const shuffle = <T,>(items: T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Used when a family hasn't set spelling words this week.
export const FALLBACK_WORDS = [
  "because", "friend", "people", "could", "would", "should", "water", "again", "after", "every",
  "great", "house", "school", "animal", "different", "earth", "answer", "believe", "caught", "strange",
];

/** Counts down from `seconds` while `running`; calls onDone once at zero. */
export function useCountdown(seconds: number, running: boolean, onDone: () => void) {
  const [left, setLeft] = useState(seconds);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!running) return;
    setLeft(seconds);
    const end = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        done.current();
      }
    }, 200);
    return () => clearInterval(id);
  }, [running, seconds]);

  return left;
}

export function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return false;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = synth.getVoices().find((v) => v.lang === "en-GB") ?? synth.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.lang = "en-GB";
    utterance.rate = 0.85;
    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function GameHeader({ title, onExit, right }: { title: string; onExit: () => void; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <button onClick={onExit} className="text-sm font-bold text-brand-sage hover:underline">← All games</button>
      <h2 className="text-lg font-extrabold text-brand-charcoal"><EmojiText text={title} /></h2>
      <div className="min-w-[4rem] text-right">{right}</div>
    </div>
  );
}

/** Saves the score once and shows the result, with a celebration for a new best. */
export function GameResult({
  game,
  score,
  detail,
  summary,
  onAgain,
  onExit,
}: {
  game: string;
  score: number;
  detail?: string;
  summary: React.ReactNode;
  onAgain: () => void;
  onExit: () => void;
}) {
  const [best, setBest] = useState<{ new_best: boolean; previous_best: number | null } | null>(null);
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    saveGameScore(game, score, detail)
      .then((res) => setBest(res.data))
      .catch(() => setBest(null));
  }, [game, score, detail]);

  return (
    <div className="py-6 text-center">
      <Emoji e={best?.new_best ? "🎉" : "⭐"} className="mx-auto h-16 w-16" />
      <p className="mt-2 text-sm font-bold uppercase tracking-wider text-brand-softsage">Your score</p>
      <p className="text-5xl font-black text-brand-sage">{score}</p>
      {best?.new_best && best.previous_best != null && <p className="mt-2 font-extrabold text-brand-charcoal">New personal best! (was {best.previous_best})</p>}
      {best?.new_best && best.previous_best == null && <p className="mt-2 font-extrabold text-brand-charcoal">Your first score. Can you beat it?</p>}
      {best && !best.new_best && best.previous_best != null && <p className="mt-2 text-sm text-[#6E5A46]">Your best is {best.previous_best}. Keep going!</p>}
      <div className="mx-auto mt-4 max-w-md text-left text-sm text-[#6E5A46]">{summary}</div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={onAgain} className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white">Play again</button>
        <button onClick={onExit} className="rounded-xl border border-brand-line bg-white px-6 py-3 text-sm font-bold text-[#6E5A46]">All games</button>
      </div>
    </div>
  );
}

/** A big on-screen number pad, easier than a phone keyboard for young children. */
export function NumberPad({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit: () => void }) {
  const press = (key: string) => {
    if (key === "⌫") onChange(value.slice(0, -1));
    else if (key === "✓") onSubmit();
    else if (value.length < 5) onChange(value + key);
  };
  return (
    <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => press(key)}
          className={
            "rounded-2xl py-4 text-2xl font-black transition-transform active:scale-95 " +
            (key === "✓" ? "bg-brand-sage text-white" : "bg-white text-brand-charcoal shadow-sm")
          }
        >
          {key}
        </button>
      ))}
    </div>
  );
}
