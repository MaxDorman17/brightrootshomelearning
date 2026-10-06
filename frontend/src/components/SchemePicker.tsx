"use client";

import { useState } from "react";
import { SCHEME_OPTIONS } from "@/lib/schemes";

type Props = {
  value: string[];
  onChange: (schemes: string[]) => void;
};

/** Tick boxes for the schemes a family uses, with room to add any other by name. */
export default function SchemePicker({ value, onChange }: Props) {
  const [custom, setCustom] = useState("");
  const choices = [...SCHEME_OPTIONS, ...value.filter((s) => !SCHEME_OPTIONS.includes(s))];

  const toggle = (scheme: string) =>
    onChange(value.includes(scheme) ? value.filter((s) => s !== scheme) : [...value, scheme]);

  const addCustom = () => {
    const name = custom.trim().replace(/\s+/g, " ");
    if (!name) return;
    const existing = choices.find((s) => s.toLowerCase() === name.toLowerCase()) ?? name;
    if (!value.includes(existing)) onChange([...value, existing]);
    setCustom("");
  };

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {choices.map((scheme) => {
          const checked = value.includes(scheme);
          return (
            <label
              key={scheme}
              className={
                "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors " +
                (checked ? "border-brand-softsage bg-brand-tint text-[#2E342F]" : "border-brand-line bg-white text-[#6E5A46]")
              }
            >
              <input type="checkbox" checked={checked} onChange={() => toggle(scheme)} className="h-4 w-4 accent-brand-sage" />
              {scheme}
            </label>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          maxLength={100}
          placeholder="Add another, e.g. a maths scheme or a tutor"
          aria-label="Add another scheme"
          className="min-w-0 flex-1 rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-softsage"
        />
        <button type="button" onClick={addCustom} className="rounded-xl border border-[#D9D1C4] bg-white px-5 py-3 text-sm font-extrabold text-brand-sage">
          Add
        </button>
      </div>
    </div>
  );
}
