"use client";

import { useEffect, useState } from "react";
import { getGamesSummary } from "@/lib/api";
import { EmojiText } from "@/components/Emoji";

const NAMES: Record<string, string> = {
  spelling_bee: "🐝 Spelling Bee",
  word_scramble: "🔤 Word Scramble",
  times_tables: "✖️ Times Tables Blast",
  maths_sprint: "➕ Maths Sprint",
  memory_match: "🧠 Memory Match",
};

type Game = { best: number | null; best_detail: string | null; played: number; played_this_week: number };

/** A parent's view of one child's learning game scores. */
export default function GamesSummaryCard({ childId }: { childId: number }) {
  const [games, setGames] = useState<Record<string, Game> | null>(null);

  useEffect(() => {
    setGames(null);
    getGamesSummary(childId)
      .then((res) => setGames(res.data.games))
      .catch(() => {});
  }, [childId]);

  if (!games) return null;
  const played = Object.values(games).some((g) => g.played > 0);

  return (
    <section className="brand-card p-5 sm:p-6">
      <h2 className="text-lg font-extrabold text-brand-charcoal">🎮 Learning games</h2>
      {!played ? (
        <p className="mt-2 text-sm text-[#6E5A46]">No games played yet. They&apos;re in the Games link on your child&apos;s menu.</p>
      ) : (
        <div className="mt-3 divide-y divide-brand-line">
          {Object.entries(games).map(([id, g]) => (
            <div key={id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="font-bold text-brand-charcoal"><EmojiText text={NAMES[id] ?? id} /></span>
              <span className="text-[#6E5A46]">
                {g.best != null ? <>Best <b className="text-brand-sage">{g.best}</b>{g.best_detail ? ` (${g.best_detail})` : ""} · </> : null}
                {g.played_this_week} this week · {g.played} in total
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
