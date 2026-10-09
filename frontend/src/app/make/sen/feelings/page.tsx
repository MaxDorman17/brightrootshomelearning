"use client";

import { useState } from "react";
import { PictureCard, PrintButton, PrintCard, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import Emoji from "@/components/Emoji";
import { FEELINGS, HELPS, type Card } from "@/lib/sen";

/** "I feel... I need..." on screen, and the full set of feelings and helps cards to print. */
export default function FeelingsPage() {
  useSenRole();
  const [feel, setFeel] = useState<Card | null>(null);
  const [help, setHelp] = useState<Card | null>(null);

  return (
    <SenFrame
      printable={
        <div className="p-6">
          <PrintTitle title="How I feel" />
          <div className="grid grid-cols-4 gap-3">
            {FEELINGS.map((c) => (
              <PrintCard key={c.label} card={c} />
            ))}
          </div>
          <div style={{ breakBefore: "page" }} className="pt-6">
            <PrintTitle title="What helps me" />
            <div className="grid grid-cols-4 gap-3">
              {HELPS.map((c) => (
                <PrintCard key={c.label} card={c} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SenPage
        title="Feelings cards"
        intro="Tap how you feel, then what would help. Print the cards to keep on the fridge or in a bag, so a child can point when words are hard."
      >
        <div className="brand-card mx-auto max-w-xl p-5 text-center">
          <p className="text-2xl font-extrabold text-brand-charcoal">
            I feel{" "}
            {feel ? (
              <span className="text-brand-sage">
                <Emoji e={feel.emoji} /> {feel.label.toLowerCase()}
              </span>
            ) : (
              "..."
            )}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-brand-charcoal">
            I need{" "}
            {help ? (
              <span className="text-brand-sage">
                <Emoji e={help.emoji} /> {help.label.toLowerCase()}
              </span>
            ) : (
              "..."
            )}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {(feel || help) && (
              <button
                onClick={() => {
                  setFeel(null);
                  setHelp(null);
                }}
                className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage"
              >
                Start again
              </button>
            )}
            <PrintButton label="🖨️ Print all cards" />
          </div>
        </div>

        <h2 className="mt-8 font-extrabold text-brand-charcoal">I feel</h2>
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {FEELINGS.map((c) => (
            <PictureCard key={c.label} card={c} picked={feel?.label === c.label} onClick={() => setFeel(c)} />
          ))}
        </div>

        <h2 className="mt-8 font-extrabold text-brand-charcoal">What helps me</h2>
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {HELPS.map((c) => (
            <PictureCard key={c.label} card={c} picked={help?.label === c.label} onClick={() => setHelp(c)} />
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
