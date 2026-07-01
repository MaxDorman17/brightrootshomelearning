"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getCodingProgress, getChildren, getSpellingResults, getOakQuizResults, refreshOakQuizResults } from "@/lib/api";
import { PlannerEntry, Child, OakQuizResult } from "@/types";
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
  const [codingDone, setCodingDone] = useState(0);
  const [allSpellingResults, setAllSpellingResults] = useState<{id: number; child_id: number; week_start: string; score: number; total: number; wrong_words: string[]; taken_at: string}[]>([]);
  const [quizResults, setQuizResults] = useState<Record<string, OakQuizResult>>({});

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    const toMap = (rows: OakQuizResult[]) =>
      Object.fromEntries(rows.map(r => [r.url, r]));
    Promise.all([getAllEntries(), getCodingProgress(), getChildren(), getSpellingResults(), getOakQuizResults()]).then(([eRes, cRes, childRes, sRes, qRes]) => {
      setEntries(eRes.data);
      setCodingDone((cRes.data as string[]).length);
      setChildren(childRes.data);
      setAllSpellingResults(sRes.data);
      setQuizResults(toMap(qRes.data));
      setLoading(false);
    });
    // Fetch scores for any share links that aren't cached yet, then reload
    refreshOakQuizResults().then(res => {
      if (res.data.added > 0) {
        getOakQuizResults().then(qRes => setQuizResults(toMap(qRes.data)));
      }
    }).catch(() => {});
  }, [router]);

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

  const allSubmitted = childEntries.filter(e => e.completed_work_url);

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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedChild ? `${selectedChild.username}'s Report` : "Report"}
            </h1>
            <p className="text-gray-500 mt-1">Learning progress and analytics</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {children.length > 0 && (
              <div className="flex items-center gap-2 bg-white/80 border border-white/60 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="text-xs font-bold text-gray-500">Viewing:</span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                  className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All children</option>
                  {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                </select>
              </div>
            )}
            <button onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              🖨 Print
            </button>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex gap-2 mb-6">
          {(["week", "month", "all"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                period === p ? "bg-[#2F5D3A] text-white shadow-md" : "bg-white/80 backdrop-blur-sm border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"
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
                <p className="text-3xl font-bold text-[#2F5D3A]">{filtered.length}</p>
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
                <p className="text-3xl font-bold text-[#7A5C3E]">{totalSubmitted}</p>
                <p className="text-sm text-gray-500 mt-1">Work Submitted</p>
              </div>
            </div>

            {/* Coding card */}
            <div className="bg-[#F7F9F7] rounded-2xl border border-[#A8C67A]/40 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💻</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[#2F5D3A]">Coding Curriculum</h2>
                    <span className="text-sm font-bold text-[#6EA76E]">{codingDone} / {TOTAL_CODING} lessons</span>
                  </div>
                  <div className="w-full bg-[#A8C67A]/20 rounded-full h-2.5 mt-2">
                    <div className="bg-[#2F5D3A] h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.round((codingDone / TOTAL_CODING) * 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-3">
                {TRACKS.map(t => (
                  <div key={t.name} className="bg-white rounded-xl p-3 text-center border border-[#A8C67A]/20">
                    <p className="text-xs font-medium text-[#2F5D3A]">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.count} lessons</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance heatmap */}
            {childEntries.length > 0 && (
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
            {childEntries.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Weekly Trend (Last 8 Weeks)</h2>
                <div className="flex items-end justify-between gap-2 h-40">
                  {weeklyTrend.map((w, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-600">{w.pct > 0 ? `${w.pct}%` : ""}</span>
                      <div className="w-full flex flex-col justify-end" style={{ height: "100px" }}>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${w.pct === 100 ? "bg-gradient-to-t from-emerald-500 to-green-400" : w.pct >= 50 ? "bg-gradient-to-t from-[#2F5D3A] to-[#6EA76E]" : w.total === 0 ? "bg-gray-100" : "bg-gradient-to-t from-orange-400 to-yellow-300"}`}
                          style={{ height: `${w.total === 0 ? 4 : Math.max(4, w.pct)}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium leading-tight text-center">{w.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-500 to-green-400 inline-block" /><span className="text-xs text-gray-500">100%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#2F5D3A] to-[#6EA76E] inline-block" /><span className="text-xs text-gray-500">50%+</span></div>
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
                          <span className={`font-bold w-10 text-right ${s.pct === 100 ? "text-green-600" : s.pct >= 50 ? "text-[#6EA76E]" : "text-red-500"}`}>
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

            {/* Spelling scores */}
            {(() => {
              const spellingFiltered = allSpellingResults.filter(r =>
                selectedChildId ? r.child_id === selectedChildId : true
              );
              if (spellingFiltered.length === 0) return null;
              const byWeek: Record<string, typeof spellingFiltered> = {};
              spellingFiltered.forEach(r => {
                if (!byWeek[r.week_start]) byWeek[r.week_start] = [];
                byWeek[r.week_start].push(r);
              });
              const weeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a));
              return (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">🔤 Spelling Test Scores</h2>
                    <a href="/spellings" className="text-xs text-[#6EA76E] hover:text-[#2F5D3A] font-bold">Go to Spellings →</a>
                  </div>
                  <div className="space-y-3">
                    {weeks.map(week => (
                      <div key={week}>
                        <p className="text-xs font-bold text-gray-400 mb-1.5">Week of {format(new Date(week + "T12:00:00"), "d MMM yyyy")}</p>
                        <div className="space-y-1.5">
                          {byWeek[week].map(r => {
                            const pct = Math.round((r.score / r.total) * 100);
                            const child = children.find(c => c.id === r.child_id);
                            return (
                              <div key={r.id} className="flex items-center gap-3">
                                <div className="w-8 text-right">
                                  <span className={`text-xs font-extrabold ${pct === 100 ? "text-emerald-600" : pct >= 70 ? "text-[#6EA76E]" : "text-orange-500"}`}>
                                    {pct}%
                                  </span>
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={`h-2.5 rounded-full transition-all ${pct === 100 ? "bg-emerald-500" : pct >= 70 ? "bg-[#6EA76E]" : "bg-orange-400"}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-10 text-right shrink-0">{r.score}/{r.total}</span>
                                {!selectedChildId && child && (
                                  <span className="text-xs text-gray-400 font-semibold w-16 truncate shrink-0">{child.username}</span>
                                )}
                                {r.wrong_words.length > 0 && (
                                  <div className="flex gap-1 flex-wrap max-w-[35%]">
                                    {r.wrong_words.map((w, i) => (
                                      <span key={i} className="text-[10px] bg-red-50 text-red-500 border border-red-200 px-1 rounded font-semibold">{w}</span>
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
                        {(() => {
                          const shareUrl = e.completed_work_url!.match(OAK_SHARE_RE)?.[0];
                          const r = shareUrl ? quizResults[shareUrl] : undefined;
                          if (!r) return null;
                          return (
                            <div className="flex items-center gap-1.5 flex-wrap mt-1 mb-0.5">
                              {r.starter_total != null && r.starter_score != null && (
                                <QuizScoreBadge label="Starter quiz" score={r.starter_score} total={r.starter_total} />
                              )}
                              {r.exit_total != null && r.exit_score != null && (
                                <QuizScoreBadge label="Exit quiz" score={r.exit_score} total={r.exit_total} />
                              )}
                            </div>
                          );
                        })()}
                        <a href={e.completed_work_url!} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[#6EA76E] hover:underline break-all">{e.completed_work_url}</a>
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
