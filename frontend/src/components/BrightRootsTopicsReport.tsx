"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getResultsOverview } from "@/lib/api";
import type { SheetResult } from "@/components/ResultsView";
import { SUBJECT_ORDER, lessonForLink, unitLink, unitTerm, type LessonUnit } from "@/lib/lessons";
import { termBySlug } from "@/lib/terms";
import type { PlannerEntry } from "@/types";

type TopicRow = { unit: LessonUnit; done: number; total: number; quiz: number | null };

/**
 * The Bright Roots topics in the report's period: how many of each topic's planned lessons are done,
 * the term it belongs to, and the average end-of-lesson quiz score. Built from the planner entries the
 * report already has, plus each child's finished lesson quizzes.
 */
export function useBrightRootsTopics(entries: PlannerEntry[], childIds: number[], inPeriod: (iso: string) => boolean): TopicRow[] {
  const [quizzes, setQuizzes] = useState<SheetResult[]>([]);
  const key = childIds.join(",");

  useEffect(() => {
    if (!key) return;
    Promise.all(key.split(",").map((id) => getResultsOverview(Number(id)).then((res) => (res.data.sheets ?? []) as SheetResult[]).catch(() => [])))
      .then((all) => setQuizzes(all.flat().filter((s) => s.kind === "lesson")))
      .catch(() => setQuizzes([]));
  }, [key]);

  const byUnit = new Map<string, TopicRow>();
  for (const e of entries) {
    const found = lessonForLink(e.lesson.lesson_url);
    if (!found) continue;
    const row = byUnit.get(found.unit.slug) ?? { unit: found.unit, done: 0, total: 0, quiz: null };
    row.total += 1;
    if (e.is_complete) row.done += 1;
    byUnit.set(found.unit.slug, row);
  }
  for (const row of byUnit.values()) {
    const slugs = new Set(row.unit.lessons.map((l) => l.slug));
    const scores = quizzes.filter((q) => slugs.has(q.slug) && q.total > 0 && inPeriod(q.finished_at.slice(0, 10)));
    row.quiz = scores.length ? Math.round((scores.reduce((n, q) => n + q.score / q.total, 0) / scores.length) * 100) : null;
  }
  return [...byUnit.values()].sort(
    (a, b) => SUBJECT_ORDER.indexOf(a.unit.subject) - SUBJECT_ORDER.indexOf(b.unit.subject) || a.unit.title.localeCompare(b.unit.title)
  );
}

const termName = (unit: LessonUnit) => termBySlug(unitTerm(unit))?.name ?? "";

/** On screen: one row per topic with a progress bar. */
export default function BrightRootsTopicsCard({ topics, className = "mb-6" }: { topics: TopicRow[]; className?: string }) {
  if (topics.length === 0) return null;
  return (
    <div className={`brand-card p-6 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Bright Roots Lessons</p>
      <h2 className="text-lg font-bold text-[#2E342F] mt-1">Topics</h2>
      <p className="text-sm text-[#6E5A46] mt-1">Each topic in the planner for this period, with its term and quiz average.</p>
      <div className="grid gap-3 mt-5">
        {topics.map(({ unit, done, total, quiz }) => {
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <div key={unit.slug} className="rounded-xl border border-brand-line p-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <Link href={unitLink(unit)} className="text-sm font-bold text-[#2E342F] hover:text-brand-sage">
                    {unit.title}
                  </Link>
                  <p className="text-xs text-[#6E5A46] mt-0.5">
                    {unit.subject} · ages {unit.ages} · {termName(unit)} · {done} of {total} lessons done
                  </p>
                </div>
                {quiz !== null && (
                  <span className="shrink-0 rounded-full bg-brand-cream px-2.5 py-1 text-xs font-bold text-[#2E342F]">Quizzes {quiz}%</span>
                )}
              </div>
              <div className="h-2.5 rounded-full bg-[#EDE6DA] overflow-hidden">
                <div className="h-full rounded-full bg-brand-softsage" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** In the printed report: the same topics as a table. */
export function BrightRootsTopicsPrint({ topics }: { topics: TopicRow[] }) {
  if (topics.length === 0) return null;
  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-400 pb-1 mb-3">Bright Roots Topics</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-400 px-2 py-1 text-left">Topic</th>
            <th className="border border-gray-400 px-2 py-1 text-left">Subject</th>
            <th className="border border-gray-400 px-2 py-1 text-left">Term</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Lessons done</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Quiz average</th>
          </tr>
        </thead>
        <tbody>
          {topics.map(({ unit, done, total, quiz }) => (
            <tr key={unit.slug}>
              <td className="border border-gray-400 px-2 py-1">{unit.title}</td>
              <td className="border border-gray-400 px-2 py-1">{unit.subject}</td>
              <td className="border border-gray-400 px-2 py-1">{termName(unit)}</td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                {done} of {total}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">{quiz === null ? "" : `${quiz}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
