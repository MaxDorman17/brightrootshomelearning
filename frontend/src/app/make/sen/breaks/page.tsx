"use client";

import { useState } from "react";
import { PrintButton, PrintCard, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import Emoji from "@/components/Emoji";
import { BREAKS } from "@/lib/sen";

const KINDS = ["Move", "Squeeze", "Calm"] as const;
const KIND_HELP: Record<(typeof KINDS)[number], string> = {
  Move: "for wriggly, can't-sit-still moments",
  Squeeze: "heavy work that helps the body feel settled",
  Calm: "slow and quiet, for when things feel too much",
};

/** Movement and sensory break cards, with a "pick one for me" button and a printable set. */
export default function BreaksPage() {
  useSenRole();
  const [kind, setKind] = useState<(typeof KINDS)[number] | "">("");
  const [lucky, setLucky] = useState<number | null>(null);
  const shown = BREAKS.filter((b) => !kind || b.kind === kind);

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title={kind ? `${kind} breaks` : "Movement breaks"} />
          <div className="grid grid-cols-3 gap-3">
            {shown.map((b) => (
              <PrintCard key={b.label} card={b} note={b.how} />
            ))}
          </div>
        </div>
      }
    >
      <SenPage
        title="Movement breaks"
        intro="Short breaks between lessons help many children focus, especially those with ADHD, autism or sensory needs. Pick one, or let the page choose."
      >
        <div className="flex flex-wrap gap-2">
          {(["", ...KINDS] as const).map((k) => (
            <button
              key={k || "all"}
              onClick={() => setKind(k)}
              className={
                "rounded-xl px-4 py-2 text-sm font-extrabold " +
                (kind === k ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
              }
            >
              {k || "Everything"}
            </button>
          ))}
          <button
            onClick={() => setLucky(BREAKS.indexOf(shown[Math.floor(Math.random() * shown.length)]))}
            className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage"
          >
            🎲 Pick one for me
          </button>
          <PrintButton label="🖨️ Print these cards" />
        </div>
        {kind && (
          <p className="mt-2 text-sm text-brand-earth/70">
            {kind}: {KIND_HELP[kind]}.
          </p>
        )}

        {lucky !== null && (
          <div className="brand-card mx-auto mt-6 max-w-sm p-6 text-center">
            <Emoji e={BREAKS[lucky].emoji} className="h-24 w-24 text-7xl" />
            <p className="mt-2 text-2xl font-extrabold text-brand-charcoal">{BREAKS[lucky].label}</p>
            <p className="mt-1 text-brand-earth/80">{BREAKS[lucky].how}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((b) => (
            <div key={b.label} className="brand-card flex flex-col items-center p-4 text-center">
              <Emoji e={b.emoji} className="h-12 w-12 text-4xl" />
              <p className="mt-2 font-extrabold text-brand-charcoal">{b.label}</p>
              <p className="mt-1 text-sm text-brand-earth/70">{b.how}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-softsage">{b.kind}</p>
            </div>
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
