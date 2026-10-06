"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { deletePlannerEntry, toggleComplete } from "@/lib/api";
import { PlannerEntry } from "@/types";

type Kid = { id: number; username: string };

/**
 * On the parent home page: things children say they did by themselves, waiting for a grown-up.
 * "OK" marks it done, so it counts like any other lesson. "Remove" takes it away.
 */
export default function ChildAddedCard({ entries, kids, onChanged }: { entries: PlannerEntry[]; kids: Kid[]; onChanged: () => void }) {
  const [busy, setBusy] = useState<number | null>(null);
  const waiting = entries.filter((e) => e.added_by_child && !e.is_complete);
  if (waiting.length === 0) return null;

  const act = async (entry: PlannerEntry, ok: boolean) => {
    setBusy(entry.id);
    try {
      if (ok) await toggleComplete(entry.id);
      else await deletePlannerEntry(entry.id);
      onChanged();
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mb-8 rounded-3xl border border-[#EBD9A8] bg-[#FBF4DF] p-5 sm:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#8A6A22]">Waiting for your OK</p>
      <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">
        {waiting.length === 1 ? "Something your child did by themselves" : "Things your children did by themselves"}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-[#6E5A46]">
        They added these from their own page. Press OK and it counts as learning done, in the planner, their stars and your records.
      </p>
      <ul className="mt-4 divide-y divide-[#EBD9A8]">
        {waiting.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-extrabold text-brand-charcoal">{e.lesson.title}</p>
              <p className="text-xs text-[#6E5A46]">
                {[kids.find((k) => k.id === e.assigned_to)?.username, e.lesson.subject, format(parseISO(e.scheduled_date), "EEE d MMM")].filter(Boolean).join(" · ")}
              </p>
              {e.completed_note && <p className="mt-1 text-sm text-[#4A3B2C]">&quot;{e.completed_note}&quot;</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => act(e, true)}
                disabled={busy === e.id}
                className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => act(e, false)}
                disabled={busy === e.id}
                className="rounded-xl border border-[#D9D1C4] bg-white px-4 py-2 text-sm font-bold text-[#A64F42] disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
