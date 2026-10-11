"use client";

import { useState } from "react";
import { BoardCardTile, PrintBoardCard, PrintButton, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import { speakText } from "@/components/games/common";
import { TALK, cardArt } from "@/lib/senBoards";

/** Communication board: tap a picture and the device says it out loud. Prints as one A4 board. */
export default function TalkPage() {
  const role = useSenRole();
  const [said, setSaid] = useState<string | null>(null);
  const [voice, setVoice] = useState(true);

  const tap = (label: string) => {
    setSaid(label);
    if (voice) speakText(label);
  };

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title="My communication board" />
          <p className="-mt-2 mb-3 text-sm">Point to a picture to tell me what you need. All ways of communicating are welcome.</p>
          <div className="grid grid-cols-4 gap-2">
            {TALK.map((c) => (
              <PrintBoardCard key={c.slug} src={cardArt("talk", c)} label={c.label} />
            ))}
          </div>
        </div>
      }
    >
      <SenPage
        title="Communication board"
        intro={
          role === "child"
            ? "Tap a picture to tell your grown-up what you need."
            : "Pictures for the things children most often need to say. Your child can point, tap or hand you a card, and the device says the word out loud. Print it for the fridge, the car or days out. All ways of communicating are welcome."
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVoice(!voice)}
            aria-pressed={voice}
            className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage hover:bg-brand-cream"
          >
            {voice ? "🔊 Speaking on" : "🔇 Speaking off"}
          </button>
          <PrintButton label="🖨️ Print the board" />
        </div>

        <p aria-live="polite" className="mt-4 min-h-[2.5rem] text-2xl font-extrabold text-brand-charcoal">
          {said ? `“${said}”` : ""}
        </p>

        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TALK.map((c) => (
            <BoardCardTile key={c.slug} src={cardArt("talk", c)} label={c.label} picked={said === c.label} onClick={() => tap(c.label)} />
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
