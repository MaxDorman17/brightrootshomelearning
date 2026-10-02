"use client";

import { useEffect, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { addStarterWeek } from "@/lib/api";

type Kid = { id: number; username: string; activity_level?: string | null };

const HIDE_KEY = "starter-week-hidden";

/** Offered on an empty planner week: fills it with a ready-made sample week the family can change. */
export default function StarterWeekCard({ kids, weekStart, onAdded }: { kids: Kid[]; weekStart: string; onAdded: (start: string) => void }) {
  const [hidden, setHidden] = useState(true);
  const [chosen, setChosen] = useState<number[]>(kids.map((k) => k.id));
  const [level, setLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setHidden(localStorage.getItem(HIDE_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  useEffect(() => setChosen(kids.map((k) => k.id)), [kids]);

  if (hidden || kids.length === 0) return null;

  // A week that has already finished (say, looking at the planner at the weekend) gets the next week instead.
  const today = format(new Date(), "yyyy-MM-dd");
  const weekOver = format(addDays(parseISO(weekStart), 4), "yyyy-MM-dd") < today;
  const target = weekOver ? format(addDays(parseISO(weekStart), 7), "yyyy-MM-dd") : weekStart;

  const hide = () => {
    try {
      localStorage.setItem(HIDE_KEY, "1");
    } catch {}
    setHidden(true);
  };

  const firstLevel = kids.find((k) => chosen.includes(k.id))?.activity_level === "teen" ? "teen" : "young";

  const add = async () => {
    if (chosen.length === 0) return setError("Pick at least one child.");
    setSaving(true);
    setError("");
    try {
      const res = await addStarterWeek(chosen, target, level || undefined);
      onAdded(res.data.start_date);
    } catch {
      setError("Could not add the starter week. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6 rounded-3xl border border-brand-mist bg-brand-wash p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Nothing planned this week</p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">Start with a ready-made week?</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#6E5A46]">
            We&apos;ll fill {weekOver ? "next week, starting" : "the week of"} {format(parseISO(target), "d MMMM")}, with Maths and English every day, plus science, history,
            geography, art, P.E. and more, each with simple steps to follow. They&apos;re ordinary lessons, so you can change, move or
            delete any of them.
          </p>
        </div>
        <button onClick={hide} className="shrink-0 text-xs font-bold text-[#8A7A69] hover:text-brand-charcoal" aria-label="Don't show this again">
          ✕
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        {kids.length > 1 && (
          <div>
            <p className="mb-1.5 text-sm font-semibold text-brand-charcoal">For</p>
            <div className="flex flex-wrap gap-2">
              {kids.map((k) => (
                <label key={k.id} className="flex items-center gap-1.5 rounded-xl border border-brand-line bg-white px-3 py-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={chosen.includes(k.id)}
                    onChange={() => setChosen((prev) => (prev.includes(k.id) ? prev.filter((x) => x !== k.id) : [...prev, k.id]))}
                    className="accent-brand-sage"
                  />
                  {k.username}
                </label>
              ))}
            </div>
          </div>
        )}
        <label className="text-sm font-semibold text-brand-charcoal">
          Lessons for
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1.5 block rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm">
            <option value="">{firstLevel === "teen" ? "Teenagers (11 to 16)" : "Younger children"}, from their settings</option>
            <option value="young">Younger children</option>
            <option value="teen">Teenagers (11 to 16)</option>
          </select>
        </label>
        <button onClick={add} disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50">
          {saving ? "Adding..." : "Add the starter week"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
    </div>
  );
}
