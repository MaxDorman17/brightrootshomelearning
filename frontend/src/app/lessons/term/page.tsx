"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import ComingTopics from "@/components/lessons/ComingTopics";
import PlanSheets, { ownNameFor } from "@/components/worksheets/PlanSheets";
import { getRole, isAuthenticated } from "@/lib/auth";
import {
  SUBJECT_ORDER,
  STAGE_AGES,
  agesFromParam,
  agesParam,
  planTerm,
  plannedFor,
  subjectSlugFor,
  unitLink,
  unitsForTerm,
  yearsFor,
} from "@/lib/lessons";
import { TERMS, currentTerm, termBySlug } from "@/lib/terms";

export default function TermPageWrapper() {
  return (
    <Suspense>
      <TermPage />
    </Suspense>
  );
}

/**
 * "This term" for one age range (`?ages=5-7`, from the Seedlings, Saplings and Teens menus): every subject's
 * topics for the term, what is still to come, and "Plan this term". `?term=winter` shows another term.
 */
function TermPage() {
  const router = useRouter();
  const params = useSearchParams();
  const ages = agesFromParam(params.get("ages"));
  const stage = STAGE_AGES.find((s) => s.ages === ages);
  const now = currentTerm();
  const term = termBySlug(params.get("term")) ?? now;
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  if (!ages || !stage) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-brand-earth">Choose an age group from the Seedlings, Saplings or Teens menu.</p>
          <Link href="/lessons" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to Bright Roots Lessons
          </Link>
        </main>
      </div>
    );
  }

  const isChild = role === "child";
  const isNow = term === now;
  const units = unitsForTerm(ages, term);
  const planned = plannedFor(ages, term);
  const lessonCount = units.reduce((n, u) => n + u.lessons.length, 0);
  const subjects = SUBJECT_ORDER.filter((s) => units.some((u) => u.subject === s) || planned.some((p) => p.subject === s));
  const termLink = (slug: string) => `/lessons/term?ages=${agesParam(ages)}${slug === now.slug ? "" : `&term=${slug}`}`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href="/lessons" className="mb-4 inline-block text-sm text-brand-earth hover:text-brand-sage">
          ← All subjects
        </Link>

        <header className="brand-card mb-6 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sage">
            {stage.stage} · ages {ages}
            {yearsFor(ages) && ` · ${yearsFor(ages)}`}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
            <span aria-hidden>{term.emoji} </span>
            {term.name}
          </h1>
          <p className="mt-1 text-brand-earth">
            {term.months}
            {isNow ? ", this term." : "."}{" "}
            {units.length > 0
              ? `${units.length} ${units.length === 1 ? "topic" : "topics"} ready, ${lessonCount} lessons.`
              : "The lessons for this term are still being written."}
          </p>
          {!isChild && units.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PlanSheets
                plan={planTerm(units, ownNameFor)}
                count={lessonCount}
                noun="lessons"
                what={`${term.name}, ages ${ages}: ${units.length} topics, ${lessonCount} lessons`}
                spread="each subject on the days it is on your timetable, or every weekday if it isn't, one topic after another. Days off are skipped."
                label="Plan this term"
                className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-brand-sagedark"
              />
            </div>
          )}
        </header>

        <nav aria-label="Terms" className="mb-8 flex flex-wrap gap-2">
          {TERMS.map((t) => (
            <Link
              key={t.slug}
              href={termLink(t.slug)}
              aria-current={t === term ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                t === term ? "bg-brand-sage text-white" : "border-2 border-brand-line bg-white text-brand-earth hover:border-brand-softsage"
              }`}
            >
              {t.name}
              {t === now && t !== term && " (now)"}
            </Link>
          ))}
        </nav>

        {subjects.map((name) => {
          const subjectUnits = units.filter((u) => u.subject === name);
          const coming = planned.filter((p) => p.subject === name);
          const slug = subjectSlugFor(name);
          return (
            <section key={name} className="mb-8">
              <h2 className="mb-3 text-xl font-extrabold text-brand-charcoal">
                {slug ? (
                  <Link href={`/lessons/subject/${slug}?ages=${agesParam(ages)}`} className="hover:text-brand-sage">
                    {name}
                  </Link>
                ) : (
                  name
                )}
              </h2>
              <div className="space-y-3">
                {subjectUnits.map((u) => (
                  <Link key={u.slug} href={unitLink(u)} className="brand-card flex items-center gap-4 p-3 hover:border-brand-softsage">
                    {u.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.cover} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl" style={{ background: `${u.color}1A` }}>
                        <Emoji e={u.emoji} className="h-9 w-9 text-4xl" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold text-brand-charcoal">{u.title}</span>
                      <span className="block text-sm text-brand-earth">{u.summary}</span>
                    </span>
                    <span className="hidden text-sm font-bold text-brand-sage sm:block">{u.lessons.length} lessons →</span>
                  </Link>
                ))}
                {(name === "Maths" || name === "English") && subjectUnits.length === 0 && !isChild && (
                  <p className="text-sm text-brand-earth">
                    Bright Roots {name} lessons are on their way. Until then,{" "}
                    <Link href="/parent/oak" className="font-bold text-brand-sage underline">
                      find {name} lessons from Oak
                    </Link>
                    {name === "Maths" && (
                      <>
                        {" or "}
                        <Link href={`/worksheets?subject=Maths&ages=${agesParam(ages)}`} className="font-bold text-brand-sage underline">
                          try the Maths worksheets
                        </Link>
                      </>
                    )}
                    .
                  </p>
                )}
                <ComingTopics topics={coming} term={term} isNow={isNow} />
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
