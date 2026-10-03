"use client";

import { useEffect, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { addStarterWeek } from "@/lib/api";

type Kid = { id: number; username: string; activity_level?: string | null };

const HIDE_KEY = "starter-week-hidden";
// School years 1 to 11, with the usual ages so families outside England can pick the right one.
const YEARS = Array.from({ length: 11 }, (_, i) => ({ year: i + 1, label: `Year ${i + 1} (age ${i + 5} to ${i + 6})` }));

/** Offered on an empty planner week: fills it with Oak National Academy lessons for each child's year. */
export default function StarterWeekCard({ kids, weekStart, onAdded }: { kids: Kid[]; weekStart: string; onAdded: (start: string) => void }) {
  const [hidden, setHidden] = useState(true);
  // The year each child is working at: "" until chosen, 0 to leave that child out.
  const [years, setYears] = useState<Record<number, number | "">>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setHidden(localStorage.getItem(HIDE_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

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

  const included = kids.filter((k) => years[k.id] !== 0);
  const ready = included.every((k) => typeof years[k.id] === "number");

  const add = async () => {
    if (included.length === 0) return setError("Pick at least one child.");
    if (!ready) return setError(kids.length > 1 ? "Choose a year for each child." : "Choose a year first.");
    setSaving(true);
    setError("");
    try {
      const chosen: Record<number, number> = {};
      included.forEach((k) => (chosen[k.id] = years[k.id] as number));
      const res = await addStarterWeek(included.map((k) => k.id), target, chosen);
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
            We&apos;ll fill {weekOver ? "next week, starting" : "the week of"} {format(parseISO(target), "d MMMM")}, with free Oak National
            Academy lessons: the first lessons for each subject on your timetable, each with a video and quizzes. You can change,
            move or delete any of them.
          </p>
        </div>
        <button onClick={hide} className="shrink-0 text-xs font-bold text-[#8A7A69] hover:text-brand-charcoal" aria-label="Don't show this again">
          ✕
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        {kids.map((k) => (
          <label key={k.id} className="text-sm font-semibold text-brand-charcoal">
            {kids.length > 1 ? `${k.username} is working at` : "Working at"}
            <select
              value={years[k.id] ?? ""}
              onChange={(e) => {
                setError("");
                setYears((prev) => ({ ...prev, [k.id]: e.target.value === "" ? "" : Number(e.target.value) }));
              }}
              className="mt-1.5 block rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm"
            >
              <option value="">Choose a year</option>
              {YEARS.map((y) => (
                <option key={y.year} value={y.year}>{y.label}</option>
              ))}
              {kids.length > 1 && <option value={0}>Leave {k.username} out</option>}
            </select>
          </label>
        ))}
        <button onClick={add} disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50">
          {saving ? "Finding lessons..." : "Add the starter week"}
        </button>
      </div>
      <p className="mt-3 text-xs text-[#8A7A69]">
        Pick the year that suits your child, not just their age. Where Oak has no lesson for a subject, we add a simple one of our own.
      </p>
      {error && <p className="mt-2 text-sm font-semibold text-[#A64F42]">{error}</p>}
    </div>
  );
}
