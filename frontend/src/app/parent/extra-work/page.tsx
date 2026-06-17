"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { createLesson, createPlannerEntry, getAllEntries, deletePlannerEntry, getChildren } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, startOfDay } from "date-fns";

const TIMETABLE_SUBJECTS = new Set([
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
]);

const CATEGORIES = ["Reading", "Project", "Research", "Practice", "Creative Writing", "Other"];

const CATEGORY_COLOR: Record<string, string> = {
  Reading: "bg-blue-100 text-blue-800",
  Project: "bg-purple-100 text-purple-800",
  Research: "bg-green-100 text-green-800",
  Practice: "bg-yellow-100 text-yellow-800",
  "Creative Writing": "bg-pink-100 text-pink-800",
  Other: "bg-gray-100 text-gray-700",
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
    setEntries(res.data.filter((e: PlannerEntry) => !TIMETABLE_SUBJECTS.has(e.lesson.subject)));
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
      await createPlannerEntry({ lesson_id: lessonRes.data.id, scheduled_date: dueDate, assigned_to: assignedChildId ?? undefined });
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Extra Work</h1>
            <p className="text-gray-500 mt-1">Assign reading, projects, and additional tasks for your child</p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            className="bg-[#2F5D3A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6EA76E] transition-colors">
            + Add Task
          </button>
        </div>

        {/* Child filter */}
        {children.length > 0 && (
          <div className="flex gap-2 mb-5 flex-wrap">
            <button onClick={() => setFilterChildId(null)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${!filterChildId ? "bg-[#2F5D3A] text-white shadow-md" : "bg-white/80 border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"}`}>
              All children
            </button>
            {children.map(c => (
              <button key={c.id} onClick={() => setFilterChildId(c.id)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filterChildId === c.id ? "bg-[#2F5D3A] text-white shadow-md" : "bg-white/80 border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"}`}>
                {c.username}
              </button>
            ))}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">New Extra Task</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task title *</label>
                <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder="e.g. Read Chapter 5 of Matilda"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]" />
              </div>
              {children.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                  <select value={assignedChildId ?? ""} onChange={e => setAssignedChildId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]">
                    <option value="">All children</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                  </select>
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes for your child (optional)</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any instructions…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !title.trim()}
                className="bg-[#2F5D3A] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : "Add Task"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500">No extra tasks yet — click &ldquo;Add Task&rdquo; above.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">To Do ({pending.length})</p>
                <div className="space-y-3">
                  {pending.map(e => (
                    <div key={e.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLOR[e.lesson.subject] || "bg-gray-100 text-gray-700"}`}>
                              {e.lesson.subject}
                            </span>
                            <span className="text-xs text-gray-400">Due {format(parseISO(e.scheduled_date), "d MMM yyyy")}</span>
                            {e.assigned_to ? (
                              <span className="text-xs bg-[#A8C67A]/20 text-[#2F5D3A] px-2 py-0.5 rounded-full font-semibold">
                                {children.find(c => c.id === e.assigned_to)?.username ?? "Child"}
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">All</span>
                            )}
                            {!e.is_complete && parseISO(e.scheduled_date) < startOfDay(new Date()) && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">OVERDUE</span>
                            )}
                            {e.is_complete && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Done</span>}
                          </div>
                          <p className="font-semibold text-gray-900">{e.lesson.title}</p>
                          {e.lesson.description && (
                            <p className="text-sm text-gray-500 mt-1">{e.lesson.description}</p>
                          )}
                          {e.lesson.lesson_url && (
                            <a href={e.lesson.lesson_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-[#6EA76E] hover:underline mt-1 block truncate">🔗 {e.lesson.lesson_url}</a>
                          )}
                          {e.completed_work_url && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                              <p className="text-xs font-semibold text-green-700 mb-1">your child&apos;s submitted work:</p>
                              <a href={e.completed_work_url} target="_blank" rel="noopener noreferrer"
                                className="text-sm text-green-800 hover:underline break-all">{e.completed_work_url}</a>
                            </div>
                          )}
                        </div>
                        <button onClick={() => handleDelete(e.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors text-xl shrink-0 leading-none">×</button>
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
                    <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-600 line-through truncate">{e.lesson.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLOR[e.lesson.subject] || "bg-gray-100 text-gray-700"}`}>{e.lesson.subject}</span>
                      </div>
                      {e.completed_work_url && (
                        <a href={e.completed_work_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[#6EA76E] hover:underline shrink-0">View work →</a>
                      )}
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
