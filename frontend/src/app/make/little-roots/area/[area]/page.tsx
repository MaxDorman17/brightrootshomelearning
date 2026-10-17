"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import { LittleCard, LittleTopicActivities, useLittleItems } from "@/components/make/LittleTopic";
import { isAuthenticated } from "@/lib/auth";
import { LITTLE_AREA_PAGES, LITTLE_EXTRA_PAGES, LITTLE_PLAN, LITTLE_PLAN_B, LITTLE_YEARS, RHYMES, littleTermSection, littleYear } from "@/lib/little-roots-plan";
import { currentTerm, termsFrom } from "@/lib/terms";

/**
 * One Little Roots area of learning (Talk, Early maths...): its topic for each term, this term first, then the family's own.
 * Rhymes and songs and Outdoors use the same page, with each term's rhymes or outdoor activities. `?year=b` shows Year B.
 */
export default function LittleAreaPageWrapper() {
  return (
    <Suspense>
      <LittleAreaPage />
    </Suspense>
  );
}

function LittleAreaPage() {
  const router = useRouter();
  const slug = useParams<{ area: string }>().area;
  const area = [...LITTLE_AREA_PAGES, ...LITTLE_EXTRA_PAGES].find((a) => a.slug === slug);
  const year = littleYear(useSearchParams().get("year"));
  const items = useLittleItems();
  const now = currentTerm();

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  if (!area) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-brand-earth">We couldn&apos;t find that area.</p>
          <Link href="/make/little-roots" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to Little Roots
          </Link>
        </main>
      </div>
    );
  }

  const planned = new Set([...Object.values(LITTLE_PLAN), ...Object.values(LITTLE_PLAN_B)].flatMap((p) => [...p.topics.flatMap((t) => t.activities), ...p.rhymes].map((a) => a.slug)));
  // Activities in this area that aren't in the plan: the family's own, and any extras.
  const others = Object.values(items ?? {}).filter((i) => i.category === area.name && !planned.has(i.slug ?? ""));
  const intro =
    area.name === RHYMES
      ? "Four rhymes and songs each term, to say, sing and act out together."
      : slug === "outdoors"
        ? "The activities from every area that are best done outside, term by term."
        : "";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/make/little-roots" className="mb-4 inline-block text-sm text-brand-earth hover:text-brand-sage">
          ← All Little Roots activities
        </Link>

        <header className="brand-card mb-6 flex items-center gap-4 p-6">
          <Emoji e={area.emoji} className="h-16 w-16 text-5xl" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sage">Little Roots · ages 3 to 4</p>
            <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{area.name}</h1>
            {intro && <p className="mt-1 text-brand-earth">{intro}</p>}
          </div>
        </header>

        <nav aria-label="Years" className="mb-4 flex flex-wrap gap-2">
          {LITTLE_YEARS.map((y) => (
            <Link
              key={y.slug}
              href={`/make/little-roots/area/${slug}${y.slug === "b" ? "?year=b" : ""}`}
              aria-current={y.slug === year ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
                y.slug === year ? "bg-brand-charcoal text-white" : "border-2 border-brand-line bg-white text-brand-earth hover:border-brand-softsage"
              }`}
            >
              {y.name}
            </Link>
          ))}
        </nav>

        <Link
          href={`/make/little-roots/term${year === "b" ? "?year=b" : ""}`}
          className="mb-8 flex items-center gap-3 rounded-2xl bg-brand-cream px-4 py-3 font-bold text-brand-charcoal hover:bg-brand-softsage/30"
        >
          <Emoji e={now.emoji} className="h-8 w-8 text-2xl" />
          <span className="flex-1">It&apos;s {now.name}. See this term&apos;s activities in every area</span>
          <span className="text-brand-sage">→</span>
        </Link>

        {items === null ? (
          <p className="text-sm text-brand-earth/70">Loading...</p>
        ) : (
          <div className="space-y-10">
            {termsFrom(now).map((term) => {
              const topic = littleTermSection(slug, term.slug, year);
              if (!topic || topic.activities.length === 0) return null;
              return (
                <section key={term.slug} id={term.slug} className="scroll-mt-20">
                  <h2 className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-extrabold text-brand-charcoal">
                    <span className="flex items-center gap-2">
                      <Emoji e={term.emoji} className="h-9 w-9 text-3xl" />
                      {term.name}
                    </span>
                    <span className="text-base font-bold text-brand-earth/70">{term.months}</span>
                    {term === now && <span className="rounded-full bg-brand-sage px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-white">This term</span>}
                  </h2>
                  <p className="font-extrabold text-brand-charcoal">{topic.title}</p>
                  <p className="mb-3 text-sm text-brand-earth">{topic.summary}</p>
                  <LittleTopicActivities
                    activities={topic.activities}
                    items={items}
                    comingLabel={term === now ? "Still being written for this term" : `Coming in ${term.startMonth}`}
                  />
                </section>
              );
            })}
            {others.length > 0 && (
              <section>
                <h2 className="mb-3 text-2xl font-extrabold text-brand-charcoal">More {area.name.toLowerCase()} activities</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {others.map((i) => (
                    <LittleCard key={i.id} item={i} />
                  ))}
                </div>
              </section>
            )}
            {slug === "outdoors" && (
              <Link href="/make/outdoors?age=little" className="flex items-center gap-3 rounded-2xl border-2 border-brand-line bg-white px-4 py-3 font-bold text-brand-charcoal hover:border-brand-softsage">
                <span className="flex-1">Ready for more? Bug trails, dens and nature walks for ages 5 and up are in Seedlings Outdoors</span>
                <span className="text-brand-sage">→</span>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
