"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole, getUsername } from "@/lib/auth";
import { getAllMyEntries, getCodingProgress, getGoals, getDaysOff, getBooks } from "@/lib/api";
import { PlannerEntry, WeeklyGoal, ReadingLogBook } from "@/types";
import Navbar from "@/components/Navbar";
import { format, startOfWeek } from "date-fns";

function computeStreak(entries: PlannerEntry[], daysOff: Set<string>): number {
  const today = format(new Date(), "yyyy-MM-dd");
  const byDate: Record<string, PlannerEntry[]> = {};
  entries.forEach(e => {
    if (!byDate[e.scheduled_date]) byDate[e.scheduled_date] = [];
    byDate[e.scheduled_date].push(e);
  });
  const todayDone = (byDate[today] || []).length > 0 && (byDate[today] || []).every(e => e.is_complete);
  const pastDates = Object.keys(byDate).filter(d => d < today).sort().reverse();
  let streak = (todayDone || daysOff.has(today)) ? 1 : 0;
  for (const d of pastDates) {
    if (daysOff.has(d)) { streak++; continue; }
    if (byDate[d].length > 0 && byDate[d].every(e => e.is_complete)) streak++;
    else break;
  }
  return streak;
}

export default function ChildProgressPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [coding, setCoding] = useState<Set<string>>(new Set());
  const [daysOff, setDaysOff] = useState<Set<string>>(new Set());
  const [books, setBooks] = useState<ReadingLogBook[]>([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") { router.replace("/login"); return; }
    setUsername(getUsername() || "");

    const weekMon = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
    Promise.all([
      getAllMyEntries(),
      getCodingProgress(),
      getGoals({ week_start: weekMon }),
      getDaysOff(),
      getBooks(),
    ]).then(([eRes, cRes, gRes, dRes, bRes]) => {
      setEntries(eRes.data);
      setCoding(new Set(cRes.data as string[]));
      setGoals(gRes.data);
      setDaysOff(new Set((dRes.data as { date: string }[]).map(d => d.date)));
      setBooks(bRes.data);
    }).finally(() => setLoading(false));
  }, [router]);

  const today = format(new Date(), "yyyy-MM-dd");
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(new Date(new Date(weekStart).getTime() + 4 * 86400000), "yyyy-MM-dd");

  const allDone = entries.filter(e => e.is_complete).length;
  const submitted = entries.filter(e => e.completed_work_url).length;
  const streak = computeStreak(entries, daysOff);

  const weekEntries = entries.filter(e => e.scheduled_date >= weekStart && e.scheduled_date <= weekEnd);
  const weekDone = weekEntries.filter(e => e.is_complete).length;
  const weekTotal = weekEntries.length;
  const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const goalsTotal = goals.length;
  const goalsDone = goals.filter(g => g.is_complete).length;

  const booksReading = books.filter(b => b.status === "reading").length;
  const booksFinished = books.filter(b => b.status === "completed").length;
  const currentBook = books.find(b => b.status === "reading") ?? null;

  const todayEntries = entries.filter(e => e.scheduled_date === today);
  const todayDone = todayEntries.filter(e => e.is_complete).length;
  const todayTotal = todayEntries.length;
  const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;

  const subjectStats = Array.from(
    entries.reduce((map, entry) => {
      if (entry.is_extra) return map;
      const subject = entry.lesson.subject;
      const current = map.get(subject) || { total: 0, done: 0 };
      current.total += 1;
      if (entry.is_complete) current.done += 1;
      map.set(subject, current);
      return map;
    }, new Map<string, { total: number; done: number }>())
  )
    .map(([subject, stats]) => ({
      subject,
      total: stats.total,
      done: stats.done,
      pct: stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const statCards = [
    { label: "Lessons done", value: allDone, icon: "📚", tone: "text-[#3F5D46]" },
    { label: "Day streak", value: streak, icon: "🔥", tone: "text-[#D19A32]" },
    { label: "Work submitted", value: submitted, icon: "📎", tone: "text-[#6C8C85]" },
    { label: "Coding lessons", value: coding.size, icon: "💻", tone: "text-[#5C607D]" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
            Progress
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">My Progress</h1>
          <p className="text-sm sm:text-base text-[#6E5A46] mt-2">
            Hi {username}, here&apos;s how your learning is going.
          </p>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading progress…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {statCards.map(card => (
                <div key={card.label} className="brand-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-2xl font-bold ${card.tone}`}>{card.value}</p>
                      <p className="text-xs font-semibold text-[#6E5A46] mt-1">{card.label}</p>
                    </div>
                    <span className="text-xl">{card.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="brand-card p-5 mb-5">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">This week</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Your learning this week</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    {weekDone} of {weekTotal} planned lessons complete.
                  </p>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-3xl font-bold text-[#3F5D46]">{weekPct}%</p>
                  <p className="text-xs text-[#8A7A69]">week complete</p>
                </div>
              </div>

              <div className="h-3 rounded-full bg-[#EEE8DD] overflow-hidden mb-5">
                <div
                  className="h-full rounded-full bg-[#8FA382] transition-all"
                  style={{ width: `${weekPct}%` }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E7DFD1] bg-[#FFFDF8] p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-bold text-[#2E342F]">Today</p>
                    <p className="text-sm font-bold text-[#3F5D46]">{todayDone}/{todayTotal}</p>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#EEE8DD] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D19A32]"
                      style={{ width: `${todayPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#8A7A69] mt-2">
                    {todayTotal === 0
                      ? "Nothing scheduled today."
                      : todayDone === todayTotal
                      ? "Everything finished today 🎉"
                      : `${todayTotal - todayDone} lesson${todayTotal - todayDone === 1 ? "" : "s"} still to go`}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E7DFD1] bg-[#FFFDF8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#2E342F]">Weekly goals</p>
                      <p className="text-xs text-[#8A7A69] mt-1">
                        {goalsTotal === 0 ? "No goals set yet." : `${goalsDone} of ${goalsTotal} complete`}
                      </p>
                    </div>
                    {goalsTotal > 0 && (
                      <p className="text-2xl font-bold text-[#3F5D46]">{goalsDone}/{goalsTotal}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {subjectStats.length > 0 && (
              <div className="brand-card p-5 mb-5">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Subjects</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Subject progress</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">A quick look at your busiest subjects.</p>
                </div>

                <div className="space-y-3">
                  {(showAllSubjects ? subjectStats : subjectStats.slice(0, 3)).map(item => (
                    <div key={item.subject} className="rounded-2xl border border-[#E7DFD1] bg-[#FFFDF8] px-4 py-3">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-bold text-[#2E342F]">{item.subject}</p>
                          <p className="text-xs text-[#8A7A69]">{item.done} of {item.total} complete</p>
                        </div>
                        <p className="text-sm font-bold text-[#3F5D46]">{item.pct}%</p>
                      </div>
                      <div className="h-2 rounded-full bg-[#EEE8DD] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#8FA382]"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {subjectStats.length > 3 && (
                    <button
                      onClick={() => setShowAllSubjects(v => !v)}
                      className="w-full rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] px-4 py-2.5 text-sm font-bold text-[#3F5D46] hover:border-[#8FA382]"
                    >
                      {showAllSubjects ? "Show fewer subjects" : `Show all subjects (${subjectStats.length})`}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="brand-card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Goals</p>
                <h2 className="text-lg font-bold text-[#2E342F] mt-1">This week&apos;s goals</h2>

                {goalsTotal === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-6 text-center mt-4">
                    <p className="text-sm text-[#8A7A69]">No goals set yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    {goals.map(goal => (
                      <div key={goal.id} className="flex items-center gap-3 rounded-xl bg-[#FBF8F1] p-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          goal.is_complete
                            ? "bg-[#3F5D46] text-white"
                            : "border border-[#CFC6B9] text-[#A79B8C]"
                        }`}>
                          {goal.is_complete ? "✓" : ""}
                        </span>
                        <span className={`text-sm font-semibold ${
                          goal.is_complete ? "text-[#8A7A69] line-through" : "text-[#2E342F]"
                        }`}>
                          {goal.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="brand-card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Reading</p>
                <h2 className="text-lg font-bold text-[#2E342F] mt-1">Reading progress</h2>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-2xl bg-[#F4F1EA] p-4">
                    <p className="text-2xl font-bold text-[#5C607D]">{booksReading}</p>
                    <p className="text-xs font-semibold text-[#6E5A46] mt-1">Reading now</p>
                  </div>
                  <div className="rounded-2xl bg-[#F1F6EF] p-4">
                    <p className="text-2xl font-bold text-[#3F5D46]">{booksFinished}</p>
                    <p className="text-xs font-semibold text-[#6E5A46] mt-1">Books finished</p>
                  </div>
                </div>

                {currentBook && (
                  <div className="rounded-2xl border border-[#E7DFD1] bg-[#FFFDF8] p-4 mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#8FA382]">Currently reading</p>
                    <p className="text-sm font-bold text-[#2E342F] mt-1">{currentBook.title}</p>
                    {currentBook.author && (
                      <p className="text-xs text-[#8A7A69] mt-0.5">{currentBook.author}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {streak > 0 && (
              <div className="brand-card p-5 border-[#E7D4A4] bg-[#FFF9EC]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7E5B7] flex items-center justify-center text-2xl shrink-0">
                    {streak >= 10 ? "🔥" : streak >= 5 ? "🏆" : "⚡"}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#B98224]">Learning streak</p>
                    <p className="text-lg font-bold text-[#2E342F] mt-0.5">{streak}-day streak</p>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      {streak >= 10 ? "More than two school weeks of consistent learning." : streak >= 5 ? "A full school week completed." : "Keep the run going."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
