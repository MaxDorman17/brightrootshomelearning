"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getAllMyEntries, getCodingProgress, getDaysOff, getChildren } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

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
];

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

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    const r = getRole() || "";
    setRole(r);

    const entriesFetch = r === "parent" ? getAllEntries() : getAllMyEntries();
    Promise.all([entriesFetch, getCodingProgress(), getDaysOff()]).then(([eRes, cRes, dRes]) => {
      setAllEntries(eRes.data);
      setCoding(new Set(cRes.data as string[]));
      setDaysOff(new Set((dRes.data as { date: string }[]).map(d => d.date)));
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
    const data: BadgeData = { totalComplete, streak, submitted, coding, subjectCounts };
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
  }, [loading, allEntries, coding, selectedChildId]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const data: BadgeData = { totalComplete, streak, submitted, coding, subjectCounts };
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
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">🏆 Achievements</h1>
          <p className="text-gray-500 font-medium mt-1">
            {role === "parent" ? "Badges and learning milestones" : "Your badges and milestones — keep going!"}
          </p>
        </div>

        {/* Child selector (parent only) */}
        {role === "parent" && children.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setSelectedChildId(null)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${!selectedChildId ? "bg-[#2F5D3A] text-white shadow-md" : "bg-white/80 border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"}`}>
              All children
            </button>
            {children.map(c => (
              <button key={c.id} onClick={() => setSelectedChildId(c.id)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${selectedChildId === c.id ? "bg-[#2F5D3A] text-white shadow-md" : "bg-white/80 border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"}`}>
                {c.username}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#2F5D3A] to-[#6EA76E] rounded-2xl p-5 text-white shadow-lg shadow-green-900/20 text-center">
                <p className="text-3xl font-extrabold">{totalComplete}</p>
                <p className="text-xs text-white/80 font-bold mt-1">Lessons Done</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-300/40 text-center">
                <p className="text-3xl font-extrabold">{streak}</p>
                <p className="text-xs text-white/80 font-bold mt-1">Day Streak 🔥</p>
              </div>
              <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl p-5 text-white shadow-lg shadow-teal-300/40 text-center">
                <p className="text-3xl font-extrabold">{submitted}</p>
                <p className="text-xs text-white/80 font-bold mt-1">Work Submitted</p>
              </div>
              <div className="bg-gradient-to-br from-[#F5B841] to-amber-500 rounded-2xl p-5 text-white shadow-lg shadow-yellow-400/30 text-center">
                <p className="text-3xl font-extrabold">{coding.size}</p>
                <p className="text-xs text-white/80 font-bold mt-1">Coding Lessons</p>
              </div>
            </div>

            {/* Streak bar */}
            {streak > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
                <div className="text-4xl">{streak >= 10 ? "🔥" : streak >= 5 ? "🏆" : streak >= 3 ? "⚡" : "✨"}</div>
                <div>
                  <p className="font-extrabold text-orange-800 text-lg">{streak}-day streak!</p>
                  <p className="text-orange-600 text-sm font-semibold">
                    {streak >= 10 ? "Incredible — over two weeks!" : streak >= 5 ? "A full school week — amazing!" : streak >= 3 ? "Hat trick unlocked!" : "Keep it going!"}
                  </p>
                </div>
                <div className="ml-auto flex gap-1">
                  {Array.from({ length: Math.min(streak, 10) }, (_, i) => (
                    <div key={i} className="w-3 h-8 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-sm shadow-sm" />
                  ))}
                </div>
              </div>
            )}

            {/* Earned badges */}
            {earned.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4">
                  Earned ({earned.length}/{BADGES.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {earned.map(b => (
                    <div key={b.id}
                      className={`bg-gradient-to-br ${b.color} rounded-2xl p-4 text-white shadow-lg text-center transition-all ${
                        newlyUnlocked.includes(b.id)
                          ? "ring-4 ring-yellow-300 ring-offset-2 scale-105 shadow-2xl"
                          : ""
                      }`}>
                      <p className="text-4xl mb-2">{b.icon}</p>
                      <p className="font-extrabold text-sm leading-tight">{b.title}</p>
                      <p className="text-xs text-white/75 mt-1 leading-snug">{b.desc}</p>
                      {newlyUnlocked.includes(b.id) && (
                        <p className="text-xs font-extrabold mt-2 bg-white/25 rounded-lg py-0.5">NEW! 🎉</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked badges */}
            {locked.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4">
                  Locked — keep going!
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {locked.map(b => (
                    <div key={b.id}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-dashed border-gray-200 opacity-60">
                      <p className="text-4xl mb-2 grayscale">{b.icon}</p>
                      <p className="font-bold text-sm text-gray-600 leading-tight">{b.title}</p>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">{b.desc}</p>
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
