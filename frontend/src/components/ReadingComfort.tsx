"use client";

import { useEffect, useState } from "react";
import { getDisplayPrefs, saveDisplayPrefs } from "@/lib/api";
import { DEFAULT_DISPLAY, DisplayPrefs, TEXT_SIZES, applyDisplay } from "@/lib/display";

type Props = {
  /** Set when a parent is choosing for one of their children. Left out, it is for whoever is logged in. */
  childId?: number;
  childName?: string;
};

/** Bigger text, an easy-read font and calm mode. Each choice is saved as soon as it is picked. */
export default function ReadingComfort({ childId, childName }: Props) {
  const [prefs, setPrefs] = useState<DisplayPrefs>(DEFAULT_DISPLAY);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getDisplayPrefs(childId)
      .then((res) => setPrefs(res.data))
      .catch(() => {});
  }, [childId]);

  const change = async (next: DisplayPrefs) => {
    const previous = prefs;
    setPrefs(next);
    setMessage("");
    // Your own screens change straight away. A child's change the next time they open Bright Roots.
    if (childId === undefined) applyDisplay(next);
    try {
      await saveDisplayPrefs(next, childId);
      setMessage(childId === undefined ? "Saved!" : `Saved. ${childName ?? "They"} will see it next time they open Bright Roots.`);
    } catch {
      setPrefs(previous);
      if (childId === undefined) applyDisplay(previous);
      setMessage("Could not save. Please try again.");
    }
  };

  return (
    <div>
      <p className="text-sm font-bold text-brand-charcoal">Text size</p>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Text size">
        {TEXT_SIZES.map((size, i) => {
          const on = prefs.text_size === size.id;
          return (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => change({ ...prefs, text_size: size.id })}
              className={
                "rounded-xl border-2 px-4 py-2 font-bold transition-colors " +
                (on ? "border-brand-softsage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")
              }
              style={{ fontSize: `${14 + i * 3}px` }}
            >
              {size.label}
            </button>
          );
        })}
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={prefs.easy_font}
          onChange={(e) => change({ ...prefs, easy_font: e.target.checked })}
          className="mt-1 h-4 w-4 accent-brand-sage"
        />
        <span>
          <span className="block text-sm font-bold text-brand-charcoal">Easy-read letters</span>
          <span className="block text-xs text-[#6E5A46]">
            A clear font made so that letters like b, d, p and q are easier to tell apart.
          </span>
        </span>
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={prefs.calm}
          onChange={(e) => change({ ...prefs, calm: e.target.checked })}
          className="mt-1 h-4 w-4 accent-brand-sage"
        />
        <span>
          <span className="block text-sm font-bold text-brand-charcoal">Calm mode</span>
          <span className="block text-xs text-[#6E5A46]">
            Turns off moving pictures, confetti and timer sounds. Helpful for children who find busy screens or sudden noises hard.
          </span>
        </span>
      </label>

      {message && <p className="mt-3 text-sm font-semibold text-brand-sage">{message}</p>}
    </div>
  );
}
