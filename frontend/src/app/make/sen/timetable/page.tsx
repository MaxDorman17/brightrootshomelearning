"use client";

import { FormEvent, useEffect, useState } from "react";
import { PictureCard, PrintButton, PrintCard, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import Emoji from "@/components/Emoji";
import { ACTIVITIES, type Card } from "@/lib/sen";

const KEY = "br-sen-timetable";

/** Build a day from picture cards, then print it to cut out or stick in a row. Kept on this device only. */
export default function VisualTimetablePage() {
  useSenRole();
  const [day, setDay] = useState<Card[]>([]);
  const [own, setOwn] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setDay(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (next: Card[]) => {
    setDay(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= day.length) return;
    const next = [...day];
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };

  const addOwn = (e: FormEvent) => {
    e.preventDefault();
    if (!own.trim()) return;
    save([...day, { emoji: "⭐", label: own.trim() }]);
    setOwn("");
  };

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title="My day" />
          <div className="grid grid-cols-4 gap-3">
            {day.map((c, i) => (
              <PrintCard key={i} card={c} />
            ))}
          </div>
        </div>
      }
    >
      <SenPage
        title="Visual timetable"
        intro="Tap cards to build the day in order. Print it to cut out, or stick the cards in a row and take each one off when it's done."
      >
        <div className="brand-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-extrabold text-brand-charcoal">Today ({day.length})</h2>
            <div className="flex gap-2">
              {day.length > 0 && (
                <button onClick={() => save([])} className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage">
                  Clear
                </button>
              )}
              <PrintButton label="🖨️ Print timetable" />
            </div>
          </div>
          {day.length === 0 ? (
            <p className="mt-3 text-sm text-brand-earth/70">Nothing yet. Tap a card below to add it.</p>
          ) : (
            <ol className="mt-3 flex flex-wrap gap-2">
              {day.map((c, i) => (
                <li key={i} className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-2">
                  <span className="text-xs font-bold text-brand-earth/50">{i + 1}</span>
                  <Emoji e={c.emoji} />
                  <span className="text-sm font-bold text-brand-charcoal">{c.label}</span>
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="px-1 text-brand-earth/60 disabled:opacity-30"
                    aria-label={`Move ${c.label} earlier`}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === day.length - 1}
                    className="px-1 text-brand-earth/60 disabled:opacity-30"
                    aria-label={`Move ${c.label} later`}
                  >
                    →
                  </button>
                  <button onClick={() => save(day.filter((_, k) => k !== i))} className="px-1 text-brand-earth/50" aria-label={`Remove ${c.label}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        <form onSubmit={addOwn} className="mt-5 flex max-w-md gap-2">
          <input
            value={own}
            onChange={(e) => setOwn(e.target.value)}
            placeholder="Add your own, e.g. Swimming"
            className="min-w-0 flex-1 rounded-xl border-2 border-brand-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-softsage"
          />
          <button type="submit" className="shrink-0 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white">
            Add
          </button>
        </form>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
          {ACTIVITIES.map((c) => (
            <PictureCard key={c.label} card={c} onClick={() => save([...day, c])} />
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
