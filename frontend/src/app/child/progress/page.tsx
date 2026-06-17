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

  const todayEntries = entries.filter(e => e.scheduled_date === today);
  const todayDone = todayEntries.filter(e => e.is_complete).length;
  const todayTotal = todayEntries.length;

  const statCards = [
    { label: "Lessons done", value: allDone, icon: "📚", color: "from-[#2F5D3A] to-[#6EA76E]", shadow: "shadow-green-900/20" },
    { label: "Day streak", value: streak, icon: "🔥", color: "from-orange-400 to-red-500", shadow: "shadow-orange-300/40" },
    { label: "Work submitted", value: submitted, icon: "📎", color: "from-teal-400 to-cyan-500", shadow: "shadow-teal-300/40" },
    { label: "Coding lessons", value: coding.size, icon: "💻", color: "from-[#F5B841] to-amber-500", shadow: "shadow-yellow-400/30" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#2F5D3A]">My Progress</h1>
          <p className="text-gray-500 mt-1">Hi {username}, here&apos;s how you&apos;re doing!</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {statCards.map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg ${s.shadow} text-center`}>
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="text-3xl font-extrabold">{s.value}</p>
                  <p className="text-xs text-white/80 font-bold mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* This week */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#A8C67A]/30 p-5 mb-4">
              <h2 className="font-extrabold text-gray-800 mb-4">This week</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Lessons progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">Lessons</p>
                    <p className="text-sm font-extrabold text-[#2F5D3A]">{weekDone}/{weekTotal}</p>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#2F5D3A] to-[#6EA76E] rounded-full transition-all duration-500"
                      style={{ width: `${weekPct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{weekPct}% complete</p>
                </div>
                {/* Today */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">Today</p>
                    <p className="text-sm font-extrabold text-[#2F5D3A]">{todayDone}/{todayTotal}</p>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#F5B841] to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {todayTotal === 0 ? "Nothing scheduled" : todayDone === todayTotal ? "All done! 🎉" : `${todayTotal - todayDone} to go`}
                  </p>
                </div>
              </div>
            </div>

            {/* Goals + Reading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Weekly goals */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#A8C67A]/30 p-5">
                <h2 className="font-extrabold text-gray-800 mb-3">This week&apos;s goals</h2>
                {goalsTotal === 0 ? (
                  <p className="text-sm text-gray-400">No goals set yet</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-3">
                      {goals.map(g => (
                        <div key={g.id} className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 ${g.is_complete ? "bg-[#2F5D3A] border-[#2F5D3A] text-white" : "border-gray-300"}`}>
                            {g.is_complete ? "✓" : ""}
                          </span>
                          <span className={`text-sm font-medium ${g.is_complete ? "line-through text-gray-400" : "text-gray-700"}`}>{g.title}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#2F5D3A] font-bold">{goalsDone}/{goalsTotal} complete</p>
                  </>
                )}
              </div>

              {/* Reading */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#A8C67A]/30 p-5">
                <h2 className="font-extrabold text-gray-800 mb-3">Reading</h2>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-blue-600">{booksReading}</p>
                    <p className="text-xs text-gray-500 font-semibold">Reading now</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-emerald-600">{booksFinished}</p>
                    <p className="text-xs text-gray-500 font-semibold">Finished</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak banner */}
            {streak > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="text-4xl">{streak >= 10 ? "🔥" : streak >= 5 ? "🏆" : "⚡"}</div>
                <div>
                  <p className="font-extrabold text-orange-800 text-lg">{streak}-day streak!</p>
                  <p className="text-orange-600 text-sm font-semibold">
                    {streak >= 10 ? "Incredible — over two weeks!" : streak >= 5 ? "A full school week!" : "Keep it up!"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
