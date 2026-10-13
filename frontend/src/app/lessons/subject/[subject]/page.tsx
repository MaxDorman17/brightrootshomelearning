"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import UnitCard from "@/components/lessons/UnitCard";
import ResourceLibrary from "@/components/ResourceLibrary";
import { getRole, isAuthenticated } from "@/lib/auth";
import { comingIn, pageSubject, searchUnits, unitsIn, yearsFor, type LessonUnit } from "@/lib/lessons";

/** Other names families give these subjects, so the right Resources folder shows. */
const FOLDER_ALIASES: Record<string, string[]> = {
  maths: ["Math", "Mathematics", "Numeracy"],
  english: ["Literacy", "English Language"],
  re: ["RE", "R.E.", "RME", "Religious Studies"],
  rshe: ["RSHE", "PSHE", "Wellbeing", "Health and Wellbeing"],
  art: ["Art", "Art and Design"],
  computing: ["ICT", "Computer Science"],
};

export default function LessonSubjectPageWrapper() {
  return (
    <Suspense>
      <LessonSubjectPage />
    </Suspense>
  );
}

/**
 * One subject's Bright Roots lessons, grouped by age range. `?ages=7-9` (from the Seedlings,
 * Saplings and Teens menus) shows just that age range.
 */
function LessonSubjectPage() {
  const router = useRouter();
  const params = useParams<{ subject: string }>();
  const subject = pageSubject(params.subject);
  const agesParam = useSearchParams().get("ages");
  // "7-9" in the address, "7 to 9" in the units.
  const onlyAges = agesParam ? agesParam.replace("-", " to ") : null;
  const [role, setRole] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  if (!subject) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-brand-earth">We couldn&apos;t find that subject.</p>
          <Link href="/lessons" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to Bright Roots Lessons
          </Link>
        </main>
      </div>
    );
  }

  const isChild = role === "child";
  const units = unitsIn(subject);
  const shown = onlyAges ? units.filter((u) => u.ages === onlyAges) : units;
  const found = searchUnits(shown, query);
  const byAge = new Map<string, { unit: LessonUnit; lessons?: Set<string> }[]>();
  for (const f of found) byAge.set(f.unit.ages, [...(byAge.get(f.unit.ages) ?? []), f]);
  const searching = query.trim().length > 0;
  const coming = comingIn(subject);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href="/lessons" className="mb-4 inline-block text-sm text-brand-earth hover:text-brand-sage">
          ← All subjects
        </Link>

        <header className="brand-card mb-8 flex flex-col overflow-hidden sm:flex-row">
          <div className="shrink-0 sm:w-64" style={{ background: `${subject.color}1A` }}>
            {subject.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={subject.cover} alt="" className="aspect-[3/2] h-full w-full object-cover sm:aspect-square" />
            ) : (
              <div className="flex aspect-[3/2] h-full items-center justify-center sm:aspect-square">
                <Emoji e={subject.emoji} className="h-24 w-24 text-7xl" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: subject.color }}>
              Bright Roots Lessons
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{subject.name}</h1>
            <p className="mt-2 text-brand-earth">{subject.blurb}</p>
            {onlyAges && <p className="mt-3 text-sm font-bold text-brand-earth/80">Ages {onlyAges}</p>}
          </div>
        </header>

        {/* The family's own links and files for this subject, from their Resources folders. */}
        {role && (
          <section className="mb-8" aria-label={`${subject.name} resources`}>
            <ResourceLibrary isParent={!isChild} folder={subject.name} aliases={FOLDER_ALIASES[subject.slug]} />
            {!isChild && (
              <Link href="/parent/resources" className="mt-2 inline-block text-sm font-bold text-brand-sage hover:underline">
                All your resources →
              </Link>
            )}
          </section>
        )}

        {onlyAges && shown.length === 0 && (
          <div className="brand-card mb-8 p-6">
            <p className="text-lg font-extrabold text-brand-charcoal">
              {subject.name} lessons for ages {onlyAges} are on their way.
            </p>
            <p className="mt-1 text-brand-earth">
              {units.length > 0 ? (
                <Link href={`/lessons/subject/${subject.slug}`} className="font-bold text-brand-sage underline">
                  See the {subject.name} lessons for other ages
                </Link>
              ) : (
                <Link href="/lessons" className="font-bold text-brand-sage underline">
                  See all Bright Roots Lessons
                </Link>
              )}
              {subject.slug === "maths" && (
                <>
                  {" or "}
                  <Link href={`/worksheets?subject=Maths&ages=${agesParam}`} className="font-bold text-brand-sage underline">
                    try the Maths worksheets
                  </Link>
                </>
              )}
              .
            </p>
          </div>
        )}

        {shown.length > 0 && (
          <div className="mb-8">
            <label htmlFor="lesson-search" className="sr-only">
              Search {subject.name} lessons
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-earth/60" aria-hidden>
                🔍
              </span>
              <input
                id="lesson-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${subject.name} lessons, e.g. "${shown[0].short.toLowerCase()}"`}
                className="w-full rounded-2xl border-2 border-brand-cream bg-white py-3 pl-11 pr-4 text-brand-charcoal shadow-sm outline-none focus:border-brand-sage"
              />
            </div>
            {searching && (
              <p className="mt-2 text-sm text-brand-earth" aria-live="polite">
                {found.length === 0
                  ? `No ${subject.name} lessons match "${query.trim()}". Try another word.`
                  : `${found.length} ${found.length === 1 ? "unit matches" : "units match"} "${query.trim()}".`}{" "}
                <button type="button" onClick={() => setQuery("")} className="font-bold text-brand-sage underline">
                  Clear search
                </button>
              </p>
            )}
          </div>
        )}

        {Array.from(byAge.entries()).map(([ages, list]) => (
          <section key={ages} id={`ages-${ages.replace(/\s+/g, "-")}`} className="mb-10 scroll-mt-20">
            <h2 className="mb-4 text-2xl font-extrabold text-brand-charcoal">
              Ages {ages}
              {yearsFor(ages) && <span className="ml-2 text-base font-bold text-brand-earth/70">{yearsFor(ages)}</span>}
            </h2>
            <div className="space-y-6">
              {list.map(({ unit, lessons }) => (
                <UnitCard key={unit.slug} unit={unit} isChild={isChild} only={lessons} />
              ))}
            </div>
          </section>
        ))}

        {units.length === 0 && !onlyAges && <p className="mb-10 text-brand-earth">The first {subject.name} lessons are on their way.</p>}

        {coming.length > 0 && !searching && (
          <section>
            <h2 className="text-2xl font-extrabold text-brand-charcoal">Coming soon</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {coming.map((c) => (
                <div key={c.title} className="brand-card p-4 opacity-70" aria-disabled>
                  <Emoji e={c.emoji} className="h-10 w-10 text-4xl" />
                  <h3 className="mt-2 font-extrabold text-brand-charcoal">{c.title}</h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
