"use client";

import { useState } from "react";
import { BoardCardTile, PrintBoardCard, PrintButton, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import ReadAloud from "@/components/ReadAloud";
import { CHOICES, cardArt } from "@/lib/senBoards";

const MAX_OFFER = 3;

/** Choice board: a grown-up picks two or three activities to offer, and the child chooses one. */
export default function ChoicePage() {
  const role = useSenRole();
  const [offer, setOffer] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const offered = CHOICES.filter((c) => offer.includes(c.slug));
  const printed = offered.length ? offered : CHOICES;

  const toggle = (slug: string) => {
    setChosen(null);
    setOffer((o) => (o.includes(slug) ? o.filter((s) => s !== slug) : o.length >= MAX_OFFER ? [...o.slice(1), slug] : [...o, slug]));
  };
  const question = `What would you like to do? ${offered.map((c) => c.label).join(", or ")}?`;

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title="What would you like to do?" />
          <div className={"grid gap-3 " + (offered.length === 3 ? "grid-cols-3" : offered.length ? "grid-cols-2" : "grid-cols-4")}>
            {printed.map((c) => (
              <PrintBoardCard key={c.slug} src={cardArt("choice", c)} label={c.label} />
            ))}
          </div>
          <p className="mt-3 text-center text-sm">Point, look or say which you prefer.</p>
        </div>
      }
    >
      <SenPage
        title="Choice board"
        intro={
          role === "child"
            ? "What would you like to do? Pick a picture."
            : "Offering two or three choices helps children feel in control without being overwhelmed. Tap up to three cards to offer, then let your child point, look or say which they prefer. Print the cards you picked, or the whole board."
        }
      >
        <div className="flex flex-wrap gap-2">
          {offered.length > 0 && (
            <button
              onClick={() => {
                setOffer([]);
                setChosen(null);
              }}
              className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-extrabold text-brand-earth hover:bg-brand-tint"
            >
              Start again
            </button>
          )}
          <PrintButton label={offered.length ? "🖨️ Print these choices" : "🖨️ Print the whole board"} />
        </div>

        {offered.length > 0 && (
          <div className="brand-card mt-6 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold text-brand-charcoal">{chosen ? `You chose: ${CHOICES.find((c) => c.slug === chosen)?.label}` : "What would you like to do?"}</h2>
              {!chosen && <ReadAloud text={question} />}
            </div>
            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
              {offered.map((c) => (
                <BoardCardTile
                  key={c.slug}
                  src={cardArt("choice", c)}
                  label={c.label}
                  picked={chosen === c.slug}
                  onClick={() => setChosen(chosen === c.slug ? null : c.slug)}
                />
              ))}
            </div>
          </div>
        )}

        <h2 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-brand-softsage">
          {offered.length ? `Offering ${offered.length} of ${MAX_OFFER}` : `Tap up to ${MAX_OFFER} to offer`}
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CHOICES.map((c) => (
            <BoardCardTile key={c.slug} src={cardArt("choice", c)} label={c.label} picked={offer.includes(c.slug)} onClick={() => toggle(c.slug)} />
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
