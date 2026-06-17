"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getCodingProgress } from "@/lib/api";
import { PlannerEntry } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, subWeeks, addDays, eachDayOfInterval } from "date-fns";

const TIMETABLE_SUBJECTS = [
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
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

export default function ReportPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("week");
  const [codingDone, setCodingDone] = useState(0);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    Promise.all([getAllEntries(), getCodingProgress()]).then(([eRes, cRes]) => {
      setEntries(eRes.data);
      setCodingDone((cRes.data as string[]).length);
      setLoading(false);
    });
  }, [router]);

  const filtered = entries.filter(e => {
    const d = parseISO(e.scheduled_date);
    const now = new Date();
    if (period === "week") return isWithinInterval(d, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
    if (period === "month") return isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) });
    return true;
  });

  const timetable = filtered.filter(e => TIMETABLE_SUBJECTS.includes(e.lesson.subject));
  const extra = filtered.filter(e => !TIMETABLE_SUBJECTS.includes(e.lesson.subject));
  const totalComplete = filtered.filter(e => e.is_complete).length;
  const totalSubmitted = filtered.filter(e => e.completed_work_url).length;
  const completionPct = filtered.length === 0 ? 0 : Math.round((totalComplete / filtered.length) * 100);

  const subjectStats = TIMETABLE_SUBJECTS.map(subject => {
    const s = timetable.filter(e => e.lesson.subject === subject);
    const done = s.filter(e => e.is_complete).length;
    return { subject, total: s.length, done, pct: s.length === 0 ? 0 : Math.round((done / s.length) * 100) };
  }).filter(s => s.total > 0).sort((a, b) => b.pct - a.pct);

  const allSubmitted = entries.filter(e => e.completed_work_url);

  // Attendance heatmap: last 16 weeks of school days
  const heatmapWeeks = Array.from({ length: 16 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 15 - i), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 4) }); // Mon–Fri only
  });
  const byDate: Record<string, PlannerEntry[]> = {};
  entries.forEach(e => {
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
    const weekEntries = entries.filter(e => {
      const d = parseISO(e.scheduled_date);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    });
    const done = weekEntries.filter(e => e.is_complete).length;
    const pct = weekEntries.length === 0 ? 0 : Math.round((done / weekEntries.length) * 100);
    return { label: format(weekStart, "d MMM"), total: weekEntries.length, done, pct };
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report</h1>
            <p className="text-gray-500 mt-1">Oscar&apos;s learning progress and analytics</p>
          </div>
          <button onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            🖨 Print
          </button>
        </div>

        {/* Period selector */}
        <div className="flex gap-2 mb-6">
          {(["week", "month", "all"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                period === p ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md" : "bg-white/80 backdrop-blur-sm border border-white/60 text-gray-600 hover:border-indigo-300 shadow-sm"
              }`}>
              {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-indigo-600">{filtered.length}</p>
                <p className="text-sm text-gray-500 mt-1">Lessons Assigned</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-green-600">{totalComplete}</p>
                <p className="text-sm text-gray-500 mt-1">Completed</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-blue-600">{completionPct}%</p>
                <p className="text-sm text-gray-500 mt-1">Completion Rate</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
                <p className="text-3xl font-bold text-purple-600">{totalSubmitted}</p>
                <p className="text-sm text-gray-500 mt-1">Work Submitted</p>
              </div>
            </div>

            {/* Coding card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💻</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-indigo-800">Coding Curriculum</h2>
                    <span className="text-sm font-bold text-indigo-600">{codingDone} / {TOTAL_CODING} lessons</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2.5 mt-2">
                    <div className="bg-indigo-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.round((codingDone / TOTAL_CODING) * 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-3">
                {TRACKS.map(t => (
                  <div key={t.name} className="bg-white/70 rounded-xl p-3 text-center">
                    <p className="text-xs font-medium text-indigo-700">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.count} lessons</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance heatmap */}
            {entries.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Attendance — Last 16 Weeks</h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-1.5 min-w-max">
                    {/* Day labels */}
                    <div className="flex flex-col gap-1.5 mr-1">
                      {["M", "T", "W", "T", "F"].map((d, i) => (
                        <div key={i} className="w-4 h-4 text-xs text-gray-400 font-bold flex items-center justify-center">{d}</div>
                      ))}
                    </div>
                    {heatmapWeeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1.5">
                        {week.map((day, di) => (
                          <div key={di} title={format(day, "d MMM yyyy")}
                            className={`w-4 h-4 rounded-sm transition-all ${heatmapColor(day)}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />All done</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />Partial</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />None done</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />No lessons</span>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly trend chart */}
            {entries.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Weekly Trend (Last 8 Weeks)</h2>
                <div className="flex items-end justify-between gap-2 h-40">
                  {weeklyTrend.map((w, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-600">{w.pct > 0 ? `${w.pct}%` : ""}</span>
                      <div className="w-full flex flex-col justify-end" style={{ height: "100px" }}>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${w.pct === 100 ? "bg-gradient-to-t from-emerald-500 to-green-400" : w.pct >= 50 ? "bg-gradient-to-t from-indigo-500 to-violet-400" : w.total === 0 ? "bg-gray-100" : "bg-gradient-to-t from-orange-400 to-yellow-300"}`}
                          style={{ height: `${w.total === 0 ? 4 : Math.max(4, w.pct)}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium leading-tight text-center">{w.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-500 to-green-400 inline-block" /><span className="text-xs text-gray-500">100%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-t from-indigo-500 to-violet-400 inline-block" /><span className="text-xs text-gray-500">50%+</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-t from-orange-400 to-yellow-300 inline-block" /><span className="text-xs text-gray-500">Under 50%</span></div>
                </div>
              </div>
            )}

            {/* Subject breakdown */}
            {subjectStats.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">By Subject</h2>
                <div className="space-y-4">
                  {subjectStats.map(s => (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${SUBJECT_COLOR[s.subject] || "bg-gray-400"}`} />
                          <span className="text-sm font-medium text-gray-700">{s.subject}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-400">{s.done}/{s.total}</span>
                          <span className={`font-bold w-10 text-right ${s.pct === 100 ? "text-green-600" : s.pct >= 50 ? "text-indigo-600" : "text-red-500"}`}>
                            {s.pct}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-300 ${SUBJECT_COLOR[s.subject] || "bg-gray-400"}`}
                          style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra work summary */}
            {extra.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Extra Work</h2>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{extra.length}</p>
                    <p className="text-xs text-gray-500">Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{extra.filter(e => e.is_complete).length}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-yellow-400 h-3 rounded-full transition-all"
                        style={{ width: `${extra.length === 0 ? 0 : Math.round((extra.filter(e => e.is_complete).length / extra.length) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {extra.length === 0 ? 0 : Math.round((extra.filter(e => e.is_complete).length / extra.length) * 100)}% complete
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submitted work */}
            {allSubmitted.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  All Submitted Work ({allSubmitted.length})
                </h2>
                <div className="space-y-3">
                  {allSubmitted.slice(0, 15).map(e => (
                    <div key={e.id} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${SUBJECT_COLOR[e.lesson.subject] || "bg-gray-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs font-medium text-gray-600">{e.lesson.subject}</span>
                          <span className="text-xs text-gray-400">{format(parseISO(e.scheduled_date), "d MMM yyyy")}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 truncate">{e.lesson.title}</p>
                        <a href={e.completed_work_url!} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-indigo-500 hover:underline break-all">{e.completed_work_url}</a>
                      </div>
                    </div>
                  ))}
                  {allSubmitted.length > 15 && (
                    <p className="text-xs text-gray-400 text-center pt-1">
                      Showing 15 of {allSubmitted.length} — visit Progress page for the full list.
                    </p>
                  )}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
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
