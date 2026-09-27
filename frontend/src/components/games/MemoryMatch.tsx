"use client";

import { useEffect, useState } from "react";
import { GameHeader, GameResult, randInt, shuffle } from "./common";

type Card = { id: number; pair: number; text: string };

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const PAIRS = 6;

function buildDeck(mode: "words" | "tables"): Card[] {
  const cards: Card[] = [];
  const used = new Set<string>();
  let pair = 0;
  while (pair < PAIRS) {
    let a: string, b: string;
    if (mode === "words") {
      const n = randInt(1, 20);
      a = String(n);
      b = NUMBER_WORDS[n];
    } else {
      const x = randInt(2, 10);
      const y = randInt(2, 10);
      a = `${x} × ${y}`;
      b = String(x * y);
    }
    if (used.has(b)) continue; // keep every answer different so each pair is clear
    used.add(b);
    cards.push({ id: pair * 2, pair, text: a }, { id: pair * 2 + 1, pair, text: b });
    pair++;
  }
  return shuffle(cards);
}

/** Flip two cards at a time to find the matching pairs. */
export default function MemoryMatch({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<"words" | "tables" | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);

  const start = (m: "words" | "tables") => {
    setMode(m);
    setDeck(buildDeck(m));
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
  };

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((id) => deck.find((c) => c.id === id)!);
    const t = setTimeout(() => {
      if (a.pair === b.pair) setMatched((prev) => new Set(prev).add(a.pair));
      setOpen([]);
    }, a.pair === b.pair ? 350 : 900);
    return () => clearTimeout(t);
  }, [open, deck]);

  const flip = (card: Card) => {
    if (open.length === 2 || open.includes(card.id) || matched.has(card.pair)) return;
    const next = [...open, card.id];
    setOpen(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };

  const done = mode && matched.size === PAIRS;
  const score = Math.max(10, 100 - (moves - PAIRS) * 5);

  if (!mode) {
    return (
      <div>
        <GameHeader title="🧠 Memory Match" onExit={onExit} />
        <div className="py-4 text-center">
          <p className="text-sm font-bold text-brand-charcoal">Choose your cards</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button onClick={() => start("words")} className="rounded-2xl border-2 border-brand-line bg-white px-6 py-4 font-extrabold text-brand-charcoal hover:border-brand-softsage">7 ↔ seven</button>
            <button onClick={() => start("tables")} className="rounded-2xl border-2 border-brand-line bg-white px-6 py-4 font-extrabold text-brand-charcoal hover:border-brand-softsage">3 × 4 ↔ 12</button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <GameResult
        game="memory_match"
        score={score}
        detail={mode === "words" ? "numbers and words" : "times tables"}
        onAgain={() => setMode(null)}
        onExit={onExit}
        summary={<p>All {PAIRS} pairs found in <b>{moves}</b> goes. Fewer goes means a higher score.</p>}
      />
    );
  }

  return (
    <div>
      <GameHeader title="🧠 Memory Match" onExit={onExit} right={<span className="text-sm font-bold text-[#6E5A46]">{moves} goes</span>} />
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((card) => {
          const shown = open.includes(card.id) || matched.has(card.pair);
          return (
            <button
              key={card.id}
              onClick={() => flip(card)}
              className={
                "flex aspect-[4/3] items-center justify-center rounded-2xl p-1 text-center text-lg font-black transition-colors " +
                (matched.has(card.pair)
                  ? "bg-green-100 text-green-800"
                  : shown
                    ? "bg-white text-brand-charcoal shadow"
                    : "bg-brand-sage text-white shadow-sm")
              }
              aria-label={shown ? card.text : "Hidden card"}
            >
              {shown ? card.text : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
