"use client";

import { useState } from "react";
import { SUBJECT_COLOUR_OPTIONS } from "@/lib/avatar";
import { CHILD_THEMES, applyTheme } from "@/lib/theme";

type Props = {
  subjects: string[];
  initialTheme: string | null;
  initialColours: Record<string, string>;
  familyThemeLabel?: string;
  onSave: (theme: string | null, colours: Record<string, string>) => Promise<void>;
};

/** A child's own colours: a theme for their screens and a colour per subject. */
export default function ChildColours({ subjects, initialTheme, initialColours, onSave }: Props) {
  const [theme, setTheme] = useState<string | null>(initialTheme);
  const [colours, setColours] = useState<Record<string, string>>(initialColours);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const chooseTheme = (id: string | null) => {
    setTheme(id);
    if (id) applyTheme(id);
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await onSave(theme, colours);
      setMessage("Saved!");
    } catch {
      setMessage("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-brand-charcoal">My theme</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setTheme(null)}
          aria-pressed={theme === null}
          className={"rounded-2xl border-2 bg-white p-3 text-left text-sm font-extrabold " + (theme === null ? "border-brand-sage" : "border-brand-line")}
        >
          Family colours
          <span className="block text-xs font-semibold text-[#6E5A46]">Same as my grown-up</span>
        </button>
        {CHILD_THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => chooseTheme(t.id)}
            aria-pressed={theme === t.id}
            className={"rounded-2xl border-2 bg-white p-3 text-left " + (theme === t.id ? "border-brand-sage" : "border-brand-line")}
          >
            <span className="flex gap-1">
              {t.swatches.map((c) => (
                <span key={c} className="h-6 flex-1 rounded-md" style={{ background: c }} />
              ))}
            </span>
            <span className="mt-1.5 block text-sm font-extrabold text-brand-charcoal">{t.label}</span>
          </button>
        ))}
      </div>

      {subjects.length > 0 && (
        <>
          <p className="mb-2 mt-5 text-sm font-bold text-brand-charcoal">My subject colours</p>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div key={subject} className="flex flex-wrap items-center gap-2">
                <span className="w-32 shrink-0 truncate text-sm font-semibold text-brand-charcoal">{subject}</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(SUBJECT_COLOUR_OPTIONS).map(([key, c]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setColours((prev) => ({ ...prev, [subject]: key }))}
                      aria-label={`${subject}: ${c.label}`}
                      aria-pressed={colours[subject] === key}
                      className={`h-6 w-6 rounded-full ${c.dot} ${colours[subject] === key ? "ring-2 ring-brand-charcoal ring-offset-2" : ""}`}
                    />
                  ))}
                  {colours[subject] && (
                    <button
                      type="button"
                      onClick={() =>
                        setColours((prev) => {
                          const next = { ...prev };
                          delete next[subject];
                          return next;
                        })
                      }
                      className="text-xs font-bold text-[#6E5A46] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save my colours"}
        </button>
        {message && <span className="text-sm font-semibold text-brand-sage">{message}</span>}
      </div>
    </div>
  );
}
