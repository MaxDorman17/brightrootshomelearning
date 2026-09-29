"use client";

import { useEffect, useRef, useState } from "react";
import Emoji from "@/components/Emoji";

const GROUPS: [string, string[]][] = [
  ["Screen time & play", ["🎮", "🥽", "📺", "📱", "💻", "🎬", "🧩", "🎲", "🪀", "🧸", "🪁", "🛝"]],
  ["Treats", ["🍦", "🍫", "🍪", "🍩", "🧁", "🍕", "🍔", "🍿", "🥤", "🍭", "🥞", "🍰"]],
  ["Days out", ["🏞️", "🏖️", "🎡", "🏊", "🚲", "⚽", "🎳", "🦁", "🎨", "🛍️", "🎟️", "🐴"]],
  ["At home", ["🛌", "🌙", "🍽️", "👨‍🍳", "🎵", "📚", "🏕️", "🛁", "🐶", "🌱", "🎧", "🕹️"]],
  ["Special", ["🎁", "💷", "🏆", "⭐", "👑", "🎉", "💖", "🦄", "🚀", "🌈", "🎈", "🪙"]],
];

/** A button showing the chosen emoji that opens a grid of reward emojis to pick from. */
export default function EmojiPicker({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-14 items-center justify-center rounded-xl border border-[#D9D1C4] bg-white text-2xl hover:border-brand-softsage"
        aria-label="Choose an emoji"
        aria-expanded={open}
      >
        <Emoji e={value || "🎁"} className="h-8 w-8" />
      </button>
      {open && (
        <div className="absolute bottom-12 left-0 z-30 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-brand-line bg-white p-3 shadow-xl">
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {GROUPS.map(([label, emojis]) => (
              <div key={label}>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8A7A69]">{label}</p>
                <div className="grid grid-cols-6 gap-1">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        onChange(e);
                        setOpen(false);
                      }}
                      className={`rounded-lg p-1 text-2xl hover:bg-brand-cream ${value === e ? "bg-brand-tint ring-1 ring-brand-softsage" : ""}`}
                    >
                      <Emoji e={e} className="mx-auto h-7 w-7" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <label className="mt-2 flex items-center gap-2 border-t border-brand-line pt-2 text-xs font-semibold text-[#6E5A46]">
            Or type your own:
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              maxLength={16}
              className="w-14 rounded-lg border border-[#D9D1C4] px-2 py-1 text-center text-lg outline-none focus:border-brand-softsage"
              aria-label="Your own emoji"
            />
          </label>
        </div>
      )}
    </div>
  );
}
