"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import LittleWeek from "@/components/make/LittleWeek";
import { LittleTopicActivities, PlanLittleTerm, useLittleItems } from "@/components/make/LittleTopic";
import { getRole, isAuthenticated } from "@/lib/auth";
import { LITTLE_AREA_PAGES, LITTLE_PLAN } from "@/lib/little-roots-plan";
import { TERMS, currentTerm, termBySlug } from "@/lib/terms";

export default function LittleTermPageWrapper() {
  return (
    <Suspense>
      <LittleTermPage />
    </Suspense>
  );
}

/** Little Roots "This term": the weekly set, then each area's topic for the term. `?term=winter` shows another term. */
function LittleTermPage() {
  const router = useRouter();
  const now = currentTerm();
  const term = termBySlug(useSearchParams().get("term")) ?? now;
  const isNow = term === now;
  const items = useLittleItems();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole() || "");
  }, [router]);

  const plan = LITTLE_PLAN[term.slug];
  const comingLabel = isNow ? "Still being written for this term" : `Coming in ${term.startMonth}`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/make/little-roots" className="mb-4 inline-block text-sm text-brand-earth hover:text-brand-sage">
          ← All Little Roots activities
        </Link>

        <header className="brand-card mb-6 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sage">Little Roots · ages 3 to 4 · with a grown-up</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
            <Emoji e={term.emoji} className="h-12 w-12 text-4xl" />
            {term.name}
          </h1>
          <p className="mt-1 text-brand-earth">
            {term.months}
            {isNow ? ", this term." : "."} One topic for each area of learning, six short activities each.
          </p>
          {role === "parent" && items && (
            <div className="mt-4">
              <PlanLittleTerm topics={plan.topics} items={items} term={term} isNow={isNow} />
            </div>
          )}
        </header>

        <nav aria-label="Terms" className="mb-6 flex flex-wrap gap-2">
          {TERMS.map((t) => (
            <Link
              key={t.slug}
              href={t === now ? "/make/little-roots/term" : `/make/little-roots/term?term=${t.slug}`}
              aria-current={t === term ? "page" : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                t === term ? "bg-brand-sage text-white" : "border-2 border-brand-line bg-white text-brand-earth hover:border-brand-softsage"
              }`}
            >
              <Emoji e={t.emoji} className="h-6 w-6 text-lg" />
              {t.name}
              {t === now && t !== term && " (now)"}
            </Link>
          ))}
        </nav>

        {isNow && role === "parent" && <LittleWeek />}

        {items === null ? (
          <p className="mt-8 text-sm text-brand-earth/70">Loading...</p>
        ) : (
          <div className="mt-8 space-y-8">
            {plan.topics.map((topic) => {
              const area = LITTLE_AREA_PAGES.find((a) => a.name === topic.area);
              return (
                <section key={topic.title}>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">
                    {area ? (
                      <Link href={`/make/little-roots/area/${area.slug}`} className="hover:text-brand-sage">
                        {topic.area}
                      </Link>
                    ) : (
                      topic.area
                    )}
                  </p>
                  <h2 className="text-xl font-extrabold text-brand-charcoal">{topic.title}</h2>
                  <p className="mb-3 text-sm text-brand-earth">{topic.summary}</p>
                  <LittleTopicActivities activities={topic.activities} items={items} comingLabel={comingLabel} />
                </section>
              );
            })}
            {plan.rhymes.length > 0 && (
              <section>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">Rhymes and songs</p>
                <h2 className="mb-3 text-xl font-extrabold text-brand-charcoal">This term&apos;s rhymes</h2>
                <LittleTopicActivities activities={plan.rhymes} items={items} comingLabel={comingLabel} />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
