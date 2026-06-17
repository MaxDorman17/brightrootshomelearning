"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllMyEntries, toggleComplete, submitWorkUrl } from "@/lib/api";
import { PlannerEntry } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, startOfDay } from "date-fns";

const TIMETABLE_SUBJECTS = new Set([
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
]);

const CATEGORY_COLOR: Record<string, string> = {
  Reading: "bg-blue-100 border-blue-200 text-blue-800",
  Project: "bg-purple-100 border-purple-200 text-purple-800",
  Research: "bg-green-100 border-green-200 text-green-800",
  Practice: "bg-yellow-100 border-yellow-200 text-yellow-800",
  "Creative Writing": "bg-pink-100 border-pink-200 text-pink-800",
  Other: "bg-gray-100 border-gray-200 text-gray-700",
};

export default function ChildExtraWorkPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [workUrls, setWorkUrls] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    const res = await getAllMyEntries();
    const extra = res.data.filter((e: PlannerEntry) => !TIMETABLE_SUBJECTS.has(e.lesson.subject));
    setEntries(extra);
    const initial: Record<number, string> = {};
    extra.forEach((e: PlannerEntry) => { if (e.completed_work_url) initial[e.id] = e.completed_work_url; });
    setWorkUrls(initial);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") { router.replace("/login"); return; }
    loadData();
  }, [loadData, router]);

  const handleToggle = async (id: number) => {
    setToggling(id);
    try {
      const res = await toggleComplete(id);
      setEntries(prev => prev.map(e => e.id === id ? res.data : e));
    } finally { setToggling(null); }
  };

  const handleSubmit = async (id: number) => {
    const url = workUrls[id]?.trim();
    if (!url) return;
    setSubmitting(id);
    try {
      const res = await submitWorkUrl(id, url);
      setEntries(prev => prev.map(e => e.id === id ? res.data : e));
    } finally { setSubmitting(null); }
  };

  const pending = entries.filter(e => !e.is_complete);
  const done = entries.filter(e => e.is_complete);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Extra Work</h1>
          <p className="text-gray-500 mt-1">Tasks and projects set by Max</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500">No extra tasks yet — check back later!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">To Do ({pending.length})</p>
                <div className="space-y-4">
                  {pending.map(e => (
                    <div key={e.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5">
                      <div className="flex items-start gap-3">
                        <button onClick={() => handleToggle(e.id)} disabled={toggling === e.id}
                          className="mt-0.5 w-6 h-6 rounded-full border-2 border-gray-300 hover:border-indigo-400 shrink-0 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${CATEGORY_COLOR[e.lesson.subject] || "bg-gray-100 border-gray-200 text-gray-700"}`}>
                              {e.lesson.subject}
                            </span>
                            <span className="text-xs text-gray-400">Due {format(parseISO(e.scheduled_date), "d MMM yyyy")}</span>
                            {parseISO(e.scheduled_date) < startOfDay(new Date()) && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">OVERDUE</span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900">{e.lesson.title}</h3>
                          {e.lesson.description && (
                            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-2 border border-amber-100">
                              📝 {e.lesson.description}
                            </p>
                          )}
                          {e.lesson.lesson_url && (
                            <a href={e.lesson.lesson_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg mt-3 hover:bg-indigo-700 font-medium transition-colors">
                              ▶ Open Link
                            </a>
                          )}
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">Paste your results link when done:</p>
                            <div className="flex gap-2">
                              <input
                                value={workUrls[e.id] || ""}
                                onChange={ev => setWorkUrls(p => ({ ...p, [e.id]: ev.target.value }))}
                                placeholder="https://…"
                                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                              <button onClick={() => handleSubmit(e.id)} disabled={submitting === e.id || !workUrls[e.id]?.trim()}
                                className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 font-medium transition-colors">
                                {submitting === e.id ? "…" : "Submit"}
                              </button>
                            </div>
                            {e.completed_work_url && <p className="text-xs text-green-600 mt-1">✓ Work submitted — Max can see it</p>}
                          </div>
                        </div>
                        <button onClick={() => handleToggle(e.id)} disabled={toggling === e.id}
                          className="shrink-0 text-sm px-4 py-1.5 rounded-xl font-bold gradient-btn">
                          {toggling === e.id ? "…" : "Done"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {done.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Completed ({done.length})</p>
                <div className="space-y-2 opacity-70">
                  {done.map(e => (
                    <div key={e.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-4 flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-600 line-through truncate">{e.lesson.title}</p>
                        <span className="text-xs text-gray-400">{e.lesson.subject}</span>
                      </div>
                      <button onClick={() => handleToggle(e.id)} className="text-xs text-gray-400 hover:text-gray-600 shrink-0">Undo</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
