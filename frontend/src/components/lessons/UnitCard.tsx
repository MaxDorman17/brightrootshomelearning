"use client";

import Link from "next/link";
import Emoji from "@/components/Emoji";
import PlanSheets from "@/components/worksheets/PlanSheets";
import { lessonLink, planUnit, unitTerm, type LessonUnit } from "@/lib/lessons";
import { termBySlug } from "@/lib/terms";
import { packBySlug, packCover } from "@/lib/topics";

/**
 * One unit: its lessons, "Add unit to planner", and the topic pack if there is one.
 * `only` limits the list to those lessons (from a search), keeping their numbers.
 */
export default function UnitCard({ unit, isChild, only }: { unit: LessonUnit; isChild: boolean; only?: Set<string> }) {
  const pack = unit.topicPack ? packBySlug(unit.topicPack) : undefined;
  const cover = unit.cover ?? (pack ? packCover(pack) : null);
  const minutes = Math.round(unit.lessons.reduce((sum, l) => sum + l.minutes, 0) / unit.lessons.length);

  return (
    <section id={unit.slug} className="brand-card scroll-mt-20 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className={`flex shrink-0 justify-center sm:w-56 ${cover ? "items-start bg-brand-cream" : "items-center"}`} style={cover ? undefined : { background: `${unit.color}1A` }}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="aspect-[3/2] w-full object-cover sm:aspect-square" />
          ) : (
            <Emoji e={unit.emoji} className="h-24 w-24 py-6 text-7xl" />
          )}
        </div>
        <div className="min-w-0 flex-1 p-5">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: unit.color }}>
            {unit.subject} · ages {unit.ages} · {termBySlug(unitTerm(unit))?.name} · {unit.lessons.length} lessons, about {minutes} minutes each
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal">{unit.title}</h2>
          <p className="mt-1 text-sm text-brand-earth">{unit.summary}</p>

          <ol className="mt-4 space-y-1.5">
            {unit.lessons.map((l, i) => only && !only.has(l.slug) ? null : (
              <li key={l.slug}>
                <Link href={lessonLink(l.slug)} className="group flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-brand-cream">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: unit.color }}>
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 font-bold text-brand-charcoal group-hover:text-brand-sage">
                    <Emoji e={l.emoji} className="mr-1.5 inline h-4 w-4" />
                    {l.title}
                  </span>
                  <span className="text-xs font-bold text-brand-sage">{isChild ? "Start" : "Preview"} →</span>
                </Link>
              </li>
            ))}
          </ol>
          {only && (
            <p className="mt-2 px-2 text-xs font-bold text-brand-earth/70">
              Showing {only.size} of {unit.lessons.length} lessons that match your search
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!isChild && (
              <PlanSheets
                plan={planUnit(unit)}
                count={unit.lessons.length}
                subject={unit.subject}
                noun="lessons"
                what={`${unit.title}: ${unit.lessons.length} lessons`}
                label="Add unit to planner"
                className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-brand-sagedark"
              />
            )}
            {pack && (
              <Link href={`/make/topics/${pack.slug}`} className="text-sm font-bold text-brand-sage underline">
                {isChild ? "More about this topic" : "The topic pack, with background notes and books"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
