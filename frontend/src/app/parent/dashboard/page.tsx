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
import { useMounted } from "@/lib/useMounted";
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
      getTodayOakQuizResults(),
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
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand-terracotta">
              Bright Roots
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-brand-charcoal md:text-4xl">
              Welcome back, {parentName}
            </h1>

            <p className="mt-2 text-brand-earth/70">
              {mounted
                ? format(
                    new Date(),
                    "EEEE, d MMMM yyyy"
                  )
                : " "}
            </p>
          </div>

          {children.length > 0 && (
            <div className="brand-card flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-brand-earth/70">
                Viewing
              </span>

              <select
                value={selectedChildId ?? ""}
                onChange={(event) =>
                  setSelectedChildId(
                    event.target.value
                      ? Number(event.target.value)
                      : null
                  )
                }
                className="bg-transparent text-sm font-extrabold text-brand-sage outline-none"
              >
                <option value="">All children</option>

                {children.map((child) => (
                  <option
                    key={child.id}
                    value={child.id}
                  >
                    {child.username}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStat
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
            label="This Week"
            value={
              loading
                ? "..."
                : `${weekPercent}%`
            }
            detail={`${weekComplete} of ${weekEntries.length} lessons`}
          />

          <DashboardStat
            label="Oak Results"
            value={
              loading
                ? "..."
                : oakPercent !== null
                ? `${oakPercent}%`
                : "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"
            }
            detail={
              oakPossible > 0
                ? `${oakScore} of ${oakPossible} points`
                : "No quiz results yet"
            }
          />

          <DashboardStat
            label="Work Submitted"
            value={
              loading
                ? "..."
                : submittedThisWeek
            }
            detail="This week"
          />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="brand-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-terracotta">
                  Today
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">
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
            <div className="brand-card p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-gold">
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

            <div className="brand-card p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-terracotta">
                Snapshot
              </p>

              <div className="mt-4 space-y-4">
                <SnapshotRow
                  label="Oak today"
                  value={
                    selectedTodayQuiz.length > 0
                      ? `${selectedTodayQuiz.filter((row) => row.completed).length}/${selectedTodayQuiz.length} completed`
                      : "No Oak results today"
                  }
                />

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

            <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">
              Where do you want to go?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickCard
              href="/parent"
              title="Planner"
              description="Plan and manage the learning week."
            />

            <QuickCard
              href="/parent/report"
              title="Reports"
              description="See progress, Oak results and learning history."
            />

            <QuickCard
              href="/units"
              title="Oak Units"
              description="Add and manage Oak Academy learning."
            />

            <QuickCard
              href="/reading-log"
              title="Reading"
              description="Books, reading progress and worksheets."
            />

            <QuickCard
              href="/spellings"
              title="Spellings"
              description="Weekly words, tests and weak-word practice."
            />

            <QuickCard
              href="/parent/progress"
              title="Review Work"
              description="Review submitted work and leave feedback."
            />
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
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="brand-card p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-earth/55">
        {label}
      </p>

      <p className="mt-3 text-3xl font-extrabold text-brand-sage">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-brand-earth/65">
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
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group brand-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-softsage/45 hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-softsage/15 text-brand-sage transition-colors group-hover:bg-brand-sage group-hover:text-white">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <h3 className="font-extrabold text-brand-charcoal">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-relaxed text-brand-earth/65">
        {description}
      </p>
    </Link>
  );
}