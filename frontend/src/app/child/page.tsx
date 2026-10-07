"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getRole, getUsername } from "@/lib/auth";
import {
  getWeekEntries, getAllMyEntries, toggleComplete,
  submitWorkUrl, submitNote, getFeedback, markFeedbackRead, getDaysOff,
  getGoals, toggleGoal, getTimetable, getBooks, checkOakWorksheet, getLessonScores,
} from "@/lib/api";
import { PlannerEntry, WorkFeedback, WeeklyGoal, ReadingLogBook, LessonScore } from "@/types";
import IDidThisCard from "@/components/IDidThisCard";
import Navbar from "@/components/Navbar";
import { useMounted } from "@/lib/useMounted";
import { useParentName } from "@/lib/useParentName";
import LessonGuide from "@/components/LessonGuide";
import RemindersCard from "@/components/RemindersCard";
import { ChildStarJarCard } from "@/components/StarJarCards";
import { ChildNotesCard } from "@/components/FamilyNotes";
import StarIcon from "@/components/StarIcon";
import AppCard from "@/components/AppCard";
import { SUBJECT_COLOUR_OPTIONS } from "@/lib/avatar";
import { checkSession } from "@/lib/api";
import { format, addDays, startOfWeek, isToday, parseISO, startOfDay } from "date-fns";
import Emoji from "@/components/Emoji";

interface WorksheetInfo { has_worksheet: boolean; intro_url: string | null; }

const OAK_LESSON_URL_RE = /^https:\/\/(?:www\.)?thenational\.academy\/pupils\/programmes\/[^/?#]+\/units\/[^/?#]+\/lessons\/[^/?#]+$/;
const isOakLessonUrl = (url?: string | null): url is string => !!url && OAK_LESSON_URL_RE.test(url);

const DEFAULT_TIMETABLE: Record<string, string[]> = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-brand-tint border-brand-mist text-brand-sage",
  English: "bg-[#F3ECE8] border-[#E5D9D1] text-[#765D52]",
  Science: "bg-brand-tint border-brand-mist text-brand-sage",
  History: "bg-[#F8F0DA] border-[#EADBAE] text-[#8A6A22]",
  Geography: "bg-[#EAF2EC] border-[#D4E1D6] text-[#48654E]",
  Computing: "bg-[#ECECF5] border-[#DADCEC] text-[#5C607D]",
  Cooking: "bg-[#F7EDE5] border-[#E9D7C9] text-[#8A624B]",
  "Art & Design": "bg-[#F7E9ED] border-[#E8CCD4] text-[#8B5968]",
  "Design and Technology": "bg-[#F4E9E6] border-[#E5D2CD] text-[#8A5A52]",
  "Life Skills": "bg-[#E7F0ED] border-[#CFDED8] text-[#4F6E64]",
  Languages: "bg-[#F3ECE8] border-[#E5D9D1] text-[#765D52]",
  "RSHE (PSHE)": "bg-[#EEEAF4] border-[#DDD5E8] text-[#675E7E]",
};

const subjectDot: Record<string, string> = {
  Maths: "bg-blue-400", English: "bg-purple-400", Science: "bg-green-400",
  History: "bg-yellow-400", Geography: "bg-cyan-400", Computing: "bg-indigo-400",
  Cooking: "bg-orange-400", "Art & Design": "bg-pink-400",
  "Design and Technology": "bg-red-400", "Life Skills": "bg-teal-400",
  Languages: "bg-rose-400",
};

const quotes = (parentName: string) => [
  "Every lesson is a step forward. Keep going! 🚀",
  `You're doing brilliantly, and ${parentName} is proud of you! ⭐`,
  "Smart people never stop learning. That's you! 🧠",
  "One lesson at a time — you've got this! 💪",
  "The more you learn, the more amazing you become! 🌟",
  "Today's effort is tomorrow's achievement! 🏆",
  "Every expert was once a beginner. Keep practising! 🎯",
  "Your brain is like a muscle — it grows every day! 💡",
  "Curiosity is a superpower — use it! 🔍",
  "You're building something incredible, one day at a time! 🏗️",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface SlotModal {
  entry: PlannerEntry;
}

function CompletionRing({ done, total }: { done: number; total: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = total === 0 ? circ : circ * (1 - done / total);
  return (
    <div className="relative w-16 h-16 shrink-0 rounded-full bg-white/80 shadow-sm">
      <svg className="w-16 h-16 -rotate-90 absolute inset-0" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(47,93,58,0.15)" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="#2F5D3A" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-[#2F5D3A] leading-none">{done}</span>
        <span className="text-[9px] text-[#6E5A46] font-bold leading-none mt-0.5">of {total}</span>
      </div>
    </div>
  );
}

export default function ChildDashboard() {
  const parentName = useParentName();
  const [myColours, setMyColours] = useState<Record<string, string>>({});
  useEffect(() => {
    checkSession()
      .then((res) => setMyColours(res.data.subject_colors || {}))
      .catch(() => {});
  }, []);
  // The child's own subject colour wins over the default one.
  const dotFor = (subject: string) => SUBJECT_COLOUR_OPTIONS[myColours[subject]]?.dot ?? subjectDot[subject];
  const cardFor = (subject: string) => SUBJECT_COLOUR_OPTIONS[myColours[subject]]?.card ?? SUBJECT_COLORS[subject];
  const router = useRouter();
  const mounted = useMounted();
  const [username, setUsername] = useState("");
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  // Things this child added themselves that a grown-up hasn't OK'd yet. Kept out of the lesson lists.
  const [waiting, setWaiting] = useState<PlannerEntry[]>([]);
  const [allEntries, setAllEntries] = useState<PlannerEntry[]>([]);
  const [feedbackList, setFeedbackList] = useState<WorkFeedback[]>([]);
  const [daysOffSet, setDaysOffSet] = useState<Set<string>>(new Set());
  const [books, setBooks] = useState<ReadingLogBook[]>([]);
  const [timetable, setTimetable] = useState<Record<string, string[]>>(DEFAULT_TIMETABLE);
  const [loading, setLoading] = useState(true);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5 ? day - 1 : 0;
  });

  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [modal, setModal] = useState<SlotModal | null>(null);
  const [toggling, setToggling] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [workUrl, setWorkUrl] = useState("");
  const [submittingUrl, setSubmittingUrl] = useState(false);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [worksheetCache, setWorksheetCache] = useState<Record<string, WorksheetInfo>>({});
  // The marks a grown-up has given this child's lessons, keyed by lesson.
  const [myScores, setMyScores] = useState<Record<number, LessonScore>>({});
  useEffect(() => {
    getLessonScores()
      .then(res => setMyScores(Object.fromEntries((res.data as LessonScore[]).map(s => [s.entry_id, s]))))
      .catch(() => {});
  }, []);
  const worksheetRequested = useRef<Set<string>>(new Set());

  const loadWeek = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWeekEntries(format(weekStart, "yyyy-MM-dd"));
      const all = res.data as PlannerEntry[];
      const isWaiting = (e: PlannerEntry) => !!e.added_by_child && !e.is_complete;
      setEntries(all.filter(e => !isWaiting(e)));
      setWaiting(all.filter(isWaiting));
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") { router.replace("/login"); return; }
    setUsername(getUsername() || "");
    loadWeek();

    // Non-critical data loaded separately so failures don't block the timetable
    Promise.all([getAllMyEntries(), getFeedback(), getDaysOff(), getBooks()])
      .then(([allRes, fbRes, daysOffRes, booksRes]) => {
        setAllEntries(allRes.data);
        setFeedbackList(fbRes.data);
        setDaysOffSet(new Set((daysOffRes.data as { date: string }[]).map((d: { date: string }) => d.date)));
        setBooks(booksRes.data);
      })
      .catch(() => {});

    getTimetable().then(res => setTimetable(res.data.config)).catch(() => {});

    // Load this week's goals
    const weekMon = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
    getGoals({ week_start: weekMon }).then(res => setGoals(res.data)).catch(() => {});

    const timer = setInterval(() => setQuoteIdx(i => (i + 1) % quotes("").length), 8000);
    return () => clearInterval(timer);
  }, [loadWeek, router]);

  useEffect(() => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const isCurrentWeek = format(currentWeekStart, "yyyy-MM-dd") === format(weekStart, "yyyy-MM-dd");
    const day = new Date().getDay();
    setSelectedDayIndex(isCurrentWeek && day >= 1 && day <= 5 ? day - 1 : 0);
  }, [weekStart]);

  // Check worksheet availability once per distinct Oak lesson URL — the ref
  // tracks what's already been requested so re-renders (or a week reload
  // returning the same URLs) never re-fire a check that's already in flight
  // or cached.
  useEffect(() => {
    entries.forEach(e => {
      const url = e.lesson.lesson_url;
      if (isOakLessonUrl(url) && !worksheetRequested.current.has(url)) {
        worksheetRequested.current.add(url);
        checkOakWorksheet(url)
          .then(res => setWorksheetCache(prev => ({ ...prev, [url]: res.data })))
          .catch(() => setWorksheetCache(prev => ({ ...prev, [url]: { has_worksheet: false, intro_url: null } })));
      }
    });
  }, [entries]);

  const weekDates = DAYS.map((_, i) => addDays(weekStart, i));

  const getEntry = (date: Date, subject: string): PlannerEntry | null =>
    entries.find(
      e => e.scheduled_date === format(date, "yyyy-MM-dd") && e.lesson.subject === subject
    ) ?? null;

  const openModal = (entry: PlannerEntry) => {
    setModal({ entry });
    setWorkUrl(entry.completed_work_url ?? "");
    setNote(entry.completed_note ?? "");
  };
  const closeModal = () => { setModal(null); setWorkUrl(""); setNote(""); };

  const handleToggle = async () => {
    if (!modal) return;
    setToggling(true);
    try {
      const res = await toggleComplete(modal.entry.id);
      setModal({ entry: res.data });
      setEntries(prev => prev.map(e => e.id === res.data.id ? res.data : e));
      if (res.data.is_complete) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 2200);
      }
    } finally { setToggling(false); }
  };

  const handleSubmitWork = async () => {
    if (!modal || !workUrl.trim()) return;
    setSubmittingUrl(true);
    try {
      const res = await submitWorkUrl(modal.entry.id, workUrl.trim());
      setModal({ entry: res.data });
      setEntries(prev => prev.map(e => e.id === res.data.id ? res.data : e));
    } finally { setSubmittingUrl(false); }
  };

  const handleSaveNote = async () => {
    if (!modal || !note.trim()) return;
    setSavingNote(true);
    try {
      const res = await submitNote(modal.entry.id, note.trim());
      setModal({ entry: res.data });
      setEntries(prev => prev.map(e => e.id === res.data.id ? res.data : e));
    } finally { setSavingNote(false); }
  };

  const handleToggleGoal = async (id: number) => {
    const res = await toggleGoal(id);
    setGoals(prev => prev.map(g => g.id === id ? res.data : g));
  };

  const handleReadFeedback = async (id: number) => {
    await markFeedbackRead(id);
    setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, read_at: new Date().toISOString() } : f));
  };

  // Streak: consecutive school days with all lessons done; days off don't break it
  const streak = (() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const byDate: Record<string, PlannerEntry[]> = {};
    allEntries.forEach(e => {
      if (!byDate[e.scheduled_date]) byDate[e.scheduled_date] = [];
      byDate[e.scheduled_date].push(e);
    });
    const todayDone = (byDate[today] || []).length > 0 && (byDate[today] || []).every(e => e.is_complete);
    const past = Object.keys(byDate).filter(d => d < today).sort().reverse();
    let s = (todayDone || daysOffSet.has(today)) ? 1 : 0;
    for (const d of past) {
      if (daysOffSet.has(d)) { s++; continue; }
      if (byDate[d].length > 0 && byDate[d].every(e => e.is_complete)) s++;
      else break;
    }
    return s;
  })();

  // Today's unread feedback
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayEntryIds = new Set(entries.filter(e => e.scheduled_date === todayStr).map(e => e.id));
  const unreadFeedback = feedbackList.filter(f => todayEntryIds.has(f.entry_id) && !f.read_at);

  const weekLabel = `${format(weekStart, "d MMM")} – ${format(addDays(weekStart, 4), "d MMM yyyy")}`;

  const todayStr2 = format(new Date(), "yyyy-MM-dd");
  // Excludes Extra Work (is_extra) so an Extra Work item can never stand in
  // for a real timetable lesson in "Up next" or the today completion count.
  const todayLessons = entries.filter(e => e.scheduled_date === todayStr2 && !e.is_extra);
  const todayDoneCount = todayLessons.filter(e => e.is_complete).length;
  const todayTotalCount = todayLessons.length;
  const nextLesson = todayLessons.find(e => !e.is_complete) ?? null;

  const weekLessons = entries.filter(e => !e.is_extra);
  const weekDoneCount = weekLessons.filter(e => e.is_complete).length;
  const weekTotalCount = weekLessons.length;
  const weekPercent = weekTotalCount > 0 ? Math.round((weekDoneCount / weekTotalCount) * 100) : 0;

  const readingBook = books.find(b => b.status === "reading") ?? books[0] ?? null;

  const selectedDate = weekDates[selectedDayIndex];
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedDayName = DAYS[selectedDayIndex];
  const selectedDayOff = daysOffSet.has(selectedDateStr);
  const selectedDayEntries = entries
    .filter(e => e.scheduled_date === selectedDateStr && !e.is_extra)
    .sort((a, b) => {
      const order = timetable[selectedDayName] ?? [];
      const ai = order.indexOf(a.lesson.subject);
      const bi = order.indexOf(b.lesson.subject);
      if (ai === -1 && bi === -1) return a.id - b.id;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  const selectedDoneCount = selectedDayEntries.filter(e => e.is_complete).length;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />

      {/* Lesson completion celebration */}
      {celebrating && (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
          {["🌟","✨","🎉","⭐","💫","🏆","🎊","🌈"].map((emoji, i) => (
            <span key={i} className="confetti-particle text-3xl"
              style={{ left: `${6 + i * 12}%`, top: "-10px", animationDelay: `${i * 0.08}s` }}>
              {emoji}
            </span>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl text-center">
              <StarIcon className="mx-auto mb-2 h-16 w-16" />
              <p className="text-xl font-extrabold text-brand-deep">Lesson done!</p>
              <p className="text-sm text-gray-500 font-semibold mt-1">Keep it up! <Emoji e="🎉" /></p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Hero header */}
        <div className="relative mb-4 overflow-hidden rounded-3xl border border-brand-line bg-[#FDFAF3] shadow-xl shadow-green-900/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* A wide banner: cream on the left, the illustration on the right. Sized by height so it's never stretched or zoomed. */}
          <img src="/hero/child-hero.jpg" alt="" className="absolute right-0 top-0 h-full w-auto max-w-none" />
          {/* On phones the picture sits behind the words, so soften it. */}
          <div className="absolute inset-0 bg-[#FDFAF3]/80 sm:hidden" />
          <div className="relative flex min-h-[180px] items-center gap-5 p-5 sm:min-h-[240px] sm:p-7 lg:min-h-[270px]">
            <div className="min-w-0 flex-1 sm:max-w-[55%]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6E5A46]/70">{mounted ? format(new Date(), "EEEE, d MMMM yyyy") : " "}</p>
              <h1 className="mt-0.5 text-2xl font-extrabold text-[#2F5D3A] sm:text-3xl">{mounted ? getGreeting() : "Hello"}, {username}! 👋</h1>
              {todayTotalCount > 0 ? (
                <p className="mt-1 text-sm font-semibold text-[#4A3B2C]">
                  {todayDoneCount === todayTotalCount
                    ? "🎉 All done today — brilliant work!"
                    : `${todayTotalCount - todayDoneCount} lesson${todayTotalCount - todayDoneCount !== 1 ? "s" : ""} left today`}
                </p>
              ) : (
                <p className="mt-1 text-sm text-[#6E5A46]">No lessons scheduled today</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {streak > 0 && (
                  <div className="flex w-fit items-center gap-1.5 rounded-xl bg-white/80 px-3 py-1.5 text-[#2F5D3A] shadow-sm">
                    <Emoji e={streak >= 10 ? "🔥" : streak >= 5 ? "⚡" : "✨"} />
                    <span className="text-sm font-extrabold">{streak}-day streak!</span>
                  </div>
                )}
                {todayTotalCount > 0 && <CompletionRing done={todayDoneCount} total={todayTotalCount} />}
              </div>
              <p className="mt-3 hidden max-w-sm text-xs italic leading-relaxed text-[#6E5A46] lg:block">{quotes(parentName)[quoteIdx]}</p>
            </div>
          </div>
        </div>

        <ChildNotesCard />

        {/* Up next card */}
        {nextLesson && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm">
            <span className="text-2xl shrink-0">▶️</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-amber-700 mb-0.5">Up next</p>
              <p className="text-sm font-extrabold text-amber-900 truncate">{nextLesson.lesson.title}</p>
              <p className="text-xs text-amber-600 font-semibold">{nextLesson.lesson.subject}</p>
            </div>
            <button onClick={() => openModal(nextLesson)}
              className="text-sm px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors shadow-sm shrink-0">
              Open →
            </button>
          </div>
        )}

        <ChildStarJarCard />

        <RemindersCard />

        <div className="mb-6">
          <AppCard role="child" dismissible />
        </div>

        {/* Unread feedback banner */}
        {unreadFeedback.length > 0 && (
          <div className="mb-4 space-y-2">
            {unreadFeedback.map(fb => (
              <div key={fb.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3 shadow-sm">
                <span className="text-2xl shrink-0">{fb.emoji || "💬"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-amber-700 mb-0.5">New feedback from {parentName}! <Emoji e="🎉" /></p>
                  <p className="text-sm font-semibold text-amber-900">{fb.message}</p>
                </div>
                <button onClick={() => handleReadFeedback(fb.id)}
                  className="text-amber-400 hover:text-amber-600 text-xl font-bold shrink-0 transition-colors" title="Dismiss">
                  ✓
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Weekly goals strip */}
        {goals.length > 0 && (
          <div className="mb-4 bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-4">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3"><Emoji e="🎯" /> This Week&apos;s Goals</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                    goal.is_complete
                      ? "bg-emerald-50 border-2 border-emerald-200"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-brand-lime"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                    goal.is_complete
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-gray-300"
                  }`}>
                    {goal.is_complete && "✓"}
                  </span>
                  <span className={`text-sm font-semibold ${goal.is_complete ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {goal.title}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">
              {goals.filter(g => g.is_complete).length}/{goals.length} complete
            </p>
          </div>
        )}

        {/* Week calendar */}
        <div className="brand-card p-4 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekStart(d => addDays(d, -7))}
                className="w-10 h-10 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage font-bold hover:border-brand-softsage"
                aria-label="Previous week"
              >
                ←
              </button>

              <div className="px-2 sm:px-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-softsage">Week calendar</p>
                <p className="text-sm font-bold text-[#2E342F] mt-0.5">{weekLabel}</p>
              </div>

              <button
                onClick={() => setWeekStart(d => addDays(d, 7))}
                className="w-10 h-10 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage font-bold hover:border-brand-softsage"
                aria-label="Next week"
              >
                →
              </button>

              <button
                onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-brand-tint text-brand-sage"
              >
                This week
              </button>
            </div>

            <div className="lg:w-72">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#6E5A46]">Week progress</span>
                <span className="font-bold text-brand-sage">{weekDoneCount}/{weekTotalCount} complete</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#EEE8DD] overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-softsage transition-all"
                  style={{ width: `${weekPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {DAYS.map((dayName, dayIndex) => {
              const dayDate = weekDates[dayIndex];
              const dateStr = format(dayDate, "yyyy-MM-dd");
              const dayEntries = entries
                .filter(e => e.scheduled_date === dateStr && !e.is_extra)
                .sort((a, b) => {
                  const order = timetable[dayName] ?? [];
                  const ai = order.indexOf(a.lesson.subject);
                  const bi = order.indexOf(b.lesson.subject);
                  if (ai === -1 && bi === -1) return a.id - b.id;
                  if (ai === -1) return 1;
                  if (bi === -1) return -1;
                  return ai - bi;
                });
              const complete = dayEntries.filter(e => e.is_complete).length;
              const dayOff = daysOffSet.has(dateStr);
              const active = selectedDayIndex === dayIndex;
              const today = isToday(dayDate);

              return (
                <button
                  key={dayName}
                  onClick={() => setSelectedDayIndex(dayIndex)}
                  className={`text-left rounded-2xl border overflow-hidden transition-all ${
                    active
                      ? "border-brand-sage ring-2 ring-brand-mist"
                      : dayOff
                      ? "border-[#F0D4A8]"
                      : "border-brand-line hover:border-brand-softsage"
                  }`}
                >
                  <div className={`px-3 py-3 ${
                    active
                      ? "bg-brand-sage text-white"
                      : dayOff
                      ? "bg-[#FFF3E3] text-[#8A624B]"
                      : today
                      ? "bg-brand-tint text-brand-sage"
                      : "bg-[#F7F3EA] text-[#2E342F]"
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{dayName}</p>
                        <p className="text-lg font-bold mt-0.5">{format(dayDate, "d MMM")}</p>
                      </div>
                      {today && (
                        <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                          active ? "bg-white/15 text-white" : "bg-white text-brand-sage"
                        }`}>
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-semibold mt-2 opacity-80">
                      {dayOff ? "Day off" : dayEntries.length > 0 ? `${complete}/${dayEntries.length} complete` : "No lessons"}
                    </p>
                  </div>

                  <div className={`p-2.5 min-h-[190px] space-y-2 ${
                    dayOff ? "bg-[#FFF9F1]" : "bg-brand-white"
                  }`}>
                    {dayOff ? (
                      <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center">
                        <span className="text-2xl">🌤️</span>
                        <p className="text-xs font-bold text-[#8A624B] mt-2">No school work</p>
                      </div>
                    ) : dayEntries.length === 0 ? (
                      <div className="h-full min-h-[160px] flex items-center justify-center text-center">
                        <p className="text-xs text-[#A79B8C]">Nothing planned</p>
                      </div>
                    ) : (
                      dayEntries.map(entry => (
                        <div
                          key={entry.id}
                          className={`rounded-xl border px-2.5 py-2 ${
                            entry.is_complete
                              ? "bg-brand-wash border-brand-mist"
                              : "bg-white border-brand-line"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              entry.is_complete ? "bg-brand-leaf" : dotFor(entry.lesson.subject) || "bg-gray-400"
                            }`} />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A7A69]">
                                {entry.lesson.subject}
                              </p>
                              <p className="text-xs font-semibold text-[#2E342F] leading-snug mt-0.5 line-clamp-2">
                                {entry.lesson.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

            <div className="brand-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Daily plan</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                    {selectedDayName}, {format(selectedDate, "d MMMM")}
                  </h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    {selectedDayOff
                      ? "This day is marked as a day off."
                      : selectedDayEntries.length === 0
                      ? "No lessons are planned for this day."
                      : `${selectedDoneCount} of ${selectedDayEntries.length} lessons complete`}
                  </p>
                </div>

                {!selectedDayOff && selectedDayEntries.length > 0 && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-sage">{selectedDoneCount}/{selectedDayEntries.length}</p>
                    <p className="text-xs text-[#8A7A69]">complete</p>
                  </div>
                )}
              </div>

              {selectedDayOff ? (
                <div className="rounded-2xl border border-dashed border-[#F0D4A8] bg-[#FFF8EE] p-8 text-center">
                  <p className="text-2xl">🌤️</p>
                  <p className="text-sm font-bold text-[#8A624B] mt-2">Day off</p>
                  <p className="text-xs text-[#9B7A60] mt-1">No school work needed today.</p>
                </div>
              ) : selectedDayEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-8 text-center">
                  <p className="text-sm font-semibold text-[#6E5A46]">Nothing planned for this day.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedDayEntries.map(entry => {
                    const colorClass = cardFor(entry.lesson.subject) || "bg-[#F0ECE6] border-[#DDD3C4] text-[#6E6256]";
                    const dotClass = dotFor(entry.lesson.subject) || "bg-gray-400";
                    const normalSubjects = timetable[selectedDayName] ?? [];
                    const movedHere = !normalSubjects.includes(entry.lesson.subject);

                    return (
                      <button
                        key={entry.id}
                        onClick={() => openModal(entry)}
                        className={`w-full text-left rounded-2xl border p-4 transition-all hover:shadow-md ${
                          entry.is_complete
                            ? "bg-brand-wash border-brand-mist"
                            : colorClass
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            entry.is_complete ? "bg-brand-leaf" : dotClass
                          }`} />

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold">{entry.lesson.subject}</span>
                              {movedHere && (
                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/70">
                                  Moved here
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-bold text-[#2E342F] mt-1.5 leading-snug">
                              {entry.lesson.title}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {entry.is_complete ? (
                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-brand-mist text-brand-sage">
                                  ✓ Complete
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/70 text-[#6E5A46]">
                                  To do
                                </span>
                              )}
                              {entry.lesson.lesson_url && <span className="text-xs" title="Lesson link">🔗</span>}
                              {entry.completed_work_url && <span className="text-xs" title="Work submitted"><Emoji e="📎" /></span>}
                              {myScores[entry.id] && (
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  Score {myScores[entry.id].score}/{myScores[entry.id].total}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-brand-softsage font-bold">→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Completed</span>
          <span className="flex items-center gap-1">🔗 Has lesson link</span>
          <span className="flex items-center gap-1"><Emoji e="📎" /> Work submitted</span>
          <span className="ml-auto text-gray-400">Choose a day, then tap a lesson to open it</span>
        </div>

        <IDidThisCard
          subjects={Array.from(new Set(Object.values(timetable).flat()))}
          waiting={waiting}
          grownUp={parentName}
          onAdded={entry => setWaiting(prev => [...prev, entry])}
        />

        {/* Reading — sourced from the real Reading Log, never spellings or Extra Work */}
        {readingBook && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-gray-900"><Emoji e="📚" /> Reading</h2>
              <Link href="/reading-log" className="text-sm text-brand-leaf hover:text-brand-deep font-bold">
                Go to Reading Log →
              </Link>
            </div>
            <Link href="/reading-log"
              className="block bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-5 hover:shadow-md hover:border-brand-lime/60 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl shrink-0">
                  {readingBook.status === "completed" ? "✅" : readingBook.status === "reading" ? "📖" : "📋"}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{readingBook.title}</p>
                  {readingBook.author && <p className="text-sm text-gray-400 truncate">{readingBook.author}</p>}
                  <span className={`inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    readingBook.status === "reading" ? "bg-blue-100 text-blue-800"
                      : readingBook.status === "completed" ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {readingBook.status === "reading" ? "Currently Reading" : readingBook.status === "completed" ? "Completed" : "Wishlist"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Extra Work — separate from the normal timetable above */}
        {(() => {
          const extraEntries = allEntries.filter(e => e.is_extra);
          if (extraEntries.length === 0) return null;
          const extraPending = extraEntries.filter(e => !e.is_complete);
          const extraDone = extraEntries.filter(e => e.is_complete);
          return (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-gray-900">📋 Extra Work</h2>
                <Link href="/child/extra-work" className="text-sm text-brand-leaf hover:text-brand-deep font-bold">
                  See all →
                </Link>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-5">
                {extraPending.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No extra work to do right now <Emoji e="🎉" /></p>
                ) : (
                  <div className="space-y-2">
                    {extraPending.map(e => {
                      const overdue = parseISO(e.scheduled_date) < startOfDay(new Date());
                      return (
                        <button key={e.id} onClick={() => openModal(e)}
                          className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50 hover:bg-brand-lime/10 transition-colors">
                          <span className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-xs font-semibold text-gray-500">{e.lesson.subject}</span>
                              <span className="text-xs text-gray-400">Due {format(parseISO(e.scheduled_date), "d MMM")}</span>
                              {overdue && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">OVERDUE</span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-800 truncate">{e.lesson.title}</p>
                          </div>
                          {myScores[e.id] && (
                            <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {myScores[e.id].score}/{myScores[e.id].total}
                            </span>
                          )}
                          {e.completed_work_url && <span className="text-xs opacity-60 shrink-0"><Emoji e="📎" /></span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {extraDone.length > 0 && (
                  <details className="mt-3 pt-3 border-t border-gray-100">
                    <summary className="text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer">
                      Completed ({extraDone.length})
                    </summary>
                    <div className="space-y-2 mt-2 opacity-70">
                      {extraDone.map(e => (
                        <button key={e.id} onClick={() => openModal(e)}
                          className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                          <span className="text-green-500">✓</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-600 line-through truncate">{e.lesson.title}</p>
                            <span className="text-xs text-gray-400">{e.lesson.subject}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Lesson modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${dotFor(modal.entry.lesson.subject) || "bg-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{modal.entry.lesson.subject}</p>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{modal.entry.lesson.title}</h3>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl font-bold shrink-0">✕</button>
            </div>

            {/* Notes from the parent */}
            {modal.entry.lesson.description && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-amber-700 mb-1"><Emoji e="📝" /> Notes from {parentName}</p>
                <p className="text-sm text-amber-900">{modal.entry.lesson.description}</p>
              </div>
            )}

            <LessonGuide entryId={modal.entry.id} lesson={modal.entry.lesson} />

            {/* Open lesson link */}
            {modal.entry.lesson.lesson_url && (
              <a
                // An Oak lesson opens on its own Bright Roots page, where the quizzes and video are; anything else opens where it lives.
                {...(isOakLessonUrl(modal.entry.lesson.lesson_url)
                  ? { href: `/child/lesson/${modal.entry.id}` }
                  : { href: modal.entry.lesson.lesson_url, target: "_blank", rel: "noopener noreferrer" })}
                className="flex items-center gap-3 bg-brand-deep hover:bg-brand-leaf text-white rounded-xl px-4 py-3 mb-4 transition-colors font-semibold text-sm"
              >
                <span className="text-lg">▶</span>
                Open Lesson
                <span className="ml-auto opacity-70">→</span>
              </a>
            )}

            {(() => {
              const url = modal.entry.lesson.lesson_url;
              const ws = url ? worksheetCache[url] : undefined;
              return ws?.has_worksheet && ws.intro_url ? (
                <a
                  href={ws.intro_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border-2 border-brand-lime/40 hover:bg-brand-lime/10 text-brand-deep rounded-xl px-4 py-3 mb-4 transition-colors font-semibold text-sm"
                >
                  <span className="text-lg">📄</span>
                  Open Worksheet
                  <span className="ml-auto opacity-70">→</span>
                </a>
              ) : null;
            })()}

            <a
              href={`/child/resources?folder=${encodeURIComponent(modal.entry.lesson.subject)}`}
              className="flex items-center gap-3 bg-white border-2 border-brand-mist hover:bg-brand-wash text-brand-deep rounded-xl px-4 py-3 mb-4 transition-colors font-semibold text-sm"
            >
              <span className="text-lg">📂</span>
              Lesson aids for {modal.entry.lesson.subject}
              <span className="ml-auto opacity-70">→</span>
            </a>

            {!modal.entry.is_complete && (
              <a
                href={`/child/lesson/${modal.entry.id}#timer`}
                className="flex items-center gap-3 bg-white border-2 border-brand-mist hover:bg-brand-wash text-brand-deep rounded-xl px-4 py-3 mb-4 transition-colors font-semibold text-sm"
              >
                <span className="text-lg">⏱</span>
                Start study timer
                <span className="ml-auto opacity-70">→</span>
              </a>
            )}

            {/* Mark done */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all mb-4 ${
                modal.entry.is_complete
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "gradient-btn"
              }`}
            >
              {toggling ? "…" : modal.entry.is_complete ? "✓ Completed — tap to undo" : "Mark as Done ✓"}
            </button>

            {/* Submit work URL */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-600 mb-2"><Emoji e="📎" /> Paste a link to your work or results</p>
              <div className="flex gap-2">
                <input
                  value={workUrl}
                  onChange={e => setWorkUrl(e.target.value)}
                  placeholder="https://…"
                  className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-leaf bg-white"
                />
                <button
                  onClick={handleSubmitWork}
                  disabled={submittingUrl || !workUrl.trim()}
                  className="text-sm px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-sm disabled:opacity-40"
                >
                  {submittingUrl ? "…" : "Send"}
                </button>
              </div>
              {modal.entry.completed_work_url && (
                <p className="text-xs text-emerald-600 font-bold mt-1.5">✓ Link submitted. {parentName} can see it!</p>
              )}
            </div>

            {myScores[modal.entry.id] && (
              <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                <p className="text-sm font-bold text-emerald-700">
                  Your score: {myScores[modal.entry.id].score} out of {myScores[modal.entry.id].total}
                </p>
                <p className="text-xs text-emerald-700/80">Marked by {parentName}.</p>
              </div>
            )}

            {/* Note */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2"><Emoji e="📝" /> Add a note</p>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="What did you learn? What was tricky?"
                  className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-leaf resize-none bg-white"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote || !note.trim()}
                  className="text-sm px-3 py-2 bg-gradient-to-r from-brand-deep to-brand-leaf text-white rounded-xl font-bold shadow-sm disabled:opacity-40 self-start"
                >
                  {savingNote ? "…" : "Save"}
                </button>
              </div>
              {modal.entry.completed_note && (
                <p className="text-xs text-brand-leaf font-bold mt-1.5">✓ Note saved!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
