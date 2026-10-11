"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import UnitCard from "@/components/lessons/UnitCard";
import { getRole, isAuthenticated } from "@/lib/auth";
import { comingIn, subjectBySlug, unitsIn, yearsFor, type LessonUnit } from "@/lib/lessons";

/** One subject's Bright Roots lessons, grouped by age range. */
export default function LessonSubjectPage() {
  const router = useRouter();
  const params = useParams<{ subject: string }>();
  const subject = subjectBySlug(params.subject);
  const [role, setRole] = useState<string | null>(null);

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
  const byAge = new Map<string, LessonUnit[]>();
  for (const u of units) byAge.set(u.ages, [...(byAge.get(u.ages) ?? []), u]);
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
            {byAge.size > 1 && (
              <nav className="mt-4 flex flex-wrap gap-2" aria-label="Age ranges">
                {Array.from(byAge.keys()).map((a) => (
                  <a key={a} href={`#ages-${a.replace(/\s+/g, "-")}`} className="rounded-full bg-brand-cream px-3 py-1 text-sm font-bold text-brand-earth hover:text-brand-sage">
                    Ages {a}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </header>

        {Array.from(byAge.entries()).map(([ages, list]) => (
          <section key={ages} id={`ages-${ages.replace(/\s+/g, "-")}`} className="mb-10 scroll-mt-20">
            <h2 className="mb-4 text-2xl font-extrabold text-brand-charcoal">
              Ages {ages}
              {yearsFor(ages) && <span className="ml-2 text-base font-bold text-brand-earth/70">{yearsFor(ages)}</span>}
            </h2>
            <div className="space-y-6">
              {list.map((unit) => (
                <UnitCard key={unit.slug} unit={unit} isChild={isChild} />
              ))}
            </div>
          </section>
        ))}

        {units.length === 0 && <p className="mb-10 text-brand-earth">The first {subject.name} lessons are on their way.</p>}

        {coming.length > 0 && (
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
