"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getStudySummary } from "@/lib/api";

type Summary = {
  week_minutes: number;
  week_sessions: number;
  last_30_days_minutes: number;
  by_subject: { subject: string; minutes: number }[];
  recent: { date: string; subject: string | null; label: string | null; minutes: number; completed: boolean }[];
};

export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Time studied with the study timer. Parents pass childId; children see their own. */
export default function StudySummaryCard({ childId, forChild }: { childId?: number; forChild?: boolean }) {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    setData(null);
    getStudySummary(childId)
      .then((res) => setData(res.data))
      .catch(() => {});
  }, [childId]);

  if (!data) return null;
  const top = data.by_subject[0]?.minutes || 1;

  return (
    <section className="brand-card p-5 sm:p-6">
      <h2 className="text-lg font-extrabold text-brand-charcoal">⏱ Time studied</h2>
      {data.last_30_days_minutes === 0 ? (
        <p className="mt-2 text-sm text-[#6E5A46]">
          {forChild ? "Use the study timer and your time will show up here." : "No study timer sessions in the last 30 days."}
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-brand-cream p-4">
              <p className="text-2xl font-black text-brand-sage">{formatMinutes(data.week_minutes)}</p>
              <p className="text-xs font-bold text-[#6E5A46]">This week · {data.week_sessions} session{data.week_sessions === 1 ? "" : "s"}</p>
            </div>
            <div className="rounded-2xl bg-brand-cream p-4">
              <p className="text-2xl font-black text-brand-sage">{formatMinutes(data.last_30_days_minutes)}</p>
              <p className="text-xs font-bold text-[#6E5A46]">Last 30 days</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {data.by_subject.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-xs font-bold text-[#6E5A46]">
                  <span>{s.subject}</span>
                  <span>{formatMinutes(s.minutes)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-brand-cream">
                  <div className="h-full rounded-full bg-brand-sage" style={{ width: `${(s.minutes / top) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {data.recent.length > 0 && (
            <div className="mt-4 divide-y divide-brand-line text-sm">
              {data.recent.slice(0, 5).map((r, i) => (
                <div key={i} className="flex justify-between gap-3 py-2">
                  <span className="min-w-0 truncate text-[#6E5A46]">
                    {format(parseISO(r.date), "d MMM")} · {r.subject || "Other"}
                    {r.label && r.label !== r.subject ? ` · ${r.label}` : ""}
                  </span>
                  <span className="shrink-0 font-bold text-brand-charcoal">{r.minutes} min</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
