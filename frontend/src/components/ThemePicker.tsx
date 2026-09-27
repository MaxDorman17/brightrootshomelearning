"use client";

import { FAMILY_THEMES, FamilyTheme } from "@/lib/theme";

type Props = {
  value: FamilyTheme;
  onChange: (theme: FamilyTheme) => void;
  disabled?: boolean;
};

export default function ThemePicker({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Family colour theme" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FAMILY_THEMES.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(theme.id)}
            className={
              "rounded-2xl border-2 bg-white p-3 text-left transition-colors disabled:opacity-60 " +
              (selected ? "border-brand-sage" : "border-brand-line hover:border-brand-softsage")
            }
          >
            <div className="flex gap-1.5">
              {theme.swatches.map((colour) => (
                <span key={colour} className="h-7 flex-1 rounded-lg" style={{ background: colour }} />
              ))}
            </div>
            <p className="mt-2 text-sm font-extrabold text-brand-charcoal">
              {theme.label}
              {selected && <span className="ml-1 text-brand-sage">✓</span>}
            </p>
          </button>
        );
      })}
    </div>
  );
}
