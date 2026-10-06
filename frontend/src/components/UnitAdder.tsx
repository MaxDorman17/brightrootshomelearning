"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { createLesson, createPlannerEntry } from "@/lib/api";
import SchemeInput from "@/components/SchemeInput";

export type UnitLesson = { title: string; url: string };
export type PlannedUnitLesson = { lesson: UnitLesson; date: string; dayName: string };

type Props = {
  subjects: string[];
  children: { id: number; username: string }[];
  defaultChildId: number | null;
  /** Works out which day each lesson lands on, from the family's timetable, days off and what is already planned. */
  plan: (lessons: UnitLesson[], subject: string, startDate: string) => PlannedUnitLesson[];
  onAdded: () => Promise<void> | void;
  onClose: () => void;
};

const MAX_LESSONS = 60;
const LINK_RE = /https?:\/\/\S+/i;
const field =
  "w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage";
const label = "block text-xs font-bold text-brand-earth/70 mb-1";

/** One lesson per line. A line may carry its own link; otherwise the unit's link is used. */
function readLessons(text: string, unitUrl: string): UnitLesson[] {
  const out: UnitLesson[] = [];
  for (const raw of text.split("\n")) {
    const link = raw.match(LINK_RE)?.[0] ?? "";
    const title = raw
      .replace(LINK_RE, "")
      .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "")
      .replace(/[\s|,;:-]+$/, "")
      .trim()
      .slice(0, 255);
    if (title) out.push({ title, url: link || unitUrl });
  }
  return out.slice(0, MAX_LESSONS);
}

/** Adds a whole unit of your own lessons, from any scheme, and spreads it across the timetable. */
export default function UnitAdder({ subjects, children, defaultChildId, plan, onAdded, onClose }: Props) {
  const [scheme, setScheme] = useState("");
  const [unitUrl, setUnitUrl] = useState("");
  const [titles, setTitles] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [assignedTo, setAssignedTo] = useState<number | null>(defaultChildId);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const cleanUrl = unitUrl.trim();
  const urlOk = !cleanUrl || /^https?:\/\//i.test(cleanUrl);
  const lessons = useMemo(() => readLessons(titles, urlOk ? cleanUrl : ""), [titles, cleanUrl, urlOk]);
  const schedule = lessons.length > 0 && subject && startDate ? plan(lessons, subject, startDate) : [];

  const add = async () => {
    if (!schedule.length || !urlOk) return;
    setAdding(true);
    setError("");
    try {
      for (const { lesson, date } of schedule) {
        const made = await createLesson({
          title: lesson.title,
          subject,
          lesson_url: lesson.url || undefined,
          scheme: scheme.trim(),
        });
        await createPlannerEntry({ lesson_id: made.data.id, scheduled_date: date, assigned_to: assignedTo ?? undefined });
      }
      await onAdded();
      onClose();
    } catch {
      setError("Some lessons could not be added. Check the planner, then try again with the ones that are missing.");
      await onAdded();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mb-5 bg-brand-white rounded-2xl border border-brand-softsage/20 shadow-sm p-5">
      <h3 className="text-lg font-extrabold text-brand-charcoal mb-1">Add a unit from any scheme</h3>
      <p className="text-sm text-brand-earth/65 mb-4">
        For Twinkl, White Rose Maths, a workbook or your own plan. List the lessons and they are put on the right days for you.
        Only the titles and links you type are kept.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className={label}>Lessons, one on each line</label>
          <textarea
            value={titles}
            onChange={(e) => setTitles(e.target.value)}
            rows={8}
            placeholder={"Place value to 1,000\nComparing numbers\nRounding to the nearest 10"}
            aria-label="Lessons, one on each line"
            className={field + " resize-y"}
          />
          <p className="mt-1 text-xs text-brand-earth/55">
            Paste a link after a title if that lesson has its own page. Up to {MAX_LESSONS} lessons.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className={label}>Scheme</label>
            <SchemeInput value={scheme} onChange={setScheme} className={field} />
          </div>
          <div>
            <label className={label}>Link to the unit (optional)</label>
            <input
              type="url"
              value={unitUrl}
              onChange={(e) => setUnitUrl(e.target.value)}
              placeholder="https://..."
              aria-label="Link to the unit"
              className={field}
            />
            {!urlOk && <p className="mt-1 text-xs font-semibold text-brand-terracotta">Links should start with https://</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={label}>Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject" className={field}>
                <option value="">Choose</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Start from</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="Start from" className={field} />
            </div>
            <div>
              <label className={label}>For</label>
              <select
                value={assignedTo ?? ""}
                onChange={(e) => setAssignedTo(e.target.value ? Number(e.target.value) : null)}
                aria-label="For"
                className={field}
              >
                <option value="">All children</option>
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.username}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {subject && schedule.length > 0 && (
        <div className="mt-4 bg-brand-cream rounded-xl border border-brand-softsage/15 p-3">
          <p className="text-xs font-bold text-brand-earth/60 mb-2">
            {schedule.length} lesson{schedule.length !== 1 ? "s" : ""}, finishing {format(parseISO(schedule[schedule.length - 1].date), "EEE d MMM")}
          </p>
          <div className="space-y-1.5">
            {schedule.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="font-bold text-brand-sage w-28 shrink-0">{format(parseISO(item.date), "EEE d MMM")}</span>
                <span className="text-brand-charcoal truncate">{item.lesson.title}</span>
              </div>
            ))}
            {schedule.length > 6 && (
              <p className="text-xs text-brand-earth/50">Plus {schedule.length - 6} more</p>
            )}
          </div>
        </div>
      )}

      {subject && lessons.length > 0 && schedule.length === 0 && (
        <p className="mt-4 text-sm text-brand-terracotta">
          {subject} isn&apos;t on your timetable yet, so there is no day to put these on. Add it under Plan, then Timetable.
        </p>
      )}
      {schedule.length > 0 && schedule.length < lessons.length && (
        <p className="mt-2 text-xs text-brand-terracotta">
          Only {schedule.length} of {lessons.length} lessons fit. The rest can be added later.
        </p>
      )}
      {error && <p className="mt-3 text-sm font-semibold text-brand-terracotta">{error}</p>}

      <div className="flex gap-3 flex-wrap mt-4">
        <button
          onClick={add}
          disabled={adding || !subject || schedule.length === 0 || !urlOk}
          className="gradient-btn px-5 py-2.5 text-sm disabled:opacity-50"
        >
          {adding ? "Adding lessons..." : `Add ${schedule.length || ""} lesson${schedule.length !== 1 ? "s" : ""} to planner`}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2.5 border border-brand-softsage/30 text-brand-earth rounded-xl font-bold text-sm hover:bg-brand-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
