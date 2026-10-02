"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { addExam, deleteExam, Exam, ExamBody, getChildren, getExams, planRevision, updateExam } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";

type Child = { id: number; username: string };

const QUALIFICATIONS = ["GCSE", "IGCSE", "A level", "AS level", "Functional Skills", "Other"];
const STATUSES: { value: Exam["status"]; label: string; style: string }[] = [
  { value: "planning", label: "Not entered yet", style: "bg-[#FBEFEB] text-[#A64F42]" },
  { value: "entered", label: "Entered", style: "bg-brand-tint text-brand-sage" },
  { value: "sat", label: "Sat, waiting for result", style: "bg-[#E3EAF0] text-[#3D5A73]" },
  { value: "result", label: "Result in", style: "bg-[#F3EAD7] text-[#7A5B22]" },
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const input = "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

const nice = (d: string | null) => (d ? format(parseISO(d), "EEE d MMMM yyyy") : "");
const daysUntil = (d: string) => Math.round((parseISO(d).getTime() - parseISO(format(new Date(), "yyyy-MM-dd")).getTime()) / 86400000);

function ExamForm({ exam, kids, onSaved, onClose }: { exam: Exam | null; kids: Child[]; onSaved: () => void; onClose: () => void }) {
  const [body, setBody] = useState<ExamBody>({
    child_id: exam?.child_id ?? kids[0]?.id ?? 0,
    subject: exam?.subject ?? "",
    qualification: exam?.qualification ?? "GCSE",
    board: exam?.board ?? "",
    paper: exam?.paper ?? "",
    exam_date: exam?.exam_date ?? "",
    exam_time: exam?.exam_time ?? "",
    centre: exam?.centre ?? "",
    entry_deadline: exam?.entry_deadline ?? "",
    fee: exam?.fee ?? "",
    status: exam?.status ?? "planning",
    result: exam?.result ?? "",
    notes: exam?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof ExamBody, value: string | number) => setBody((b) => ({ ...b, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const clean = { ...body, exam_date: body.exam_date || null, entry_deadline: body.entry_deadline || null };
    try {
      if (exam) await updateExam(exam.id, clean);
      else await addExam(clean);
      onSaved();
    } catch (err) {
      setError(errorText(err, "Could not save. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof ExamBody, props: Record<string, any> = {}) => (
    <label className="block text-sm font-semibold text-brand-charcoal">
      {label}
      <input value={(body[key] as string) ?? ""} onChange={(e) => set(key, e.target.value)} className={input + " mt-1.5 w-full"} {...props} />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-brand-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-brand-charcoal">{exam ? "Edit exam" : "Add an exam"}</h2>
        <div className="mt-5 space-y-4">
          {kids.length > 1 && (
            <label className="block text-sm font-semibold text-brand-charcoal">
              Who is sitting it?
              <select value={body.child_id} onChange={(e) => set("child_id", Number(e.target.value))} className={input + " mt-1.5 w-full"}>
                {kids.map((k) => (
                  <option key={k.id} value={k.id}>{k.username}</option>
                ))}
              </select>
            </label>
          )}
          <div className="grid grid-cols-2 gap-3">
            {field("Subject", "subject", { required: true, maxLength: 100, placeholder: "e.g. Maths" })}
            <label className="block text-sm font-semibold text-brand-charcoal">
              Qualification
              <select value={body.qualification} onChange={(e) => set("qualification", e.target.value)} className={input + " mt-1.5 w-full"}>
                {QUALIFICATIONS.map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </label>
            {field("Exam board", "board", { maxLength: 60, placeholder: "e.g. AQA, Edexcel" })}
            {field("Paper", "paper", { maxLength: 100, placeholder: "e.g. Paper 1 Higher" })}
            {field("Exam date", "exam_date", { type: "date" })}
            {field("Time", "exam_time", { maxLength: 20, placeholder: "e.g. 9:00am" })}
          </div>
          {field("Exam centre", "centre", { maxLength: 200, placeholder: "Where it will be sat" })}
          <div className="grid grid-cols-2 gap-3">
            {field("Entry deadline", "entry_deadline", { type: "date" })}
            {field("Fee", "fee", { maxLength: 40, placeholder: "e.g. £180" })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold text-brand-charcoal">
              Where things are up to
              <select value={body.status} onChange={(e) => set("status", e.target.value)} className={input + " mt-1.5 w-full"}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
            {field("Result", "result", { maxLength: 40, placeholder: "e.g. 7 or B" })}
          </div>
          <label className="block text-sm font-semibold text-brand-charcoal">
            Notes
            <textarea value={body.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={3} maxLength={2000} placeholder="Candidate number, what to bring, access arrangements..." className={input + " mt-1.5 w-full"} />
          </label>
          {error && <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">{error}</div>}
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RevisionForm({ exam, onDone, onClose }: { exam: Exam; onDone: (message: string) => void; onClose: () => void }) {
  const [days, setDays] = useState<number[]>([0, 2, 4]);
  const [minutes, setMinutes] = useState(45);
  const [start, setStart] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (days.length === 0) return setError("Pick at least one day.");
    setSaving(true);
    setError("");
    try {
      const res = await planRevision(exam.id, { weekdays: days, minutes, start_date: start });
      const { sessions, first, last } = res.data;
      onDone(
        sessions === 0
          ? "There were no days left before the exam to add revision to."
          : `Added ${sessions} revision session${sessions === 1 ? "" : "s"} to the planner, from ${nice(first)} to ${nice(last)}.`
      );
    } catch (err) {
      setError(errorText(err, "Could not plan revision. Please try again."));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-brand-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-brand-charcoal">Plan revision for {exam.subject}</h2>
        <p className="mt-1 text-sm text-[#6E5A46]">
          Revision sessions go into {exam.child}&apos;s planner on the days you pick, up to the day before the exam on {nice(exam.exam_date)}.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-brand-charcoal">Which days?</p>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map((d, i) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDays((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))}
                  className={"rounded-xl border px-3 py-1.5 text-sm font-bold " + (days.includes(i) ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-[#6E5A46]")}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold text-brand-charcoal">
              Minutes each time
              <input type="number" min={10} max={240} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className={input + " mt-1.5 w-full"} />
            </label>
            <label className="block text-sm font-semibold text-brand-charcoal">
              Starting from
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={input + " mt-1.5 w-full"} />
            </label>
          </div>
          {error && <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">{error}</div>}
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Adding..." : "Add to planner"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ExamCard({ exam, isParent, showChild, onEdit, onRevise, onDeleted }: { exam: Exam; isParent: boolean; showChild: boolean; onEdit: () => void; onRevise: () => void; onDeleted: () => void }) {
  const status = STATUSES.find((s) => s.value === exam.status) ?? STATUSES[0];
  const deadlineDays = exam.entry_deadline ? daysUntil(exam.entry_deadline) : null;
  const deadlineWarning = exam.status === "planning" && deadlineDays != null && deadlineDays <= 21;
  const upcoming = exam.days_to_go != null && exam.days_to_go >= 0 && exam.status !== "result";

  const remove = async () => {
    if (!confirm(`Delete ${exam.subject}? Revision already in the planner stays there.`)) return;
    await deleteExam(exam.id);
    onDeleted();
  };

  return (
    <article className="brand-card flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-tint text-brand-sage">
        {upcoming ? (
          <>
            <span className="text-2xl font-extrabold leading-none">{exam.days_to_go}</span>
            <span className="text-[10px] font-bold uppercase">{exam.days_to_go === 1 ? "day" : "days"}</span>
          </>
        ) : exam.status === "result" && exam.result ? (
          <span className="text-2xl font-extrabold">{exam.result}</span>
        ) : (
          <span className="text-2xl">📝</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-extrabold text-brand-charcoal">
            {exam.qualification} {exam.subject}
            {exam.paper && <span className="font-semibold text-[#6E5A46]"> · {exam.paper}</span>}
          </h3>
          <span className={"rounded-full px-2.5 py-0.5 text-xs font-bold " + status.style}>{status.label}</span>
        </div>
        <p className="mt-0.5 text-sm text-[#6E5A46]">
          {showChild && <span className="font-bold">{exam.child} · </span>}
          {exam.exam_date ? nice(exam.exam_date) : "Date not set"}
          {exam.exam_time && ` at ${exam.exam_time}`}
          {exam.board && ` · ${exam.board}`}
        </p>
        {exam.centre && <p className="text-sm text-[#6E5A46]">📍 {exam.centre}</p>}
        {exam.entry_deadline && exam.status === "planning" && (
          <p className={"mt-2 rounded-xl px-3 py-2 text-sm font-semibold " + (deadlineWarning ? "bg-[#FBEFEB] text-[#A64F42]" : "bg-brand-cream text-[#6E5A46]")}>
            {deadlineDays! < 0
              ? `The entry deadline was ${nice(exam.entry_deadline)}. Check with the centre whether late entry is possible.`
              : `Enter by ${nice(exam.entry_deadline)}${deadlineDays === 0 ? " (today)" : ` (${deadlineDays} day${deadlineDays === 1 ? "" : "s"} left)`}.`}
            {exam.fee && ` Fee ${exam.fee}.`}
          </p>
        )}
        {exam.notes && <p className="mt-2 whitespace-pre-line text-sm text-brand-charcoal">{exam.notes}</p>}
        {isParent && (
          <div className="mt-3 flex flex-wrap gap-3">
            {exam.exam_date && upcoming && (
              <button onClick={onRevise} className="rounded-xl bg-brand-sage px-3 py-1.5 text-xs font-bold text-white">Plan revision</button>
            )}
            <button onClick={onEdit} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
            <button onClick={remove} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
}

/** GCSEs and other exams sat as a private candidate: dates, centres, entry deadlines and a revision plan. */
export default function ExamsPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [kids, setKids] = useState<Child[]>([]);
  const [filter, setFilter] = useState(0);
  const [editing, setEditing] = useState<{ exam: Exam | null } | null>(null);
  const [revising, setRevising] = useState<Exam | null>(null);
  const [message, setMessage] = useState("");
  const isParent = role === "parent";

  const load = useCallback(() => getExams().then((res) => setExams(res.data)).catch(() => setExams([])), []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const r = getRole() || "";
    setRole(r);
    load();
    if (r === "parent") getChildren().then((res) => setKids(res.data)).catch(() => {});
  }, [load, router]);

  const shown = useMemo(() => (exams || []).filter((e) => !filter || e.child_id === filter), [exams, filter]);
  const upcoming = shown.filter((e) => e.status !== "result" && (e.days_to_go == null || e.days_to_go >= 0));
  const done = shown.filter((e) => !upcoming.includes(e));
  const next = upcoming.find((e) => e.days_to_go != null);
  const showChild = isParent && kids.length > 1 && !filter;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="exams" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Teens</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Exams</h1>
          <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">
            {isParent
              ? "Keep track of GCSEs and other exams sat as a private candidate: centres, entry deadlines, dates and revision."
              : "Your exams, how long until each one, and where they are."}
          </p>
        </PageHero>

        {next && (
          <div className="brand-card mb-5 bg-brand-tint p-4 text-brand-charcoal">
            <span className="font-extrabold">Next up:</span> {next.qualification} {next.subject}
            {next.paper ? ` ${next.paper}` : ""}
            {showChild ? ` (${next.child})` : ""} on {nice(next.exam_date)}, {next.days_to_go === 0 ? "today" : `in ${next.days_to_go} day${next.days_to_go === 1 ? "" : "s"}`}.
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-brand-mist bg-brand-wash px-4 py-3 text-sm font-semibold text-brand-sage">
            <span>
              {message} <Link href="/parent" className="underline">Open the planner</Link>
            </span>
            <button onClick={() => setMessage("")} aria-label="Close">✕</button>
          </div>
        )}

        {isParent && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            {kids.length > 1 ? (
              <select value={filter} onChange={(e) => setFilter(Number(e.target.value))} className={input}>
                <option value={0}>Everyone</option>
                {kids.map((k) => (
                  <option key={k.id} value={k.id}>{k.username}</option>
                ))}
              </select>
            ) : (
              <span />
            )}
            <button
              onClick={() => setEditing({ exam: null })}
              disabled={kids.length === 0}
              className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50"
            >
              + Add an exam
            </button>
          </div>
        )}

        {exams === null ? (
          <p className="text-sm text-[#6E5A46]">Loading...</p>
        ) : shown.length === 0 ? (
          <div className="brand-card p-8 text-center">
            <p className="text-4xl">📝</p>
            <p className="mt-2 font-bold text-brand-charcoal">No exams yet</p>
            <p className="mt-1 text-sm text-[#6E5A46]">
              {isParent
                ? kids.length === 0
                  ? "Add a child first, then you can add their exams here."
                  : "Add each exam paper your teenager is sitting, with its centre and entry deadline."
                : "When your grown-up adds your exams, they will show here."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {upcoming.map((e) => (
                <ExamCard key={e.id} exam={e} isParent={isParent} showChild={showChild} onEdit={() => setEditing({ exam: e })} onRevise={() => setRevising(e)} onDeleted={load} />
              ))}
            </div>
            {done.length > 0 && (
              <>
                <h2 className="mb-3 mt-8 text-xl font-extrabold text-brand-charcoal">Sat and results</h2>
                <div className="space-y-4">
                  {done.map((e) => (
                    <ExamCard key={e.id} exam={e} isParent={isParent} showChild={showChild} onEdit={() => setEditing({ exam: e })} onRevise={() => setRevising(e)} onDeleted={load} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {isParent && (
          <div className="brand-card mt-8 p-5 text-sm text-brand-charcoal">
            <h2 className="text-lg font-extrabold">Sitting exams as a private candidate</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[#4A3B2C]">
              <li>Home-educated teenagers sit GCSEs and IGCSEs at an exam centre that takes private candidates. Not every school or college does, so ask early.</li>
              <li>Centres set their own entry deadlines, usually months before the exams. Summer exams often need entering by the winter before.</li>
              <li>Fees vary a lot between centres and subjects, so ask for the full cost, including any admin or late-entry charges.</li>
              <li>Subjects with coursework or practical endorsements (for example some sciences and English language spoken language) need extra arrangements. IGCSEs often avoid this.</li>
              <li>Once entered, you will get a candidate number and a statement of entry. Keep them in the notes for each exam.</li>
            </ul>
          </div>
        )}
      </div>

      {editing && (
        <ExamForm
          exam={editing.exam}
          kids={kids}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {revising && (
        <RevisionForm
          exam={revising}
          onClose={() => setRevising(null)}
          onDone={(text) => {
            setRevising(null);
            setMessage(text);
          }}
        />
      )}
    </div>
  );
}
