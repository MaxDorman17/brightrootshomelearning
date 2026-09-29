"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";

export type SpellingTest = {
  id: number;
  week_start: string;
  score: number;
  total: number;
  wrong_words: string[];
  is_practice_round: boolean;
  taken_at: string | null;
};

export type OakQuiz = {
  entry_id: number;
  subject: string;
  lesson_title: string;
  scheduled_date: string;
  starter_score: number | null;
  starter_total: number | null;
  exit_score: number | null;
  exit_total: number | null;
};

export type OwnTest = {
  id: number;
  child_id: number;
  subject: string;
  title: string;
  taken_on: string;
  score: number;
  total: number;
  notes: string | null;
};

export type ResultsOverview = {
  child: { id: number; username: string };
  spelling: SpellingTest[];
  oak: OakQuiz[];
  tests: OwnTest[];
};

type Props = {
  data: ResultsOverview;
  /** Parent view: show edit/delete on the family's own tests. */
  onEditTest?: (test: OwnTest) => void;
  onDeleteTest?: (test: OwnTest) => void;
  /** Child view uses friendlier wording. */
  forChild?: boolean;
};

function pct(score: number | null | undefined, total: number | null | undefined): number | null {
  if (score == null || !total) return null;
  return Math.round((score / total) * 100);
}

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function averagePct(items: { score: number | null; total: number | null }[]): number | null {
  const valid = items.filter((i) => i.score != null && i.total);
  if (valid.length === 0) return null;
  const score = valid.reduce((sum, i) => sum + (i.score as number), 0);
  const total = valid.reduce((sum, i) => sum + (i.total as number), 0);
  return Math.round((score / total) * 100);
}

function termStart(today: Date): Date {
  // UK school terms: Autumn from September, Spring from January, Summer from April.
  const y = today.getFullYear();
  const m = today.getMonth();
  if (m >= 8) return new Date(y, 8, 1);
  if (m >= 3) return new Date(y, 3, 1);
  return new Date(y, 0, 1);
}

function ScoreBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-xs text-[#8A7A69]">–</span>;
  const tone =
    value >= 80 ? "bg-green-100 text-green-800" : value >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-700";
  return <span className={"rounded-full px-2.5 py-1 text-xs font-extrabold " + tone}>{value}%</span>;
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="brand-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-brand-charcoal">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function ResultsView({ data, onEditTest, onDeleteTest, forChild }: Props) {
  const [showPractice, setShowPractice] = useState(false);
  const [showAllSpelling, setShowAllSpelling] = useState(false);
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());

  const realSpelling = data.spelling.filter((t) => !t.is_practice_round);
  const spellingRows = showPractice ? data.spelling : realSpelling;

  const oakExitAvg = averagePct(data.oak.map((q) => ({ score: q.exit_score, total: q.exit_total })));
  const spellingAvg = averagePct(realSpelling.map((t) => ({ score: t.score, total: t.total })));

  const since = termStart(new Date());
  const inTerm = (iso: string | null) => !!iso && parseISO(iso) >= since;
  const termCount =
    realSpelling.filter((t) => inTerm(t.taken_at)).length +
    data.oak.filter((q) => inTerm(q.scheduled_date)).length +
    data.tests.filter((t) => inTerm(t.taken_on)).length;

  const latest = useMemo(() => {
    const all = [
      ...realSpelling.map((t) => ({ when: t.taken_at || t.week_start, label: "Spelling test", value: pct(t.score, t.total) })),
      ...data.oak.map((q) => ({ when: q.scheduled_date, label: q.lesson_title, value: pct(q.exit_score, q.exit_total) })),
      ...data.tests.map((t) => ({ when: t.taken_on, label: t.title, value: pct(t.score, t.total) })),
    ].filter((r) => r.value != null);
    all.sort((a, b) => (a.when < b.when ? 1 : -1));
    return all[0] || null;
  }, [data, realSpelling]);

  const weakWords = useMemo(() => {
    const counts: Record<string, number> = {};
    realSpelling.slice(0, 12).forEach((t) =>
      t.wrong_words.forEach((w) => {
        const word = w.trim();
        if (word) counts[word] = (counts[word] || 0) + 1;
      })
    );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8);
  }, [realSpelling]);

  const oakBySubject = useMemo(() => {
    const groups: Record<string, OakQuiz[]> = {};
    data.oak.forEach((q) => {
      (groups[q.subject] = groups[q.subject] || []).push(q);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [data.oak]);

  const trend = realSpelling.slice(0, 8).reverse();
  const nothingYet = data.spelling.length === 0 && data.oak.length === 0 && data.tests.length === 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Spelling average", value: spellingAvg != null ? `${spellingAvg}%` : "–" },
          { label: "Oak exit quiz average", value: oakExitAvg != null ? `${oakExitAvg}%` : "–" },
          { label: "Tests this term", value: String(termCount) },
          { label: latest ? `Latest: ${latest.label}` : "Latest result", value: latest ? `${latest.value}%` : "–" },
        ].map((item) => (
          <div key={item.label} className="brand-card p-4">
            <p className="text-2xl font-black text-brand-sage">{item.value}</p>
            <p className="mt-1 truncate text-xs font-bold text-[#6E5A46]/80" title={item.label}>{item.label}</p>
          </div>
        ))}
      </div>

      {nothingYet && (
        <div className="brand-card p-6 text-center text-sm text-[#6E5A46]">
          {forChild
            ? "No test results yet. Your spelling tests and quiz scores will show up here."
            : "No results yet. Spelling tests and Oak quiz scores appear here automatically, and you can add any other test yourself."}
        </div>
      )}

      {oakBySubject.length > 0 && (
        <Card title="Oak lesson quizzes">
          <p className="-mt-2 mb-3 text-xs text-[#6E5A46]">Tap a subject to see every lesson.</p>
          <div className="divide-y divide-brand-line">
            {oakBySubject.map(([subject, quizzes]) => {
              const exitAvg = averagePct(quizzes.map((q) => ({ score: q.exit_score, total: q.exit_total })));
              const starterAvg = averagePct(quizzes.map((q) => ({ score: q.starter_score, total: q.starter_total })));
              const open = openSubjects.has(subject);
              return (
                <div key={subject} className="py-1">
                  <button
                    onClick={() =>
                      setOpenSubjects((prev) => {
                        const next = new Set(prev);
                        if (next.has(subject)) next.delete(subject);
                        else next.add(subject);
                        return next;
                      })
                    }
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-2 py-2.5 text-left hover:bg-brand-cream"
                    aria-expanded={open}
                  >
                    <span className="min-w-[8rem] flex-1 font-extrabold text-brand-charcoal">
                      <span className="mr-1.5 inline-block w-3 text-brand-sage">{open ? "▾" : "▸"}</span>
                      {subject}
                      <span className="ml-2 text-xs font-semibold text-[#8A7A69]">
                        {quizzes.length} lesson{quizzes.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-[#6E5A46]">Starter {starterAvg != null ? `${starterAvg}%` : "–"}</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#6E5A46]">
                      Exit <ScoreBadge value={exitAvg} />
                    </span>
                  </button>
                  {open && (
                    <div className="overflow-x-auto px-2 pb-2">
                      <table className="w-full min-w-[420px] text-sm">
                        <thead>
                          <tr className="text-left text-xs text-[#8A7A69]">
                            <th className="py-1.5 font-bold">Lesson</th>
                            <th className="py-1.5 font-bold">Date</th>
                            <th className="py-1.5 font-bold">Starter</th>
                            <th className="py-1.5 font-bold">Exit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-line">
                          {quizzes.map((q) => (
                            <tr key={q.entry_id}>
                              <td className="py-2 pr-3 font-semibold text-brand-charcoal">{q.lesson_title}</td>
                              <td className="py-2 pr-3 text-[#6E5A46]">{format(parseISO(q.scheduled_date), "d MMM")}</td>
                              <td className="py-2 pr-3">
                                {q.starter_total ? `${q.starter_score}/${q.starter_total}` : "–"}
                              </td>
                              <td className="py-2">
                                <ScoreBadge value={pct(q.exit_score, q.exit_total)} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
      {data.spelling.length > 0 && (
        <Card
          title="Spelling tests"
          action={
            data.spelling.some((t) => t.is_practice_round) ? (
              <label className="flex items-center gap-2 text-xs font-bold text-[#6E5A46]">
                <input
                  type="checkbox"
                  checked={showPractice}
                  onChange={(e) => setShowPractice(e.target.checked)}
                  className="accent-brand-sage"
                />
                Show practice rounds
              </label>
            ) : undefined
          }
        >
          {trend.length > 1 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-softsage">Recent weeks</p>
              <div className="flex h-24 items-end gap-2">
                {trend.map((t) => {
                  const value = pct(t.score, t.total) ?? 0;
                  return (
                    <div key={t.id} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-20 w-full items-end">
                        <div className="w-full rounded-t-md bg-brand-sage" style={{ height: `${Math.max(value, 4)}%` }} title={`${value}%`} />
                      </div>
                      <span className="text-[10px] text-[#8A7A69]">{format(parseISO(t.week_start), "d MMM")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="divide-y divide-brand-line">
            {(showAllSpelling ? spellingRows : spellingRows.slice(0, 5)).map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-extrabold text-brand-charcoal">
                    Week of {format(parseISO(t.week_start), "d MMM yyyy")}
                    {t.is_practice_round && <span className="ml-2 text-xs font-bold text-[#8A7A69]">Practice</span>}
                  </p>
                  {t.wrong_words.length > 0 && (
                    <p className="truncate text-xs text-[#6E5A46]">To practise: {t.wrong_words.join(", ")}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-charcoal">{t.score}/{t.total}</span>
                  <ScoreBadge value={pct(t.score, t.total)} />
                </div>
              </div>
            ))}
          </div>
          {spellingRows.length > 5 && (
            <button
              onClick={() => setShowAllSpelling((v) => !v)}
              className="mt-2 w-full rounded-xl border border-brand-line bg-brand-white px-4 py-2 text-sm font-bold text-brand-sage hover:border-brand-softsage"
            >
              {showAllSpelling ? "Show fewer" : `Show all ${spellingRows.length} spelling tests`}
            </button>
          )}

          {weakWords.length > 0 && (
            <div className="mt-4 rounded-2xl bg-brand-cream p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">
                {forChild ? "Words to keep practising" : "Words they keep getting wrong"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weakWords.map(([word, times]) => (
                  <span key={word} className="rounded-full border border-brand-line bg-white px-3 py-1 text-xs font-bold text-brand-charcoal">
                    {word}
                    {times > 1 && <span className="ml-1 text-[#8A7A69]">×{times}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {data.tests.length > 0 && (
        <Card title={forChild ? "Other tests" : "Your own tests"}>
          <div className="divide-y divide-brand-line">
            {data.tests.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-extrabold text-brand-charcoal">{t.title}</p>
                  <p className="text-xs text-[#6E5A46]">
                    {t.subject} · {format(parseISO(t.taken_on), "d MMM yyyy")}
                    {t.notes ? ` · ${t.notes}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-charcoal">
                    {formatScore(t.score)}/{formatScore(t.total)}
                  </span>
                  <ScoreBadge value={pct(t.score, t.total)} />
                  {onEditTest && (
                    <button onClick={() => onEditTest(t)} className="text-xs font-bold text-brand-sage hover:underline">
                      Edit
                    </button>
                  )}
                  {onDeleteTest && (
                    <button onClick={() => onDeleteTest(t)} className="text-xs font-bold text-[#A64F42] hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
