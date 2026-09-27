"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import LessonEditor from "@/components/LessonEditor";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  createLessonPlan,
  createPlannerEntry,
  deleteLesson,
  deleteLessonPlan,
  getChildren,
  getLessonLibrary,
  getLessonPlans,
  getTimetable,
  scheduleLessonPlan,
  updateLessonPlan,
} from "@/lib/api";
import { subjectsInTimetable } from "@/lib/subjects";
import { Lesson } from "@/types";

type LibraryLesson = Lesson & { times_planned: number; last_planned: string | null };
type Plan = { id: number; title: string; subject: string | null; description: string | null; lessons: Lesson[]; total_minutes: number };
type Child = { id: number; username: string };

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const input = "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";
const today = () => format(new Date(), "yyyy-MM-dd");

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-brand-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ChildPicker({ options, value, onChange }: { options: Child[]; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} className={input + " w-full"}>
      <option value="">All children</option>
      {options.map((c) => (
        <option key={c.id} value={c.id}>{c.username}</option>
      ))}
    </select>
  );
}

function AddToPlanner({ lesson, childList, onClose }: { lesson: Lesson; childList: Child[]; onClose: () => void }) {
  const [date, setDate] = useState(today());
  const [child, setChild] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPlannerEntry({ lesson_id: lesson.id, scheduled_date: date, ...(child != null ? { assigned_to: child } : {}) });
      setMessage(`Added to the planner for ${format(parseISO(date), "EEEE d MMMM")}.`);
    } catch (err) {
      setMessage(errorText(err, "Could not add it."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <h2 className="text-xl font-bold text-brand-charcoal">Add to planner</h2>
        <p className="mt-1 text-sm text-[#6E5A46]">{lesson.subject} · {lesson.title}</p>
        <div className="mt-5 space-y-3">
          <label className="block text-sm font-semibold text-brand-charcoal">
            Day
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={input + " mt-1.5 w-full"} />
          </label>
          <label className="block text-sm font-semibold text-brand-charcoal">
            For
            <div className="mt-1.5"><ChildPicker options={childList} value={child} onChange={setChild} /></div>
          </label>
        </div>
        {message && <p className="mt-4 text-sm font-semibold text-brand-sage">{message}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Close</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PlanEditor({
  plan,
  library,
  subjects,
  onSaved,
  onClose,
  onNewLesson,
}: {
  plan: Plan | null;
  library: LibraryLesson[];
  subjects: string[];
  onSaved: () => void;
  onClose: () => void;
  onNewLesson: (subject: string, add: (lesson: Lesson) => void) => void;
}) {
  const [title, setTitle] = useState(plan?.title ?? "");
  const [subject, setSubject] = useState(plan?.subject ?? subjects[0] ?? "");
  const [description, setDescription] = useState(plan?.description ?? "");
  const [lessons, setLessons] = useState<Lesson[]>(plan?.lessons ?? []);
  const [pick, setPick] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const options = library.filter((l) => !subject || l.subject === subject);
  const add = (lesson: Lesson) => setLessons((prev) => [...prev, lesson]);
  const move = (i: number, dir: -1 | 1) =>
    setLessons((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = { title: title.trim(), subject: subject.trim(), description: description.trim(), lesson_ids: lessons.map((l) => l.id) };
    try {
      if (plan) await updateLessonPlan(plan.id, body);
      else await createLessonPlan(body);
      onSaved();
    } catch (err) {
      setError(errorText(err, "Could not save the plan."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={save}>
        <h2 className="text-xl font-bold text-brand-charcoal">{plan ? "Edit plan" : "New lesson plan"}</h2>
        <div className="mt-5 space-y-3">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} placeholder="Plan name, e.g. Fractions - 2 weeks" className={input + " w-full"} />
          <input list="plan-subjects" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className={input + " w-full"} />
          <datalist id="plan-subjects">
            {subjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="What this plan covers (optional)" className={input + " w-full"} />

          <div>
            <p className="mb-2 text-sm font-semibold text-brand-charcoal">Lessons in order</p>
            {lessons.length === 0 && <p className="text-sm text-[#6E5A46]">No lessons yet. Add some below.</p>}
            <ol className="space-y-1.5">
              {lessons.map((l, i) => (
                <li key={`${l.id}-${i}`} className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-2 text-sm">
                  <span className="w-5 text-xs font-bold text-[#8A7A69]">{i + 1}.</span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-brand-charcoal">{l.title}</span>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1 disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === lessons.length - 1} className="px-1 disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => setLessons((prev) => prev.filter((_, idx) => idx !== i))} className="px-1 text-[#A64F42]" aria-label="Remove">✕</button>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <select value={pick} onChange={(e) => setPick(e.target.value)} className={input + " min-w-0 flex-1"}>
                <option value="">Choose a lesson from your library...</option>
                {options.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}{subject ? "" : ` (${l.subject})`}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={!pick}
                onClick={() => {
                  const lesson = library.find((l) => l.id === Number(pick));
                  if (lesson) add(lesson);
                  setPick("");
                }}
                className="rounded-xl border border-brand-line bg-white px-3 py-2 text-sm font-bold text-brand-sage disabled:opacity-40"
              >
                Add
              </button>
              <button type="button" onClick={() => onNewLesson(subject, add)} className="rounded-xl border border-brand-line bg-white px-3 py-2 text-sm font-bold text-brand-sage">
                + New lesson
              </button>
            </div>
          </div>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save plan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function SchedulePlan({ plan, childList, onClose }: { plan: Plan; childList: Child[]; onClose: () => void }) {
  const [start, setStart] = useState(today());
  const [child, setChild] = useState<number | null>(null);
  const [mode, setMode] = useState<"timetable" | "days">("timetable");
  const [days, setDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [result, setResult] = useState<{ lesson: string; date: string }[] | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await scheduleLessonPlan(plan.id, { start_date: start, assigned_to: child, mode, days });
      setResult(res.data.dates);
    } catch (err) {
      setError(errorText(err, "Could not schedule the plan."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-brand-charcoal">Schedule “{plan.title}”</h2>
      <p className="mt-1 text-sm text-[#6E5A46]">{plan.lessons.length} lessons, placed in order. Your days off are skipped.</p>
      {result ? (
        <div className="mt-5">
          <p className="font-bold text-brand-sage">Added to the planner:</p>
          <ul className="mt-2 space-y-1 text-sm">
            {result.map((r, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="truncate text-brand-charcoal">{r.lesson}</span>
                <span className="shrink-0 text-[#6E5A46]">{format(parseISO(r.date), "EEE d MMM")}</span>
              </li>
            ))}
          </ul>
          <button onClick={onClose} className="mt-6 w-full rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white">Done</button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-brand-charcoal">
            Start from
            <input type="date" required value={start} onChange={(e) => setStart(e.target.value)} className={input + " mt-1.5 w-full"} />
          </label>
          <label className="block text-sm font-semibold text-brand-charcoal">
            For
            <div className="mt-1.5"><ChildPicker options={childList} value={child} onChange={setChild} /></div>
          </label>
          <div>
            <p className="text-sm font-semibold text-brand-charcoal">Which days?</p>
            <label className="mt-2 flex items-center gap-2 text-sm text-[#6E5A46]">
              <input type="radio" checked={mode === "timetable"} onChange={() => setMode("timetable")} className="accent-brand-sage" />
              The days {plan.subject || "this subject"} is on your timetable
            </label>
            <label className="mt-1 flex items-center gap-2 text-sm text-[#6E5A46]">
              <input type="radio" checked={mode === "days"} onChange={() => setMode("days")} className="accent-brand-sage" />
              These days:
            </label>
            {mode === "days" && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))}
                    className={"rounded-lg border px-2.5 py-1 text-xs font-bold " + (days.includes(d) ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {saving ? "Scheduling..." : "Add to planner"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function MyLessonsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"lessons" | "plans">("lessons");
  const [library, setLibrary] = useState<LibraryLesson[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [childList, setChildList] = useState<Child[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [editing, setEditing] = useState<{ lesson: Lesson | null; subject?: string; onSaved?: (l: Lesson) => void } | null>(null);
  const [planning, setPlanning] = useState<Lesson | null>(null);
  const [planEditor, setPlanEditor] = useState<{ plan: Plan | null } | null>(null);
  const [scheduling, setScheduling] = useState<Plan | null>(null);

  const load = useCallback(async () => {
    const [lib, pl] = await Promise.all([getLessonLibrary(), getLessonPlans()]);
    setLibrary(lib.data);
    setPlans(pl.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load().catch(() => setLoading(false));
    getChildren().then((r) => setChildList(r.data)).catch(() => {});
    getTimetable().then((r) => setSubjects(subjectsInTimetable(r.data.config || {}))).catch(() => {});
  }, [load, router]);

  const allSubjects = useMemo(
    () => Array.from(new Set([...subjects, ...library.map((l) => l.subject)])),
    [subjects, library]
  );

  const shown = library.filter(
    (l) =>
      (!subjectFilter || l.subject === subjectFilter) &&
      (!search.trim() || `${l.title} ${l.objectives ?? ""}`.toLowerCase().includes(search.trim().toLowerCase()))
  );

  const removeLesson = async (l: LibraryLesson) => {
    if (!confirm(`Delete "${l.title}" from your library?`)) return;
    await deleteLesson(l.id);
    load();
  };

  const removePlan = async (p: Plan) => {
    if (!confirm(`Delete the plan "${p.title}"? The lessons stay in your library and planner.`)) return;
    await deleteLessonPlan(p.id);
    load();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Planning</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">My Lessons</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
          Build lessons once and reuse them. Group them into plans and schedule a whole series in one go.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-2xl bg-brand-white p-1">
            {(["lessons", "plans"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={"rounded-xl px-4 py-2 text-sm font-bold " + (tab === t ? "bg-brand-sage text-white" : "text-[#6E5A46]")}
              >
                {t === "lessons" ? `Lessons (${library.length})` : `Plans (${plans.length})`}
              </button>
            ))}
          </div>
          <button
            onClick={() => (tab === "lessons" ? setEditing({ lesson: null }) : setPlanEditor({ plan: null }))}
            className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark"
          >
            {tab === "lessons" ? "+ New lesson" : "+ New plan"}
          </button>
        </div>

        {loading && <p className="mt-6 text-sm text-[#6E5A46]">Loading...</p>}

        {!loading && tab === "lessons" && (
          <div className="mt-5">
            <div className="mb-4 flex flex-wrap gap-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lessons" className={input + " min-w-0 flex-1"} />
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className={input}>
                <option value="">All subjects</option>
                {allSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {shown.length === 0 ? (
              <div className="brand-card p-6 text-center text-sm text-[#6E5A46]">
                {library.length === 0 ? "No lessons yet. Press “+ New lesson” to build your first one." : "No lessons match."}
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {shown.map((l) => (
                  <div key={l.id} className="brand-card flex flex-col p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">{l.subject}</p>
                    <p className="mt-0.5 font-extrabold text-brand-charcoal">{l.title}</p>
                    {l.objectives && <p className="mt-1 line-clamp-2 text-sm text-[#6E5A46]">{l.objectives}</p>}
                    <p className="mt-2 text-xs text-[#8A7A69]">
                      {[
                        l.steps?.length ? `${l.steps.length} step${l.steps.length === 1 ? "" : "s"}` : null,
                        l.duration_minutes ? `${l.duration_minutes} min` : null,
                        l.resource_ids?.length ? `${l.resource_ids.length} resource${l.resource_ids.length === 1 ? "" : "s"}` : null,
                        l.times_planned ? `planned ${l.times_planned}×` : "not planned yet",
                        l.last_planned ? `last ${format(parseISO(l.last_planned), "d MMM")}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 border-t border-brand-line pt-3">
                      <button onClick={() => setPlanning(l)} className="text-xs font-bold text-brand-sage hover:underline">Add to planner</button>
                      <button onClick={() => setEditing({ lesson: l })} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
                      {l.times_planned === 0 && (
                        <button onClick={() => removeLesson(l)} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && tab === "plans" && (
          <div className="mt-5 space-y-3">
            {plans.length === 0 ? (
              <div className="brand-card p-6 text-center text-sm text-[#6E5A46]">
                No plans yet. A plan is a series of lessons, like “Fractions - 2 weeks”, that you can schedule in one go and reuse.
              </div>
            ) : (
              plans.map((p) => (
                <div key={p.id} className="brand-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-extrabold text-brand-charcoal">{p.title}</p>
                      <p className="text-xs text-[#6E5A46]">
                        {[p.subject, `${p.lessons.length} lesson${p.lessons.length === 1 ? "" : "s"}`, p.total_minutes ? `${p.total_minutes} min in total` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {p.description && <p className="mt-1 text-sm text-[#6E5A46]">{p.description}</p>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setScheduling(p)}
                        disabled={p.lessons.length === 0}
                        className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                      >
                        Schedule
                      </button>
                      <button onClick={() => setPlanEditor({ plan: p })} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
                      <button onClick={() => removePlan(p)} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
                    </div>
                  </div>
                  {p.lessons.length > 0 && (
                    <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-sm text-brand-charcoal">
                      {p.lessons.map((l, i) => (
                        <li key={`${l.id}-${i}`}>{l.title}</li>
                      ))}
                    </ol>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {planEditor && (
        <PlanEditor
          plan={planEditor.plan}
          library={library}
          subjects={allSubjects}
          onClose={() => setPlanEditor(null)}
          onSaved={() => {
            setPlanEditor(null);
            load();
          }}
          onNewLesson={(subject, add) => setEditing({ lesson: null, subject, onSaved: add })}
        />
      )}

      {editing && (
        <LessonEditor
          lesson={editing.lesson}
          subjects={allSubjects}
          defaultSubject={editing.subject}
          onClose={() => setEditing(null)}
          onSaved={(lesson) => {
            editing.onSaved?.(lesson);
            setEditing(null);
            load();
          }}
        />
      )}

      {planning && <AddToPlanner lesson={planning} childList={childList} onClose={() => { setPlanning(null); load(); }} />}
      {scheduling && <SchedulePlan plan={scheduling} childList={childList} onClose={() => { setScheduling(null); load(); }} />}
    </div>
  );
}
