"use client";

import { FormEvent, useEffect, useState } from "react";
import { createLesson, getResources, updateLesson } from "@/lib/api";
import { Lesson } from "@/types";
import SchemeInput from "@/components/SchemeInput";

type ResourceItem = { id: number; folder: string; title: string; kind: string; visible_to_children: boolean };

type Props = {
  lesson?: Lesson | null;
  subjects: string[];
  defaultSubject?: string;
  onSaved: (lesson: Lesson) => void;
  onClose: () => void;
};

const input =
  "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

export default function LessonEditor({ lesson, subjects, defaultSubject, onSaved, onClose }: Props) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [subject, setSubject] = useState(lesson?.subject ?? defaultSubject ?? subjects[0] ?? "");
  const [objectives, setObjectives] = useState(lesson?.objectives ?? "");
  const [steps, setSteps] = useState<string[]>(lesson?.steps?.length ? lesson.steps : [""]);
  const [duration, setDuration] = useState(lesson?.duration_minutes ? String(lesson.duration_minutes) : "");
  const [url, setUrl] = useState(lesson?.lesson_url ?? "");
  const [scheme, setScheme] = useState(lesson?.scheme ?? "");
  const [notes, setNotes] = useState(lesson?.description ?? "");
  const [resourceIds, setResourceIds] = useState<number[]>(lesson?.resource_ids ?? []);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getResources()
      .then((res) => setResources(res.data.items))
      .catch(() => {});
  }, []);

  const setStep = (i: number, value: string) => setSteps((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  const moveStep = (i: number, dir: -1 | 1) =>
    setSteps((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const removeStep = (i: number) => setSteps((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i)));

  const toggleResource = (id: number) =>
    setResourceIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return setError("A lesson needs a title and a subject.");
    if (url.trim() && !/^https?:\/\//i.test(url.trim())) return setError("Links should start with https://");
    setSaving(true);
    setError("");
    const body = {
      title: title.trim(),
      subject: subject.trim(),
      objectives: objectives.trim(),
      steps: steps.map((s) => s.trim()).filter(Boolean),
      duration_minutes: duration ? Number(duration) : null,
      lesson_url: url.trim() || null,
      scheme: scheme.trim(),
      description: notes.trim() || null,
      resource_ids: resourceIds,
    };
    try {
      const res = lesson ? await updateLesson(lesson.id, body) : await createLesson(body);
      onSaved(res.data);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not save the lesson.");
    } finally {
      setSaving(false);
    }
  };

  const folders = Array.from(new Set(resources.map((r) => r.folder)));
  const orderedFolders = [subject, ...folders.filter((f) => f !== subject)].filter((f) => folders.includes(f));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-brand-white p-6 shadow-xl"
      >
        <h2 className="text-xl font-bold text-brand-charcoal">{lesson ? "Edit lesson" : "New lesson"}</h2>

        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} placeholder="e.g. Adding fractions" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Subject</label>
              <input required list="lesson-subjects" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100} className={input} />
              <datalist id="lesson-subjects">
                {subjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">What we&apos;ll learn</label>
            <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={2} placeholder="e.g. Add fractions with the same denominator" className={input} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Steps</label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-right text-xs font-bold text-[#8A7A69]">{i + 1}.</span>
                  <input value={step} onChange={(e) => setStep(i, e.target.value)} maxLength={500} placeholder={i === 0 ? "e.g. Warm up: count in halves" : "Next step"} className={input} />
                  <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="px-1 text-[#6E5A46] disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="px-1 text-[#6E5A46] disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => removeStep(i)} className="px-1 text-[#A64F42]" aria-label="Remove step">✕</button>
                </div>
              ))}
            </div>
            {steps.length < 30 && (
              <button type="button" onClick={() => setSteps((prev) => [...prev, ""])} className="mt-2 text-sm font-bold text-brand-sage hover:underline">
                + Add a step
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Time (minutes)</label>
              <input type="number" min={1} max={600} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" className={input} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Lesson link <span className="font-normal text-[#8A7A69]">(optional)</span></label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={input} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Scheme <span className="font-normal text-[#8A7A69]">(optional)</span></label>
            <SchemeInput value={scheme} onChange={setScheme} className={input} />
            <p className="mt-1 text-xs text-[#8A7A69]">Where the lesson comes from. We only keep the name and your link.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Notes for your child <span className="font-normal text-[#8A7A69]">(optional)</span></label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={input} />
          </div>

          {resources.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Attach from Resources</label>
              <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-brand-line bg-white p-3">
                {orderedFolders.map((folder) => (
                  <div key={folder}>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">{folder}</p>
                    {resources.filter((r) => r.folder === folder).map((r) => (
                      <label key={r.id} className="flex items-center gap-2 py-0.5 text-sm text-brand-charcoal">
                        <input type="checkbox" checked={resourceIds.includes(r.id)} onChange={() => toggleResource(r.id)} className="accent-brand-sage" />
                        {r.kind === "link" ? "🔗" : "📄"} {r.title}
                        {!r.visible_to_children && <span className="text-xs text-[#8A7A69]">(parents only, children won&apos;t see it)</span>}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">{error}</div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}
