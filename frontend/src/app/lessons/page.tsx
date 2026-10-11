"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { getRole, isAuthenticated } from "@/lib/auth";
import { LESSON_SUBJECTS, comingIn, unitsIn, yearsFor, type LessonSubject } from "@/lib/lessons";

/** Bright Roots' own lessons: a tile for each subject, which opens that subject's units by age. */
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
              ? "Lessons you do on screen, one step at a time. Pick a subject to see its lessons."
              : "Ready-made lessons your child does on screen, step by step, with notes for you on each one. Pick a subject, then add a whole unit to your planner and the lessons go on the days that subject is on your timetable."}
          </p>
        </PageHero>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LESSON_SUBJECTS.map((s) => (
            <SubjectTile key={s.slug} subject={s} />
          ))}
        </div>
      </main>
    </div>
  );
}

function SubjectTile({ subject }: { subject: LessonSubject }) {
  const units = unitsIn(subject);
  const lessons = units.reduce((n, u) => n + u.lessons.length, 0);
  const ages = Array.from(new Set(units.map((u) => u.ages)));
  const next = comingIn(subject)[0];

  return (
    <Link
      href={`/lessons/subject/${subject.slug}`}
      className="brand-card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-sage"
    >
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: `${subject.color}1A` }}>
        {subject.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={subject.cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Emoji e={subject.emoji} className="h-28 w-28 text-8xl" />
          </div>
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold text-white shadow"
          style={{ background: subject.color }}
        >
          {units.length} {units.length === 1 ? "unit" : "units"} · {lessons} lessons
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-2xl font-extrabold text-brand-charcoal group-hover:text-brand-sage">{subject.name}</h2>
        <p className="mt-1 text-sm text-brand-earth">{subject.blurb}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ages.map((a) => (
            <span key={a} className="rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-bold text-brand-earth">
              Ages {a}
              {yearsFor(a) && <span className="font-normal text-brand-earth/70"> · {yearsFor(a)}</span>}
            </span>
          ))}
        </div>
        <p className="mt-auto pt-4 text-xs text-brand-earth/70">
          {next ? <>Coming next: {next.title}</> : <>&nbsp;</>}
        </p>
      </div>
    </Link>
  );
}
