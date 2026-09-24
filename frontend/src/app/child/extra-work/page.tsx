"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllMyEntries, toggleComplete, submitWorkUrl } from "@/lib/api";
import { PlannerEntry } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, startOfDay } from "date-fns";

const CATEGORY_COLOR: Record<string, string> = {
  Reading: "bg-[#E8F0E8] border-[#C9D8C6] text-[#3F5D46]",
  Project: "bg-[#F1ECE5] border-[#DDD3C4] text-[#6E5A46]",
  Research: "bg-[#EAF2EC] border-[#D0DED2] text-[#48654E]",
  Practice: "bg-[#F8F0DA] border-[#EAD9A6] text-[#8A6A22]",
  "Creative Writing": "bg-[#F7E9ED] border-[#E8CCD4] text-[#8B5968]",
  Other: "bg-[#F0ECE6] border-[#DDD5CB] text-[#6E6256]",
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
    const extra = res.data.filter((e: PlannerEntry) => e.is_extra);
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
  const overdue = pending.filter(e => parseISO(e.scheduled_date) < startOfDay(new Date()));

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
            Learning
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Extra Work</h1>
          <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
            Extra tasks, projects and practice set for you.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#D19A32]">{pending.length}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">To do</p>
          </div>
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#3F5D46]">{done.length}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Completed</p>
          </div>
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#B66443]">{overdue.length}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Overdue</p>
          </div>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading tasks…</div>
        ) : entries.length === 0 ? (
          <div className="brand-card p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Extra Work</p>
            <h2 className="text-xl font-bold text-[#2E342F] mt-2">Nothing extra to do</h2>
            <p className="text-sm text-[#6E5A46] mt-2">Any new tasks will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="brand-card p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">To Do</p>
                <h2 className="text-xl font-bold text-[#2E342F] mt-1">Your active tasks</h2>
                <p className="text-sm text-[#6E5A46] mt-1">
                  {pending.length === 0
                    ? "Everything is complete."
                    : `${pending.length} task${pending.length === 1 ? "" : "s"} waiting for you.`}
                </p>
              </div>

              {pending.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-6 text-center">
                  <p className="text-sm font-semibold text-[#6E5A46]">All caught up.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pending.map(e => {
                    const isOverdue = parseISO(e.scheduled_date) < startOfDay(new Date());

                    return (
                      <div
                        key={e.id}
                        className={`rounded-2xl border p-5 ${
                          isOverdue
                            ? "bg-[#FFF8F4] border-[#E7CFC2]"
                            : "bg-[#FFFDF8] border-[#E7DFD1]"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                                CATEGORY_COLOR[e.lesson.subject] || CATEGORY_COLOR.Other
                              }`}>
                                {e.lesson.subject}
                              </span>

                              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0ECE6] text-[#6E6256] font-semibold">
                                Due {format(parseISO(e.scheduled_date), "d MMM yyyy")}
                              </span>

                              {isOverdue && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAE4DA] text-[#A85F46] font-bold">
                                  Overdue
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-bold text-[#2E342F] mt-4">{e.lesson.title}</h3>

                            {e.lesson.description && (
                              <div className="rounded-xl bg-[#F7F2E8] border border-[#E7DFD1] p-4 mt-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Instructions</p>
                                <p className="text-sm text-[#6E5A46] mt-1 leading-relaxed">
                                  {e.lesson.description}
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3 mt-4">
                              {e.lesson.lesson_url && (
                                <a
                                  href={e.lesson.lesson_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors"
                                >
                                  Open task
                                </a>
                              )}

                              <button
                                onClick={() => handleToggle(e.id)}
                                disabled={toggling === e.id}
                                className="px-4 py-2.5 rounded-xl border border-[#3F5D46] bg-[#FFFDF8] text-[#3F5D46] text-sm font-bold hover:bg-[#F7F2E8] disabled:opacity-50"
                              >
                                {toggling === e.id ? "Saving…" : "Mark complete"}
                              </button>
                            </div>
                          </div>

                          <div className="lg:w-80 shrink-0 rounded-xl bg-[#F7F2E8] border border-[#E7DFD1] p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                              Submit your work
                            </p>
                            <p className="text-xs text-[#6E5A46] mt-1">
                              Paste a results or evidence link when you are finished.
                            </p>

                            <input
                              value={workUrls[e.id] || ""}
                              onChange={ev => setWorkUrls(p => ({ ...p, [e.id]: ev.target.value }))}
                              placeholder="https://…"
                              className="w-full mt-3 text-sm border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#8FA382]"
                            />

                            <button
                              onClick={() => handleSubmit(e.id)}
                              disabled={submitting === e.id || !workUrls[e.id]?.trim()}
                              className="w-full mt-3 px-4 py-2.5 rounded-xl bg-[#D19A32] text-white text-sm font-bold hover:bg-[#B8842A] disabled:opacity-40"
                            >
                              {submitting === e.id ? "Submitting…" : e.completed_work_url ? "Update evidence" : "Submit evidence"}
                            </button>

                            {e.completed_work_url && (
                              <p className="text-xs font-semibold text-[#3F5D46] mt-2">
                                ✓ Evidence submitted
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="brand-card p-6">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">History</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Completed work</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">Your finished extra tasks stay here.</p>
                </div>
                <span className="text-sm font-bold text-[#3F5D46]">{done.length}</span>
              </div>

              {done.length === 0 ? (
                <p className="text-sm text-[#8A7A69]">No completed extra work yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {done.map(e => (
                    <div
                      key={e.id}
                      className="rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#E8F0E8] text-[#3F5D46] flex items-center justify-center font-bold shrink-0">
                          ✓
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#2E342F]">{e.lesson.title}</p>
                          <p className="text-xs text-[#8A7A69] mt-1">{e.lesson.subject}</p>

                          <div className="flex flex-wrap gap-3 mt-2">
                            {e.completed_work_url && (
                              <a
                                href={e.completed_work_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#3F5D46] hover:underline"
                              >
                                View evidence
                              </a>
                            )}

                            <button
                              onClick={() => handleToggle(e.id)}
                              disabled={toggling === e.id}
                              className="text-xs font-bold text-[#8A7A69] hover:underline"
                            >
                              Undo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
