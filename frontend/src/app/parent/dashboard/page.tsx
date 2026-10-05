"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAllEntries,
  getBooks,
  getChildren,
  getSpellingResults,
  getTodayOakQuizResults,
  getTimetable,
  getWeekEntries,
  getWeekQuizScores,
} from "@/lib/api";
import {
  isAuthenticated,
  getRole,
  getUsername,
} from "@/lib/auth";
import { PlannerEntry, ReadingLogBook, WeekQuizScores } from "@/types";
import Navbar from "@/components/Navbar";
import HomeOverview from "@/components/HomeOverview";
import AppCard from "@/components/AppCard";
import { FamilyStarJars } from "@/components/StarJarCards";
import { ParentNotesCard } from "@/components/FamilyNotes";
import { useMounted } from "@/lib/useMounted";
import { STORE_OPEN, useStoreVisible } from "@/lib/store";
import { Sprig } from "@/components/Decor";
import { hand, serif } from "@/lib/fonts";
import {
  addDays,
  format,
  parseISO,
  startOfWeek,
} from "date-fns";

interface ChildItem {
  id: number;
  username: string;
}

interface TodayQuizRow {
  entry_id: number;
  child_id: number;
  child: string;
  lesson_title: string;
  subject: string;
  is_complete: boolean;
  completed: boolean;
  starter_score: number | null;
  starter_total: number | null;
  exit_score: number | null;
  exit_total: number | null;
}

interface SpellingResult {
  id: number;
  child_id: number;
  score: number;
  total: number;
  taken_at: string;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const mounted = useMounted();

  const [parentName, setParentName] = useState("Parent");
  const showStore = useStoreVisible();
  const [children, setChildren] = useState<ChildItem[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const [weekEntries, setWeekEntries] = useState<PlannerEntry[]>([]);
  const [allEntries, setAllEntries] = useState<PlannerEntry[]>([]);
  const [books, setBooks] = useState<ReadingLogBook[]>([]);
  const [todayQuiz, setTodayQuiz] = useState<TodayQuizRow[]>([]);
  const [weekQuizScores, setWeekQuizScores] = useState<WeekQuizScores | null>(null);
  const [spellingResults, setSpellingResults] = useState<SpellingResult[]>([]);
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});

  const [loading, setLoading] = useState(true);

  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    []
  );

  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const weekEndStr = format(addDays(weekStart, 4), "yyyy-MM-dd");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }

    setParentName(getUsername() || "Parent");

    getChildren()
      .then((res) => setChildren(res.data))
      .catch(() => {});

    getTimetable()
      .then((res) => setTimetable(res.data.config ?? {}))
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") return;

    setLoading(true);

    Promise.all([
      getWeekEntries(
        weekStartStr,
        selectedChildId ?? undefined
      ),
      getAllEntries(),
      getBooks(selectedChildId ?? undefined),
      getTodayOakQuizResults(selectedChildId ?? undefined),
      getWeekQuizScores(
        weekStartStr,
        weekEndStr,
        selectedChildId ?? undefined
      ),
      getSpellingResults({
        week_start: weekStartStr,
        ...(selectedChildId
          ? { child_id: selectedChildId }
          : {}),
      }),
    ])
      .then(
        ([
          weekRes,
          allRes,
          booksRes,
          quizRes,
          weekQuizRes,
          spellingRes,
        ]) => {
          setWeekEntries(weekRes.data);
          setAllEntries(allRes.data);
          setBooks(booksRes.data);
          setTodayQuiz(quizRes.data);
          setWeekQuizScores(weekQuizRes.data);
          setSpellingResults(spellingRes.data);
        }
      )
      .finally(() => setLoading(false));
  }, [
    selectedChildId,
    weekStartStr,
    weekEndStr,
  ]);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const todayDayName = format(new Date(), "EEEE");
  const todaySubjects = timetable[todayDayName] ?? [];

  const todayEntries = todaySubjects
    .map((subject) =>
      weekEntries.find(
        (entry) =>
          entry.scheduled_date === todayStr &&
          entry.lesson.subject === subject
      )
    )
    .filter((entry): entry is PlannerEntry => Boolean(entry));

  const todayComplete = todayEntries.filter(
    (entry) => entry.is_complete
  ).length;

  const weekComplete = weekEntries.filter(
    (entry) => entry.is_complete
  ).length;

  const weekPercent =
    weekEntries.length === 0
      ? 0
      : Math.round(
          (weekComplete / weekEntries.length) * 100
        );

  const todayPercent =
    todayEntries.length === 0
      ? 0
      : Math.round(
          (todayComplete / todayEntries.length) * 100
        );

  const childAllEntries = selectedChildId
    ? allEntries.filter(
        (entry) =>
          entry.assigned_to === null ||
          entry.assigned_to === selectedChildId
      )
    : allEntries;

  const submittedThisWeek = childAllEntries.filter(
    (entry) =>
      entry.completed_work_url &&
      entry.scheduled_date >= weekStartStr &&
      entry.scheduled_date <= weekEndStr
  ).length;

  const selectedTodayQuiz = selectedChildId
    ? todayQuiz.filter(
        (row) => row.child_id === selectedChildId
      )
    : todayQuiz;

  const oakPossible =
    weekQuizScores?.grand_total_possible ?? 0;

  const oakScore =
    weekQuizScores?.grand_total_score ?? 0;

  const oakPercent =
    oakPossible > 0
      ? Math.round((oakScore / oakPossible) * 100)
      : null;

  const currentBook =
    books.find((book) => book.status === "reading") ??
    books[0] ??
    null;

  const latestSpelling =
    spellingResults.length > 0
      ? [...spellingResults].sort(
          (a, b) =>
            new Date(b.taken_at).getTime() -
            new Date(a.taken_at).getTime()
        )[0]
      : null;

  const selectedChild = children.find(
    (child) => child.id === selectedChildId
  );

  const displayName = selectedChild
    ? selectedChild.username
    : "everyone";

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Welcome banner: the sunny desk illustration on the right, greeting on the cream to its left */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#E4DCCD] bg-[#FBF8F1] shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/hero.jpg" alt="" className="absolute right-0 top-0 hidden h-full w-auto max-w-none sm:block" />
          {/* On phones the picture sits across the top instead */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/hero.jpg" alt="" className="h-36 w-full object-cover sm:hidden" />
          <div className="absolute inset-y-0 right-0 hidden w-[62%] bg-gradient-to-r from-[#FBF8F1] via-[#FBF8F1]/40 to-transparent sm:block" />
          <Sprig className="absolute -left-3 bottom-2 hidden h-28 w-auto opacity-80 md:block" />
          <div className="relative flex min-h-[220px] flex-col justify-center gap-4 p-6 sm:max-w-[60%] sm:p-8 md:pl-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E5A46]">
              {mounted ? format(new Date(), "EEEE, d MMMM yyyy") : " "}
            </p>
            <h1 className={`${serif.className} text-3xl font-semibold leading-tight text-[#24452C] sm:text-4xl`}>
              Welcome back, {parentName}
            </h1>
            <p className={`${hand.className} -mt-1 text-2xl text-[#4F6B4A]`}>Plan less, learn more, grow together ♡</p>
            {children.length > 0 && (
              <div className="flex w-fit items-center gap-3 rounded-full border border-[#E4DCCD] bg-white/90 px-4 py-2 shadow-sm">
                <span className="text-sm font-bold text-[#6E5A46]">Viewing</span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={(event) => setSelectedChildId(event.target.value ? Number(event.target.value) : null)}
                  className="bg-transparent text-sm font-extrabold text-[#2F5D3A] outline-none"
                >
                  <option value="">All children</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>

        <HomeOverview />

        <div className="mb-8">
          <AppCard role="parent" dismissible />
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStat
            art="/home/plan.png"
            tint="#E7EADE"
            label="Today"
            value={
              loading
                ? "..."
                : `${todayComplete}/${todayEntries.length}`
            }
            detail={
              todayEntries.length > 0
                ? `${todayPercent}% complete`
                : "No lessons planned"
            }
          />

          <DashboardStat
            art="/home/progress.png"
            tint="#F5EFE1"
            label="This Week"
            value={
              loading
                ? "..."
                : `${weekPercent}%`
            }
            detail={`${weekComplete} of ${weekEntries.length} lessons`}
          />

          <DashboardStat
            art="/home/learn.png"
            tint="#E3EAF0"
            label={oakPossible > 0 ? "Oak Results" : "Quiz Results"}
            value={
              loading
                ? "..."
                : oakPercent !== null
                ? `${oakPercent}%`
                : "No data"
            }
            detail={
              oakPossible > 0
                ? `${oakScore} of ${oakPossible} points`
                : "No quiz results yet"
            }
          />

          <DashboardStat
            art="/home/family.png"
            tint="#F6E6DF"
            label="Work Submitted"
            value={
              loading
                ? "..."
                : submittedThisWeek
            }
            detail="This week"
          />
        </section>

        <FamilyStarJars />

        <ParentNotesCard />

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="brand-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-terracotta">
                  Today
                </p>

                <h2 className={`${serif.className} mt-1 text-2xl font-semibold text-[#24452C]`}>
                  Today&apos;s learning
                </h2>

                <p className="mt-1 text-sm text-brand-earth/65">
                  Showing {displayName}
                </p>
              </div>

              <Link
                href="/parent"
                className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-softsage"
              >
                Open planner
              </Link>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-brand-earth/60">
                Loading today&apos;s learning...
              </p>
            ) : todayEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-softsage/35 bg-brand-cream/70 px-5 py-10 text-center">
                <p className="font-bold text-brand-charcoal">
                  Nothing planned for today.
                </p>

                <p className="mt-1 text-sm text-brand-earth/60">
                  Add lessons from the planner whenever you&apos;re ready.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 rounded-2xl border border-brand-softsage/15 bg-brand-white p-4"
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        entry.is_complete
                          ? "bg-brand-softsage/20 text-brand-sage"
                          : "bg-brand-terracotta/15 text-brand-terracotta"
                      }`}
                    >
                      {entry.is_complete ? (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-brand-earth/55">
                          {entry.lesson.subject}
                        </span>

                        {entry.assigned_to && (
                          <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-extrabold text-brand-earth">
                            {
                              children.find(
                                (child) =>
                                  child.id ===
                                  entry.assigned_to
                              )?.username
                            }
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-1 font-bold ${
                          entry.is_complete
                            ? "text-brand-earth/50 line-through"
                            : "text-brand-charcoal"
                        }`}
                      >
                        {entry.lesson.title}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-brand-earth/60">
                        {entry.lesson.lesson_url && (
                          <span>Lesson link</span>
                        )}

                        {entry.completed_work_url && (
                          <span>Work submitted</span>
                        )}

                        {entry.is_complete && (
                          <span className="text-brand-sage">
                            Complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#E4DCCD]/60 bg-[#E3E7D9] p-6 shadow-sm">
              <Sprig className="absolute -right-2 -top-3 h-20 w-auto opacity-70" flip />
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6E5A46]">
                Week progress
              </p>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-brand-charcoal">
                    {weekPercent}%
                  </p>

                  <p className="mt-1 text-sm text-brand-earth/60">
                    {weekComplete} of{" "}
                    {weekEntries.length} lessons
                  </p>
                </div>

                <span className="text-sm font-bold text-brand-sage">
                  {format(weekStart, "d MMM")} to{" "}
                  {format(
                    addDays(weekStart, 4),
                    "d MMM"
                  )}
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-brand-softsage/15">
                <div
                  className="h-full rounded-full bg-brand-sage transition-all"
                  style={{
                    width: `${weekPercent}%`,
                  }}
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-[#E4DCCD]/60 bg-[#FBF8F1] p-6 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/books.png" alt="" className="pointer-events-none absolute -right-3 -top-2 h-16 w-auto opacity-90" />
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6E5A46]">
                Snapshot
              </p>

              <div className="mt-4 space-y-4">
                {selectedTodayQuiz.length > 0 && (
                  <SnapshotRow
                    label="Oak today"
                    value={`${selectedTodayQuiz.filter((row) => row.completed).length}/${selectedTodayQuiz.length} completed`}
                  />
                )}

                <SnapshotRow
                  label="Reading"
                  value={
                    currentBook
                      ? currentBook.title
                      : "No current book"
                  }
                />

                <SnapshotRow
                  label="Latest spelling"
                  value={
                    latestSpelling
                      ? `${latestSpelling.score}/${latestSpelling.total}`
                      : "No spelling result"
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-terracotta">
              Quick access
            </p>

            <h2 className={`${serif.className} mt-1 text-2xl font-semibold text-[#24452C]`}>
              Where do you want to go?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickCard
              art="/home/plan.png"
              tint="#E7EADE"
              href="/parent"
              title="Planner"
              description="Plan and manage the learning week."
            />

            <QuickCard
              art="/home/learn.png"
              tint="#F5EFE1"
              href="/parent/lessons"
              title="My Lessons"
              description="Build lessons once and reuse them, or schedule a whole plan."
            />

            <QuickCard
              art="/home/progress.png"
              tint="#E3EAF0"
              href="/parent/results"
              title="Test Results"
              description="Spelling, quizzes and your own tests, with time studied and games."
            />

            <QuickCard
              art="/home/parents.png"
              tint="#F3EAD7"
              href="/parent/progress"
              title="Review Work"
              description="Review submitted work and leave feedback."
            />

            <QuickCard
              art="/home/story.jpg"
              tint="#F6E6DF"
              href="/moments"
              title="Moments & Photos"
              description="Photos and notes from your learning."
            />

            <QuickCard
              art="/home/books.png"
              tint="#E3E7D9"
              href="/parent/council-report"
              title="Council Report"
              description="Download a home education report as a PDF."
            />

            {showStore && (
              <QuickCard
                art="/home/books.png"
                tint="#F3EAD7"
                href="/store"
                title={STORE_OPEN ? "Store" : "Store (only you can see this)"}
                description="Workbooks, cookbooks and stationery for home learning."
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  detail,
  art,
  tint,
}: {
  label: string;
  value: string | number;
  detail: string;
  art: string;
  tint: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E4DCCD]/60 p-5 shadow-sm" style={{ background: tint }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art} alt="" className="pointer-events-none absolute -bottom-1 -right-2 h-20 w-auto opacity-90" />
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#6E5A46]">
        {label}
      </p>

      <p className={`${serif.className} mt-2 text-4xl font-bold text-[#24452C]`}>
        {value}
      </p>

      <p className="mt-1 max-w-[70%] text-sm font-semibold text-[#6E5A46]">
        {detail}
      </p>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-brand-softsage/15 pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-semibold text-brand-earth/65">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-extrabold text-brand-charcoal">
        {value}
      </span>
    </div>
  );
}

function QuickCard({
  href,
  title,
  description,
  art,
  tint,
}: {
  href: string;
  title: string;
  description: string;
  art: string;
  tint: string;
}) {
  const photo = art.endsWith(".jpg");
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-[#E4DCCD]/60 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: tint }}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art} alt="" className={photo ? "h-16 w-16 rounded-2xl object-cover shadow-sm" : "max-h-20 w-auto"} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={`${serif.className} text-xl font-semibold text-[#24452C]`}>
          {title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-[#6E5A46]">
          {description}
        </p>
      </div>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2F5D3A] text-sm font-bold text-white transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
