"use client";

import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { getChildren, planSheets } from "@/lib/api";
import type { Worksheet } from "@/lib/worksheets";

type Child = { id: number; username: string; activity_level?: string | null };

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-60";
const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const nice = (iso: string) => format(new Date(`${iso}T12:00:00`), "EEEE d MMMM");

/**
 * "Add to planner" for a grown-up: one worksheet on a day, or a whole topic set, one sheet a day.
 * The sheets then turn up in the child's Today list and tick themselves off when finished.
 */
export default function PlanSheets({
  sheets,
  what,
  label = "Add to planner",
  className = "",
}: {
  sheets: Worksheet[];
  /** What is being planned, for the heading: a sheet's title or a topic's name. */
  what: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [kids, setKids] = useState<Child[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [day, setDay] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    getChildren()
      .then((res) => {
        // Little Roots children are too young for these, so they aren't offered.
        const able = (res.data as Child[]).filter((c) => c.activity_level !== "little");
        setKids(able);
        setPicked(able.length === 1 ? [able[0].id] : []);
      })
      .catch(() => setError("We couldn't load your children. Please try again."));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!picked.length && kids.length) {
      setError("Choose who it's for.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await planSheets(
        sheets.map((s) => ({ kind: "worksheet", slug: s.slug, title: s.title, subject: s.subject, intro: s.intro })),
        day,
        picked
      );
      const { planned, first_day, last_day } = res.data;
      setDone(planned === 1 ? `Added for ${nice(first_day)}.` : `Added ${planned} sheets, one a day from ${nice(first_day)} to ${nice(last_day)}.`);
      setOpen(false);
    } catch {
      setError("We couldn't add that to the planner. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`}>
        {label}
      </button>
      {done && (
        <span role="status" className="text-sm font-bold text-green-800">
          ✓ {done}
        </span>
      )}
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-sheets-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-brand-white p-6 text-left shadow-xl sm:rounded-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="plan-sheets-title" className="text-xl font-extrabold text-brand-charcoal">
                  Add to the planner
                </h2>
                <p className="mt-0.5 text-sm text-brand-earth">{what}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg px-2 py-1 text-sm font-bold text-brand-earth/60 hover:bg-brand-cream">
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="plan-sheets-day" className="mb-1.5 block text-sm font-bold text-brand-charcoal">
                  {sheets.length > 1 ? "Starting on" : "Day"}
                </label>
                <input id="plan-sheets-day" type="date" required value={day} onChange={(e) => setDay(e.target.value)} className={input} autoFocus />
                {sheets.length > 1 && (
                  <p className="mt-1.5 text-xs text-brand-earth/80">
                    {sheets.length} sheets, one each day in order, skipping weekends. You can move them in the planner afterwards.
                  </p>
                )}
              </div>
              {kids.length > 0 && (
                <div>
                  <p className="mb-1.5 text-sm font-bold text-brand-charcoal">Who is it for?</p>
                  <div className="flex flex-wrap gap-2">
                    {kids.map((k) => {
                      const on = picked.includes(k.id);
                      return (
                        <button
                          type="button"
                          key={k.id}
                          aria-pressed={on}
                          onClick={() => setPicked(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
                          className={
                            "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                            (on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                          }
                        >
                          {on ? "✓ " : ""}
                          {k.username}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {error && (
                <p role="alert" className="text-sm font-semibold text-red-700">
                  {error}
                </p>
              )}
              <button type="submit" disabled={saving} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark`}>
                {saving ? "Adding..." : "Add to planner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
