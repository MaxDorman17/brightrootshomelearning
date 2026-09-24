"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPolishSessions, logPolishSession, deletePolishSession } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { format, parseISO, differenceInCalendarDays, subDays } from "date-fns";

interface PolishSession {
  id: number;
  user_id: number;
  date: string;
  xp: number | null;
  notes: string | null;
}

function calcStreak(sessions: PolishSession[]): number {
  if (sessions.length === 0) return 0;
  const dates = new Set(sessions.map(s => s.date));
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  while (dates.has(format(check, "yyyy-MM-dd"))) {
    streak++;
    check = subDays(check, 1);
  }
  return streak;
}

export default function PolishPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PolishSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpInput, setXpInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [logging, setLogging] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const todaySession = sessions.find(s => s.date === today);
  const streak = calcStreak(sessions);
  const totalXp = sessions.reduce((sum, s) => sum + (s.xp ?? 0), 0);
  const totalDays = sessions.length;

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    getPolishSessions()
      .then(res => setSessions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleLog = async () => {
    setLogging(true);
    try {
      const res = await logPolishSession({
        date: today,
        xp: xpInput ? parseInt(xpInput) : undefined,
        notes: notesInput.trim() || undefined,
      });
      setSessions(prev => {
        const without = prev.filter(s => s.date !== today);
        return [res.data, ...without].sort((a, b) => b.date.localeCompare(a.date));
      });
      setXpInput("");
      setNotesInput("");
      setShowForm(false);
    } finally { setLogging(false); }
  };

  const handleDelete = async (id: number) => {
    await deletePolishSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Learning
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Languages</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Track Polish practice, Duolingo XP and daily learning streaks.
              </p>
            </div>

            <a
              href="https://www.duolingo.com/course/pl/en/Learn-Polish"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors"
            >
              Open Duolingo
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#3F5D46]">{streak}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Day streak</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#2E342F]">{totalDays}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Days practiced</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#D19A32]">{totalXp}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Total XP</p>
          </div>
        </div>

        <div className="brand-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Today</p>

              {todaySession ? (
                <>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Practice logged for today</h2>
                  <p className="text-sm text-[#6E5A46] mt-2">
                    {todaySession.xp ? `${todaySession.xp} XP` : "Session recorded"}
                    {todaySession.notes ? ` · ${todaySession.notes}` : ""}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">No practice logged yet</h2>
                  <p className="text-sm text-[#6E5A46] mt-2">
                    Log today’s Polish practice to keep the learning record up to date.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowForm(v => !v)}
              className="px-4 py-2.5 rounded-xl border border-[#3F5D46] bg-[#FFFDF8] text-[#3F5D46] text-sm font-bold hover:bg-[#F7F2E8]"
            >
              {showForm ? "Close" : todaySession ? "Edit today" : "+ Log practice"}
            </button>
          </div>

          {showForm && (
            <div className="mt-6 pt-6 border-t border-[#EEE6D9]">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                    XP earned
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={xpInput}
                    onChange={e => setXpInput(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                    What was practised?
                  </label>
                  <input
                    value={notesInput}
                    onChange={e => setNotesInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLog()}
                    placeholder="e.g. Greetings, numbers, colours"
                    className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={handleLog}
                  disabled={logging}
                  className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-50"
                >
                  {logging ? "Saving…" : todaySession ? "Update practice" : "Save practice"}
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] text-sm font-bold hover:border-[#8FA382]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="brand-card p-6">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">History</p>
              <h2 className="text-xl font-bold text-[#2E342F] mt-1">Practice history</h2>
              <p className="text-sm text-[#6E5A46] mt-1">
                Recent Polish practice sessions and XP earned.
              </p>
            </div>

            <span className="text-sm font-bold text-[#3F5D46]">{sessions.length}</span>
          </div>

          {loading ? (
            <p className="text-[#8A7A69] text-center py-8">Loading…</p>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-8 text-center">
              <p className="text-sm font-semibold text-[#6E5A46]">No practice sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(s => {
                const daysAgo = differenceInCalendarDays(new Date(), parseISO(s.date));
                const label =
                  daysAgo === 0
                    ? "Today"
                    : daysAgo === 1
                    ? "Yesterday"
                    : format(parseISO(s.date), "EEE d MMM yyyy");

                return (
                  <div
                    key={s.id}
                    className="rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E8F0E8] text-[#3F5D46] flex items-center justify-center font-bold shrink-0">
                      PL
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#2E342F]">{label}</p>
                      <p className="text-xs text-[#6E5A46] mt-1 truncate">
                        {s.notes || "Polish practice logged"}
                      </p>
                    </div>

                    {s.xp != null && (
                      <span className="text-xs font-bold text-[#3F5D46] bg-[#E8F0E8] px-3 py-1 rounded-full shrink-0">
                        +{s.xp} XP
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-[#C4BBB0] hover:text-[#A85F46] text-lg leading-none shrink-0"
                      aria-label="Delete session"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
