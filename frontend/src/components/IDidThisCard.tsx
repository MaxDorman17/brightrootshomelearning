"use client";

import { FormEvent, useState } from "react";
import { childDidIt } from "@/lib/api";
import { PlannerEntry } from "@/types";

type Props = {
  subjects: string[];
  /** Things this child has added that are still waiting for a grown-up. */
  waiting: PlannerEntry[];
  grownUp: string;
  onAdded: (entry: PlannerEntry) => void;
};

const input =
  "w-full rounded-xl border-2 border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-leaf";

/** On a child's Today page: tell a grown-up about something you did by yourself. It counts once they say OK. */
export default function IDidThisCard({ subjects, waiting, grownUp, onAdded }: Props) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 2) return setError("Tell us what you did.");
    setSaving(true);
    setError("");
    setSent(false);
    try {
      const res = await childDidIt({ title: title.trim(), subject: subject || undefined });
      onAdded(res.data);
      setTitle("");
      setSubject("");
      setSent(true);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "That didn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <h2 className="text-lg font-extrabold text-gray-900">Did something else today?</h2>
      <p className="mt-1 text-sm text-gray-500">
        Built something, read something, found something out? Tell {grownUp} here. It counts once they say OK.
      </p>

      <form onSubmit={save} className="mt-3 grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          placeholder="I made a marble run"
          aria-label="What you did"
          className={input}
        />
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="What kind of thing" className={input}>
          <option value="">My own learning</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" disabled={saving} className="rounded-xl bg-brand-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-leaf disabled:opacity-50">
          {saving ? "Sending..." : "Tell them"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      {sent && !error && <p className="mt-2 text-sm font-bold text-emerald-600">Sent to {grownUp}!</p>}

      {waiting.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Waiting for {grownUp}</p>
          <ul className="mt-1.5 space-y-1">
            {waiting.map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span aria-hidden>⏳</span>
                <span className="font-semibold">{e.lesson.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
