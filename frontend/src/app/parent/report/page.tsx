"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getCodingProgress, getChildren, getSpellingResults, getOakQuizResults, refreshOakQuizResults, exportOakResults, getWeekQuizScores } from "@/lib/api";
import { PlannerEntry, Child, OakQuizResult, WeekQuizDay, WeekQuizScores } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, subWeeks, addDays, eachDayOfInterval } from "date-fns";

const TIMETABLE_SUBJECTS = [
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
  "RSHE (PSHE)", "Languages",
];

const SUBJECT_COLOR: Record<string, string> = {
  Maths: "bg-blue-500", English: "bg-purple-500", Science: "bg-green-500",
  History: "bg-yellow-500", Geography: "bg-cyan-500", Computing: "bg-indigo-500",
  Cooking: "bg-orange-500", "Art & Design": "bg-pink-500",
  "Design and Technology": "bg-red-500", "Life Skills": "bg-teal-500",
};

const TRACKS = [
  { name: "Scratch", count: 4 },
  { name: "Code.org", count: 5 },
  { name: "Python", count: 8 },
  { name: "Web Dev", count: 6 },
]; // 23 total — must match TOTAL in /coding/page.tsx
const TOTAL_CODING = TRACKS.reduce((s, t) => s + t.count, 0);

type Period = "week" | "month" | "all";

type Tab = "home" | "progress" | "oak" | "work" | "attendance" | "export";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Report Home" },
  { id: "progress", label: "Progress" },
  { id: "oak", label: "Oak Results" },
  { id: "work", label: "Work" },
  { id: "attendance", label: "Attendance" },
  { id: "export", label: "Print / Export" },
];

const OAK_SHARE_RE = /https?:\/\/(?:www\.)?thenational\.academy\/pupils\/lessons\/[^/?#]+\/results\/[^/?#]+\/share/;

function QuizScoreBadge({ label, score, total }: { label: string; score: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const colors = pct >= 80
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : pct >= 50
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-red-50 text-red-600 border-red-200";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold border rounded-full px-2 py-0.5 ${colors}`}>
      {label} {score}/{total}
    </span>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("week");
  const [tab, setTab] = useState<Tab>("home");
  const [workWeeksBack, setWorkWeeksBack] = useState(0); // 0 = this week, 1 = last week…
  const [codingDone, setCodingDone] = useState(0);
  const [allSpellingResults, setAllSpellingResults] = useState<{id: number; child_id: number; week_start: string; score: number; total: number; wrong_words: string[]; is_practice_round: boolean; taken_at: string}[]>([]);
  const [quizResults, setQuizResults] = useState<Record<string, OakQuizResult>>({});
  const [weekQuizScores, setWeekQuizScores] = useState<WeekQuizScores | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    const weekEndStr = format(weekEnd, "yyyy-MM-dd");
    const toMap = (rows: OakQuizResult[]) =>
      Object.fromEntries(rows.map(r => [r.url, r]));
    Promise.all([
      getAllEntries(), getChildren(), getSpellingResults(), getOakQuizResults(),
    ]).then(([eRes, childRes, sRes, qRes]) => {
      setEntries(eRes.data);
      setChildren(childRes.data);
      const oscar = (childRes.data as Child[]).find(
        child => child.username.trim().toLowerCase() === "oscar"
      );
      if (oscar) {
        setSelectedChildId(current => current ?? oscar.id);
      }
      setAllSpellingResults(sRes.data);
      setQuizResults(toMap(qRes.data));
      setLoading(false);
    });
    // Fetch scores for any share links that aren't cached yet, then reload
    refreshOakQuizResults().then(res => {
      if (res.data.updated > 0) {
        getOakQuizResults().then(qRes => setQuizResults(toMap(qRes.data)));
      }
    }).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (loading) return;
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    getWeekQuizScores(
      format(weekStart, "yyyy-MM-dd"),
      format(weekEnd, "yyyy-MM-dd"),
      selectedChildId ?? undefined,
    )
      .then(res => setWeekQuizScores(res.data))
      .catch(() => setWeekQuizScores(null));
  }, [selectedChildId, loading]);

  // Coding progress is per child — show the selected child's, or the union across all children
  useEffect(() => {
    if (children.length === 0) return;
    if (selectedChildId) {
      getCodingProgress(selectedChildId).then(res => setCodingDone((res.data as string[]).length));
    } else {
      Promise.all(children.map(c => getCodingProgress(c.id))).then(results => {
        const done = new Set<string>();
        results.forEach(r => (r.data as string[]).forEach(id => done.add(id)));
        setCodingDone(done.size);
      });
    }
  }, [selectedChildId, children]);

  const selectedChild = children.find(c => c.id === selectedChildId);

  const childEntries = selectedChildId
    ? entries.filter(e => e.assigned_to === null || e.assigned_to === selectedChildId)
    : entries;

  const filtered = childEntries.filter(e => {
    const d = parseISO(e.scheduled_date);
    const now = new Date();
    if (period === "week") return isWithinInterval(d, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
    if (period === "month") return isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) });
    return true;
  });

  const timetable = filtered.filter(e => !e.is_extra);
  const extra = filtered.filter(e => e.is_extra);
  const totalComplete = filtered.filter(e => e.is_complete).length;
  const totalSubmitted = filtered.filter(e => e.completed_work_url).length;
  const completionPct = filtered.length === 0 ? 0 : Math.round((totalComplete / filtered.length) * 100);

  const subjectStats = TIMETABLE_SUBJECTS.map(subject => {
    const s = timetable.filter(e => e.lesson.subject === subject);
    const done = s.filter(e => e.is_complete).length;
    return { subject, total: s.length, done, pct: s.length === 0 ? 0 : Math.round((done / s.length) * 100) };
  }).filter(s => s.total > 0).sort((a, b) => b.pct - a.pct);

  const allSubmitted = childEntries.filter(e => e.completed_work_url);

  // Submitted work, one week at a time
  const workWeekStart = startOfWeek(subWeeks(new Date(), workWeeksBack), { weekStartsOn: 1 });
  const workWeekEnd = endOfWeek(workWeekStart, { weekStartsOn: 1 });
  const weekSubmitted = allSubmitted.filter(e =>
    isWithinInterval(parseISO(e.scheduled_date), { start: workWeekStart, end: workWeekEnd })
  );
  const workWeekLabel = workWeeksBack === 0 ? "This Week" : workWeeksBack === 1 ? "Last Week" : `Week of ${format(workWeekStart, "d MMM yyyy")}`;

  // Attendance heatmap: last 16 weeks of school days
  const heatmapWeeks = Array.from({ length: 16 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 15 - i), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 4) }); // Mon–Fri only
  });
  const byDate: Record<string, PlannerEntry[]> = {};
  childEntries.forEach(e => {
    if (!byDate[e.scheduled_date]) byDate[e.scheduled_date] = [];
    byDate[e.scheduled_date].push(e);
  });
  const heatmapColor = (d: Date) => {
    const key = format(d, "yyyy-MM-dd");
    const today = format(new Date(), "yyyy-MM-dd");
    if (key > today) return "bg-gray-100"; // future
    const day = byDate[key];
    if (!day || day.length === 0) return "bg-gray-100"; // no lessons
    const done = day.filter(e => e.is_complete).length;
    if (done === day.length) return "bg-emerald-500";
    if (done > 0) return "bg-yellow-400";
    return "bg-red-300";
  };

  // Weekly trend: last 8 weeks
  const weeklyTrend = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekEntries = childEntries.filter(e => {
      const d = parseISO(e.scheduled_date);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    });
    const done = weekEntries.filter(e => e.is_complete).length;
    const pct = weekEntries.length === 0 ? 0 : Math.round((done / weekEntries.length) * 100);
    return { label: format(weekStart, "d MMM"), total: weekEntries.length, done, pct };
  });

  const handleExportOak = async () => {
    setExporting(true);
    try {
      const params: { child_id?: number; start_date?: string; end_date?: string } = {};
      if (selectedChildId) params.child_id = selectedChildId;
      if (period === "week") {
        params.start_date = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
        params.end_date = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      } else if (period === "month") {
        params.start_date = format(startOfMonth(new Date()), "yyyy-MM-dd");
        params.end_date = format(endOfMonth(new Date()), "yyyy-MM-dd");
      }
      const res = await exportOakResults(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `bright-roots-oak-results-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="print:hidden"><Navbar /></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Learning Reports
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">
                {selectedChild ? `${selectedChild.username}'s Report` : "Family Learning Report"}
              </h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                A clear view of progress, Oak results, submitted work and attendance.
              </p>
            </div>

            {children.length > 0 && (
              <div className="brand-card px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                  Viewing
                </span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                  className="bg-transparent text-sm font-semibold text-[#2E342F] focus:outline-none cursor-pointer"
                >
                  <option value="">All children</option>
                  {children.map(c => (
                    <option key={c.id} value={c.id}>{c.username}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="brand-card p-2 mb-5 overflow-x-auto print:hidden">
          <div className="flex min-w-max gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "bg-[#3F5D46] text-white"
                    : "text-[#6E5A46] hover:bg-[#F7F2E8] hover:text-[#3F5D46]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab !== "work" && tab !== "export" && (
          <div className="flex flex-wrap gap-2 mb-6 print:hidden">
            {(["week", "month", "all"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  period === p
                    ? "bg-[#3F5D46] border-[#3F5D46] text-white"
                    : "bg-[#FFFDF8] border-[#E7DFD1] text-[#6E5A46] hover:border-[#8FA382]"
                }`}
              >
                {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {/* Printable learning report */}
            <div className="hidden print:block text-black">
              <div className="border-b-2 border-black pb-4 mb-5">
                <h1 className="text-2xl font-bold">Bright Roots Home Learning</h1>
                <p className="text-lg font-semibold mt-1">
                  {selectedChild ? `${selectedChild.username}'s Learning Report` : "Family Learning Report"}
                </p>
                <p className="text-sm mt-1">
                  {period === "week" ? "This Week" : period === "month" ? "This Month" : "All Time"}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="border border-gray-400 p-3">
                  <p className="text-xs font-bold uppercase">Assigned</p>
                  <p className="text-xl font-bold mt-1">{filtered.length}</p>
                </div>
                <div className="border border-gray-400 p-3">
                  <p className="text-xs font-bold uppercase">Completed</p>
                  <p className="text-xl font-bold mt-1">{totalComplete}</p>
                </div>
                <div className="border border-gray-400 p-3">
                  <p className="text-xs font-bold uppercase">Completion</p>
                  <p className="text-xl font-bold mt-1">{completionPct}%</p>
                </div>
                <div className="border border-gray-400 p-3">
                  <p className="text-xs font-bold uppercase">Work Submitted</p>
                  <p className="text-xl font-bold mt-1">{totalSubmitted}</p>
                </div>
              </div>

              <section className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-400 pb-1 mb-3">
                  Subject Progress
                </h2>
                {subjectStats.length > 0 ? (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 px-2 py-1 text-left">Subject</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">Completed</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">Assigned</th>
                        <th className="border border-gray-400 px-2 py-1 text-right">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectStats.map(s => (
                        <tr key={s.subject}>
                          <td className="border border-gray-400 px-2 py-1">{s.subject}</td>
                          <td className="border border-gray-400 px-2 py-1 text-right">{s.done}</td>
                          <td className="border border-gray-400 px-2 py-1 text-right">{s.total}</td>
                          <td className="border border-gray-400 px-2 py-1 text-right">{s.pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm">No subject progress for this period.</p>
                )}
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-400 pb-1 mb-3">
                  Oak Quiz Results
                </h2>
                {(() => {
                  const printDays = (weekQuizScores?.days ?? []).filter(day => {
                    const dow = parseISO(day.date).getDay();
                    return dow >= 1 && dow <= 5;
                  });

                  const printPossible = weekQuizScores?.grand_total_possible ?? 0;
                  const printScore = weekQuizScores?.grand_total_score ?? 0;

                  return (
                    <>
                      <p className="text-sm mb-3">
                        Weekly score: {printScore} / {printPossible}
                        {printPossible > 0 ? ` (${Math.round((printScore / printPossible) * 100)}%)` : ""}
                      </p>

                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="border border-gray-400 px-2 py-1 text-left">Day</th>
                            <th className="border border-gray-400 px-2 py-1 text-left">Lesson</th>
                            <th className="border border-gray-400 px-2 py-1 text-left">Starter</th>
                            <th className="border border-gray-400 px-2 py-1 text-left">Exit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {printDays.flatMap(day =>
                            day.entries.map(entry => (
                              <tr key={`${day.date}-${entry.entry_id}-${entry.child_id}`}>
                                <td className="border border-gray-400 px-2 py-1">
                                  {format(parseISO(day.date), "EEE d MMM")}
                                </td>
                                <td className="border border-gray-400 px-2 py-1">
                                  {entry.lesson_title}
                                </td>
                                <td className="border border-gray-400 px-2 py-1">
                                  {entry.starter_score != null
                                    ? `${entry.starter_score}/${entry.starter_total ?? 6}`
                                    : "No score"}
                                </td>
                                <td className="border border-gray-400 px-2 py-1">
                                  {entry.exit_score != null
                                    ? `${entry.exit_score}/${entry.exit_total ?? 6}`
                                    : "No score"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </>
                  );
                })()}
              </section>

              <section>
                <h2 className="text-lg font-bold border-b border-gray-400 pb-1 mb-3">
                  Submitted Work
                </h2>
                {allSubmitted.length > 0 ? (
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 px-2 py-1 text-left">Date</th>
                        <th className="border border-gray-400 px-2 py-1 text-left">Subject</th>
                        <th className="border border-gray-400 px-2 py-1 text-left">Lesson</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSubmitted
                        .filter(e => {
                          if (period === "all") return true;
                          return filtered.some(f => f.id === e.id);
                        })
                        .map(e => (
                          <tr key={e.id}>
                            <td className="border border-gray-400 px-2 py-1">
                              {format(parseISO(e.scheduled_date), "d MMM yyyy")}
                            </td>
                            <td className="border border-gray-400 px-2 py-1">
                              {e.lesson.subject}
                            </td>
                            <td className="border border-gray-400 px-2 py-1">
                              {e.lesson.title}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm">No submitted work for this period.</p>
                )}
              </section>

              <p className="text-xs text-gray-500 border-t border-gray-400 mt-6 pt-3">
                Bright Roots Home Learning
              </p>
            </div>

            {/* Report Home summary */}
            {tab === "home" && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="brand-card p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Assigned</p>
                  <p className="text-3xl font-bold text-[#2E342F] mt-2">{filtered.length}</p>
                  <p className="text-sm text-[#6E5A46] mt-1">Lessons in this period</p>
                </div>

                <div className="brand-card p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Completed</p>
                  <p className="text-3xl font-bold text-[#3F5D46] mt-2">{totalComplete}</p>
                  <p className="text-sm text-[#6E5A46] mt-1">Finished lessons</p>
                </div>

                <div className="brand-card p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Completion</p>
                  <p className="text-3xl font-bold text-[#D88C64] mt-2">{completionPct}%</p>
                  <p className="text-sm text-[#6E5A46] mt-1">Overall completion rate</p>
                </div>

                <div className="brand-card p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Work</p>
                  <p className="text-3xl font-bold text-[#E3B554] mt-2">{totalSubmitted}</p>
                  <p className="text-sm text-[#6E5A46] mt-1">Pieces submitted</p>
                </div>
              </div>
            )}

            {tab === "home" && (
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="brand-card p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Snapshot</p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">Subject Progress</h2>
                    </div>
                    <button
                      onClick={() => setTab("progress")}
                      className="text-sm font-semibold text-[#3F5D46] hover:underline"
                    >
                      View progress
                    </button>
                  </div>

                  {subjectStats.length > 0 ? (
                    <div className="space-y-4">
                      {subjectStats.slice(0, 5).map(s => (
                        <div key={s.subject}>
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <span className="text-sm font-semibold text-[#2E342F]">{s.subject}</span>
                            <span className="text-xs font-bold text-[#6E5A46]">
                              {s.done}/{s.total} / {s.pct}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#F0EADF] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#8FA382]"
                              style={{ width: `${s.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6E5A46]">No subject progress for this period yet.</p>
                  )}
                </div>

                <div className="brand-card p-6">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Latest</p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">Recent Learning</h2>
                    </div>
                    <button
                      onClick={() => setTab("work")}
                      className="text-sm font-semibold text-[#3F5D46] hover:underline"
                    >
                      View work
                    </button>
                  </div>

                  {filtered.length > 0 ? (
                    <div className="space-y-3">
                      {[...filtered]
                        .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))
                        .slice(0, 5)
                        .map(e => (
                          <div
                            key={e.id}
                            className="flex items-start justify-between gap-4 py-2 border-b border-[#EEE6D9] last:border-0"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#2E342F] truncate">{e.lesson.title}</p>
                              <p className="text-xs text-[#8FA382] mt-0.5">
                                {e.lesson.subject} / {format(parseISO(e.scheduled_date), "d MMM yyyy")}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                                e.is_complete
                                  ? "bg-[#E8F0E8] text-[#3F5D46]"
                                  : "bg-[#F7F2E8] text-[#6E5A46]"
                              }`}
                            >
                              {e.is_complete ? "Done" : "Planned"}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6E5A46]">No recent learning for this period yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Coding progress */}
            {tab === "progress" && (
              <div className="brand-card p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Coding</p>
                    <h2 className="text-lg font-bold text-[#2E342F] mt-1">Coding Curriculum</h2>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      Progress across the full coding pathway.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-[#3F5D46]">
                      {codingDone} / {TOTAL_CODING}
                    </p>
                    <p className="text-xs text-[#8FA382] font-semibold">lessons completed</p>
                  </div>
                </div>

                <div className="h-3 rounded-full bg-[#F0EADF] overflow-hidden mb-5">
                  <div
                    className="h-full rounded-full bg-[#3F5D46] transition-all"
                    style={{ width: `${Math.round((codingDone / TOTAL_CODING) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TRACKS.map(t => (
                    <div key={t.name} className="rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] p-4">
                      <p className="text-sm font-bold text-[#2E342F]">{t.name}</p>
                      <p className="text-xs text-[#6E5A46] mt-1">{t.count} lessons</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance */}
            {tab === "attendance" && childEntries.length > 0 && (
              <div className="space-y-6">
                <div className="brand-card p-6">
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Attendance</p>
                    <h2 className="text-lg font-bold text-[#2E342F] mt-1">Last 16 Weeks</h2>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      A day-by-day view of completed learning across recent school weeks.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      <div className="flex flex-col gap-2 mr-1">
                        {["M", "T", "W", "T", "F"].map((d, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 text-xs text-[#8FA382] font-bold flex items-center justify-center"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      {heatmapWeeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-2">
                          {week.map((day, di) => (
                            <div
                              key={di}
                              title={format(day, "d MMM yyyy")}
                              className={`w-5 h-5 rounded-md transition-all ${heatmapColor(day)}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-[#EEE6D9] text-xs text-[#6E5A46]">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                      All done
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />
                      Partial
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />
                      None done
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />
                      No lessons
                    </span>
                  </div>
                </div>

                <div className="brand-card p-6">
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Trend</p>
                    <h2 className="text-lg font-bold text-[#2E342F] mt-1">Weekly Completion</h2>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      Completion percentage across the last eight weeks.
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-2 h-44">
                    {weeklyTrend.map((w, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-[#3F5D46]">
                          {w.pct > 0 ? `${w.pct}%` : ""}
                        </span>

                        <div className="w-full flex flex-col justify-end" style={{ height: "110px" }}>
                          <div
                            className={`w-full rounded-t-lg transition-all ${
                              w.total === 0
                                ? "bg-[#F0EADF]"
                                : w.pct === 100
                                ? "bg-[#3F5D46]"
                                : w.pct >= 50
                                ? "bg-[#8FA382]"
                                : "bg-[#D88C64]"
                            }`}
                            style={{ height: `${w.total === 0 ? 4 : Math.max(4, w.pct)}px` }}
                          />
                        </div>

                        <span className="text-[10px] sm:text-xs text-[#8FA382] font-semibold leading-tight text-center">
                          {w.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#EEE6D9] text-xs text-[#6E5A46]">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#3F5D46] inline-block" />
                      100%
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#8FA382] inline-block" />
                      50%+
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#D88C64] inline-block" />
                      Under 50%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Subject progress */}
            {tab === "progress" && subjectStats.length > 0 && (
              <div className="brand-card p-6 mb-6">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Subjects</p>
                  <h2 className="text-lg font-bold text-[#2E342F] mt-1">Subject Progress</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    Completion across the subjects in this reporting period.
                  </p>
                </div>

                <div className="space-y-5">
                  {subjectStats.map(s => (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8FA382] shrink-0" />
                          <span className="text-sm font-semibold text-[#2E342F] truncate">
                            {s.subject}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-[#6E5A46]">{s.done}/{s.total}</span>
                          <span className="text-sm font-bold text-[#3F5D46] w-11 text-right">
                            {s.pct}%
                          </span>
                        </div>
                      </div>

                      <div className="h-2.5 rounded-full bg-[#F0EADF] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#8FA382] transition-all"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra work summary */}
            {tab === "progress" && extra.length > 0 && (
              <div className="brand-card p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Extra Work</p>
                    <h2 className="text-lg font-bold text-[#2E342F] mt-1">Independent Learning</h2>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      Extra activities completed outside the main timetable.
                    </p>
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <p className="text-2xl font-bold text-[#2E342F]">{extra.length}</p>
                      <p className="text-xs text-[#8FA382] font-semibold">Assigned</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#3F5D46]">
                        {extra.filter(e => e.is_complete).length}
                      </p>
                      <p className="text-xs text-[#8FA382] font-semibold">Completed</p>
                    </div>
                  </div>
                </div>

                <div className="h-3 rounded-full bg-[#F0EADF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E3B554] transition-all"
                    style={{
                      width: `${extra.length === 0
                        ? 0
                        : Math.round((extra.filter(e => e.is_complete).length / extra.length) * 100)}%`
                    }}
                  />
                </div>

                <p className="text-xs text-[#6E5A46] mt-2">
                  {extra.length === 0
                    ? 0
                    : Math.round((extra.filter(e => e.is_complete).length / extra.length) * 100)}% complete
                </p>
              </div>
            )}

            {/* Spelling results */}
            {tab === "progress" && (() => {
              const spellingFiltered = allSpellingResults.filter(r =>
                selectedChildId ? r.child_id === selectedChildId : true
              );

              if (spellingFiltered.length === 0) return (
                <div className="brand-card p-10 text-center mb-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Spellings</p>
                  <h2 className="text-lg font-bold text-[#2E342F] mt-2">No spelling results yet</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    Completed spelling tests will appear here.
                  </p>
                </div>
              );

              const byWeek: Record<string, typeof spellingFiltered> = {};
              spellingFiltered.forEach(r => {
                if (!byWeek[r.week_start]) byWeek[r.week_start] = [];
                byWeek[r.week_start].push(r);
              });

              const weeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a));

              return (
                <div className="brand-card p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Spellings</p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">Spelling Results</h2>
                      <p className="text-sm text-[#6E5A46] mt-1">
                        Test scores, practice rounds and improvements over time.
                      </p>
                    </div>

                    <a
                      href="/spellings"
                      className="text-sm font-semibold text-[#3F5D46] hover:underline"
                    >
                      Go to Spellings
                    </a>
                  </div>

                  <div className="space-y-5">
                    {weeks.map(week => (
                      <div key={week} className="rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-3">
                          Week of {format(new Date(week + "T12:00:00"), "d MMM yyyy")}
                        </p>

                        <div className="space-y-3">
                          {byWeek[week].map(r => {
                            const pct = Math.round((r.score / r.total) * 100);
                            const child = children.find(c => c.id === r.child_id);
                            const firstNormal = byWeek[week]
                              .filter(x => x.child_id === r.child_id && !x.is_practice_round)
                              .sort((a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime())[0];
                            const isFirstNormal = !r.is_practice_round && firstNormal?.id === r.id;
                            const delta = !r.is_practice_round && !isFirstNormal && firstNormal
                              ? pct - Math.round((firstNormal.score / firstNormal.total) * 100)
                              : null;

                            return (
                              <div key={r.id} className="border-t border-[#EEE6D9] first:border-0 first:pt-0 pt-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm font-bold text-[#3F5D46] w-12 shrink-0">
                                    {pct}%
                                  </span>

                                  <div className="flex-1 min-w-[100px] h-2.5 rounded-full bg-[#F0EADF] overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-[#8FA382]"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>

                                  <span className="text-xs font-semibold text-[#6E5A46] shrink-0">
                                    {r.score}/{r.total}
                                  </span>

                                  {!selectedChildId && child && (
                                    <span className="text-xs font-semibold text-[#6E5A46] shrink-0">
                                      {child.username}
                                    </span>
                                  )}

                                  {r.is_practice_round && (
                                    <span className="text-[10px] bg-[#F7F2E8] text-[#6E5A46] px-2 py-1 rounded-full font-bold shrink-0">
                                      Practice
                                    </span>
                                  )}

                                  {delta !== null && (
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${
                                      delta > 0
                                        ? "bg-[#E8F0E8] text-[#3F5D46]"
                                        : delta < 0
                                        ? "bg-[#FBEDE6] text-[#B66443]"
                                        : "bg-[#F2EFEA] text-[#6E5A46]"
                                    }`}>
                                      {delta > 0
                                        ? `Up ${delta}%`
                                        : delta < 0
                                        ? `Down ${Math.abs(delta)}%`
                                        : "No change"}
                                    </span>
                                  )}
                                </div>

                                {r.wrong_words.length > 0 && (
                                  <div className="flex gap-1.5 flex-wrap mt-2">
                                    {r.wrong_words.map((w, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] bg-[#FBEDE6] text-[#B66443] border border-[#F1C7B4] px-2 py-1 rounded-full font-semibold"
                                      >
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Submitted work */}
            {tab === "work" && (
              <>
                <div className="brand-card p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <button
                      onClick={() => setWorkWeeksBack(workWeeksBack + 1)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-[#3F5D46] border border-[#E7DFD1] bg-[#FFFDF8] hover:border-[#8FA382]"
                    >
                      Previous week
                    </button>

                    <div className="text-center">
                      <p className="text-sm font-bold text-[#2E342F]">{workWeekLabel}</p>
                      <p className="text-xs text-[#8FA382] mt-1">
                        {format(workWeekStart, "d MMM")} to {format(workWeekEnd, "d MMM yyyy")}
                      </p>
                    </div>

                    <button
                      onClick={() => setWorkWeeksBack(Math.max(0, workWeeksBack - 1))}
                      disabled={workWeeksBack === 0}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        workWeeksBack === 0
                          ? "text-[#B8B0A4] border-[#EEE6D9] bg-[#F7F2E8] cursor-not-allowed"
                          : "text-[#3F5D46] border-[#E7DFD1] bg-[#FFFDF8] hover:border-[#8FA382]"
                      }`}
                    >
                      Next week
                    </button>
                  </div>
                </div>

                {weekSubmitted.length === 0 ? (
                  <div className="brand-card p-10 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Submitted Work</p>
                    <h2 className="text-lg font-bold text-[#2E342F] mt-2">Nothing submitted this week</h2>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      Completed work links will appear here when they are submitted.
                    </p>
                  </div>
                ) : (
                  <div className="brand-card p-6">
                    <div className="mb-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Work</p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">
                        Submitted Work
                      </h2>
                      <p className="text-sm text-[#6E5A46] mt-1">
                        {weekSubmitted.length} item{weekSubmitted.length === 1 ? "" : "s"} submitted for {workWeekLabel.toLowerCase()}.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {weekSubmitted.map(e => (
                        <div
                          key={e.id}
                          className="rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] p-4"
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-[#8FA382] shrink-0" />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                                  {e.lesson.subject}
                                </span>
                                <span className="text-xs text-[#6E5A46]">
                                  {format(parseISO(e.scheduled_date), "d MMM yyyy")}
                                </span>
                              </div>

                              <p className="text-sm font-bold text-[#2E342F]">
                                {e.lesson.title}
                              </p>

                              {(() => {
                                const shareUrl = e.completed_work_url!.match(OAK_SHARE_RE)?.[0];
                                const r = shareUrl ? quizResults[shareUrl] : undefined;
                                if (!r) return null;

                                return (
                                  <div className="flex items-center gap-2 flex-wrap mt-2">
                                    {r.starter_total != null && r.starter_score != null && (
                                      <QuizScoreBadge
                                        label="Starter quiz"
                                        score={r.starter_score}
                                        total={r.starter_total}
                                      />
                                    )}
                                    {r.exit_total != null && r.exit_score != null && (
                                      <QuizScoreBadge
                                        label="Exit quiz"
                                        score={r.exit_score}
                                        total={r.exit_total}
                                      />
                                    )}
                                  </div>
                                );
                              })()}

                              <a
                                href={e.completed_work_url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-sm font-semibold text-[#3F5D46] hover:underline break-all mt-2"
                              >
                                Open submitted work
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Print and export */}
            {tab === "export" && (
              <div className="print:hidden">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="brand-card p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Export</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Oak Results Spreadsheet</h2>
                  <p className="text-sm text-[#6E5A46] mt-2">
                    Download Oak quiz results as an Excel spreadsheet for your records.
                  </p>

                  <div className="rounded-xl bg-[#F7F2E8] border border-[#E7DFD1] p-4 mt-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Current selection</p>
                    <p className="text-sm font-semibold text-[#2E342F] mt-1">
                      {selectedChild ? selectedChild.username : "All children"}
                    </p>
                    <p className="text-xs text-[#6E5A46] mt-1">
                      {period === "week" ? "This week" : period === "month" ? "This month" : "All time"}
                    </p>
                  </div>

                  <button
                    onClick={handleExportOak}
                    disabled={exporting}
                    className="w-full mt-5 px-5 py-3 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors disabled:opacity-50"
                  >
                    {exporting ? "Exporting..." : "Export Oak Results"}
                  </button>
                </div>

                <div className="brand-card p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Print</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Print Report</h2>
                  <p className="text-sm text-[#6E5A46] mt-2">
                    Print the current report view for a paper copy or save it as a PDF from your browser.
                  </p>

                  <div className="rounded-xl bg-[#F7F2E8] border border-[#E7DFD1] p-4 mt-5">
                    <p className="text-sm font-semibold text-[#2E342F]">Tip</p>
                    <p className="text-xs text-[#6E5A46] mt-1">
                      Choose Save as PDF in the print window if you want a digital copy.
                    </p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full mt-5 px-5 py-3 rounded-xl border border-[#3F5D46] text-[#3F5D46] bg-[#FFFDF8] text-sm font-bold hover:bg-[#F7F2E8] transition-colors"
                  >
                    Print Report
                  </button>
                </div>
              </div>
              </div>
            )}

            {/* Oak results */}
            {tab === "oak" && (() => {
              const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
              const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
              const days = (weekQuizScores?.days ?? []).filter(day => { const dow = parseISO(day.date).getDay(); return dow >= 1 && dow <= 5; });
              const totalPossible = weekQuizScores?.grand_total_possible ?? 0;
              const totalScore = weekQuizScores?.grand_total_score ?? 0;
              const totalPct = totalPossible > 0
                ? Math.round((totalScore / totalPossible) * 100)
                : 0;

              return (
                <div className="space-y-6">
                  <div className="brand-card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Oak National Academy</p>
                        <h2 className="text-xl font-bold text-[#2E342F] mt-1">Weekly Quiz Results</h2>
                        <p className="text-sm text-[#6E5A46] mt-1">
                          {format(weekStart, "d MMM")} to {format(weekEnd, "d MMM yyyy")}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-4xl font-bold text-[#3F5D46]">{totalPct}%</p>
                        <p className="text-sm font-semibold text-[#6E5A46] mt-1">
                          {totalScore} / {totalPossible} points
                        </p>
                      </div>
                    </div>

                    <div className="h-3 rounded-full bg-[#F0EADF] overflow-hidden mt-5">
                      <div
                        className="h-full rounded-full bg-[#8FA382]"
                        style={{ width: `${totalPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    {days.map(day => {
                      const dayPct = day.total_possible > 0
                        ? Math.round((day.total_score! / day.total_possible) * 100)
                        : 0;
                      const isToday = day.date === format(new Date(), "yyyy-MM-dd");

                      return (
                        <div
                          key={day.date}
                          className={`rounded-2xl border p-4 ${
                            isToday
                              ? "bg-[#3F5D46] border-[#3F5D46] text-white"
                              : "bg-[#FFFDF8] border-[#E7DFD1]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wide ${
                                isToday ? "text-white/70" : "text-[#8FA382]"
                              }`}>
                                {format(parseISO(day.date), "EEEE")}
                              </p>
                              <p className={`text-xs mt-1 ${
                                isToday ? "text-white/70" : "text-[#6E5A46]"
                              }`}>
                                {format(parseISO(day.date), "d MMM")}
                              </p>
                            </div>

                            <span className={`text-2xl font-bold ${
                              isToday ? "text-white" : "text-[#3F5D46]"
                            }`}>
                              {dayPct}%
                            </span>
                          </div>

                          <div className={`mt-3 pt-3 border-t ${
                            isToday ? "border-white/20" : "border-[#EEE6D9]"
                          }`}>
                            <p className={`text-xs font-semibold ${
                              isToday ? "text-white/75" : "text-[#6E5A46]"
                            }`}>
                              {day.completed}/{day.total} lessons
                            </p>

                            {day.total > 0 && (
                              <p className={`text-xs font-bold mt-1 ${
                                isToday ? "text-white/90" : "text-[#2E342F]"
                              }`}>
                                {day.total_score} / {day.total_possible} points
                              </p>
                            )}
                          </div>

                          <div className="space-y-3 mt-3">
                            {day.entries.map(entry => {
                              const ss = entry.starter_score;
                              const st = entry.starter_total;
                              const es = entry.exit_score;
                              const et = entry.exit_total;

                              return (
                                <div
                                  key={`${entry.entry_id}-${entry.child_id}`}
                                  className={`pt-3 border-t ${
                                    isToday ? "border-white/20" : "border-[#EEE6D9]"
                                  }`}
                                >
                                  <p className={`text-xs font-semibold ${
                                    isToday ? "text-white/90" : "text-[#2E342F]"
                                  }`}>
                                    {entry.lesson_title}
                                  </p>

                                  <div className="flex gap-2 flex-wrap mt-2">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                      isToday
                                        ? "bg-white/15 text-white"
                                        : "bg-[#F7F2E8] text-[#6E5A46]"
                                    }`}>
                                      Starter: {ss != null ? `${ss}/${st ?? 6}` : "No score"}
                                    </span>

                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                      isToday
                                        ? "bg-white/15 text-white"
                                        : "bg-[#F7F2E8] text-[#6E5A46]"
                                    }`}>
                                      Exit: {es != null ? `${es}/${et ?? 6}` : "No score"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {((tab === "home" && filtered.length === 0) || (tab === "attendance" && childEntries.length === 0)) && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-gray-500">No data for this period yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
