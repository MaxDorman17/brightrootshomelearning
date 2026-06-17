"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  createLesson, updateLesson,
  getWeekEntries, createPlannerEntry, updatePlannerEntry, deletePlannerEntry,
  getDaysOff, addDayOff, removeDayOff,
  getChildren, getGoals, createGoal, toggleGoal, deleteGoal,
} from "@/lib/api";
import { DayOff, PlannerEntry, Child, WeeklyGoal } from "@/types";
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

interface SlotModal {
  dayName: string;
  dayDate: Date;
  subject: string;
  existingEntry: PlannerEntry | null;
}

export default function ParentPlanner() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [daysOff, setDaysOff] = useState<DayOff[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [modal, setModal] = useState<SlotModal | null>(null);

  const [slotTitle, setSlotTitle] = useState("");
  const [slotUrl, setSlotUrl] = useState("");
  const [slotNotes, setSlotNotes] = useState("");
  const [slotAssignedTo, setSlotAssignedTo] = useState<number | null>(null);
  const [slotSaving, setSlotSaving] = useState(false);

  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  const loadData = useCallback(async () => {
    const [entriesRes, daysOffRes] = await Promise.all([
      getWeekEntries(weekStartStr, selectedChildId ?? undefined),
      getDaysOff(),
    ]);
    setEntries(entriesRes.data);
    setDaysOff(daysOffRes.data);
  }, [weekStartStr, selectedChildId]);

  const loadGoals = useCallback(async () => {
    const params: { week_start: string; assigned_to?: number } = { week_start: weekStartStr };
    if (selectedChildId) params.assigned_to = selectedChildId;
    const res = await getGoals(params);
    setGoals(res.data);
  }, [weekStartStr, selectedChildId]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    getChildren().then(res => setChildren(res.data)).catch(() => {});
    loadData();
    loadGoals();
  }, [loadData, loadGoals, router]);

  const weekDates = DAYS.map((_, i) => addDays(weekStart, i));

  const getEntry = (date: Date, subject: string): PlannerEntry | null =>
    entries.find(
      e => e.scheduled_date === format(date, "yyyy-MM-dd") && e.lesson.subject === subject
    ) ?? null;

  const openModal = (dayIndex: number, subject: string) => {
    const dayDate = weekDates[dayIndex];
    const existing = getEntry(dayDate, subject);
    setModal({ dayName: DAYS[dayIndex], dayDate, subject, existingEntry: existing });
    setSlotTitle(existing?.lesson.title ?? "");
    setSlotUrl(existing?.lesson.lesson_url ?? "");
    setSlotNotes(existing?.lesson.description ?? "");
    setSlotAssignedTo(existing?.assigned_to ?? selectedChildId ?? null);
  };

  const closeModal = () => { setModal(null); setSlotTitle(""); setSlotUrl(""); setSlotNotes(""); setSlotAssignedTo(null); };

  const handleSaveSlot = async () => {
    if (!modal || !slotTitle.trim()) return;
    setSlotSaving(true);
    try {
      if (modal.existingEntry) {
        await Promise.all([
          updateLesson(modal.existingEntry.lesson.id, {
            title: slotTitle,
            lesson_url: slotUrl || undefined,
            description: slotNotes || undefined,
          }),
          updatePlannerEntry(modal.existingEntry.id, {
            assigned_to: slotAssignedTo ?? null,
          }),
        ]);
      } else {
        const lessonRes = await createLesson({
          title: slotTitle,
          subject: modal.subject,
          lesson_url: slotUrl || undefined,
          description: slotNotes || undefined,
        });
        await createPlannerEntry({
          lesson_id: lessonRes.data.id,
          scheduled_date: format(modal.dayDate, "yyyy-MM-dd"),
          assigned_to: slotAssignedTo ?? undefined,
        });
      }
      await loadData();
      closeModal();
    } finally { setSlotSaving(false); }
  };

  const handleDeleteSlot = async () => {
    if (!modal?.existingEntry) return;
    if (!confirm("Remove this lesson from the planner?")) return;
    setSlotSaving(true);
    try {
      await deletePlannerEntry(modal.existingEntry.id);
      await loadData();
      closeModal();
    } finally { setSlotSaving(false); }
  };

  const isDayOff = (date: Date) => daysOff.some(d => d.date === format(date, "yyyy-MM-dd"));

  const handleToggleDayOff = async (date: Date, reason: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = daysOff.find(d => d.date === dateStr);
    if (existing) {
      await removeDayOff(existing.id);
      setDaysOff(prev => prev.filter(d => d.id !== existing.id));
    } else {
      const res = await addDayOff({ date: dateStr, reason });
      setDaysOff(prev => [...prev, res.data]);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    setAddingGoal(true);
    try {
      const res = await createGoal({
        week_start: weekStartStr,
        title: newGoal.trim(),
        assigned_to: selectedChildId ?? undefined,
      });
      setGoals(prev => [...prev, res.data]);
      setNewGoal("");
    } finally { setAddingGoal(false); }
  };

  const handleToggleGoal = async (id: number) => {
    const res = await toggleGoal(id);
    setGoals(prev => prev.map(g => g.id === id ? res.data : g));
  };

  const handleDeleteGoal = async (id: number) => {
    await deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const weekLabel = `${format(weekStart, "d MMM")} – ${format(addDays(weekStart, 4), "d MMM yyyy")}`;
  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="text-xl font-bold text-gray-900">Weekly Timetable</h1>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Child selector — only shown when there are linked children */}
            {children.length > 0 && (
              <div className="flex items-center gap-2 bg-white/80 border border-white/60 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="text-xs font-bold text-gray-500">Viewing:</span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                  className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All children</option>
                  {children.map(c => (
                    <option key={c.id} value={c.id}>{c.username}</option>
                  ))}
                </select>
              </div>
            )}

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
        <div className="grid grid-cols-5 gap-3">
          {DAYS.map((dayName, dayIndex) => {
            const dayDate = weekDates[dayIndex];
            const subjects = TIMETABLE[dayName];
            const today = isToday(dayDate);

            return (
              <div key={dayName}>
                {(() => {
                  const dayOff = isDayOff(dayDate);
                  return (
                    <div className={`rounded-2xl px-3 py-2.5 mb-2 text-center shadow-sm ${dayOff ? "bg-gradient-to-b from-amber-400 to-orange-400 text-white shadow-orange-200/60" : today ? "bg-gradient-to-b from-[#2F5D3A] to-[#6EA76E] text-white shadow-green-900/20" : "bg-white/80 backdrop-blur-sm border border-white/60 text-gray-700"}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide opacity-80">{dayName.slice(0, 3)}</p>
                      <p className="text-lg font-extrabold">{format(dayDate, "d")}</p>
                      <p className="text-xs opacity-70 font-semibold">{format(dayDate, "MMM")}</p>
                      {dayOff && <p className="text-xs font-extrabold mt-0.5">🤒 Day off</p>}
                      <div className="flex gap-1 justify-center mt-1.5">
                        <button onClick={() => handleToggleDayOff(dayDate, "Sick")}
                          title={dayOff ? "Remove day off" : "Mark as sick day"}
                          className={`text-xs px-1.5 py-0.5 rounded-md font-bold transition-all ${dayOff ? "bg-white/30 hover:bg-white/50" : "bg-black/10 hover:bg-black/20 text-gray-600"}`}>
                          {dayOff ? "✕" : "🤒"}
                        </button>
                        {!dayOff && (
                          <button onClick={() => handleToggleDayOff(dayDate, "Holiday")}
                            title="Mark as holiday"
                            className="text-xs px-1.5 py-0.5 rounded-md font-bold bg-black/10 hover:bg-black/20 text-gray-600 transition-all">
                            🏖️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  {subjects.map(subject => {
                    const entry = getEntry(dayDate, subject);
                    const hasLesson = !!entry;
                    const colorClass = SUBJECT_COLORS[subject] || "bg-gray-50 border-gray-200 text-gray-700";
                    const dotClass = subjectDot[subject] || "bg-gray-400";

                    return (
                      <button
                        key={subject}
                        onClick={() => openModal(dayIndex, subject)}
                        className={`w-full text-left rounded-xl border-2 p-3 transition-all hover:shadow-md hover:scale-[1.02] active:scale-100 ${hasLesson ? colorClass : "bg-white/60 border-dashed border-gray-200 hover:border-[#A8C67A] hover:bg-white/80"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                          <span className="text-xs font-semibold truncate">{subject}</span>
                        </div>
                        {hasLesson ? (
                          <>
                            <p className="text-xs font-medium leading-snug line-clamp-2 mt-1">{entry.lesson.title}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {entry.lesson.lesson_url && <span className="text-xs opacity-70">🔗</span>}
                              {entry.is_complete && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">✓</span>}
                              {entry.completed_work_url && <span className="text-xs opacity-70">📎 work</span>}
                              {entry.assigned_to && (
                                <span className="text-xs opacity-60">
                                  {children.find(c => c.id === entry.assigned_to)?.username}
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">+ Add lesson</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Completed</span>
          <span className="flex items-center gap-1">🔗 Has lesson link</span>
          <span className="flex items-center gap-1">📎 Work submitted</span>
          <span className="ml-auto text-gray-400">Click any slot to add or edit</span>
        </div>

        {/* Weekly Goals */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-extrabold text-gray-900">🎯 Weekly Goals</h2>
            <span className="text-sm text-gray-500 font-medium">{weekLabel}</span>
            {selectedChild && (
              <span className="text-xs bg-[#A8C67A]/20 text-[#2F5D3A] px-2 py-0.5 rounded-full font-bold">
                for {selectedChild.username}
              </span>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-5">
            {/* Add goal input */}
            <div className="flex gap-2 mb-4">
              <input
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddGoal()}
                placeholder={`Add a goal for this week${selectedChild ? ` for ${selectedChild.username}` : ""}…`}
                className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E] transition-colors"
              />
              <button
                onClick={handleAddGoal}
                disabled={addingGoal || !newGoal.trim()}
                className="gradient-btn text-sm px-4 py-2 disabled:opacity-50"
              >
                {addingGoal ? "…" : "Add"}
              </button>
            </div>

            {goals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No goals set for this week yet.</p>
            ) : (
              <div className="space-y-2">
                {goals.map(goal => (
                  <div key={goal.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${goal.is_complete ? "bg-emerald-50" : "bg-gray-50"}`}>
                    <button
                      onClick={() => handleToggleGoal(goal.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        goal.is_complete
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-gray-300 hover:border-[#6EA76E]"
                      }`}
                    >
                      {goal.is_complete && <span className="text-xs font-bold">✓</span>}
                    </button>
                    <span className={`flex-1 text-sm font-semibold ${goal.is_complete ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {goal.title}
                    </span>
                    {goal.assigned_to && children.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {children.find(c => c.id === goal.assigned_to)?.username}
                      </span>
                    )}
                    <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className={`w-3 h-3 rounded-full ${subjectDot[modal.subject] || "bg-gray-400"}`} />
              <div>
                <p className="text-xs text-gray-500">{modal.dayName} · {format(modal.dayDate, "d MMMM yyyy")}</p>
                <h3 className="text-lg font-bold text-gray-900">{modal.subject}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson title *</label>
                <input
                  autoFocus
                  value={slotTitle}
                  onChange={e => setSlotTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveSlot()}
                  placeholder={`e.g. ${modal.subject} — Introduction`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson link (optional)</label>
                <input
                  value={slotUrl}
                  onChange={e => setSlotUrl(e.target.value)}
                  placeholder="https://www.thenational.academy/…"
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Oscar (optional)</label>
                <textarea
                  value={slotNotes}
                  onChange={e => setSlotNotes(e.target.value)}
                  rows={2}
                  placeholder="Any extra instructions…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                />
              </div>

              {/* Assign to child */}
              {children.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                  <select
                    value={slotAssignedTo ?? ""}
                    onChange={e => setSlotAssignedTo(e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E] text-sm font-medium"
                  >
                    <option value="">All children</option>
                    {children.map(c => (
                      <option key={c.id} value={c.id}>{c.username}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveSlot} disabled={slotSaving || !slotTitle.trim()}
                className="flex-1 bg-[#2F5D3A] text-white py-2 rounded-lg font-medium hover:bg-[#6EA76E] transition-colors disabled:opacity-50">
                {slotSaving ? "Saving…" : modal.existingEntry ? "Save Changes" : "Add Lesson"}
              </button>
              {modal.existingEntry && (
                <button onClick={handleDeleteSlot} disabled={slotSaving}
                  className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                  Remove
                </button>
              )}
              <button onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
