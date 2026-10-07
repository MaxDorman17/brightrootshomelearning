"use client";

import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { getChildren, getFamilySubjects, planSheets } from "@/lib/api";
import type { Worksheet } from "@/lib/worksheets";

type Child = { id: number; username: string; activity_level?: string | null };

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-60";
const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const nice = (iso: string) => format(new Date(`${iso}T12:00:00`), "EEEE d MMMM");

const plain = (name: string) => name.toLowerCase().replace(/&/g, "and").replace(/[^a-z]+/g, " ").trim();
// What a family might call one of Oak's subjects on their own timetable.
const ALSO_CALLED: Record<string, string[]> = {
  "physical education": ["pe", "p e", "sport", "games"],
  french: ["languages", "modern languages", "mfl"],
  spanish: ["languages", "modern languages", "mfl"],
  german: ["languages", "modern languages", "mfl"],
  "rshe pshe": ["pshe", "rshe", "life skills", "health and wellbeing"],
  "religious education": ["re", "r e", "rme", "religious studies"],
  "design and technology": ["dt", "d t", "technology", "design technology"],
  "art and design": ["art"],
  "cooking and nutrition": ["cooking", "food"],
  computing: ["ict", "computer science", "coding"],
  maths: ["mathematics", "numeracy"],
  english: ["literacy"],
};

/** The family's own name for a subject, if their timetable has one; otherwise the name as given. */
function ownNameFor(subject: string, timetable: string[]): string {
  const wanted = [plain(subject), ...(ALSO_CALLED[plain(subject)] ?? [])];
  for (const name of wanted) {
    const found = timetable.find((t) => plain(t) === name);
    if (found) return found;
  }
  return subject;
}

/**
 * "Add to planner" for a grown-up: one worksheet on a day, or a whole topic set, one sheet a day.
 * The sheets then turn up in the child's Today list and tick themselves off when finished.
 */
export default function PlanSheets({
  sheets = [],
  plan,
  count,
  subject,
  noun = "sheets",
  what,
  label = "Add to planner",
  className = "",
}: {
  /** Worksheets to plan. Leave out when `plan` is given. */
  sheets?: Worksheet[];
  /** For anything that is not a worksheet (Oak lessons): does the planning itself. Needs `count`. */
  plan?: (day: string, childIds: number[], subject: string) => Promise<{ data: { planned: number; first_day: string; last_day: string } }>;
  count?: number;
  /** With `plan`: the subject these belong to. The grown-up can file them under one of their own timetable subjects. */
  subject?: string;
  /** What several of them are called: "sheets" or "lessons". */
  noun?: string;
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
  const [timetable, setTimetable] = useState<string[]>([]);
  const [filedUnder, setFiledUnder] = useState(subject ?? "");
  const howMany = count ?? sheets.length;
  // Worksheets keep their own subject; anything else can be filed under one of the family timetable subjects.
  const theSubject = subject ? filedUnder || subject : sheets[0]?.subject ?? "";
  const onTimetable = timetable.includes(theSubject);

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
    getFamilySubjects()
      .then((res) => {
        setTimetable(res.data.subjects);
        if (subject) setFiledUnder(ownNameFor(subject, res.data.subjects));
      })
      .catch(() => {});
  }, [open, subject]);

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
      const res = plan
        ? await plan(day, picked, theSubject)
        : await planSheets(
            sheets.map((s) => ({ kind: "worksheet", slug: s.slug, title: s.title, subject: s.subject, intro: s.intro })),
            day,
            picked
          );
      const { planned, first_day, last_day } = res.data;
      setDone(planned === 1 ? `Added for ${nice(first_day)}.` : `Added ${planned} ${noun}, from ${nice(first_day)} to ${nice(last_day)}.`);
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
                  {howMany > 1 ? "Starting on" : "Day"}
                </label>
                <input id="plan-sheets-day" type="date" required value={day} onChange={(e) => setDay(e.target.value)} className={input} autoFocus />
                {howMany > 1 && (
                  <p className="mt-1.5 text-xs text-brand-earth/80">
                    {howMany} {noun}, in order,{" "}
                    {onTimetable
                      ? `on the days ${theSubject} is on your timetable. Days off, and days that already have ${theSubject}, are skipped.`
                      : `one each weekday, as ${theSubject || "this subject"} is not on your timetable. Days off are skipped.`}{" "}
                    You can move them in the planner afterwards.
                  </p>
                )}
              </div>
              {subject && timetable.length > 0 && (
                <div>
                  <label htmlFor="plan-sheets-subject" className="mb-1.5 block text-sm font-bold text-brand-charcoal">
                    Subject on your timetable
                  </label>
                  <select id="plan-sheets-subject" value={theSubject} onChange={(e) => setFiledUnder(e.target.value)} className={input}>
                    {[...new Set([...timetable, subject])].map((name) => (
                      <option key={name} value={name}>
                        {name}
                        {timetable.includes(name) ? "" : " (not on your timetable)"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
