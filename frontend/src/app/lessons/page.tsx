"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import PlanSheets from "@/components/worksheets/PlanSheets";
import { planSheets } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { COMING_UNITS, UNITS, lessonLink, plannerTitle, type LessonUnit } from "@/lib/lessons";
import { packBySlug, packCover } from "@/lib/topics";

/** Bright Roots' own lessons, in units. A grown-up puts a whole unit into the planner; a child does each lesson on screen. */
export default function LessonsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  const isChild = role === "child";
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <PageHero art="topics" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Written for Bright Roots</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Bright Roots Lessons</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {isChild
              ? "Lessons you do on screen, one step at a time: a warm-up quiz, picture cards to learn from, something to try, something to make, and a quiz at the end."
              : "Ready-made lessons your child does on screen, step by step, with notes for you on each one. Add a whole unit to your planner and the lessons go on the days that subject is on your timetable. The exit quiz is marked automatically, ticks the lesson off and goes to Test Results."}
          </p>
        </PageHero>

        <div className="space-y-6">
          {UNITS.map((unit) => (
            <UnitCard key={unit.slug} unit={unit} isChild={isChild} />
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-brand-charcoal">Coming soon</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COMING_UNITS.map((c) => (
              <div key={c.title} className="brand-card p-4 opacity-70" aria-disabled>
                <Emoji e={c.emoji} className="h-10 w-10 text-4xl" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-softsage">{c.subject}</p>
                <h3 className="mt-0.5 font-extrabold text-brand-charcoal">{c.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function UnitCard({ unit, isChild }: { unit: LessonUnit; isChild: boolean }) {
  const pack = unit.topicPack ? packBySlug(unit.topicPack) : undefined;
  const cover = pack ? packCover(pack) : null;
  const minutes = Math.round(unit.lessons.reduce((sum, l) => sum + l.minutes, 0) / unit.lessons.length);

  const plan = (day: string, childIds: number[], subject: string) =>
    planSheets(
      unit.lessons.map((l, i) => ({
        kind: "lesson" as const,
        slug: l.slug,
        title: plannerTitle(unit, i + 1),
        subject,
        intro: "",
        minutes: l.minutes,
      })),
      day,
      childIds
    );

  return (
    <section id={unit.slug} className="brand-card scroll-mt-20 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex shrink-0 items-center justify-center sm:w-56" style={{ background: `${unit.color}1A` }}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="aspect-[3/2] h-full w-full object-cover sm:aspect-square" />
          ) : (
            <Emoji e={unit.emoji} className="h-24 w-24 py-6 text-7xl" />
          )}
        </div>
        <div className="min-w-0 flex-1 p-5">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: unit.color }}>
            {unit.subject} · ages {unit.ages} · {unit.lessons.length} lessons, about {minutes} minutes each
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal">{unit.title}</h2>
          <p className="mt-1 text-sm text-brand-earth">{unit.summary}</p>

          <ol className="mt-4 space-y-1.5">
            {unit.lessons.map((l, i) => (
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

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!isChild && (
              <PlanSheets
                plan={plan}
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
