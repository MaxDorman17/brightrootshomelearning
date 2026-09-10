"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getAllMyEntries, getCodingProgress, getDaysOff, getChildren, getPolishSessions } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format, subDays } from "date-fns";

const SEEN_KEY = "seen_badges";

// CODING_KEY removed — progress is now fetched from the backend

// Track lesson IDs by track for badge checking
const SCRATCH_IDS  = ["s1","s2","s3","s4"];
const CODEORG_IDS  = ["c1","c2","c3","c4","c5"];
const PYTHON_IDS   = ["p1","p2","p3","p4","p5","p6","p7","p8"];
const WEB_IDS      = ["w1","w2","w3","w4","w5","w6"];

interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  check: (data: BadgeData) => boolean;
}

interface BadgeData {
  totalComplete: number;
  streak: number;
  submitted: number;
  coding: Set<string>;
  subjectCounts: Record<string, number>;
  polishSessions: number;
  polishStreak: number;
  polishXp: number;
}

const BADGES: Badge[] = [
  // --- Lesson milestones ---
  { id: "first",        icon: "🎯", title: "First Step!",          desc: "Completed your very first lesson",          color: "from-blue-400 to-blue-500",      check: d => d.totalComplete >= 1 },
  { id: "five",         icon: "⚡", title: "Getting Going",         desc: "Completed 5 lessons",                       color: "from-yellow-400 to-amber-500",    check: d => d.totalComplete >= 5 },
  { id: "ten",          icon: "💪", title: "Double Digits",         desc: "Completed 10 lessons",                      color: "from-orange-400 to-orange-500",   check: d => d.totalComplete >= 10 },
  { id: "twentyfive",   icon: "📚", title: "Bookworm",              desc: "Completed 25 lessons",                      color: "from-green-400 to-emerald-500",   check: d => d.totalComplete >= 25 },
  { id: "fifty",        icon: "🌟", title: "Star Pupil",            desc: "Completed 50 lessons",                      color: "from-[#2F5D3A] to-[#6EA76E]",    check: d => d.totalComplete >= 50 },
  { id: "hundred",      icon: "👑", title: "Century!",              desc: "Completed 100 lessons",                     color: "from-amber-400 to-yellow-500",    check: d => d.totalComplete >= 100 },
  { id: "seventy_five", icon: "🌈", title: "Three Quarters",        desc: "Completed 75 lessons",                      color: "from-violet-400 to-purple-500",   check: d => d.totalComplete >= 75 },
  { id: "one_fifty",    icon: "💎", title: "Diamond Student",       desc: "Completed 150 lessons",                     color: "from-cyan-400 to-blue-500",       check: d => d.totalComplete >= 150 },
  { id: "two_hun",      icon: "🦁", title: "Legend",                desc: "Completed 200 lessons",                     color: "from-rose-500 to-pink-600",       check: d => d.totalComplete >= 200 },

  // --- Streaks ---
  { id: "hat_trick",    icon: "🎩", title: "Hat Trick",             desc: "3-day learning streak",                     color: "from-pink-400 to-rose-500",       check: d => d.streak >= 3 },
  { id: "school_week",  icon: "🏆", title: "School Week",           desc: "Full 5-day streak",                         color: "from-[#F5B841] to-amber-500",     check: d => d.streak >= 5 },
  { id: "on_fire",      icon: "🔥", title: "On Fire!",              desc: "10-day learning streak",                    color: "from-red-500 to-orange-500",      check: d => d.streak >= 10 },
  { id: "fortnight",    icon: "🗓️", title: "Fortnight",            desc: "14-day learning streak",                    color: "from-purple-500 to-violet-600",   check: d => d.streak >= 14 },
  { id: "three_weeks",  icon: "🌙", title: "Three-Week Wonder",     desc: "21-day learning streak",                    color: "from-indigo-500 to-blue-600",     check: d => d.streak >= 21 },
  { id: "monthly",      icon: "🏰", title: "Month of Learning",     desc: "30-day learning streak",                    color: "from-[#7A5C3E] to-amber-700",     check: d => d.streak >= 30 },

  // --- Work submissions ---
  { id: "show_work",    icon: "📎", title: "Show Your Work",        desc: "Submitted your first piece of work",        color: "from-teal-400 to-cyan-500",       check: d => d.submitted >= 1 },
  { id: "five_sub",     icon: "📬", title: "Getting Noticed",       desc: "Submitted 5 pieces of work",               color: "from-sky-400 to-cyan-500",        check: d => d.submitted >= 5 },
  { id: "over_achieve", icon: "🏅", title: "Over-Achiever",         desc: "Submitted 10 pieces of work",              color: "from-blue-500 to-cyan-600",       check: d => d.submitted >= 10 },
  { id: "twenty_sub",   icon: "🎓", title: "Work Ethic",            desc: "Submitted 25 pieces of work",              color: "from-emerald-500 to-green-600",   check: d => d.submitted >= 25 },

  // --- Subject badges ---
  { id: "maths_star",   icon: "🔢", title: "Number Cruncher",       desc: "Completed 5 Maths lessons",                color: "from-blue-400 to-indigo-500",     check: d => (d.subjectCounts["Maths"] || 0) >= 5 },
  { id: "science_star", icon: "🔬", title: "Lab Rat",               desc: "Completed 5 Science lessons",              color: "from-lime-500 to-green-600",      check: d => (d.subjectCounts["Science"] || 0) >= 5 },
  { id: "english_star", icon: "✍️", title: "Word Smith",            desc: "Completed 5 English lessons",              color: "from-violet-400 to-purple-600",   check: d => (d.subjectCounts["English"] || 0) >= 5 },
  { id: "history_star", icon: "🏺", title: "History Buff",          desc: "Completed 5 History lessons",              color: "from-amber-600 to-yellow-700",    check: d => (d.subjectCounts["History"] || 0) >= 5 },
  { id: "geo_star",     icon: "🌍", title: "Explorer",              desc: "Completed 5 Geography lessons",            color: "from-teal-500 to-cyan-600",       check: d => (d.subjectCounts["Geography"] || 0) >= 5 },
  { id: "all_rounder",  icon: "🎨", title: "All Rounder",           desc: "Completed lessons in 5 different subjects", color: "from-fuchsia-500 to-pink-600",    check: d => Object.keys(d.subjectCounts).filter(s => d.subjectCounts[s] > 0).length >= 5 },

  // --- Coding ---
  { id: "hello_world",  icon: "💻", title: "Hello World!",          desc: "Completed your first coding lesson",        color: "from-gray-600 to-gray-800",       check: d => d.coding.size >= 1 },
  { id: "code_five",    icon: "🖥️", title: "Code Explorer",         desc: "Completed 5 coding lessons",               color: "from-slate-500 to-gray-700",      check: d => d.coding.size >= 5 },
  { id: "code_ten",     icon: "⚙️", title: "Code Builder",          desc: "Completed 10 coding lessons",              color: "from-zinc-600 to-slate-700",      check: d => d.coding.size >= 10 },
  { id: "scratch_star", icon: "🐱", title: "Scratch Star",          desc: "Completed all Scratch lessons",             color: "from-orange-400 to-amber-500",    check: d => SCRATCH_IDS.every(id => d.coding.has(id)) },
  { id: "codeorg",      icon: "🕹️", title: "Code.org Champion",    desc: "Completed all Hour of Code lessons",        color: "from-blue-400 to-blue-600",       check: d => CODEORG_IDS.every(id => d.coding.has(id)) },
  { id: "pythonista",   icon: "🐍", title: "Pythonista",            desc: "Completed all Python lessons",              color: "from-green-500 to-emerald-600",   check: d => PYTHON_IDS.every(id => d.coding.has(id)) },
  { id: "web_dev",      icon: "🌐", title: "Web Developer",         desc: "Completed all Web Dev lessons",             color: "from-[#6EA76E] to-[#2F5D3A]",    check: d => WEB_IDS.every(id => d.coding.has(id)) },
  { id: "full_coding",  icon: "🚀", title: "Future Coder",          desc: "Completed the entire coding curriculum",    color: "from-[#2F5D3A] to-[#7A5C3E]",    check: d => d.coding.size >= 23 },

  // --- Polish / Duolingo ---
  { id: "dzien_dobry",  icon: "🇵🇱", title: "Dzień Dobry!",          desc: "Logged your first Polish practice session",  color: "from-red-500 to-rose-600",         check: d => d.polishSessions >= 1 },
  { id: "polish_week",  icon: "🗣️", title: "Polska Week",            desc: "7-day Polish practice streak",              color: "from-red-600 to-red-700",          check: d => d.polishStreak >= 7 },
  { id: "polish_fort",  icon: "🌍", title: "Language Learner",       desc: "14-day Polish practice streak",             color: "from-rose-500 to-red-700",         check: d => d.polishStreak >= 14 },
  { id: "polish_month", icon: "🏅", title: "Miesiąc!",               desc: "30-day Polish practice streak",             color: "from-red-700 to-rose-900",         check: d => d.polishStreak >= 30 },
  { id: "polish_ten",   icon: "📖", title: "Getting Fluent",         desc: "Practiced Polish 10 times",                 color: "from-orange-400 to-red-500",       check: d => d.polishSessions >= 10 },
  { id: "polish_fifty", icon: "🎓", title: "Polyglot in Training",   desc: "Practiced Polish 50 times",                 color: "from-amber-500 to-red-600",        check: d => d.polishSessions >= 50 },
  { id: "xp_500",       icon: "⚡", title: "XP Hunter",              desc: "Earned 500 XP on Duolingo",                 color: "from-yellow-400 to-orange-500",    check: d => d.polishXp >= 500 },
  { id: "xp_1000",      icon: "💎", title: "XP Legend",              desc: "Earned 1,000 XP on Duolingo",              color: "from-amber-400 to-yellow-600",     check: d => d.polishXp >= 1000 },
];

function computePolishStreak(dates: Set<string>): number {
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  while (dates.has(format(check, "yyyy-MM-dd"))) {
    streak++;
    check = subDays(check, 1);
  }
  return streak;
}

function computeStreak(entries: PlannerEntry[], daysOff: Set<string> = new Set()): number {
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

export default function AchievementsPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [allEntries, setAllEntries] = useState<PlannerEntry[]>([]);
  const [coding, setCoding] = useState<Set<string>>(new Set());
  const [daysOff, setDaysOff] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [polishSessions, setPolishSessions] = useState<{ date: string; xp: number | null }[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    const r = getRole() || "";
    setRole(r);

    const entriesFetch = r === "parent" ? getAllEntries() : getAllMyEntries();
    Promise.all([entriesFetch, getCodingProgress(), getDaysOff(), getPolishSessions()]).then(([eRes, cRes, dRes, pRes]) => {
      setAllEntries(eRes.data);
      setCoding(new Set(cRes.data as string[]));
      setDaysOff(new Set((dRes.data as { date: string }[]).map(d => d.date)));
      setPolishSessions(pRes.data);
      setLoading(false);
    });
    if (r === "parent") {
      getChildren().then(res => setChildren(res.data)).catch(() => {});
    }
  }, [router]);

  useEffect(() => {
    if (role !== "parent" || !selectedChildId) return;
    getCodingProgress(selectedChildId).then(res => setCoding(new Set(res.data as string[]))).catch(() => {});
  }, [selectedChildId, role]);

  // Detect newly unlocked badges and show animation
  useEffect(() => {
    if (loading) return;
    const filtered = role === "parent" && selectedChildId
      ? allEntries.filter(e => e.assigned_to === selectedChildId || e.assigned_to === null)
      : allEntries;
    const totalComplete = filtered.filter(e => e.is_complete).length;
    const submitted = filtered.filter(e => e.completed_work_url).length;
    const streak = computeStreak(filtered, daysOff);
    const subjectCounts: Record<string, number> = {};
    filtered.filter(e => e.is_complete).forEach(e => {
      const s = e.lesson.subject;
      subjectCounts[s] = (subjectCounts[s] || 0) + 1;
    });
    const polishDates = new Set(polishSessions.map(s => s.date));
    const polishStreak = computePolishStreak(polishDates);
    const polishXp = polishSessions.reduce((sum, s) => sum + (s.xp ?? 0), 0);
    const data: BadgeData = { totalComplete, streak, submitted, coding, subjectCounts, polishSessions: polishSessions.length, polishStreak, polishXp };
    const earned = BADGES.filter(b => b.check(data)).map(b => b.id);

    const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    const fresh = earned.filter(id => !seen.includes(id));
    if (fresh.length > 0) {
      setNewlyUnlocked(fresh);
      localStorage.setItem(SEEN_KEY, JSON.stringify(earned));
      celebrateTimeout.current = setTimeout(() => setNewlyUnlocked([]), 4000);
    } else {
      localStorage.setItem(SEEN_KEY, JSON.stringify(earned));
    }
    return () => { if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current); };
  }, [loading, allEntries, coding, selectedChildId, polishSessions]); // eslint-disable-line react-hooks/exhaustive-deps

  const entries = role === "parent" && selectedChildId
    ? allEntries.filter(e => e.assigned_to === selectedChildId || e.assigned_to === null)
    : allEntries;

  const totalComplete = entries.filter(e => e.is_complete).length;
  const submitted = entries.filter(e => e.completed_work_url).length;
  const streak = computeStreak(entries, daysOff);
  const subjectCounts: Record<string, number> = {};
  entries.filter(e => e.is_complete).forEach(e => {
    const s = e.lesson.subject;
    subjectCounts[s] = (subjectCounts[s] || 0) + 1;
  });
  const polishDates = new Set(polishSessions.map(s => s.date));
  const polishStreak = computePolishStreak(polishDates);
  const polishXp = polishSessions.reduce((sum, s) => sum + (s.xp ?? 0), 0);
  const data: BadgeData = { totalComplete, streak, submitted, coding, subjectCounts, polishSessions: polishSessions.length, polishStreak, polishXp };
  const earned = BADGES.filter(b => b.check(data));
  const locked = BADGES.filter(b => !b.check(data));

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* New badge unlock banner */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed inset-x-0 top-16 z-40 flex justify-center px-4 pointer-events-none">
          <div className="relative bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white rounded-2xl px-6 py-4 shadow-2xl shadow-amber-300/60 pointer-events-auto max-w-sm w-full">
            {/* Confetti particles */}
            {["🌟","✨","🎉","⭐","🏆","💫"].map((emoji, i) => (
              <span key={i} className="confetti-particle text-xl"
                style={{ left: `${10 + i * 15}%`, top: "-8px", animationDelay: `${i * 0.1}s` }}>
                {emoji}
              </span>
            ))}
            <p className="text-lg font-extrabold text-center">🎉 New badge{newlyUnlocked.length > 1 ? "s" : ""} unlocked!</p>
            <div className="flex justify-center gap-3 mt-2 flex-wrap">
              {newlyUnlocked.map(id => {
                const b = BADGES.find(x => x.id === id);
                return b ? (
                  <span key={id} className="text-2xl" title={b.title}>{b.icon}</span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="brand-card p-6 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D88C64]">Progress</p>
            <h1 className="brand-heading text-3xl mt-1">Achievements</h1>
            <p className="text-[#6E5A46] mt-2 max-w-2xl">
              {role === "parent"
                ? "Celebrate learning milestones, streaks, badges and progress across every subject."
                : "Collect badges, build streaks and celebrate every milestone along the way."}
            </p>
          </div>
        </div>

{/* Child selector (parent only) */}
        {role === "parent" && children.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setSelectedChildId(null)}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${!selectedChildId ? "border-[#3F5D46] bg-[#3F5D46] text-white" : "border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] hover:border-[#8FA382]"}`}>
              All children
            </button>
            {children.map(c => (
              <button key={c.id} onClick={() => setSelectedChildId(c.id)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${selectedChildId === c.id ? "border-[#3F5D46] bg-[#3F5D46] text-white" : "border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] hover:border-[#8FA382]"}`}>
                {c.username}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
              {[
                { label: "Lessons Done", value: totalComplete, accent: "bg-[#3F5D46]" },
                { label: "Day Streak", value: streak, accent: "bg-[#D88C64]" },
                { label: "Work Submitted", value: submitted, accent: "bg-[#8FA382]" },
                { label: "Coding Lessons", value: coding.size, accent: "bg-[#E3B554]" },
              ].map(s => (
                <div key={s.label} className="brand-card p-4">
                  <div className={`mb-3 h-1.5 w-10 rounded-full ${s.accent}`} />
                  <p className="text-2xl font-extrabold text-[#2E342F]">{s.value}</p>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#6E5A46]">{s.label}</p>
                </div>
              ))}
            </div>{/* Polish stats strip */}
            {polishSessions.length > 0 && (
              <div className="brand-card p-5 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5E4DA] text-xl">
                    {"\uD83C\uDDF5\uD83C\uDDF1"}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D88C64]">Language Learning</p>
                    <p className="mt-1 font-extrabold text-[#2E342F]">Polish with Duolingo</p>
                    <p className="mt-1 text-sm font-semibold text-[#6E5A46]">
                      {polishSessions.length} session{polishSessions.length !== 1 ? "s" : ""}
                      {polishStreak > 0 ? ` \u00B7 ${polishStreak}-day streak` : ""}
                      {polishXp > 0 ? ` \u00B7 ${polishXp} XP` : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Streak bar */}
            {streak > 0 && (
              <div className="brand-card p-5 mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5E4DA] text-2xl">
                    {"\uD83D\uDD25"}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D88C64]">Learning Streak</p>
                    <p className="mt-1 text-lg font-extrabold text-[#2E342F]">{streak}-day streak</p>
                    <p className="mt-1 text-sm font-semibold text-[#6E5A46]">
                      {streak >= 10 ? "Incredible, over two weeks!" : streak >= 5 ? "A full school week, amazing!" : streak >= 3 ? "Hat trick unlocked!" : "Keep it going!"}
                    </p>
                  </div>
                  <div className="flex gap-1 sm:ml-auto">
                    {Array.from({ length: Math.min(streak, 10) }, (_, i) => (
                      <div key={i} className="h-8 w-2.5 rounded-full bg-[#D88C64]" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Earned badges */}
            {earned.length > 0 && (
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D88C64]">Badge Collection</p>
                    <h2 className="mt-1 text-lg font-extrabold text-[#2E342F]">Earned achievements</h2>
                  </div>
                  <span className="rounded-full bg-[#E5ECE2] px-3 py-1 text-xs font-bold text-[#3F5D46]">
                    {earned.length}/{BADGES.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {earned.map(b => (
                    <div
                      key={b.id}
                      className={`brand-card p-4 text-center transition-all ${
                        newlyUnlocked.includes(b.id)
                          ? "ring-2 ring-[#E3B554] ring-offset-2"
                          : ""
                      }`}
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F2E8] text-3xl">
                        {b.icon}
                      </div>
                      <p className="text-sm font-extrabold leading-tight text-[#2E342F]">{b.title}</p>
                      <p className="mt-1 text-xs leading-snug text-[#6E5A46]">{b.desc}</p>
                      {newlyUnlocked.includes(b.id) && (
                        <p className="mt-3 rounded-full bg-[#FFF3D6] px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#9A6A1E]">
                          New
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked badges */}
            {locked.length > 0 && (
              <div>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8A7A69]">Still to unlock</p>
                  <h2 className="mt-1 text-lg font-extrabold text-[#2E342F]">Keep going</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {locked.map(b => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-dashed border-[#D8D1C4] bg-[#FFFDF8]/70 p-4 text-center"
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFE9DF] text-3xl grayscale opacity-50">
                        {b.icon}
                      </div>
                      <p className="text-sm font-extrabold leading-tight text-[#6E5A46]">{b.title}</p>
                      <p className="mt-1 text-xs leading-snug text-[#9A8B7C]">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}







