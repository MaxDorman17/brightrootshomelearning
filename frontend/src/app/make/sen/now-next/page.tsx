"use client";

import { useState } from "react";
import { PictureCard, PrintButton, PrintCard, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import { ACTIVITIES, type Card } from "@/lib/sen";

/** Two big cards side by side: what happens now, and what comes next. Shown full size or printed. */
export default function NowNextPage() {
  useSenRole();
  const [now, setNow] = useState<Card | null>(null);
  const [next, setNext] = useState<Card | null>(null);
  const [picking, setPicking] = useState<"now" | "next">("now");

  const pick = (c: Card) => {
    if (picking === "now") {
      setNow(c);
      setPicking("next");
    } else {
      setNext(c);
    }
  };

  const half = (title: string, card: Card | null) => (
    <div>
      <p className="mb-2 text-center text-5xl font-extrabold">{title}</p>
      {card ? <PrintCard card={card} big /> : <div className="rounded-xl border-[3px] border-dashed border-black" style={{ minHeight: "11cm" }} />}
    </div>
  );

  const slot = (which: "now" | "next", card: Card | null) => (
    <button
      type="button"
      onClick={() => setPicking(which)}
      className={"rounded-2xl p-2 text-left " + (picking === which ? "bg-brand-tint ring-2 ring-brand-sage" : "bg-brand-cream")}
    >
      <p className="mb-2 text-center text-2xl font-extrabold text-brand-charcoal">{which === "now" ? "Now" : "Next"}</p>
      {card ? (
        <PictureCard card={card} size="lg" />
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-brand-line text-sm font-bold text-brand-earth/60">
          Tap a card below
        </div>
      )}
    </button>
  );

  return (
    <SenFrame
      printable={
        <div className="grid grid-cols-2 gap-8 p-8">
          {half("Now", now)}
          {half("Next", next)}
        </div>
      }
    >
      <SenPage
        title="Now & Next"
        intro="Pick what's happening now, then what comes next. Show it on screen or print it. Many children find a hard thing easier when they can see the nice thing coming after."
      >
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-4">
          {slot("now", now)}
          {slot("next", next)}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => {
              setNow(next);
              setNext(null);
              setPicking("next");
            }}
            disabled={!next}
            className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage disabled:opacity-50"
          >
            Done! Move Next to Now
          </button>
          <PrintButton />
        </div>

        <p className="mt-6 text-sm font-bold text-brand-earth/70">Choosing for: {picking === "now" ? "Now" : "Next"}</p>
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
          {ACTIVITIES.map((c) => (
            <PictureCard key={c.label} card={c} onClick={() => pick(c)} picked={(picking === "now" ? now : next)?.label === c.label} />
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
