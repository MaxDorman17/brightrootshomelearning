"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  createLesson, updateLesson,
  getWeekEntries, createPlannerEntry, updatePlannerEntry, deletePlannerEntry,
  getDaysOff, addDayOff, removeDayOff,
  getChildren, getGoals, createGoal, toggleGoal, deleteGoal,
  getTimetable, shiftDay, importOakUnit, checkOakWorksheet,
  getOakQuizResults, getWeekQuizScores,
} from "@/lib/api";
import { DayOff, PlannerEntry, Child, WeeklyGoal, OakQuizResult, WeekQuizScores } from "@/types";
import Navbar from "@/components/Navbar";
import { format, addDays, startOfWeek, isToday } from "date-fns";

const DEFAULT_TIMETABLE: Record<string, string[]> = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [],
};

interface WorksheetInfo { has_worksheet: boolean; intro_url: string | null; }

const OAK_LESSON_URL_RE = /^https:\/\/(?:www\.)?thenational\.academy\/pupils\/programmes\/[^/?#]+\/units\/[^/?#]+\/lessons\/[^/?#]+$/;
const isOakLessonUrl = (url?: string | null): url is string => !!url && OAK_LESSON_URL_RE.test(url);

interface FifeHoliday { label: string; start: string; end: string; inservice?: boolean; group: string; }

const FIFE_HOLIDAYS: FifeHoliday[] = [
  // 2025–26
  { group: "2025–26", inservice: true, label: "In-service days",         start: "2025-08-18", end: "2025-08-19" },
  { group: "2025–26",                  label: "Autumn break",            start: "2025-10-13", end: "2025-10-24" },
  { group: "2025–26", inservice: true, label: "In-service day (14 Nov)", start: "2025-11-14", end: "2025-11-14" },
  { group: "2025–26",                  label: "Christmas & New Year",    start: "2025-12-22", end: "2026-01-02" },
  { group: "2025–26", inservice: true, label: "In-service day (11 Feb)", start: "2026-02-11", end: "2026-02-11" },
  { group: "2025–26",                  label: "February additional",     start: "2026-02-12", end: "2026-02-13" },
  { group: "2025–26",                  label: "Spring break",            start: "2026-04-03", end: "2026-04-17" },
  { group: "2025–26",                  label: "May Day",                 start: "2026-05-04", end: "2026-05-04" },
  { group: "2025–26", inservice: true, label: "In-service day (7 May)",  start: "2026-05-07", end: "2026-05-07" },
  { group: "2025–26",                  label: "June holiday",            start: "2026-06-01", end: "2026-06-01" },
  { group: "2025–26",                  label: "Summer 2026",             start: "2026-07-06", end: "2026-08-14" },
  // 2026–27
  { group: "2026–27", inservice: true, label: "In-service days",         start: "2026-08-17", end: "2026-08-18" },
  { group: "2026–27",                  label: "Autumn break",            start: "2026-10-12", end: "2026-10-23" },
  { group: "2026–27", inservice: true, label: "In-service day (13 Nov)", start: "2026-11-13", end: "2026-11-13" },
  { group: "2026–27",                  label: "Christmas & New Year",    start: "2026-12-23", end: "2027-01-05" },
  { group: "2026–27", inservice: true, label: "In-service day (10 Feb)", start: "2027-02-10", end: "2027-02-10" },
  { group: "2026–27",                  label: "February additional",     start: "2027-02-11", end: "2027-02-12" },
  { group: "2026–27",                  label: "Spring break",            start: "2027-03-26", end: "2027-04-09" },
  { group: "2026–27",                  label: "May Day",                 start: "2027-05-03", end: "2027-05-03" },
  { group: "2026–27", inservice: true, label: "In-service day (6 May)",  start: "2027-05-06", end: "2027-05-06" },
  { group: "2026–27",                  label: "June holiday",            start: "2027-06-07", end: "2027-06-07" },
  { group: "2026–27",                  label: "Summer 2027",             start: "2027-07-05", end: "2027-08-13" },
];

function eachWeekday(start: string, end: string): string[] {
  const dates: string[] = [];
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const cur = new Date(s);
  while (cur <= e) {
    const d = cur.getDay();
    if (d >= 1 && d <= 5) dates.push(format(cur, "yyyy-MM-dd"));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

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
  "RSHE (PSHE)": "bg-violet-50 border-violet-200 text-violet-800",
};

const subjectDot: Record<string, string> = {
  Maths: "bg-blue-400", English: "bg-purple-400", Science: "bg-green-400",
  History: "bg-yellow-400", Geography: "bg-cyan-400", Computing: "bg-indigo-400",
  Cooking: "bg-orange-400", "Art & Design": "bg-pink-400",
  "Design and Technology": "bg-red-400", "Life Skills": "bg-teal-400",
  Languages: "bg-rose-400",
  "RSHE (PSHE)": "bg-violet-400",
};

interface SlotModal {
  dayName: string;
  dayDate: Date;
  subject: string;
  existingEntry: PlannerEntry | null;
}

interface ShiftConfirm {
  fromDate: string;
  toDate: string;
  fromLabel: string;
  toLabel: string;
  direction: "forward" | "backward";
}

interface OakLessonItem { title: string; url: string; }
interface ScheduledItem { lesson: OakLessonItem; date: string; dayName: string; }

function buildSchedule(
  lessons: OakLessonItem[],
  subject: string,
  startDateStr: string,
  timetableConfig: Record<string, string[]>,
  daysOffList: DayOff[],
): ScheduledItem[] {
  const subjectDays = DAYS.filter(d => (timetableConfig[d] ?? []).includes(subject));
  if (!subjectDays.length || !lessons.length) return [];
  const daysOffSet = new Set(daysOffList.map(d => d.date));
  const result: ScheduledItem[] = [];
  const cur = new Date(startDateStr + "T12:00:00");
  for (const lesson of lessons) {
    let placed = false;
    for (let safety = 0; safety < 500; safety++) {
      const dow = cur.getDay();
      if (dow >= 1 && dow <= 5) {
        const dayName = DAYS[dow - 1];
        const dateStr = format(cur, "yyyy-MM-dd");
        if (subjectDays.includes(dayName) && !daysOffSet.has(dateStr)) {
          result.push({ lesson, date: dateStr, dayName });
          placed = true;
          cur.setDate(cur.getDate() + 1);
          break;
        }
      }
      cur.setDate(cur.getDate() + 1);
    }
    if (!placed) break;
  }
  return result;
}

function nextWeekday(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0 || d.getDay() === 6);
  return format(d, "yyyy-MM-dd");
}

function prevWeekday(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  do { d.setDate(d.getDate() - 1); } while (d.getDay() === 0 || d.getDay() === 6);
  return format(d, "yyyy-MM-dd");
}

export default function ParentPlanner() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [daysOff, setDaysOff] = useState<DayOff[]>([]);
  const [timetable, setTimetable] = useState<Record<string, string[]>>(DEFAULT_TIMETABLE);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [goalAssignedTo, setGoalAssignedTo] = useState<number | null>(null);
  const [addingGoal, setAddingGoal] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [modal, setModal] = useState<SlotModal | null>(null);

  const [slotTitle, setSlotTitle] = useState("");
  const [slotUrl, setSlotUrl] = useState("");
  const [slotNotes, setSlotNotes] = useState("");
  const [slotAssignedTo, setSlotAssignedTo] = useState<number | null>(null);
  const [slotSaving, setSlotSaving] = useState(false);

  const [showHolidayPanel, setShowHolidayPanel] = useState(false);
  const [importingHolidays, setImportingHolidays] = useState(false);
  const [selectedHolidayGroups, setSelectedHolidayGroups] = useState<number[]>(
    Array.from({ length: FIFE_HOLIDAYS.length }, (_, i) => i)
  );

  const [shiftConfirm, setShiftConfirm] = useState<ShiftConfirm | null>(null);
  const [shifting, setShifting] = useState(false);

  const [quickAdd, setQuickAdd] = useState<{ title: string; url: string } | null>(null);
  const [qaTitle, setQaTitle] = useState("");
  const [qaSubject, setQaSubject] = useState("");
  const [qaDayIndex, setQaDayIndex] = useState(0);
  const [qaAssignedTo, setQaAssignedTo] = useState<number | null>(null);
  const [qaSaving, setQaSaving] = useState(false);
  const [showBookmarklet, setShowBookmarklet] = useState(false);

  const [showOakImport, setShowOakImport] = useState(false);
  const [oakUrl, setOakUrl] = useState("");
  const [oakFetching, setOakFetching] = useState(false);
  const [oakError, setOakError] = useState("");
  const [oakLessons, setOakLessons] = useState<OakLessonItem[]>([]);
  const [oakUnitTitle, setOakUnitTitle] = useState("");
  const [oakSubject, setOakSubject] = useState("");
  const [oakStartDate, setOakStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [oakAssignedTo, setOakAssignedTo] = useState<number | null>(null);
  const [oakAdding, setOakAdding] = useState(false);

  const [worksheetCache, setWorksheetCache] = useState<Record<string, WorksheetInfo>>({});
  const worksheetRequested = useRef<Set<string>>(new Set());
  const [quizResults, setQuizResults] = useState<Record<string, OakQuizResult>>({});
  const [weekQuizScores, setWeekQuizScores] = useState<WeekQuizScores | null>(null);
  const [quizLoading, setQuizLoading] = useState(true);

  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const weekEndStr = format(addDays(weekStart, 4), "yyyy-MM-dd");

  const loadQuizData = useCallback(async () => {
    try {
      const [qr, ws] = await Promise.all([
        getOakQuizResults(),
        getWeekQuizScores(weekStartStr, weekEndStr, selectedChildId ?? undefined),
      ]);
      setQuizResults(qr.data.reduce<Record<string, OakQuizResult>>((acc, r) => ({ ...acc, [r.url]: r }), {}));
      setWeekQuizScores(ws.data);
    } catch { /* non-fatal */ }
    finally { setQuizLoading(false); }
  }, [weekStartStr, selectedChildId]);

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
    getTimetable().then(res => setTimetable(res.data.config)).catch(() => {});
    loadData();
    loadGoals();
    loadQuizData();
    // Detect bookmarklet params
    const params = new URLSearchParams(window.location.search);
    const lt = params.get("lesson_title");
    const lu = params.get("lesson_url");
    if (lt && lu) {
      const dow = new Date().getDay();
      const defaultDay = dow >= 1 && dow <= 5 ? dow - 1 : 0;
      setQuickAdd({ title: lt, url: lu });
      setQaTitle(lt);
      setQaDayIndex(defaultDay);
      window.history.replaceState({}, "", "/parent");
    }
  }, [loadData, loadGoals, router]);

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
        assigned_to: goalAssignedTo ?? undefined,
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

  const handleImportHolidays = async () => {
    setImportingHolidays(true);
    try {
      const existing = new Set(daysOff.map(d => d.date));
      const selected = FIFE_HOLIDAYS.filter((_, i) => selectedHolidayGroups.includes(i));
      const fresh = selected.flatMap(h => eachWeekday(h.start, h.end)).filter(d => !existing.has(d));
      for (const date of fresh) {
        const res = await addDayOff({ date, reason: "School holiday" });
        setDaysOff(prev => [...prev, res.data]);
      }
      setShowHolidayPanel(false);
    } finally { setImportingHolidays(false); }
  };

  const handleQuickAdd = async () => {
    if (!quickAdd || !qaTitle.trim() || !qaSubject) return;
    setQaSaving(true);
    try {
      const dayDate = weekDates[qaDayIndex];
      const lessonRes = await createLesson({
        title: qaTitle.trim(),
        subject: qaSubject,
        lesson_url: quickAdd.url || undefined,
      });
      await createPlannerEntry({
        lesson_id: lessonRes.data.id,
        scheduled_date: format(dayDate, "yyyy-MM-dd"),
        assigned_to: qaAssignedTo ?? undefined,
      });
      await loadData();
      setQuickAdd(null);
      setQaTitle("");
      setQaSubject("");
      setQaAssignedTo(null);
    } finally { setQaSaving(false); }
  };

  const handleShiftDay = async () => {
    if (!shiftConfirm) return;
    setShifting(true);
    try {
      await shiftDay(shiftConfirm.fromDate, shiftConfirm.toDate, shiftConfirm.direction);
      await loadData();
      setShiftConfirm(null);
    } finally { setShifting(false); }
  };

  const handleOakFetch = async () => {
    setOakError("");
    setOakLessons([]);
    setOakUnitTitle("");
    if (!oakUrl.trim()) return;
    setOakFetching(true);
    try {
      const res = await importOakUnit(oakUrl.trim());
      const data = res.data;
      if (!data.lessons?.length) {
        setOakError("No published lessons found in this unit — check the URL.");
        return;
      }
      setOakLessons(data.lessons);
      setOakUnitTitle(data.unit_title || "");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      setOakError(err?.response?.data?.detail || "Could not fetch lessons — check the URL.");
    } finally {
      setOakFetching(false);
    }
  };

  const handleOakAdd = async () => {
    if (!oakSchedule.length) return;
    setOakAdding(true);
    try {
      for (const { lesson, date } of oakSchedule) {
        const lessonRes = await createLesson({
          title: lesson.title,
          subject: oakSubject,
          lesson_url: lesson.url,
        });
        await createPlannerEntry({
          lesson_id: lessonRes.data.id,
          scheduled_date: date,
          assigned_to: oakAssignedTo ?? undefined,
        });
      }
      await loadData();
      setOakLessons([]);
      setOakUrl("");
      setOakUnitTitle("");
      setOakSubject("");
      setShowOakImport(false);
    } finally {
      setOakAdding(false);
    }
  };

  const weekLabel = `${format(weekStart, "d MMM")} – ${format(addDays(weekStart, 4), "d MMM yyyy")}`;
  const selectedChild = children.find(c => c.id === selectedChildId);
  const allTimetableSubjects = Array.from(new Set(Object.values(timetable).flat())).sort();
  const oakSchedule: ScheduledItem[] = oakLessons.length > 0 && oakSubject && oakStartDate
    ? buildSchedule(oakLessons, oakSubject, oakStartDate, timetable, daysOff)
    : [];

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

            <button onClick={() => setShowOakImport(v => !v)}
              title="Import a full Oak Academy unit"
              className={`px-3 py-1.5 text-sm border rounded-xl font-semibold shadow-sm transition-all ${showOakImport ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "bg-white/80 border-white/60 hover:bg-white"}`}>
              🌳 Oak Unit
            </button>
            <button onClick={() => setShowBookmarklet(v => !v)}
              title="One-click lesson importer"
              className={`px-3 py-1.5 text-sm border rounded-xl font-semibold shadow-sm transition-all ${showBookmarklet ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "bg-white/80 border-white/60 hover:bg-white"}`}>
              🔗 Bookmarklet
            </button>
            <button onClick={() => setShowHolidayPanel(v => !v)}
              className={`px-3 py-1.5 text-sm border rounded-xl font-semibold shadow-sm transition-all ${showHolidayPanel ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "bg-white/80 border-white/60 hover:bg-white"}`}>
              🏴󠁧󠁢󠁳󠁣󠁴󠁿 Holidays
            </button>
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

        {/* Bookmarklet panel */}
        {showBookmarklet && (
          <div className="mb-4 bg-white/90 rounded-2xl border border-[#A8C67A]/40 shadow-sm p-5">
            <p className="text-sm font-extrabold text-gray-800 mb-1">🔗 One-click lesson importer</p>
            <p className="text-xs text-gray-500 mb-4">
              Drag the button below to your browser&apos;s bookmarks bar. Then when you&apos;re on Oak Academy (or any lesson site),
              click it and the lesson title and link will be sent straight to the planner for you.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href={`javascript:(function(){var t=encodeURIComponent(document.title);var u=encodeURIComponent(location.href);location.href='https://brightrootshomelearning.co.uk/parent?lesson_title='+t+'&lesson_url='+u;})();`}
                className="inline-flex items-center gap-2 bg-[#2F5D3A] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm cursor-grab active:cursor-grabbing select-none"
                onClick={e => { e.preventDefault(); alert("Drag this button to your bookmarks bar — don't click it here!"); }}>
                📎 Add to Bright Roots
              </a>
              <p className="text-xs text-gray-400 italic">← drag this to your bookmarks bar</p>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Works on Oak National Academy, BBC Bitesize, YouTube, and any other site.
            </p>
          </div>
        )}

        {/* Oak Unit import panel */}
        {showOakImport && (
          <div className="mb-4 bg-white/90 rounded-2xl border border-[#A8C67A]/40 shadow-sm p-5">
            <p className="text-sm font-extrabold text-gray-800 mb-1">🌳 Import Oak Academy Unit</p>
            <p className="text-xs text-gray-500 mb-4">
              Paste a unit URL from Oak National Academy and all its lessons will be scheduled automatically on the correct days.
            </p>

            {/* Step 1: URL input */}
            <div className="flex gap-2 mb-3">
              <input
                value={oakUrl}
                onChange={e => { setOakUrl(e.target.value); setOakLessons([]); setOakError(""); }}
                onKeyDown={e => e.key === "Enter" && handleOakFetch()}
                placeholder="https://www.thenational.academy/pupils/programmes/…/units/…"
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E] transition-colors"
              />
              <button
                onClick={handleOakFetch}
                disabled={oakFetching || !oakUrl.trim()}
                className="px-4 py-2 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold hover:bg-[#6EA76E] disabled:opacity-50 transition-colors shrink-0">
                {oakFetching ? "Loading…" : "Load lessons"}
              </button>
            </div>

            {oakError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">{oakError}</p>
            )}

            {/* Step 2: schedule options (shown after lessons loaded) */}
            {oakLessons.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
                <div className="bg-[#A8C67A]/20 rounded-xl px-3 py-2 text-sm font-bold text-[#2F5D3A]">
                  📚 {oakUnitTitle ? `${oakUnitTitle} — ` : ""}{oakLessons.length} lesson{oakLessons.length !== 1 ? "s" : ""} found
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Subject</label>
                    <select
                      value={oakSubject}
                      onChange={e => setOakSubject(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E]">
                      <option value="">Pick subject…</option>
                      {allTimetableSubjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Start from</label>
                    <input
                      type="date"
                      value={oakStartDate}
                      onChange={e => setOakStartDate(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E]"
                    />
                  </div>
                </div>

                {children.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Assign to</label>
                    <select
                      value={oakAssignedTo ?? ""}
                      onChange={e => setOakAssignedTo(e.target.value ? Number(e.target.value) : null)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E]">
                      <option value="">All children</option>
                      {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                    </select>
                  </div>
                )}

                {/* Schedule preview */}
                {oakSubject && oakSchedule.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-2">Schedule preview</p>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {oakSchedule.slice(0, 6).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">
                          <span className="font-bold text-[#2F5D3A] shrink-0">{item.date}</span>
                          <span className="text-gray-400 shrink-0">{item.dayName.slice(0, 3)}</span>
                          <span className="truncate">{item.lesson.title}</span>
                        </div>
                      ))}
                      {oakSchedule.length > 6 && (
                        <p className="text-xs text-gray-400 pl-3">…and {oakSchedule.length - 6} more</p>
                      )}
                    </div>
                  </div>
                )}

                {oakSubject && oakSchedule.length === 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    ⚠️ &ldquo;{oakSubject}&rdquo; doesn&apos;t appear on your timetable — add it in the Timetable page first.
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleOakAdd}
                    disabled={oakAdding || !oakSubject || oakSchedule.length === 0}
                    className="flex-1 bg-[#2F5D3A] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                    {oakAdding
                      ? "Adding to planner…"
                      : `Add ${oakSchedule.length} lesson${oakSchedule.length !== 1 ? "s" : ""} to planner`}
                  </button>
                  <button
                    onClick={() => { setOakLessons([]); setOakUrl(""); setOakSubject(""); setShowOakImport(false); }}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scottish holiday import panel */}
        {showHolidayPanel && (
          <div className="mb-4 bg-white/90 rounded-2xl border border-[#A8C67A]/40 shadow-sm p-5">
            <p className="text-sm font-extrabold text-gray-800 mb-0.5">🏴󠁧󠁢󠁳󠁣󠁴󠁿 Fife Council School Holidays</p>
            <p className="text-xs text-gray-500 mb-3">Tick the dates to add as days off. Uncheck Summer if you school year-round.</p>
            <div className="max-h-72 overflow-y-auto mb-4 space-y-0.5 pr-1">
              {FIFE_HOLIDAYS.map((h, i) => {
                const showHeader = i === 0 || FIFE_HOLIDAYS[i - 1].group !== h.group;
                return (
                  <div key={i}>
                    {showHeader && (
                      <p className={`text-[10px] font-extrabold text-[#2F5D3A] uppercase tracking-widest pb-1 ${i > 0 ? "pt-3 border-t border-gray-100 mt-2" : ""}`}>
                        {h.group}
                      </p>
                    )}
                    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                      <input type="checkbox" checked={selectedHolidayGroups.includes(i)}
                        onChange={e => setSelectedHolidayGroups(prev =>
                          e.target.checked ? [...prev, i] : prev.filter(x => x !== i)
                        )}
                        className="w-4 h-4 accent-[#2F5D3A] rounded cursor-pointer shrink-0" />
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-[#2F5D3A] transition-colors">
                        {h.label}
                      </span>
                      {h.inservice && (
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full shrink-0">in-service</span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto shrink-0">
                        {h.start === h.end ? h.start : `${h.start} → ${h.end}`}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleImportHolidays}
                disabled={importingHolidays || selectedHolidayGroups.length === 0}
                className="px-4 py-2 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                {importingHolidays ? "Adding…" : `Add ${selectedHolidayGroups.length} selected`}
              </button>
              <button onClick={() => setSelectedHolidayGroups(Array.from({ length: FIFE_HOLIDAYS.length }, (_, i) => i))}
                className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                Select all
              </button>
              <button onClick={() => setSelectedHolidayGroups([])}
                className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                Clear
              </button>
              <button onClick={() => setShowHolidayPanel(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors ml-auto">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Today at a glance strip */}
        {(() => {
          const todayDate = format(new Date(), "yyyy-MM-dd");
          const todayEnt = entries.filter(e => e.scheduled_date === todayDate);
          if (todayEnt.length === 0) return null;
          const done = todayEnt.filter(e => e.is_complete).length;
          const total = todayEnt.length;
          const submitted = todayEnt.filter(e => e.completed_work_url).length;
          return (
            <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
              <div className="flex-1 min-w-[80px] bg-white/80 rounded-2xl border border-white/60 shadow-sm px-4 py-3 text-center shrink-0">
                <p className="text-2xl font-extrabold text-[#2F5D3A]">{done}/{total}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Done today</p>
              </div>
              <div className="flex-1 min-w-[80px] bg-white/80 rounded-2xl border border-white/60 shadow-sm px-4 py-3 text-center shrink-0">
                <p className="text-2xl font-extrabold text-orange-500">{total - done}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Remaining</p>
              </div>
              <div className="flex-1 min-w-[80px] bg-white/80 rounded-2xl border border-white/60 shadow-sm px-4 py-3 text-center shrink-0">
                <p className="text-2xl font-extrabold text-teal-500">{submitted}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Submitted</p>
              </div>
              {done === total && (
                <div className="flex-1 min-w-[80px] bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl px-4 py-3 text-center shadow-sm shrink-0">
                  <p className="text-2xl">🎉</p>
                  <p className="text-[10px] text-white font-extrabold uppercase tracking-wide mt-0.5">Perfect!</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Timetable grid */}
        <div className="grid grid-cols-5 gap-3">
          {DAYS.map((dayName, dayIndex) => {
            const dayDate = weekDates[dayIndex];
            const subjects = timetable[dayName] ?? [];
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
                        {!dayOff && (() => {
                          const dayStr = format(dayDate, "yyyy-MM-dd");
                          const toFwd = nextWeekday(dayStr);
                          const toBwd = prevWeekday(dayStr);
                          const fromLabel = format(dayDate, "EEE d MMM");
                          return (
                            <>
                              <button
                                onClick={() => setShiftConfirm({
                                  fromDate: dayStr,
                                  toDate: toBwd,
                                  fromLabel,
                                  toLabel: format(new Date(toBwd + "T12:00:00"), "EEE d MMM"),
                                  direction: "backward",
                                })}
                                title={`Shift all lessons from ${fromLabel} onwards back 1 day`}
                                className="text-xs px-1.5 py-0.5 rounded-md font-bold bg-black/10 hover:bg-black/20 text-gray-600 transition-all">
                                ←
                              </button>
                              <button
                                onClick={() => setShiftConfirm({
                                  fromDate: dayStr,
                                  toDate: toFwd,
                                  fromLabel,
                                  toLabel: format(new Date(toFwd + "T12:00:00"), "EEE d MMM"),
                                  direction: "forward",
                                })}
                                title={`Shift all lessons from ${fromLabel} onwards forward 1 day`}
                                className="text-xs px-1.5 py-0.5 rounded-md font-bold bg-black/10 hover:bg-black/20 text-gray-600 transition-all">
                                →
                              </button>
                            </>
                          );
                        })()}
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
                              {/* Quiz scores from cached OakQuizResult */}
                              {entry.completed_work_url && quizResults[entry.completed_work_url] && (
                                <>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                    S:{quizResults[entry.completed_work_url].starter_score}/{quizResults[entry.completed_work_url].starter_total ?? 6}
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    E:{quizResults[entry.completed_work_url].exit_score}/{quizResults[entry.completed_work_url].exit_total ?? 6}
                                  </span>
                                </>
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
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-5">
            {/* Add goal input */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <input
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddGoal()}
                  placeholder="Add a goal for this week…"
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
              {children.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium shrink-0">For:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setGoalAssignedTo(null)}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold border transition-all ${goalAssignedTo === null ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "bg-white border-gray-200 text-gray-600 hover:border-[#A8C67A]"}`}
                    >
                      Everyone
                    </button>
                    {children.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setGoalAssignedTo(c.id)}
                        className={`text-xs px-3 py-1 rounded-lg font-semibold border transition-all ${goalAssignedTo === c.id ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "bg-white border-gray-200 text-gray-600 hover:border-[#A8C67A]"}`}
                      >
                        {c.username}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                    {children.length > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${goal.assigned_to ? "bg-[#A8C67A]/20 text-[#2F5D3A]" : "bg-gray-100 text-gray-500"}`}>
                        {goal.assigned_to ? children.find(c => c.id === goal.assigned_to)?.username ?? "?" : "Everyone"}
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

      {/* Quick Add modal — from bookmarklet */}
      {quickAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setQuickAdd(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📎</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add to Planner</h3>
                <p className="text-xs text-gray-400 truncate max-w-xs">{quickAdd.url}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson title</label>
                <input
                  autoFocus
                  value={qaTitle}
                  onChange={e => setQaTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select value={qaDayIndex} onChange={e => setQaDayIndex(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E] text-sm">
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>{d} {format(weekDates[i], "d MMM")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select value={qaSubject} onChange={e => setQaSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E] text-sm">
                    <option value="">Pick subject…</option>
                    {Array.from(new Set(Object.values(timetable).flat())).sort().map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              {children.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                  <select value={qaAssignedTo ?? ""}
                    onChange={e => setQaAssignedTo(e.target.value ? Number(e.target.value) : null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6EA76E] text-sm">
                    <option value="">All children</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleQuickAdd} disabled={qaSaving || !qaTitle.trim() || !qaSubject}
                className="flex-1 bg-[#2F5D3A] text-white py-2.5 rounded-xl font-bold hover:bg-[#6EA76E] transition-colors disabled:opacity-50">
                {qaSaving ? "Adding…" : "Add to Planner"}
              </button>
              <button onClick={() => setQuickAdd(null)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shift day confirmation */}
      {shiftConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setShiftConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <p className="text-lg font-extrabold text-gray-900 mb-2">
              {shiftConfirm.direction === "forward" ? "📅 Push schedule forward" : "📅 Pull schedule back"}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Move <strong>all lessons from {shiftConfirm.fromLabel} onwards</strong>{" "}
              {shiftConfirm.direction === "forward" ? "forward" : "back"} 1 day
              {" "}(to start on <strong>{shiftConfirm.toLabel}</strong>)?
            </p>
            <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-4">
              This includes every future week too — the whole schedule shifts, nothing gets lost.
            </p>
            <div className="flex gap-3">
              <button onClick={handleShiftDay} disabled={shifting}
                className="flex-1 bg-[#2F5D3A] text-white py-2.5 rounded-xl font-bold hover:bg-[#6EA76E] disabled:opacity-50 transition-colors">
                {shifting ? "Moving…" : "Yes, move them"}
              </button>
              <button onClick={() => setShiftConfirm(null)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                {(() => {
                  const url = modal.existingEntry?.lesson.lesson_url;
                  const ws = url ? worksheetCache[url] : undefined;
                  return ws?.has_worksheet && ws.intro_url ? (
                    <a
                      href={ws.intro_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-[#6EA76E] hover:text-[#2F5D3A] border border-[#A8C67A]/40 rounded-lg px-3 py-1.5 hover:bg-[#A8C67A]/10 transition-colors"
                    >
                      📄 Open Worksheet
                    </a>
                  ) : null;
                })()}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes for child (optional)</label>
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
