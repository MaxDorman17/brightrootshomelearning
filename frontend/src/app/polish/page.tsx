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

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2F5D3A] to-[#6EA76E] text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="text-6xl mb-3">🇵🇱</div>
          <h1 className="text-3xl font-extrabold mb-1">Polish with Duolingo</h1>
          <p className="text-white/70 font-semibold mb-6">Track your daily practice and build your streak!</p>

          {/* Stats row */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <div className="bg-white/15 rounded-2xl px-6 py-3 text-center">
              <p className="text-3xl font-extrabold">{streak > 0 ? `🔥 ${streak}` : "—"}</p>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wide mt-0.5">Day streak</p>
            </div>
            <div className="bg-white/15 rounded-2xl px-6 py-3 text-center">
              <p className="text-3xl font-extrabold">{totalDays}</p>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wide mt-0.5">Days practiced</p>
            </div>
            {totalXp > 0 && (
              <div className="bg-white/15 rounded-2xl px-6 py-3 text-center">
                <p className="text-3xl font-extrabold">{totalXp}</p>
                <p className="text-xs font-bold text-white/70 uppercase tracking-wide mt-0.5">Total XP</p>
              </div>
            )}
          </div>

          {/* Open Duolingo button */}
          <a
            href="https://www.duolingo.com/course/pl/en/Learn-Polish"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#58CC02] hover:bg-[#46A302] text-white font-extrabold text-lg px-8 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-100">
            Open Duolingo
            <span className="text-2xl">→</span>
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Today's log */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-5 mb-6">
          {todaySession ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0">✅</div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-gray-900">Practice logged for today!</p>
                <p className="text-sm text-gray-500">
                  {todaySession.xp ? `${todaySession.xp} XP · ` : ""}
                  {todaySession.notes || "Good work — keep the streak going!"}
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="text-xs text-[#2F5D3A] font-bold hover:underline shrink-0">
                Edit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">📖</div>
              <div className="flex-1">
                <p className="font-extrabold text-gray-900">Did you practice today?</p>
                <p className="text-sm text-gray-500">Log your Duolingo session to keep your streak!</p>
              </div>
              <button
                onClick={() => setShowForm(v => !v)}
                className="gradient-btn text-sm px-4 py-2 shrink-0">
                + Log it
              </button>
            </div>
          )}

          {showForm && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">XP earned (optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={xpInput}
                    onChange={e => setXpInput(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6EA76E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">What did you learn? (optional)</label>
                <input
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLog()}
                  placeholder="e.g. Colours, greetings, numbers…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6EA76E]"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleLog} disabled={logging}
                  className="flex-1 bg-[#2F5D3A] text-white py-2.5 rounded-xl font-bold hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                  {logging ? "Saving…" : todaySession ? "Update" : "Log practice ✓"}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Session history */}
        <h2 className="text-lg font-extrabold text-gray-900 mb-3">Practice history</h2>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading…</p>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-gray-200">
            <p className="text-4xl mb-2">🇵🇱</p>
            <p className="font-bold text-gray-500">No sessions yet</p>
            <p className="text-sm text-gray-400 mt-1">Open Duolingo and log your first practice above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => {
              const daysAgo = differenceInCalendarDays(new Date(), parseISO(s.date));
              const label = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : format(parseISO(s.date), "EEE d MMM yyyy");
              return (
                <div key={s.id} className="bg-white/80 border border-white/60 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-[#A8C67A]/30 flex items-center justify-center text-lg shrink-0">🇵🇱</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{label}</p>
                    {(s.xp || s.notes) && (
                      <p className="text-xs text-gray-500 truncate">
                        {s.xp ? `${s.xp} XP` : ""}
                        {s.xp && s.notes ? " · " : ""}
                        {s.notes ?? ""}
                      </p>
                    )}
                  </div>
                  {s.xp && (
                    <span className="text-xs font-extrabold text-[#58CC02] bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                      +{s.xp} XP
                    </span>
                  )}
                  <button onClick={() => handleDelete(s.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0 ml-1">
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
