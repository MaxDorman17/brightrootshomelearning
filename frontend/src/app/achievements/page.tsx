"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getAllMyEntries, getCodingProgress, getDaysOff, getChildren, getLanguageSummary, LanguageSummary } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import RewardsTabs from "@/components/RewardsTabs";
import { format } from "date-fns";
import Emoji from "@/components/Emoji";
import FamilyBadges from "@/components/FamilyBadges";

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
  category?: "Lessons" | "Streaks" | "Work" | "Subjects" | "Coding" | "Languages";
  check: (data: BadgeData) => boolean;
}

interface BadgeData {
  totalComplete: number;
  streak: number;
  submitted: number;
  coding: Set<string>;
  subjectCounts: Record<string, number>;
  languageDays: number;
  languageBestStreak: number;
  languageXp: number;
  languageMinutes: number;
  languageCount: number;
}

const BADGES: Badge[] = [
  // --- Lesson milestones ---
  { category: "Lessons", id: "first",        icon: "🎯", title: "First Step!",          desc: "Completed your very first lesson",          color: "from-blue-400 to-blue-500",      check: d => d.totalComplete >= 1 },
  { category: "Lessons", id: "five",         icon: "⚡", title: "Getting Going",         desc: "Completed 5 lessons",                       color: "from-yellow-400 to-amber-500",    check: d => d.totalComplete >= 5 },
  { category: "Lessons", id: "ten",          icon: "💪", title: "Double Digits",         desc: "Completed 10 lessons",                      color: "from-orange-400 to-orange-500",   check: d => d.totalComplete >= 10 },
  { category: "Lessons", id: "twentyfive",   icon: "📚", title: "Bookworm",              desc: "Completed 25 lessons",                      color: "from-green-400 to-emerald-500",   check: d => d.totalComplete >= 25 },
  { category: "Lessons", id: "fifty",        icon: "🌟", title: "Star Pupil",            desc: "Completed 50 lessons",                      color: "from-brand-deep to-brand-leaf",    check: d => d.totalComplete >= 50 },
  { category: "Lessons", id: "hundred",      icon: "👑", title: "Century!",              desc: "Completed 100 lessons",                     color: "from-amber-400 to-yellow-500",    check: d => d.totalComplete >= 100 },
  { category: "Lessons", id: "seventy_five", icon: "🌈", title: "Three Quarters",        desc: "Completed 75 lessons",                      color: "from-violet-400 to-purple-500",   check: d => d.totalComplete >= 75 },
  { category: "Lessons", id: "one_fifty",    icon: "💎", title: "Diamond Student",       desc: "Completed 150 lessons",                     color: "from-cyan-400 to-blue-500",       check: d => d.totalComplete >= 150 },
  { category: "Lessons", id: "two_hun",      icon: "🦁", title: "Legend",                desc: "Completed 200 lessons",                     color: "from-rose-500 to-pink-600",       check: d => d.totalComplete >= 200 },

  // --- Streaks ---
  { category: "Streaks", id: "hat_trick",    icon: "🎩", title: "Hat Trick",             desc: "3-day learning streak",                     color: "from-pink-400 to-rose-500",       check: d => d.streak >= 3 },
  { category: "Streaks", id: "school_week",  icon: "🏆", title: "School Week",           desc: "Full 5-day streak",                         color: "from-[#F5B841] to-amber-500",     check: d => d.streak >= 5 },
  { category: "Streaks", id: "on_fire",      icon: "🔥", title: "On Fire!",              desc: "10-day learning streak",                    color: "from-red-500 to-orange-500",      check: d => d.streak >= 10 },
  { category: "Streaks", id: "fortnight",    icon: "🗓️", title: "Fortnight",            desc: "14-day learning streak",                    color: "from-purple-500 to-violet-600",   check: d => d.streak >= 14 },
  { category: "Streaks", id: "three_weeks",  icon: "🌙", title: "Three-Week Wonder",     desc: "21-day learning streak",                    color: "from-indigo-500 to-blue-600",     check: d => d.streak >= 21 },
  { category: "Streaks", id: "monthly",      icon: "🏰", title: "Month of Learning",     desc: "30-day learning streak",                    color: "from-[#7A5C3E] to-amber-700",     check: d => d.streak >= 30 },

  // --- Work submissions ---
  { category: "Work", id: "show_work",    icon: "📎", title: "Show Your Work",        desc: "Submitted your first piece of work",        color: "from-teal-400 to-cyan-500",       check: d => d.submitted >= 1 },
  { category: "Work", id: "five_sub",     icon: "📬", title: "Getting Noticed",       desc: "Submitted 5 pieces of work",               color: "from-sky-400 to-cyan-500",        check: d => d.submitted >= 5 },
  { category: "Work", id: "over_achieve", icon: "🏅", title: "Over-Achiever",         desc: "Submitted 10 pieces of work",              color: "from-blue-500 to-cyan-600",       check: d => d.submitted >= 10 },
  { category: "Work", id: "twenty_sub",   icon: "🎓", title: "Work Ethic",            desc: "Submitted 25 pieces of work",              color: "from-emerald-500 to-green-600",   check: d => d.submitted >= 25 },

  // --- Subject badges ---
  { category: "Subjects", id: "maths_star",   icon: "🔢", title: "Number Cruncher",       desc: "Completed 5 Maths lessons",                color: "from-blue-400 to-indigo-500",     check: d => (d.subjectCounts["Maths"] || 0) >= 5 },
  { category: "Subjects", id: "science_star", icon: "🔬", title: "Lab Rat",               desc: "Completed 5 Science lessons",              color: "from-lime-500 to-green-600",      check: d => (d.subjectCounts["Science"] || 0) >= 5 },
  { category: "Subjects", id: "english_star", icon: "✍️", title: "Word Smith",            desc: "Completed 5 English lessons",              color: "from-violet-400 to-purple-600",   check: d => (d.subjectCounts["English"] || 0) >= 5 },
  { category: "Subjects", id: "history_star", icon: "🏺", title: "History Buff",          desc: "Completed 5 History lessons",              color: "from-amber-600 to-yellow-700",    check: d => (d.subjectCounts["History"] || 0) >= 5 },
  { category: "Subjects", id: "geo_star",     icon: "🌍", title: "Explorer",              desc: "Completed 5 Geography lessons",            color: "from-teal-500 to-cyan-600",       check: d => (d.subjectCounts["Geography"] || 0) >= 5 },
  { category: "Subjects", id: "all_rounder",  icon: "🎨", title: "All Rounder",           desc: "Completed lessons in 5 different subjects", color: "from-fuchsia-500 to-pink-600",    check: d => Object.keys(d.subjectCounts).filter(s => d.subjectCounts[s] > 0).length >= 5 },

  // --- Coding ---
  { category: "Coding", id: "hello_world",  icon: "💻", title: "Hello World!",          desc: "Completed your first coding lesson",        color: "from-gray-600 to-gray-800",       check: d => d.coding.size >= 1 },
  { category: "Coding", id: "code_five",    icon: "🖥️", title: "Code Explorer",         desc: "Completed 5 coding lessons",               color: "from-slate-500 to-gray-700",      check: d => d.coding.size >= 5 },
  { category: "Coding", id: "code_ten",     icon: "⚙️", title: "Code Builder",          desc: "Completed 10 coding lessons",              color: "from-zinc-600 to-slate-700",      check: d => d.coding.size >= 10 },
  { category: "Coding", id: "scratch_star", icon: "🐱", title: "Scratch Star",          desc: "Completed all Scratch lessons",             color: "from-orange-400 to-amber-500",    check: d => SCRATCH_IDS.every(id => d.coding.has(id)) },
  { category: "Coding", id: "codeorg",      icon: "🕹️", title: "Code.org Champion",    desc: "Completed all Hour of Code lessons",        color: "from-blue-400 to-blue-600",       check: d => CODEORG_IDS.every(id => d.coding.has(id)) },
  { category: "Coding", id: "pythonista",   icon: "🐍", title: "Pythonista",            desc: "Completed all Python lessons",              color: "from-green-500 to-emerald-600",   check: d => PYTHON_IDS.every(id => d.coding.has(id)) },
  { category: "Coding", id: "web_dev",      icon: "🌐", title: "Web Developer",         desc: "Completed all Web Dev lessons",             color: "from-brand-leaf to-brand-deep",    check: d => WEB_IDS.every(id => d.coding.has(id)) },
  { category: "Coding", id: "full_coding",  icon: "🚀", title: "Future Coder",          desc: "Completed the entire coding curriculum",    color: "from-brand-deep to-[#7A5C3E]",    check: d => d.coding.size >= 23 },

  // --- Languages (any language, from the Languages page) ---
  { category: "Languages", id: "lang_first",     icon: "🗣️", title: "First Words",          desc: "Logged your first language practice",        color: "from-sky-400 to-blue-500",         check: d => d.languageDays >= 1 },
  { category: "Languages", id: "lang_week",      icon: "🔥", title: "Week of Words",        desc: "7-day language practice streak",             color: "from-orange-400 to-red-500",       check: d => d.languageBestStreak >= 7 },
  { category: "Languages", id: "lang_fortnight", icon: "🌍", title: "Language Learner",     desc: "14-day language practice streak",            color: "from-emerald-400 to-teal-600",     check: d => d.languageBestStreak >= 14 },
  { category: "Languages", id: "lang_month",     icon: "🏅", title: "A Month of Practice",  desc: "30-day language practice streak",            color: "from-rose-500 to-red-700",         check: d => d.languageBestStreak >= 30 },
  { category: "Languages", id: "lang_ten",       icon: "📖", title: "Getting Fluent",       desc: "Practised a language on 10 different days",  color: "from-orange-400 to-amber-500",     check: d => d.languageDays >= 10 },
  { category: "Languages", id: "lang_fifty",     icon: "🎓", title: "Dedicated Linguist",   desc: "Practised a language on 50 different days",  color: "from-amber-500 to-red-600",        check: d => d.languageDays >= 50 },
  { category: "Languages", id: "lang_hours",     icon: "⏱️", title: "Ten Hours In",         desc: "10 hours of language practice",              color: "from-violet-400 to-purple-600",    check: d => d.languageMinutes >= 600 },
  { category: "Languages", id: "lang_two",       icon: "💬", title: "Bilingual Explorer",   desc: "Practised two different languages",          color: "from-cyan-400 to-sky-600",         check: d => d.languageCount >= 2 },
  { category: "Languages", id: "lang_three",     icon: "🌐", title: "Polyglot",             desc: "Practised three different languages",        color: "from-indigo-400 to-violet-600",    check: d => d.languageCount >= 3 },
  { category: "Languages", id: "xp_500",         icon: "⚡", title: "XP Hunter",            desc: "Earned 500 XP in a language app",            color: "from-yellow-400 to-orange-500",    check: d => d.languageXp >= 500 },
  { category: "Languages", id: "xp_1000",        icon: "💎", title: "XP Legend",            desc: "Earned 1,000 XP in a language app",          color: "from-amber-400 to-yellow-600",     check: d => d.languageXp >= 1000 },
];

function languageData(t: LanguageSummary["totals"] | null) {
  return {
    languageDays: t?.days ?? 0,
    languageBestStreak: t?.best_streak ?? 0,
    languageXp: t?.xp ?? 0,
    languageMinutes: t?.minutes ?? 0,
    languageCount: t?.languages ?? 0,
  };
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
  const [languages, setLanguages] = useState<LanguageSummary["totals"] | null>(null);
  const [familyEarned, setFamilyEarned] = useState(0);
  const [badgeView, setBadgeView] = useState<"earned" | "locked" | "all">("earned");
  const [badgeCategory, setBadgeCategory] = useState<string>("All");

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

  // Language badges come from the Languages diary, for the child being viewed.
  useEffect(() => {
    if (!role) return;
    getLanguageSummary(role === "parent" && selectedChildId ? { child_id: selectedChildId } : {})
      .then(res => setLanguages(res.data.totals))
      .catch(() => setLanguages(null));
  }, [role, selectedChildId]);

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
    const data: BadgeData = { totalComplete, streak, submitted, coding, subjectCounts, ...languageData(languages) };
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
  }, [loading, allEntries, coding, selectedChildId, languages]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const data: BadgeData = { totalComplete, streak, submitted, coding, subjectCounts, ...languageData(languages) };
  const earned = BADGES.filter(b => b.check(data));
  const locked = BADGES.filter(b => !b.check(data));
  const categoryOptions = ["All", "Lessons", "Streaks", "Work", "Subjects", "Coding", "Languages"];
  const sourceBadges = badgeView === "earned" ? earned : badgeView === "locked" ? locked : BADGES;
  const visibleBadges = sourceBadges.filter(
    b => badgeCategory === "All" || b.category === badgeCategory
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {newlyUnlocked.length > 0 && (
        <div className="fixed inset-x-0 top-16 z-40 flex justify-center px-4 pointer-events-none">
          <div className="brand-card relative px-6 py-4 shadow-xl pointer-events-auto max-w-sm w-full border-[#E3B554]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#D19A32] text-center">New achievement</p>
            <p className="text-lg font-bold text-[#2E342F] text-center mt-1">
              Badge{newlyUnlocked.length > 1 ? "s" : ""} unlocked
            </p>
            <div className="flex justify-center gap-3 mt-3 flex-wrap">
              {newlyUnlocked.map(id => {
                const b = BADGES.find(x => x.id === id);
                return b ? <span key={id} className="text-3xl" title={b.title}><Emoji e={b.icon} /></span> : null;
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {(role === "parent" || role === "child") && <RewardsTabs role={role} current="badges" />}
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <PageHero art="badges" tint={1}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage mb-2">Motivation</p>
              <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Badges</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Celebrate milestones, learning streaks, subject progress and special achievements.
              </p>
              </PageHero>
            </div>

            {role === "parent" && children.length > 0 && (
              <div className="brand-card px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Viewing</span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                  className="text-sm font-semibold text-[#2E342F] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All children</option>
                  {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading achievements…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="brand-card p-4">
                <p className="text-2xl font-bold text-brand-sage">{earned.length + familyEarned}</p>
                <p className="text-xs font-semibold text-[#6E5A46] mt-1">Badges earned</p>
              </div>
              <div className="brand-card p-4">
                <p className="text-2xl font-bold text-[#2E342F]">{totalComplete}</p>
                <p className="text-xs font-semibold text-[#6E5A46] mt-1">Lessons complete</p>
              </div>
              <div className="brand-card p-4">
                <p className="text-2xl font-bold text-[#D19A32]">{streak}</p>
                <p className="text-xs font-semibold text-[#6E5A46] mt-1">Day streak</p>
              </div>
              <div className="brand-card p-4">
                <p className="text-2xl font-bold text-brand-softsage">{submitted}</p>
                <p className="text-xs font-semibold text-[#6E5A46] mt-1">Work submitted</p>
              </div>
            </div>

            {(streak > 0 || (languages?.days ?? 0) > 0) && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {streak > 0 && (
                  <div className="brand-card p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Learning streak</p>
                    <div className="flex items-end justify-between gap-4 mt-2">
                      <div>
                        <p className="text-2xl font-bold text-[#2E342F]">{streak} days</p>
                        <p className="text-sm text-[#6E5A46] mt-1">
                          {streak >= 10 ? "A serious run of consistent learning." : streak >= 5 ? "A full school week completed." : "Keep the streak growing."}
                        </p>
                      </div>
                      <Emoji e="🔥" className="h-9 w-9" />
                    </div>
                  </div>
                )}

                {languages && languages.days > 0 && (
                  <a href="/languages" className="brand-card p-5 block hover:border-brand-softsage">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Languages</p>
                    <div className="flex items-end justify-between gap-4 mt-2">
                      <div>
                        <p className="text-2xl font-bold text-[#2E342F]">{languages.days} day{languages.days === 1 ? "" : "s"} of practice</p>
                        <p className="text-sm text-[#6E5A46] mt-1">
                          {languages.current_streak > 0 ? `${languages.current_streak}-day streak · ` : ""}
                          {languages.languages} language{languages.languages === 1 ? "" : "s"}
                          {languages.xp > 0 ? ` · ${languages.xp} XP` : ""}
                        </p>
                      </div>
                      <Emoji e="🗣️" className="h-9 w-9" />
                    </div>
                  </a>
                )}
              </div>
            )}

            <div className="brand-card p-4 mb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {([
                    ["earned", "Earned"],
                    ["locked", "Locked"],
                    ["all", "All badges"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setBadgeView(value)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        badgeView === value
                          ? "bg-brand-sage border-brand-sage text-white"
                          : "bg-brand-white border-brand-line text-[#6E5A46] hover:border-brand-softsage"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setBadgeCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        badgeCategory === cat
                          ? "bg-brand-tint border-brand-softsage text-brand-sage"
                          : "bg-brand-white border-brand-line text-[#8A7A69] hover:border-brand-softsage"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="brand-card p-6">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
                    {badgeView === "earned" ? "Trophy cabinet" : badgeView === "locked" ? "Still to unlock" : "Badge collection"}
                  </p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                    {badgeView === "earned" ? "Earned achievements" : badgeView === "locked" ? "Keep going" : "All achievements"}
                  </h2>
                </div>
                <span className="text-sm font-bold text-brand-sage">{visibleBadges.length}</span>
              </div>

              {visibleBadges.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-8 text-center">
                  <p className="text-sm font-semibold text-[#6E5A46]">No badges in this view yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {visibleBadges.map(b => {
                    const isEarned = b.check(data);
                    return (
                      <div
                        key={b.id}
                        className={`rounded-2xl border p-4 text-center transition-all ${
                          isEarned
                            ? "bg-brand-white border-[#D8D1C4]"
                            : "bg-[#FBF8F1] border-dashed border-[#DDD3C4]"
                        } ${newlyUnlocked.includes(b.id) ? "ring-2 ring-[#E3B554]" : ""}`}
                      >
                        <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
                          isEarned ? "bg-brand-cream" : "bg-[#EFE9DF] grayscale opacity-50"
                        }`}>
                          <Emoji e={b.icon} />
                        </div>
                        <p className={`text-sm font-bold leading-tight ${isEarned ? "text-[#2E342F]" : "text-[#6E5A46]"}`}>
                          {b.title}
                        </p>
                        <p className="mt-1 text-xs leading-snug text-[#8A7A69]">{b.desc}</p>
                        <div className="mt-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            isEarned ? "bg-brand-tint text-brand-sage" : "bg-[#F0ECE6] text-[#8A7A69]"
                          }`}>
                            {isEarned ? "Earned" : "Locked"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <FamilyBadges role={role} kids={children} viewingChildId={selectedChildId} onEarnedCount={setFamilyEarned} />
          </>
        )}
      </div>
    </div>
  );
}
