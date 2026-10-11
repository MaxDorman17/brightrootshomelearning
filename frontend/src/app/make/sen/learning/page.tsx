"use client";

import { useState } from "react";
import { BoardCardTile, PrintBoardCard, PrintButton, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import { LEARNING, cardArt } from "@/lib/senBoards";

/** Learning your way: pick the ways a child learns best, then print them as a one-page profile. */
export default function LearningPage() {
  const role = useSenRole();
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState("");
  const chosen = LEARNING.filter((c) => picked.includes(c.slug));
  const printed = chosen.length ? chosen : LEARNING;
  const heading = name.trim() ? `How ${name.trim()} learns best` : "How I learn best";

  const toggle = (slug: string) => setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title={heading} />
          <div className="grid grid-cols-4 gap-2">
            {printed.map((c) => (
              <PrintBoardCard key={c.slug} src={cardArt("learning", c)} label={c.label} />
            ))}
          </div>
        </div>
      }
    >
      <SenPage
        title="Learning your way"
        intro={
          role === "child"
            ? "Everyone learns in their own way. Tap the pictures that help you learn."
            : "Every child learns and shows what they know differently. Tap the cards that help your child, with them if you can, then print the page. It's handy on the wall at lesson time, and to share with tutors, clubs or anyone new who works with them."
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm font-bold text-brand-earth">
            Name for the printout
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Optional"
              className="w-40 rounded-xl border-2 border-brand-line bg-white px-3 py-1.5 text-sm"
            />
          </label>
          {chosen.length > 0 && (
            <button onClick={() => setPicked([])} className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-extrabold text-brand-earth hover:bg-brand-tint">
              Clear
            </button>
          )}
          <PrintButton label={chosen.length ? "🖨️ Print my page" :"🖨️ Print all the cards"} />
        </div>
        <p className="mt-2 text-sm text-brand-earth/70">
          {chosen.length ? `${chosen.length} picked. Tap a card again to take it off.` : "Nothing picked yet, so printing gives you all twelve cards to cut out."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LEARNING.map((c) => (
            <BoardCardTile
              key={c.slug}
              src={cardArt("learning", c)}
              label={c.label}
              picked={picked.includes(c.slug)}
              onClick={() => toggle(c.slug)}
              badge={picked.includes(c.slug) ? <span className="absolute right-2 top-2 rounded-full bg-brand-sage px-2 py-0.5 text-sm font-extrabold text-white">✓</span> : null}
            />
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-xs text-brand-earth/60">The name stays on this screen for printing. It isn&apos;t saved anywhere.</p>
      </SenPage>
    </SenFrame>
  );
}
