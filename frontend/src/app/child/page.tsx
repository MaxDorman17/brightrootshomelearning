"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole, getUsername } from "@/lib/auth";
import {
  getWeekEntries, getAllMyEntries, toggleComplete,
  submitWorkUrl, submitNote, getFeedback, markFeedbackRead, getDaysOff,
  getGoals, toggleGoal,
} from "@/lib/api";
import { PlannerEntry, WorkFeedback, WeeklyGoal } from "@/types";
import Navbar from "@/components/Navbar";
import { format, addDays, startOfWeek, isToday } from "date-fns";

const TIMETABLE: Record<string, string[]> = {
  Monday:    ["Maths", "English", "Science", "History", "Computing"],
  Tuesday:   ["Maths", "English", "Science", "Geography", "Cooking"],
  Wednesday: ["Maths", "English", "Science", "Art & Design", "Design and Technology"],
  Thursday:  ["Maths", "English", "Science", "History", "Life Skills"],
  Friday:    ["Maths", "English", "Science", "Languages"],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-blue-50 border-blue-200 text-blue-800",
  English: "bg-purple-50 border-purple-200 text-purple-800",
  Science: "bg-green-50 border-green-200 text-green-800",
  History: "bg-yellow-50 border-yellow-200 text-yellow-800",
  Geography: "bg-cyan-50 border-cyan-200 text-cyan-800",
  Computing: "bg-indigo-50 border-indigo-200 text-indigo-800",
  Cooking: "bg-orange-50 border-orange-200 text-orange-800",
  "Art & Design": "bg-pink-50 border-pink-200 text-pink-800",
  "Design and Technology": "bg-red-50 border-red-200 text-red-800",
  "Life Skills": "bg-teal-50 border-teal-200 text-teal-800",
  Languages: "bg-rose-50 border-rose-200 text-rose-800",
};

const subjectDot: Record<string, string> = {
  Maths: "bg-blue-400", English: "bg-purple-400", Science: "bg-green-400",
  History: "bg-yellow-400", Geography: "bg-cyan-400", Computing: "bg-indigo-400",
  Cooking: "bg-orange-400", "Art & Design": "bg-pink-400",
  "Design and Technology": "bg-red-400", "Life Skills": "bg-teal-400",
  Languages: "bg-rose-400",
};

const QUOTES = [
  "Every lesson is a step forward. Keep going! 🚀",
  "You're doing brilliantly — Max is proud of you! ⭐",
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

export default function ChildDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [allEntries, setAllEntries] = useState<PlannerEntry[]>([]);
  const [feedbackList, setFeedbackList] = useState<WorkFeedback[]>([]);
  const [daysOffSet, setDaysOffSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [modal, setModal] = useState<SlotModal | null>(null);
  const [toggling, setToggling] = useState(false);
  const [workUrl, setWorkUrl] = useState("");
  const [submittingUrl, setSubmittingUrl] = useState(false);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const loadWeek = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWeekEntries(format(weekStart, "yyyy-MM-dd"));
      setEntries(res.data);
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") { router.replace("/login"); return; }
    setUsername(getUsername() || "");
    loadWeek();

    // Non-critical data loaded separately so failures don't block the timetable
    Promise.all([getAllMyEntries(), getFeedback(), getDaysOff()])
      .then(([allRes, fbRes, daysOffRes]) => {
        setAllEntries(allRes.data);
        setFeedbackList(fbRes.data);
        setDaysOffSet(new Set((daysOffRes.data as { date: string }[]).map((d: { date: string }) => d.date)));
      })
      .catch(() => {});

    // Load this week's goals
    const weekMon = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
    getGoals({ week_start: weekMon }).then(res => setGoals(res.data)).catch(() => {});

    const timer = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 8000);
    return () => clearInterval(timer);
  }, [loadWeek, router]);

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

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Hero header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-5 mb-5 text-white shadow-xl shadow-indigo-300/40">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white/75 text-sm font-semibold">{getGreeting()}, {username}! 👋</p>
              <h1 className="text-xl font-extrabold mt-0.5">This Week&apos;s Timetable</h1>
              <p className="text-white/60 text-xs mt-0.5">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {streak > 0 && (
                <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
                  <span className="text-lg">{streak >= 5 ? "🔥" : "⚡"}</span>
                  <span className="text-sm font-bold">{streak}-day streak!</span>
                </div>
              )}
              <div className="hidden sm:block text-xs text-white/60 italic max-w-xs text-right">
                {QUOTES[quoteIdx]}
              </div>
            </div>
          </div>
        </div>

        {/* Unread feedback banner */}
        {unreadFeedback.length > 0 && (
          <div className="mb-4 space-y-2">
            {unreadFeedback.map(fb => (
              <div key={fb.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3 shadow-sm">
                <span className="text-2xl shrink-0">{fb.emoji || "💬"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-amber-700 mb-0.5">New feedback from Max! 🎉</p>
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
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">🎯 This Week&apos;s Goals</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                    goal.is_complete
                      ? "bg-emerald-50 border-2 border-emerald-200"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-indigo-300"
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

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekStart(d => addDays(d, -7))}
              className="px-3 py-1.5 text-sm bg-white/80 border border-white/60 rounded-xl hover:bg-white font-semibold shadow-sm transition-all">
              ← Prev
            </button>
            <span className="text-sm font-bold text-gray-700 min-w-40 text-center">{weekLabel}</span>
            <button onClick={() => setWeekStart(d => addDays(d, 7))}
              className="px-3 py-1.5 text-sm bg-white/80 border border-white/60 rounded-xl hover:bg-white font-semibold shadow-sm transition-all">
              Next →
            </button>
            <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              className="px-3 py-1.5 text-sm gradient-btn">
              Today
            </button>
          </div>
        </div>

        {/* Timetable grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {DAYS.map((dayName, dayIndex) => {
              const dayDate = weekDates[dayIndex];
              const subjects = TIMETABLE[dayName];
              const today = isToday(dayDate);
              const dayOff = daysOffSet.has(format(dayDate, "yyyy-MM-dd"));

              return (
                <div key={dayName}>
                  {/* Day header */}
                  <div className={`rounded-2xl px-3 py-2.5 mb-2 text-center shadow-sm ${
                    dayOff
                      ? "bg-gradient-to-b from-amber-400 to-orange-400 text-white shadow-orange-200/60"
                      : today
                      ? "bg-gradient-to-b from-violet-600 to-indigo-600 text-white shadow-indigo-300/40"
                      : "bg-white/80 backdrop-blur-sm border border-white/60 text-gray-700"
                  }`}>
                    <p className="text-xs font-extrabold uppercase tracking-wide opacity-80">{dayName.slice(0, 3)}</p>
                    <p className="text-lg font-extrabold">{format(dayDate, "d")}</p>
                    <p className="text-xs opacity-70 font-semibold">{format(dayDate, "MMM")}</p>
                    {dayOff && <p className="text-xs font-extrabold mt-0.5">🤒 Day off</p>}
                    {today && !dayOff && <p className="text-xs font-extrabold mt-0.5 text-white/80">Today</p>}
                  </div>

                  {/* Lesson slots */}
                  <div className="space-y-2">
                    {subjects.map(subject => {
                      const entry = getEntry(dayDate, subject);
                      const hasLesson = !!entry;
                      const colorClass = SUBJECT_COLORS[subject] || "bg-gray-50 border-gray-200 text-gray-700";
                      const dotClass = subjectDot[subject] || "bg-gray-400";

                      return hasLesson ? (
                        <button
                          key={subject}
                          onClick={() => openModal(entry)}
                          className={`w-full text-left rounded-xl border-2 p-3 transition-all hover:shadow-md hover:scale-[1.02] active:scale-100 ${
                            entry.is_complete
                              ? "bg-green-50 border-green-200 opacity-80"
                              : colorClass
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${entry.is_complete ? "bg-green-500" : dotClass}`} />
                            <span className="text-xs font-semibold truncate">{subject}</span>
                          </div>
                          <p className="text-xs font-medium leading-snug line-clamp-2 mt-1">
                            {entry.lesson.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {entry.lesson.lesson_url && <span className="text-xs opacity-70">🔗</span>}
                            {entry.is_complete && (
                              <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">✓</span>
                            )}
                            {entry.completed_work_url && <span className="text-xs opacity-70">📎</span>}
                          </div>
                        </button>
                      ) : (
                        <div
                          key={subject}
                          className="w-full rounded-xl border-2 p-3 bg-white/40 border-dashed border-gray-150"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                            <span className="text-xs font-semibold text-gray-400 truncate">{subject}</span>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">No lesson set</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Completed</span>
          <span className="flex items-center gap-1">🔗 Has lesson link</span>
          <span className="flex items-center gap-1">📎 Work submitted</span>
          <span className="ml-auto text-gray-400">Tap a lesson to open it</span>
        </div>
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
              <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${subjectDot[modal.entry.lesson.subject] || "bg-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{modal.entry.lesson.subject}</p>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{modal.entry.lesson.title}</h3>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl font-bold shrink-0">✕</button>
            </div>

            {/* Notes from Max */}
            {modal.entry.lesson.description && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-amber-700 mb-1">📝 Notes from Max</p>
                <p className="text-sm text-amber-900">{modal.entry.lesson.description}</p>
              </div>
            )}

            {/* Open lesson link */}
            {modal.entry.lesson.lesson_url && (
              <a
                href={modal.entry.lesson.lesson_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 mb-4 transition-colors font-semibold text-sm"
              >
                <span className="text-lg">▶</span>
                Open Lesson
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
              <p className="text-xs font-bold text-gray-600 mb-2">📎 Paste your results link</p>
              <div className="flex gap-2">
                <input
                  value={workUrl}
                  onChange={e => setWorkUrl(e.target.value)}
                  placeholder="https://…"
                  className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 bg-white"
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
                <p className="text-xs text-emerald-600 font-bold mt-1.5">✓ Link submitted — Max can see it!</p>
              )}
            </div>

            {/* Note */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2">📝 Add a note</p>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="What did you learn? What was tricky?"
                  className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 resize-none bg-white"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote || !note.trim()}
                  className="text-sm px-3 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-bold shadow-sm disabled:opacity-40 self-start"
                >
                  {savingNote ? "…" : "Save"}
                </button>
              </div>
              {modal.entry.completed_note && (
                <p className="text-xs text-violet-600 font-bold mt-1.5">✓ Note saved!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
