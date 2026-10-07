"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import PlanSheets from "@/components/worksheets/PlanSheets";
import { getOakSubjects, getOakUnit, getOakUnits, planOakLessons, type OakSubject, type OakUnit, type OakUnitGroup } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";

const REMEMBER = "oak_finder_choice";
const pill = (on: boolean) =>
  `rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
    on ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-brand-earth hover:border-brand-softsage"
  }`;
const label = "mb-2 text-xs font-extrabold uppercase tracking-widest text-brand-softsage";

/** Children in Year 1 are 5 or 6, and so on up. Shown beside the year so it reads the same in Scotland and England. */
const ages = (year: number) => `ages ${year + 4} to ${year + 5}`;

/**
 * The Oak lesson finder: choose a subject and a school year, open a unit, and add a lesson or the
 * whole unit to the planner. Nothing to copy from Oak's website.
 */
export default function OakFinderPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<OakSubject[] | null>(null);
  const [problem, setProblem] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [courseSlug, setCourseSlug] = useState("");
  const [groups, setGroups] = useState<OakUnitGroup[] | null>(null);
  // Older years split into several courses (Biology · Higher...). One is shown at a time.
  const [groupLabel, setGroupLabel] = useState("");
  const [openUnit, setOpenUnit] = useState("");
  const [units, setUnits] = useState<Record<string, OakUnit | "loading" | "failed">>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    if (getRole() === "child") {
      router.replace("/child");
      return;
    }
    getOakSubjects()
      .then((res) => {
        setSubjects(res.data);
        // Pick up where they left off last time.
        try {
          const last = JSON.parse(localStorage.getItem(REMEMBER) || "null");
          const subject = res.data.find((s) => s.slug === last?.subject);
          if (subject) {
            setSubjectSlug(subject.slug);
            if (subject.years.includes(last.year)) setYear(last.year);
          }
        } catch {
          // Nothing remembered: start from the top.
        }
      })
      .catch((err) => setProblem(err?.response?.data?.detail || "We couldn't load Oak's subjects just now. Please try again in a moment."));
  }, [router]);

  const subject = subjects?.find((s) => s.slug === subjectSlug);
  // The courses on offer for this year: one for most years, a choice of exam boards for some older ones.
  const courses = useMemo(() => (subject && year ? subject.courses.filter((c) => c.years.includes(year)) : []), [subject, year]);
  const course = courses.find((c) => c.slug === courseSlug) ?? (courses.length === 1 || (year ?? 0) < 10 ? courses[0] : undefined);

  useEffect(() => {
    setGroups(null);
    setGroupLabel("");
    setOpenUnit("");
    if (!course || !year) return;
    let current = true;
    setProblem("");
    getOakUnits(course.slug, year)
      .then((res) => current && setGroups(res.data.groups))
      .catch((err) => current && setProblem(err?.response?.data?.detail || "We couldn't load the units just now. Please try again in a moment."));
    try {
      localStorage.setItem(REMEMBER, JSON.stringify({ subject: subjectSlug, year }));
    } catch {
      // Remembering the choice is only a convenience.
    }
    return () => {
      current = false;
    };
  }, [course, year, subjectSlug]);

  const toggleUnit = (slug: string) => {
    if (openUnit === slug) {
      setOpenUnit("");
      return;
    }
    setOpenUnit(slug);
    if (units[slug] && units[slug] !== "failed") return;
    setUnits((prev) => ({ ...prev, [slug]: "loading" }));
    getOakUnit(slug)
      .then((res) => setUnits((prev) => ({ ...prev, [slug]: res.data })))
      .catch(() => setUnits((prev) => ({ ...prev, [slug]: "failed" })));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="oak" tint={0}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Plan</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Oak Lessons</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/80">
            Find Oak National Academy lessons by subject and school year, and add them to your planner. Your child does the
            quizzes and watches the video here in Bright Roots.
          </p>
        </PageHero>

        {problem && (
          <p role="alert" className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            {problem}
          </p>
        )}
        {!subjects && !problem && <p className="text-sm text-brand-earth/70">Loading Oak&apos;s subjects…</p>}

        {subjects && (
          <section aria-labelledby="pick-subject">
            <h2 id="pick-subject" className={label}>
              1. Subject
            </h2>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  aria-pressed={s.slug === subjectSlug}
                  onClick={() => {
                    setSubjectSlug(s.slug);
                    setCourseSlug("");
                    if (year && !s.years.includes(year)) setYear(null);
                  }}
                  className={pill(s.slug === subjectSlug)}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </section>
        )}

        {subject && (
          <section aria-labelledby="pick-year" className="mt-6">
            <h2 id="pick-year" className={label}>
              2. School year
            </h2>
            <div className="flex flex-wrap gap-2">
              {subject.years.map((y) => (
                <button
                  key={y}
                  type="button"
                  aria-pressed={y === year}
                  onClick={() => {
                    setYear(y);
                    setCourseSlug("");
                  }}
                  className={pill(y === year)}
                >
                  Year {y} <span className={`font-semibold ${y === year ? "text-white/80" : "text-brand-earth/60"}`}>· {ages(y)}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-brand-earth/70">These are England&apos;s school years. Go by your child&apos;s age, or by what they&apos;re ready for.</p>
          </section>
        )}

        {subject && year && courses.length > 1 && year >= 10 && (
          <section aria-labelledby="pick-course" className="mt-6">
            <h2 id="pick-course" className={label}>
              3. Exam board
            </h2>
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <button key={c.slug} type="button" aria-pressed={c.slug === course?.slug} onClick={() => setCourseSlug(c.slug)} className={pill(c.slug === course?.slug)}>
                  {c.label || "Standard"}
                </button>
              ))}
            </div>
          </section>
        )}

        {course && year && !groups && !problem && <p className="mt-6 text-sm text-brand-earth/70">Loading the units…</p>}

        {groups && subject && (
          <section aria-labelledby="pick-unit" className="mt-8">
            <h2 id="pick-unit" className={label}>
              Units, in Oak&apos;s teaching order
            </h2>
            {groups.length === 0 && (
              <p className="rounded-2xl border border-brand-line bg-white p-5 text-sm text-brand-earth">Oak has no units listed for this year yet.</p>
            )}
            {groups.length > 1 && (
              <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Choose a course">
                {groups.map((group) => (
                  <button
                    key={group.label}
                    type="button"
                    aria-pressed={group.label === groupLabel}
                    onClick={() => {
                      setGroupLabel(group.label);
                      setOpenUnit("");
                    }}
                    className={pill(group.label === groupLabel)}
                  >
                    {group.label || "Standard"}
                  </button>
                ))}
              </div>
            )}
            {groups.length > 1 && !groups.some((g) => g.label === groupLabel) && (
              <p className="text-sm text-brand-earth/80">Choose a course above to see its units.</p>
            )}
            {groups
              .filter((group) => groups.length === 1 || group.label === groupLabel)
              .map((group) => (
              <div key={group.label || "all"} className="mb-6">
                {group.label && <h3 className="mb-2 text-lg font-extrabold text-brand-charcoal">{group.label}</h3>}
                <ol className="space-y-2">
                  {group.units.map((unit, i) => {
                    const open = openUnit === unit.slug;
                    const detail = units[unit.slug];
                    return (
                      <li key={unit.slug} className="rounded-2xl border border-brand-line bg-white">
                        <button
                          type="button"
                          onClick={() => toggleUnit(unit.slug)}
                          aria-expanded={open}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-brand-cream"
                        >
                          <span className="w-4 text-brand-sage" aria-hidden>
                            {open ? "▾" : "▸"}
                          </span>
                          <span className="w-6 shrink-0 text-sm font-extrabold text-brand-earth/60">{i + 1}</span>
                          <span className="min-w-0 flex-1 font-extrabold text-brand-charcoal">{unit.title}</span>
                        </button>
                        {open && (
                          <div className="border-t border-brand-line px-4 py-4">
                            {detail === "loading" || !detail ? (
                              <p className="text-sm text-brand-earth/70">Loading the lessons…</p>
                            ) : detail === "failed" ? (
                              <p role="alert" className="text-sm font-bold text-amber-900">
                                We couldn&apos;t load this unit just now. Close it and open it again to retry.
                              </p>
                            ) : (
                              <UnitLessons unit={detail} subject={subject.title} />
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
            <p className="mt-4 text-xs leading-relaxed text-brand-earth/70">
              Lessons are by Oak National Academy, licensed under the Open Government Licence v3.0. A few lessons can&apos;t be shown inside
              Bright Roots because of copyright; those open on Oak&apos;s website instead. After adding, you&apos;ll find them in your{" "}
              <Link href="/parent" className="font-bold text-brand-sage underline">
                planner
              </Link>
              . A whole unit goes on the days that subject is on your timetable, skipping days off.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function UnitLessons({ unit, subject }: { unit: OakUnit; subject: string }) {
  // The grown-up can file the lessons under their own name for the subject, so they follow that subject on the timetable.
  const plan = (lessons: OakUnit["lessons"]) => (day: string, childIds: number[], filedUnder: string) =>
    planOakLessons({ lessons, subject: filedUnder || subject, unit_title: unit.title, scheduled_date: day, child_ids: childIds });

  if (unit.lessons.length === 0) return <p className="text-sm text-brand-earth">Oak has no lessons ready in this unit yet.</p>;
  return (
    <div>
      {unit.description && <p className="text-sm leading-relaxed text-brand-earth">{unit.description}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PlanSheets
          plan={plan(unit.lessons)}
          count={unit.lessons.length}
          subject={subject}
          noun="lessons"
          what={`${unit.title}: ${unit.lessons.length} lessons`}
          label={`Add the whole unit (${unit.lessons.length} lessons)`}
          className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark"
        />
      </div>
      <ol className="mt-4 divide-y divide-brand-line">
        {unit.lessons.map((lesson, i) => (
          <li key={lesson.slug} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
            <span className="w-6 shrink-0 text-right text-sm font-extrabold text-brand-earth/60">{i + 1}.</span>
            <span className="min-w-0 flex-1 text-sm font-semibold text-brand-charcoal">{lesson.title}</span>
            <PlanSheets
              plan={plan([lesson])}
              count={1}
              subject={subject}
              noun="lessons"
              what={lesson.title}
              label="Add"
              className="rounded-lg border-2 border-brand-line bg-white px-3 py-1 text-sm font-bold text-brand-sage hover:border-brand-softsage"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
