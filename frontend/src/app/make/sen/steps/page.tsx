"use client";

import { useState } from "react";
import { BoardCardTile, PrintBoardCard, PrintButton, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import ReadAloud from "@/components/ReadAloud";
import { HELPER_CARDS, ROUTINES, cardArt } from "@/lib/senBoards";

/** Step by step: an everyday task as numbered picture steps. Tap each step when it's done. */
export default function StepsPage() {
  const role = useSenRole();
  const [slug, setSlug] = useState(ROUTINES[0].slug);
  const [done, setDone] = useState<number[]>([]);
  const routine = ROUTINES.find((r) => r.slug === slug) ?? ROUTINES[0];
  const folder = `steps/${routine.slug}`;
  const next = routine.steps.findIndex((_, i) => !done.includes(i));
  const allDone = next === -1;

  const pick = (s: string) => {
    setSlug(s);
    setDone([]);
  };
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title={routine.title} />
          <div className="grid grid-cols-4 gap-2">
            {routine.steps.map((c, i) => (
              <PrintBoardCard key={c.slug} src={cardArt(folder, c)} label={c.label} note={`${i + 1}  ☐`} />
            ))}
          </div>
          <p className="mb-2 mt-5 text-sm font-bold">Helpful cards for any task</p>
          <div className="grid grid-cols-6 gap-2">
            {HELPER_CARDS.map((c) => (
              <PrintBoardCard key={c.slug} src={cardArt("steps/generic-cards", c)} label={c.label} />
            ))}
          </div>
        </div>
      }
    >
      <SenPage
        title="Step by step"
        intro={
          role === "child"
            ? "Pick a job, then do one picture at a time. Tap each one when it's done."
            : "Everyday tasks broken into small picture steps, so your child can follow them in order and see how far they've got. Tap a step when it's done. Print a strip for the bathroom, bedroom or kitchen door."
        }
      >
        <div className="flex flex-wrap gap-2">
          {ROUTINES.map((r) => (
            <button
              key={r.slug}
              onClick={() => pick(r.slug)}
              className={
                "rounded-xl px-4 py-2 text-sm font-extrabold " +
                (r.slug === slug ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
              }
            >
              {r.title}
            </button>
          ))}
        </div>

        <div className="brand-card mt-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="text-xl font-extrabold text-brand-charcoal">{routine.title}</h2>
            <p aria-live="polite" className="text-sm font-bold text-brand-earth/70">
              {allDone ? "All done. Well done!" : `Step ${next + 1} of ${routine.steps.length}: ${routine.steps[next].label}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ReadAloud text={allDone ? "All done. Well done!" : routine.steps.slice(next).map((s) => s.label).join(". ")} />
            {done.length > 0 && (
              <button onClick={() => setDone([])} className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-extrabold text-brand-earth hover:bg-brand-tint">
                Start again
              </button>
            )}
            <PrintButton label="🖨️ Print these steps" />
          </div>
        </div>

        <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {routine.steps.map((c, i) => (
            <li key={c.slug} className={done.includes(i) ? "opacity-50" : ""}>
              <BoardCardTile
                src={cardArt(folder, c)}
                label={`Step ${i + 1}: ${c.label}`}
                picked={i === next}
                onClick={() => toggle(i)}
                badge={
                  <span
                    className={
                      "absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold " +
                      (done.includes(i) ? "bg-brand-sage text-white" : "bg-brand-charcoal text-white")
                    }
                  >
                    {done.includes(i) ? "✓" : i + 1}
                  </span>
                }
              />
            </li>
          ))}
        </ol>

        <h2 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-brand-softsage">Helpful cards for any task</h2>
        <div className="mt-2 grid max-w-xl grid-cols-3 gap-3">
          {HELPER_CARDS.map((c) => (
            <BoardCardTile key={c.slug} src={cardArt("steps/generic-cards", c)} label={c.label} />
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
