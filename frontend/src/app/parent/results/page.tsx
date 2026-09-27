"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import ResultsView, { OwnTest, ResultsOverview } from "@/components/ResultsView";
import StudySummaryCard from "@/components/StudySummaryCard";
import GamesSummaryCard from "@/components/GamesSummaryCard";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  addTestResult,
  deleteTestResult,
  getChildren,
  getResultsOverview,
  getTimetable,
  updateTestResult,
} from "@/lib/api";
import { subjectsInTimetable } from "@/lib/subjects";

type Child = { id: number; username: string };

type FormState = {
  id: number | null;
  subject: string;
  title: string;
  taken_on: string;
  score: string;
  total: string;
  notes: string;
};

const emptyForm = (): FormState => ({
  id: null,
  subject: "",
  title: "",
  taken_on: format(new Date(), "yyyy-MM-dd"),
  score: "",
  total: "",
  notes: "",
});

const inputClass =
  "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20";

export default function ResultsPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [data, setData] = useState<ResultsOverview | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    Promise.all([getChildren(), getTimetable().catch(() => null)])
      .then(([childRes, timetableRes]) => {
        const list: Child[] = childRes.data || [];
        setChildren(list);
        setChildId(list[0]?.id ?? null);
        if (timetableRes) setSubjects(subjectsInTimetable(timetableRes.data.config || {}));
        if (list.length === 0) setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const load = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await getResultsOverview(id);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (childId != null) load(childId);
  }, [childId, load]);

  const openAdd = () => {
    setError("");
    setForm(emptyForm());
  };

  const openEdit = (test: OwnTest) => {
    setError("");
    setForm({
      id: test.id,
      subject: test.subject,
      title: test.title,
      taken_on: test.taken_on,
      score: String(test.score),
      total: String(test.total),
      notes: test.notes || "",
    });
  };

  const handleDelete = async (test: OwnTest) => {
    if (!confirm(`Delete "${test.title}"?`)) return;
    await deleteTestResult(test.id);
    if (childId != null) load(childId);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!form || childId == null) return;
    const score = Number(form.score);
    const total = Number(form.total);
    if (!(total > 0)) return setError("\"Out of\" must be more than 0.");
    if (!(score >= 0)) return setError("Score can't be negative.");
    if (score > total) return setError("Score can't be more than the total.");

    setSaving(true);
    setError("");
    const body = {
      child_id: childId,
      subject: form.subject.trim(),
      title: form.title.trim(),
      taken_on: form.taken_on,
      score,
      total,
      notes: form.notes.trim() || null,
    };
    try {
      if (form.id == null) await addTestResult(body);
      else await updateTestResult(form.id, body);
      setForm(null);
      load(childId);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Results</p>
            <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Test Results</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
              Spelling tests and Oak quiz scores appear here automatically. Add any other test yourself.
            </p>
          </div>
          {children.length > 0 && (
            <button onClick={openAdd} className="rounded-xl bg-brand-sage px-5 py-3 text-sm font-bold text-white hover:bg-brand-sagedark">
              + Add a result
            </button>
          )}
        </div>

        {children.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setChildId(child.id)}
                className={
                  "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors " +
                  (child.id === childId
                    ? "border-brand-softsage bg-brand-tint text-brand-sage"
                    : "border-brand-line bg-brand-white text-[#6E5A46] hover:border-brand-softsage")
                }
              >
                {child.username}
              </button>
            ))}
          </div>
        )}

        {!loading && children.length === 0 && (
          <div className="brand-card p-6 text-center text-sm text-[#6E5A46]">
            Add a child on the Children page to start recording results.
          </div>
        )}

        {loading && <p className="text-sm text-[#6E5A46]">Loading results...</p>}

        {!loading && data && (
          <div className="space-y-5">
            <ResultsView data={data} onEditTest={openEdit} onDeleteTest={handleDelete} />
            {childId != null && <StudySummaryCard childId={childId} />}
            {childId != null && <GamesSummaryCard childId={childId} />}
          </div>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setForm(null)}>
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-brand-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-brand-charcoal">{form.id == null ? "Add a result" : "Edit result"}</h2>
            <p className="mt-1 text-sm text-[#6E5A46]">
              For {children.find((c) => c.id === childId)?.username}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Test name</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Times tables check"
                  maxLength={255}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Subject</label>
                <input
                  required
                  list="result-subjects"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Maths"
                  maxLength={100}
                  className={inputClass}
                />
                <datalist id="result-subjects">
                  {subjects.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Score</label>
                  <input
                    required
                    type="number"
                    min={0}
                    step="any"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Out of</label>
                  <input
                    required
                    type="number"
                    min={0}
                    step="any"
                    value={form.total}
                    onChange={(e) => setForm({ ...form, total: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">Date</label>
                  <input
                    required
                    type="date"
                    value={form.taken_on}
                    onChange={(e) => setForm({ ...form, taken_on: e.target.value })}
                    className={inputClass + " px-2"}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
                  Notes <span className="font-normal text-[#8A7A69]">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save result"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
