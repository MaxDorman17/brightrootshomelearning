"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { createLesson, createPlannerEntry, getAllEntries, deletePlannerEntry, getChildren } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, startOfDay } from "date-fns";

const CATEGORIES = ["Reading", "Project", "Research", "Practice", "Creative Writing", "Other"];

const CATEGORY_COLOR: Record<string, string> = {
  Reading: "bg-[#E8F0E8] text-[#3F5D46]",
  Project: "bg-[#F1ECE5] text-[#6E5A46]",
  Research: "bg-[#EAF2EC] text-[#48654E]",
  Practice: "bg-[#F8F0DA] text-[#8A6A22]",
  "Creative Writing": "bg-[#F7E9ED] text-[#8B5968]",
  Other: "bg-[#F0ECE6] text-[#6E6256]",
};

export default function ExtraWorkParentPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [filterChildId, setFilterChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [assignedChildId, setAssignedChildId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const res = await getAllEntries();
    setEntries(res.data.filter((e: PlannerEntry) => e.is_extra));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    getChildren().then(res => setChildren(res.data)).catch(() => {});
    loadData();
  }, [loadData, router]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const lessonRes = await createLesson({
        title,
        subject: category,
        description: notes || undefined,
        lesson_url: link || undefined,
      });
      await createPlannerEntry({ lesson_id: lessonRes.data.id, scheduled_date: dueDate, assigned_to: assignedChildId ?? undefined, is_extra: true });
      setTitle(""); setCategory(CATEGORIES[0]); setLink(""); setNotes("");
      setDueDate(format(new Date(), "yyyy-MM-dd")); setAssignedChildId(null);
      setShowForm(false);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this task?")) return;
    await deletePlannerEntry(id);
    await loadData();
  };

  const visibleEntries = filterChildId
    ? entries.filter(e => e.assigned_to === filterChildId || e.assigned_to === null)
    : entries;
  const pending = visibleEntries.filter(e => !e.is_complete);
  const done = visibleEntries.filter(e => e.is_complete);
  const overdue = pending.filter(e => parseISO(e.scheduled_date) < startOfDay(new Date()));

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Learning
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Extra Work</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Plan reading, projects, practice and one-off tasks outside the main timetable.
              </p>
            </div>

            <button
              onClick={() => setShowForm(v => !v)}
              className="px-5 py-3 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors"
            >
              {showForm ? "Close form" : "+ Add task"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#2E342F]">{visibleEntries.length}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Total tasks</p>
          </div>
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

        {children.length > 0 && (
          <div className="brand-card p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="mr-2">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Viewing</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterChildId(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    !filterChildId
                      ? "bg-[#3F5D46] border-[#3F5D46] text-white"
                      : "bg-[#FFFDF8] border-[#E7DFD1] text-[#6E5A46] hover:border-[#8FA382]"
                  }`}
                >
                  All children
                </button>

                {children.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFilterChildId(c.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                      filterChildId === c.id
                        ? "bg-[#3F5D46] border-[#3F5D46] text-white"
                        : "bg-[#FFFDF8] border-[#E7DFD1] text-[#6E5A46] hover:border-[#8FA382]"
                    }`}
                  >
                    {c.username}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="brand-card p-6 mb-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">New Task</p>
              <h2 className="text-xl font-bold text-[#2E342F] mt-1">Add extra work</h2>
              <p className="text-sm text-[#6E5A46] mt-1">
                Create a task outside the normal planner and optionally attach a link or instructions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Task title
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder="e.g. Read Chapter 5 of Matilda"
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>

              {children.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                    Assign to
                  </label>
                  <select
                    value={assignedChildId ?? ""}
                    onChange={e => setAssignedChildId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                  >
                    <option value="">All children</option>
                    {children.map(c => (
                      <option key={c.id} value={c.id}>{c.username}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Link
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Instructions or notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any instructions for the child…"
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : "Add task"}
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

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading tasks…</div>
        ) : entries.length === 0 ? (
          <div className="brand-card p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Extra Work</p>
            <h2 className="text-xl font-bold text-[#2E342F] mt-2">No extra tasks yet</h2>
            <p className="text-sm text-[#6E5A46] mt-2">
              Use Add task when you want to set work outside the main timetable.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="brand-card p-6">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">To Do</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                    Active tasks
                  </h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    {pending.length === 0
                      ? "Nothing waiting to be completed."
                      : `${pending.length} task${pending.length === 1 ? "" : "s"} still open.`}
                  </p>
                </div>
              </div>

              {pending.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-6 text-center">
                  <p className="text-sm font-semibold text-[#6E5A46]">All extra work is complete.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {pending.map(e => {
                    const childName = e.assigned_to
                      ? children.find(c => c.id === e.assigned_to)?.username ?? "Child"
                      : "All children";
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
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${CATEGORY_COLOR[e.lesson.subject] || CATEGORY_COLOR.Other}`}>
                              {e.lesson.subject}
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0ECE6] text-[#6E6256] font-semibold">
                              {childName}
                            </span>
                            {isOverdue && (
                              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAE4DA] text-[#A85F46] font-bold">
                                Overdue
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleDelete(e.id)}
                            className="text-[#B8B0A4] hover:text-[#A85F46] text-xl leading-none"
                            aria-label="Delete task"
                          >
                            ×
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-[#2E342F] mt-4">{e.lesson.title}</h3>

                        <p className="text-xs font-semibold text-[#8A7A69] mt-2">
                          Due {format(parseISO(e.scheduled_date), "d MMM yyyy")}
                        </p>

                        {e.lesson.description && (
                          <p className="text-sm text-[#6E5A46] mt-3 leading-relaxed">
                            {e.lesson.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#EEE6D9]">
                          {e.lesson.lesson_url && (
                            <a
                              href={e.lesson.lesson_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-bold text-[#3F5D46] hover:underline"
                            >
                              Open task
                            </a>
                          )}

                          {e.completed_work_url && (
                            <a
                              href={e.completed_work_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-bold text-[#D19A32] hover:underline"
                            >
                              View submitted work
                            </a>
                          )}
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
                  <p className="text-sm text-[#6E5A46] mt-1">
                    Finished extra tasks stay here for reference.
                  </p>
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

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${CATEGORY_COLOR[e.lesson.subject] || CATEGORY_COLOR.Other}`}>
                              {e.lesson.subject}
                            </span>

                            {e.completed_work_url && (
                              <a
                                href={e.completed_work_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#3F5D46] hover:underline"
                              >
                                View work
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-[#C4BBB0] hover:text-[#A85F46] text-lg leading-none"
                          aria-label="Delete completed task"
                        >
                          ×
                        </button>
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
