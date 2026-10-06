"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { addMoment, deletePlannerEntry, getFamilySubjects, getWeekEntries, logLearning } from "@/lib/api";
import { SUBJECT_OPTIONS } from "@/lib/subjects";
import { PlannerEntry } from "@/types";

type Kid = { id: number; username: string };

const MAX_PHOTOS = 5;
const MAX_PHOTO_MB = 10;

const input =
  "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

/**
 * For families who record learning as it happens rather than planning it first:
 * type what you did, pick who and which subject, and it is saved as done.
 * It counts everywhere a ticked-off lesson does: the planner, progress and the council report.
 */
export default function LogTodayCard({ kids, onLogged }: { kids: Kid[]; onLogged?: () => void }) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [day, setDay] = useState(today);
  const [who, setWho] = useState<number[]>([]);
  const [more, setMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoNote, setPhotoNote] = useState("");
  const [subjects, setSubjects] = useState<string[]>(SUBJECT_OPTIONS);
  const [done, setDone] = useState<PlannerEntry[]>([]);

  // With one child there is nobody to choose between.
  const chosen = kids.length === 1 ? [kids[0].id] : who;

  const loadDone = useCallback(async () => {
    try {
      const monday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const res = await getWeekEntries(monday);
      setDone((res.data as PlannerEntry[]).filter((e) => e.scheduled_date === today && e.is_complete));
    } catch {
      /* the list is a nicety; logging still works */
    }
  }, [today]);

  useEffect(() => {
    loadDone();
    getFamilySubjects()
      .then((res) => {
        const mine = res.data.subjects || [];
        setSubjects([...mine, ...SUBJECT_OPTIONS.filter((s) => !mine.includes(s))]);
      })
      .catch(() => {});
  }, [loadDone]);

  const days = useMemo(
    () => [0, -1, -2, -3, -4, -5, -6].map((back) => format(addDays(new Date(), back), "yyyy-MM-dd")),
    []
  );

  const pickPhotos = (files: FileList | null) => {
    const chosenFiles = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    const tooBig = chosenFiles.find((f) => f.size > MAX_PHOTO_MB * 1024 * 1024);
    if (tooBig) return setError(`Each photo needs to be under ${MAX_PHOTO_MB} MB.`);
    setError("");
    setPhotos(chosenFiles.slice(0, MAX_PHOTOS));
  };

  const toggle = (id: number) => setWho((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("Say what you did.");
    if (!subject.trim()) return setError("Pick a subject, or type your own.");
    if (chosen.length === 0) return setError("Pick who did it.");
    setSaving(true);
    setError("");
    try {
      await logLearning({ title: title.trim(), subject: subject.trim(), child_ids: chosen, day, note: note.trim() || undefined });
      setPhotoNote("");
      if (photos.length > 0) {
        // The photos are kept as a learning moment, so they show in Moments & Photos and the council report.
        try {
          await addMoment(
            { note: note.trim() ? `${title.trim()}: ${note.trim()}` : title.trim(), moment_date: day, subject: subject.trim(), child_ids: chosen },
            photos
          );
          setPhotoNote(photos.length === 1 ? "Saved, with your photo in Moments." : `Saved, with your ${photos.length} photos in Moments.`);
        } catch {
          setPhotoNote("Saved, but the photo could not be added. You can add it from Moments & Photos.");
        }
        setPhotos([]);
      }
      setTitle("");
      setNote("");
      setDay(today);
      setMore(false);
      await loadDone();
      onLogged?.();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not save that. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry: PlannerEntry) => {
    if (!confirm(`Remove "${entry.lesson.title}" from today?`)) return;
    await deletePlannerEntry(entry.id);
    await loadDone();
    onLogged?.();
  };

  if (kids.length === 0) return null;

  return (
    <section id="log" className="mb-8 scroll-mt-24 rounded-3xl border border-brand-line bg-brand-white p-5 sm:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-softsage">No plan needed</p>
      <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">What did you do today?</h2>
      <p className="mt-1 max-w-2xl text-sm text-[#6E5A46]">
        A walk, a book, baking, a museum, a long chat about volcanoes. Jot it down and it is saved as learning done, ready for
        your records and your council report.
      </p>

      <form onSubmit={save} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            placeholder="e.g. Pond dipping at the park"
            aria-label="What you did"
            className={input}
          />
          <input
            list="log-subjects"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={100}
            placeholder="Subject"
            aria-label="Subject"
            className={input}
          />
          <datalist id="log-subjects">
            {subjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {kids.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[#6E5A46]">Who?</span>
            {kids.map((k) => {
              const on = who.includes(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => toggle(k.id)}
                  aria-pressed={on}
                  className={
                    "rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-colors " +
                    (on ? "border-brand-softsage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")
                  }
                >
                  {k.username}
                </button>
              );
            })}
            <button type="button" onClick={() => setWho(who.length === kids.length ? [] : kids.map((k) => k.id))} className="text-xs font-bold text-brand-sage underline">
              {who.length === kids.length ? "Clear" : "Everyone"}
            </button>
          </div>
        )}

        {more && (
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <select value={day} onChange={(e) => setDay(e.target.value)} aria-label="When" className={input}>
              {days.map((d, i) => (
                <option key={d} value={d}>
                  {i === 0 ? "Today" : i === 1 ? "Yesterday" : format(parseISO(d), "EEEE d MMM")}
                </option>
              ))}
            </select>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              placeholder="A note, if you like: what they said, found or made"
              aria-label="Note"
              className={input}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save as done"}
          </button>
          <label className="cursor-pointer text-sm font-bold text-brand-sage underline">
            {photos.length > 0 ? `${photos.length} photo${photos.length === 1 ? "" : "s"} chosen` : "Add a photo"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              aria-label="Add a photo"
              onChange={(e) => {
                pickPhotos(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          {photos.length > 0 && (
            <button type="button" onClick={() => setPhotos([])} className="text-xs font-bold text-[#8A7A69] underline">
              Remove
            </button>
          )}
          {!more && (
            <button type="button" onClick={() => setMore(true)} className="text-sm font-bold text-brand-sage underline">
              Add a note or change the day
            </button>
          )}
          {photoNote && !error && <p className="text-sm font-semibold text-brand-sage">{photoNote}</p>}
          {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
        </div>
      </form>

      {done.length > 0 && (
        <div className="mt-5 border-t border-brand-line pt-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6E5A46]">Done today</p>
          <ul className="mt-2 divide-y divide-brand-line">
            {done.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                <p className="min-w-0 text-sm text-brand-charcoal">
                  <span className="font-bold">{e.lesson.title}</span>
                  <span className="text-[#6E5A46]">
                    {" · "}
                    {e.lesson.subject}
                    {e.assigned_to && kids.length > 1 ? ` · ${kids.find((k) => k.id === e.assigned_to)?.username ?? ""}` : ""}
                  </span>
                </p>
                <button type="button" onClick={() => remove(e)} className="shrink-0 text-xs font-bold text-[#A64F42] underline">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
