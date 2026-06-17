"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getRole, getUsername } from "@/lib/auth";
import { getWeekEntries, getAllEntries, getCodingProgress, getSpellingResults, getChildren } from "@/lib/api";
import { PlannerEntry } from "@/types";
import Navbar from "@/components/Navbar";
import { format, startOfWeek, addDays, parseISO, isAfter, startOfDay } from "date-fns";

const TOTAL_CODING = 23;

const TIMETABLE_SUBJECTS = new Set([
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
]);

const QUICK_LINKS = [
  { href: "/parent", label: "Planner", icon: "📅", desc: "Weekly timetable", from: "from-[#2F5D3A]", to: "to-[#6EA76E]" },
  { href: "/parent/extra-work", label: "Extra Work", icon: "📋", desc: "Projects & tasks", from: "from-amber-500", to: "to-orange-500" },
  { href: "/coding", label: "Coding", icon: "💻", desc: "Coding curriculum", from: "from-emerald-500", to: "to-teal-500" },
  { href: "/parent/report", label: "Report", icon: "📈", desc: "Analytics", from: "from-blue-500", to: "to-cyan-500" },
  { href: "/parent/progress", label: "Progress", icon: "📊", desc: "Submitted work", from: "from-pink-500", to: "to-rose-500" },
];

export default function ParentDashboardPage() {
  const router = useRouter();
  const [weekEntries, setWeekEntries] = useState<PlannerEntry[]>([]);
  const [allEntries, setAllEntries] = useState<PlannerEntry[]>([]);
  const [codingDone, setCodingDone] = useState(0);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("Max");
  const [spellingResults, setSpellingResults] = useState<{id: number; child_id: number; score: number; total: number; taken_at: string}[]>([]);
  const [dashChildren, setDashChildren] = useState<{id: number; username: string}[]>([]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    setParentName(getUsername() || "Max");
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    Promise.all([
      getWeekEntries(weekStartStr),
      getAllEntries(),
      getCodingProgress(),
      getSpellingResults({ week_start: weekStartStr }),
      getChildren(),
    ]).then(([wRes, aRes, cRes, sRes, kidRes]) => {
      setWeekEntries(wRes.data);
      setAllEntries(aRes.data);
      setCodingDone((cRes.data as string[]).length);
      setSpellingResults(sRes.data);
      setDashChildren(kidRes.data);
      setLoading(false);
    });
  }, [router]);

  const weekComplete = weekEntries.filter(e => e.is_complete).length;
  const weekTotal = weekEntries.length;
  const weekPct = weekTotal === 0 ? 0 : Math.round((weekComplete / weekTotal) * 100);
  const totalSubmitted = allEntries.filter(e => e.completed_work_url).length;
  const today = format(new Date(), "yyyy-MM-dd");
  const todayEntries = weekEntries.filter(e => e.scheduled_date === today);
  const todayDone = todayEntries.filter(e => e.is_complete).length;
  const recentSubmissions = allEntries.filter(e => e.completed_work_url).slice(0, 5);

  // Upcoming extra work due in next 7 days
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const in7 = format(addDays(new Date(), 7), "yyyy-MM-dd");
  const upcomingDue = allEntries
    .filter(e =>
      !TIMETABLE_SUBJECTS.has(e.lesson.subject) &&
      !e.is_complete &&
      e.scheduled_date >= todayStr &&
      e.scheduled_date <= in7
    )
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
    .slice(0, 5);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekLabel = `${format(weekStart, "d MMM")} – ${format(addDays(weekStart, 4), "d MMM")}`;

  const statCards = [
    { label: "Lessons This Week", value: loading ? "—" : weekTotal, icon: "📚", from: "from-[#2F5D3A]", to: "to-[#6EA76E]", shadow: "shadow-green-900/20" },
    { label: "Completed", value: loading ? "—" : weekComplete, icon: "✅", from: "from-emerald-400", to: "to-teal-500", shadow: "shadow-emerald-300/50" },
    { label: "Week Progress", value: loading ? "—" : `${weekPct}%`, icon: "📈", from: "from-[#F5B841]", to: "to-amber-500", shadow: "shadow-yellow-400/30" },
    { label: "Work Submitted", value: loading ? "—" : totalSubmitted, icon: "📎", from: "from-orange-400", to: "to-pink-500", shadow: "shadow-orange-300/50" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome back, {parentName}! 👋
          </h1>
          <p className="text-gray-500 font-medium mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map(c => (
            <div key={c.label} className={`bg-gradient-to-br ${c.from} ${c.to} rounded-2xl p-5 text-white shadow-lg ${c.shadow}`}>
              <p className="text-3xl mb-2">{c.icon}</p>
              <p className="text-3xl font-extrabold">{c.value}</p>
              <p className="text-sm text-white/80 font-semibold mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Week progress bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-gray-700">Week of {weekLabel}</span>
            <span className="text-[#2F5D3A] font-extrabold">{weekComplete} / {weekTotal}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#2F5D3A] to-[#6EA76E] h-4 rounded-full transition-all duration-700 shadow-inner"
              style={{ width: `${weekPct}%` }} />
          </div>
          {weekTotal > 0 && weekComplete === weekTotal && (
            <p className="text-emerald-600 text-sm font-bold mt-2 text-center">Perfect week — all done! 🎉</p>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-6">
          {/* Today's lessons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wide">Today — {format(new Date(), "EEEE")}</h2>
              {todayEntries.length > 0 && (
                <span className="text-xs font-bold text-[#2F5D3A]">{todayDone}/{todayEntries.length}</span>
              )}
            </div>
            {loading ? <p className="text-sm text-gray-400">Loading…</p>
              : todayEntries.length === 0 ? <p className="text-sm text-gray-400">No lessons today.</p>
              : (
                <div className="space-y-2">
                  {todayEntries.map(e => (
                    <div key={e.id} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${e.is_complete ? "bg-emerald-500" : "bg-gray-200"}`}>
                        {e.is_complete && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </span>
                      <span className={`text-xs font-semibold ${e.is_complete ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {e.lesson.subject}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Coding progress */}
          <div className="bg-[#F7F9F7] rounded-2xl border border-[#A8C67A]/40 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-[#2F5D3A] mb-1">💻 Coding Progress</h2>
            <p className="text-xs text-[#6EA76E] font-semibold mb-4">{codingDone} of {TOTAL_CODING} lessons</p>
            <div className="w-full bg-[#A8C67A]/20 rounded-full h-3 mb-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2F5D3A] to-[#6EA76E] h-3 rounded-full transition-all"
                style={{ width: `${Math.round((codingDone / TOTAL_CODING) * 100)}%` }} />
            </div>
            <p className="text-2xl font-extrabold text-[#2F5D3A]">
              {Math.round((codingDone / TOTAL_CODING) * 100)}%
            </p>
            <Link href="/coding" className="text-xs text-[#6EA76E] hover:text-[#2F5D3A] font-bold mt-2 block">View curriculum →</Link>
          </div>

          {/* Recent submissions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wide mb-3">Recent Work</h2>
            {loading ? <p className="text-sm text-gray-400">Loading…</p>
              : recentSubmissions.length === 0 ? <p className="text-sm text-gray-400">No work submitted yet.</p>
              : (
                <div className="space-y-2.5">
                  {recentSubmissions.map(e => (
                    <div key={e.id}>
                      <p className="text-xs text-gray-400 font-semibold">{e.lesson.subject} · {format(parseISO(e.scheduled_date), "d MMM")}</p>
                      <a href={e.completed_work_url!} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#2F5D3A] hover:underline font-bold line-clamp-1">{e.lesson.title}</a>
                    </div>
                  ))}
                  <Link href="/parent/progress" className="text-xs text-[#6EA76E] hover:text-[#2F5D3A] font-bold pt-1 block">View all →</Link>
                </div>
              )}
          </div>

          {/* Upcoming due dates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wide mb-3">Due This Week</h2>
            {loading ? <p className="text-sm text-gray-400">Loading…</p>
              : upcomingDue.length === 0 ? <p className="text-sm text-gray-400">No extra work due soon.</p>
              : (
                <div className="space-y-2.5">
                  {upcomingDue.map(e => {
                    const isToday = e.scheduled_date === todayStr;
                    const overdue = isAfter(startOfDay(new Date()), parseISO(e.scheduled_date));
                    return (
                      <div key={e.id} className="flex items-start gap-2">
                        <span className={`mt-0.5 text-xs font-extrabold shrink-0 ${overdue ? "text-red-500" : isToday ? "text-orange-500" : "text-gray-400"}`}>
                          {format(parseISO(e.scheduled_date), "d MMM")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">{e.lesson.title}</p>
                          <p className="text-xs text-gray-400">{e.lesson.subject}</p>
                        </div>
                        {overdue && <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 rounded-full shrink-0">!</span>}
                      </div>
                    );
                  })}
                  <Link href="/parent/extra-work" className="text-xs text-[#6EA76E] hover:text-[#2F5D3A] font-bold pt-1 block">Manage →</Link>
                </div>
              )}
          </div>
        </div>

        {/* Spellings this week */}
        {!loading && spellingResults.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wide">🔤 Spelling Results — This Week</h2>
              <Link href="/spellings" className="text-xs text-[#6EA76E] hover:text-[#2F5D3A] font-bold">Practice →</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {spellingResults.map(r => {
                const pct = Math.round((r.score / r.total) * 100);
                const child = dashChildren.find(c => c.id === r.child_id);
                return (
                  <div key={r.id} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border ${pct === 100 ? "bg-emerald-50 border-emerald-200" : pct >= 70 ? "bg-[#A8C67A]/15 border-[#A8C67A]/40" : "bg-orange-50 border-orange-200"}`}>
                    <span className={`text-xl font-extrabold ${pct === 100 ? "text-emerald-600" : pct >= 70 ? "text-[#2F5D3A]" : "text-orange-500"}`}>
                      {r.score}/{r.total}
                    </span>
                    {child && <span className="text-xs text-gray-500 font-semibold">{child.username}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {QUICK_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`bg-gradient-to-br ${l.from} ${l.to} rounded-2xl p-4 text-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all active:scale-100`}>
              <p className="text-2xl mb-2">{l.icon}</p>
              <p className="font-extrabold text-sm">{l.label}</p>
              <p className="text-xs text-white/75 font-semibold mt-0.5">{l.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
