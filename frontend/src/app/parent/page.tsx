"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  createLesson, updateLesson,
  getWeekEntries, getAllEntries, createPlannerEntry, updatePlannerEntry, deletePlannerEntry,
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
  // 2025-26
  { group: "2025-26", inservice: true,  label: "In-service days",         start: "2025-08-18", end: "2025-08-19" },
  { group: "2025-26",                   label: "Autumn break",            start: "2025-10-13", end: "2025-10-24" },
  { group: "2025-26", inservice: true,  label: "In-service day (14 Nov)", start: "2025-11-14", end: "2025-11-14" },
  { group: "2025-26",                   label: "Christmas & New Year",    start: "2025-12-22", end: "2026-01-02" },
  { group: "2025-26", inservice: true,  label: "In-service day (11 Feb)", start: "2026-02-11", end: "2026-02-11" },
  { group: "2025-26",                   label: "February additional",     start: "2026-02-12", end: "2026-02-13" },
  { group: "2025-26",                   label: "Spring break",            start: "2026-04-03", end: "2026-04-17" },
  { group: "2025-26",                   label: "May Day",                 start: "2026-05-04", end: "2026-05-04" },
  { group: "2025-26", inservice: true,  label: "In-service day (7 May)",  start: "2026-05-07", end: "2026-05-07" },
  { group: "2025-26",                   label: "June holiday",            start: "2026-06-01", end: "2026-06-01" },
  { group: "2025-26",                   label: "Summer 2026",             start: "2026-07-06", end: "2026-08-14" },

  // 2026-27
  { group: "2026-27", inservice: true,  label: "In-service days",         start: "2026-08-17", end: "2026-08-18" },
  { group: "2026-27",                   label: "Autumn break",            start: "2026-10-12", end: "2026-10-23" },
  { group: "2026-27", inservice: true,  label: "In-service day (13 Nov)", start: "2026-11-13", end: "2026-11-13" },
  { group: "2026-27",                   label: "Christmas & New Year",    start: "2026-12-23", end: "2027-01-05" },
  { group: "2026-27", inservice: true,  label: "In-service day (10 Feb)", start: "2027-02-10", end: "2027-02-10" },
  { group: "2026-27",                   label: "February additional",     start: "2027-02-11", end: "2027-02-12" },
  { group: "2026-27",                   label: "Spring break",            start: "2027-03-26", end: "2027-04-09" },
  { group: "2026-27",                   label: "May Day",                 start: "2027-05-03", end: "2027-05-03" },
  { group: "2026-27", inservice: true,  label: "In-service day (6 May)",  start: "2027-05-06", end: "2027-05-06" },
  { group: "2026-27",                   label: "June holiday",            start: "2027-06-07", end: "2027-06-07" },
  { group: "2026-27",                   label: "Summer 2027",             start: "2027-07-05", end: "2027-08-13" },
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
  existingEntries: PlannerEntry[],
): ScheduledItem[] {
  const subjectDays = DAYS.filter(d => (timetableConfig[d] ?? []).includes(subject));
  if (!subjectDays.length || !lessons.length) return [];
  const daysOffSet = new Set(daysOffList.map(d => d.date));
  const occupied = new Set(
    existingEntries
      .filter(e => !e.is_extra && e.lesson.subject === subject)
      .map(e => e.scheduled_date)
  );
  const result: ScheduledItem[] = [];
  const cur = new Date(startDateStr + "T12:00:00");
  for (const lesson of lessons) {
    let placed = false;
    for (let safety = 0; safety < 500; safety++) {
      const dow = cur.getDay();
      if (dow >= 1 && dow <= 5) {
        const dayName = DAYS[dow - 1];
        const dateStr = format(cur, "yyyy-MM-dd");
        if (subjectDays.includes(dayName) && !daysOffSet.has(dateStr) && !occupied.has(dateStr)) {
          result.push({ lesson, date: dateStr, dayName });
          occupied.add(dateStr);
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
  const [allEntries, setAllEntries] = useState<PlannerEntry[]>([]);
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
      setQuizResults((qr.data as OakQuizResult[]).reduce((acc, r) => ({ ...acc, [r.url]: r }), {}));
      setWeekQuizScores(ws.data);
    } catch { /* non-fatal */ }
    finally { setQuizLoading(false); }
  }, [weekStartStr, selectedChildId]);

  const loadData = useCallback(async () => {
    const [entriesRes, allEntriesRes, daysOffRes] = await Promise.all([
      getWeekEntries(weekStartStr, selectedChildId ?? undefined),
      getAllEntries(),
      getDaysOff(),
    ]);
    setEntries(entriesRes.data);
    setAllEntries(allEntriesRes.data);
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
  // Check worksheet availability once per distinct Oak lesson URL.
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
      const dateStr = format(dayDate, "yyyy-MM-dd");

      const slotOccupied = allEntries.some(
        e =>
          !e.is_extra &&
          e.scheduled_date === dateStr &&
          e.lesson.subject === qaSubject
      );

      if (slotOccupied) {
        alert("That day already has a lesson for this subject. Choose another day or subject.");
        return;
      }

      const lessonRes = await createLesson({
        title: qaTitle.trim(),
        subject: qaSubject,
        lesson_url: quickAdd.url || undefined,
      });

      await createPlannerEntry({
        lesson_id: lessonRes.data.id,
        scheduled_date: dateStr,
        assigned_to: qaAssignedTo ?? undefined,
      });

      await loadData();
      setQuickAdd(null);
      setQaTitle("");
      setQaSubject("");
      setQaAssignedTo(null);
    } finally {
      setQaSaving(false);
    }
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
        setOakError("No published lessons found in this unit. Check the URL.");
        return;
      }

      setOakLessons(data.lessons);
      setOakUnitTitle(data.unit_title || "");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      setOakError(
        err?.response?.data?.detail ||
          "Could not fetch lessons. Check the URL and try again."
      );
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

  const weekLabel = `${format(weekStart, "d MMM")} - ${format(addDays(weekStart, 4), "d MMM yyyy")}`;
  const selectedChild = children.find(c => c.id === selectedChildId);
  const allTimetableSubjects = Array.from(new Set(Object.values(timetable).flat())).sort();
  const oakSchedule: ScheduledItem[] = oakLessons.length > 0 && oakSubject && oakStartDate
    ? buildSchedule(oakLessons, oakSubject, oakStartDate, timetable, daysOff, allEntries)
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Planner header */}
        <div className="mb-6">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-brand-sage mb-1">Learning Planner</p>
              <h1 className="text-3xl font-extrabold text-brand-charcoal tracking-tight">
                Weekly Planner
              </h1>
              <p className="text-sm text-brand-earth/70 mt-1">
                Plan lessons, manage days off and keep the week organised.
              </p>
            </div>

            {children.length > 0 && (
              <div className="brand-card px-4 py-3 flex items-center gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-earth/60">
                    Viewing
                  </p>
                  <select
                    value={selectedChildId ?? ""}
                    onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                    className="text-sm font-bold text-brand-charcoal bg-transparent focus:outline-none cursor-pointer min-w-[130px]"
                  >
                    <option value="">All children</option>
                    {children.map(c => (
                      <option key={c.id} value={c.id}>{c.username}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="brand-card mt-5 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowOakImport(v => !v)}
                  title="Import a full Oak Academy unit"
                  className={`px-4 py-2 text-sm rounded-xl font-bold border transition-all ${
                    showOakImport
                      ? "bg-brand-sage text-white border-brand-sage"
                      : "bg-brand-white text-brand-charcoal border-brand-softsage/30 hover:border-brand-sage"
                  }`}
                >
                  Oak Unit
                </button>

                <button
                  onClick={() => setShowBookmarklet(v => !v)}
                  title="One-click lesson importer"
                  className={`px-4 py-2 text-sm rounded-xl font-bold border transition-all ${
                    showBookmarklet
                      ? "bg-brand-sage text-white border-brand-sage"
                      : "bg-brand-white text-brand-charcoal border-brand-softsage/30 hover:border-brand-sage"
                  }`}
                >
                  Quick Import
                </button>

                <button
                  onClick={() => setShowHolidayPanel(v => !v)}
                  className={`px-4 py-2 text-sm rounded-xl font-bold border transition-all ${
                    showHolidayPanel
                      ? "bg-brand-sage text-white border-brand-sage"
                      : "bg-brand-white text-brand-charcoal border-brand-softsage/30 hover:border-brand-sage"
                  }`}
                >
                  Holidays
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setWeekStart(d => addDays(d, -7))}
                  className="px-3 py-2 text-sm font-bold text-brand-charcoal bg-brand-cream border border-brand-softsage/25 rounded-xl hover:bg-brand-softsage/10 transition-colors"
                >
                  Previous
                </button>

                <div className="px-4 py-2 min-w-[190px] text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-earth/50">
                    Week
                  </p>
                  <p className="text-sm font-extrabold text-brand-charcoal">
                    {weekLabel}
                  </p>
                </div>

                <button
                  onClick={() => setWeekStart(d => addDays(d, 7))}
                  className="px-3 py-2 text-sm font-bold text-brand-charcoal bg-brand-cream border border-brand-softsage/25 rounded-xl hover:bg-brand-softsage/10 transition-colors"
                >
                  Next
                </button>

                <button
                  onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
                  className="gradient-btn px-4 py-2 text-sm"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Bookmarklet panel */}
        {showBookmarklet && (
          <div className="mb-4 bg-white/90 rounded-2xl border border-[#A8C67A]/40 shadow-sm p-5">
            <p className="text-sm font-extrabold text-gray-800 mb-1">
              One-click lesson importer
            </p>

            <p className="text-xs text-gray-500 mb-4">
              Drag the button below to your browser&apos;s bookmarks bar. Then when you&apos;re on Oak Academy (or any lesson site),
              click it and the lesson title and link will be sent straight to the planner for you.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href={`javascript:(function(){var t=encodeURIComponent(document.title);var u=encodeURIComponent(location.href);location.href='https://brightrootshomelearning.co.uk/parent?lesson_title='+t+'&lesson_url='+u;})();`}
                className="inline-flex items-center gap-2 bg-[#2F5D3A] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm cursor-grab active:cursor-grabbing select-none"
                onClick={e => {
                  e.preventDefault();
                  alert("Drag this button to your bookmarks bar.");
                }}
              >
                Add to Bright Roots
              </a>

              <p className="text-xs text-gray-400 italic">
                Drag this to your bookmarks bar
              </p>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Works on Oak National Academy, BBC Bitesize, YouTube, and any other site.
            </p>
          </div>
        )}
        {/* Oak Unit import panel */}
        {showOakImport && (
          <div className="mb-4 bg-white/90 rounded-2xl border border-[#A8C67A]/40 shadow-sm p-5">
            <p className="text-sm font-extrabold text-gray-800 mb-1">
              Import Oak Academy Unit
            </p>

            <p className="text-xs text-gray-500 mb-4">
              Paste a unit URL from Oak National Academy and all its lessons will be scheduled automatically on the correct days.
            </p>

            {/* Step 1: URL input */}
            <div className="flex gap-2 mb-3">
              <input
                value={oakUrl}
                onChange={e => {
                  setOakUrl(e.target.value);
                  setOakLessons([]);
                  setOakError("");
                }}
                onKeyDown={e => e.key === "Enter" && handleOakFetch()}
                placeholder="https://www.thenational.academy/pupils/programmes/..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8C67A]/50"
              />

              <button
                onClick={handleOakFetch}
                disabled={oakFetching || !oakUrl.trim()}
                className="px-4 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold disabled:opacity-50"
              >
                {oakFetching ? "Loading..." : "Fetch unit"}
              </button>
            </div>

            {oakError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                {oakError}
              </p>
            )}

            {oakLessons.length > 0 && (
              <div className="mt-4 space-y-4">
                <p className="text-sm font-bold text-gray-800">
                  {oakUnitTitle || "Oak unit"} - {oakLessons.length} lesson{oakLessons.length !== 1 ? "s" : ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                      Subject
                    </label>

                    <select
                      value={oakSubject}
                      onChange={e => setOakSubject(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                    >
                      <option value="">Pick subject</option>
                      {allTimetableSubjects.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                      Start from
                    </label>

                    <input
                      type="date"
                      value={oakStartDate}
                      onChange={e => setOakStartDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                      Assign to
                    </label>

                    <select
                      value={oakAssignedTo ?? ""}
                      onChange={e => setOakAssignedTo(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                    >
                      <option value="">All children</option>
                      {children.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {oakSubject && oakSchedule.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-500 mb-2">
                      Schedule preview
                    </p>

                    <div className="space-y-1.5">
                      {oakSchedule.slice(0, 6).map((item, i) => (
                        <div key={i} className="text-xs text-gray-700 flex justify-between gap-3">
                          <span className="font-semibold">{item.lesson.title}</span>
                          <span className="text-gray-400 shrink-0">{item.date}</span>
                        </div>
                      ))}

                      {oakSchedule.length > 6 && (
                        <p className="text-xs text-gray-400 pl-3">
                          Plus {oakSchedule.length - 6} more lesson{oakSchedule.length - 6 !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {oakSubject && oakSchedule.length === 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    No valid timetable slots were found for this subject from the selected date.
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleOakAdd}
                    disabled={oakAdding || !oakSubject || oakSchedule.length === 0}
                    className="px-4 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {oakAdding
                      ? "Adding to planner..."
                      : `Add ${oakSchedule.length} lesson${oakSchedule.length !== 1 ? "s" : ""} to planner`}
                  </button>

                  <button
                    onClick={() => {
                      setOakLessons([]);
                      setOakUrl("");
                      setOakSubject("");
                      setShowOakImport(false);
                    }}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
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
            <p className="text-sm font-extrabold text-gray-800 mb-0.5">Fife Council School Holidays</p>
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
                        {h.start === h.end ? h.start : `${h.start} - ${h.end}`}
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
                {importingHolidays ? "Adding..." : `Add ${selectedHolidayGroups.length} selected`}
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
        {/* Today at a glance */}
        {(() => {
          const today = new Date();
          const todayDayName = format(today, "EEEE");
          const todaySubjects = timetable[todayDayName] ?? [];

          if (todaySubjects.length === 0) return null;

          const todayEnt = todaySubjects
            .map(subject => getEntry(today, subject))
            .filter((entry): entry is PlannerEntry => Boolean(entry));

          const done = todayEnt.filter(e => e.is_complete).length;
          const total = todaySubjects.length;
          const submitted = todayEnt.filter(e => e.completed_work_url).length;

          return (
            <div className="brand-card mb-5 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-sage">
                    Today
                  </p>
                  <h2 className="text-lg font-extrabold text-brand-charcoal mt-1">
                    {format(today, "EEEE d MMMM")}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                  <div className="bg-brand-cream rounded-xl px-4 py-3 min-w-[105px]">
                    <p className="text-xl font-extrabold text-brand-sage">
                      {done}/{total}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-earth/60">
                      Completed
                    </p>
                  </div>

                  <div className="bg-brand-cream rounded-xl px-4 py-3 min-w-[105px]">
                    <p className="text-xl font-extrabold text-brand-terracotta">
                      {total - done}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-earth/60">
                      Remaining
                    </p>
                  </div>

                  <div className="bg-brand-cream rounded-xl px-4 py-3 min-w-[105px]">
                    <p className="text-xl font-extrabold text-brand-gold">
                      {submitted}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-earth/60">
                      Submitted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {/* Timetable grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-cols-5 gap-4 min-w-[1050px]">
            {DAYS.map((dayName, dayIndex) => {
              const dayDate = weekDates[dayIndex];
              const subjects = timetable[dayName] ?? [];
              const today = isToday(dayDate);
              const dayOff = isDayOff(dayDate);

              return (
                <div key={dayName} className="min-w-0">
                  <div
                    className={`rounded-2xl border px-4 py-3 mb-3 ${
                      dayOff
                        ? "bg-brand-terracotta/10 border-brand-terracotta/30"
                        : today
                          ? "bg-brand-sage text-white border-brand-sage"
                          : "bg-brand-white border-brand-softsage/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-[11px] font-extrabold uppercase tracking-widest ${
                            today ? "text-white/70" : "text-brand-earth/55"
                          }`}
                        >
                          {dayName}
                        </p>
                        <p
                          className={`text-2xl font-extrabold mt-0.5 ${
                            today ? "text-white" : "text-brand-charcoal"
                          }`}
                        >
                          {format(dayDate, "d")}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            today ? "text-white/70" : "text-brand-earth/60"
                          }`}
                        >
                          {format(dayDate, "MMMM")}
                        </p>
                      </div>

                      {dayOff && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-brand-terracotta text-white">
                          Day off
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <button
                        onClick={() => handleToggleDayOff(dayDate, "Sick")}
                        title={dayOff ? "Remove day off" : "Mark as sick day"}
                        className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                          dayOff
                            ? "bg-white/80 text-brand-terracotta border-brand-terracotta/20 hover:bg-white"
                            : today
                              ? "bg-white/15 text-white border-white/20 hover:bg-white/25"
                              : "bg-brand-cream text-brand-charcoal border-brand-softsage/20 hover:border-brand-sage"
                        }`}
                      >
                        {dayOff ? "Remove day off" : "Sick day"}
                      </button>

                      {!dayOff && (
                        <button
                          onClick={() => handleToggleDayOff(dayDate, "Holiday")}
                          title="Mark as holiday"
                          className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                            today
                              ? "bg-white/15 text-white border-white/20 hover:bg-white/25"
                              : "bg-brand-cream text-brand-charcoal border-brand-softsage/20 hover:border-brand-sage"
                          }`}
                        >
                          Holiday
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
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                                today
                                  ? "bg-white/15 text-white border-white/20 hover:bg-white/25"
                                  : "bg-brand-cream text-brand-charcoal border-brand-softsage/20 hover:border-brand-sage"
                              }`}
                            >Shift back</button>

                            <button
                              onClick={() => setShiftConfirm({
                                fromDate: dayStr,
                                toDate: toFwd,
                                fromLabel,
                                toLabel: format(new Date(toFwd + "T12:00:00"), "EEE d MMM"),
                                direction: "forward",
                              })}
                              title={`Shift all lessons from ${fromLabel} onwards forward 1 day`}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                                today
                                  ? "bg-white/15 text-white border-white/20 hover:bg-white/25"
                                  : "bg-brand-cream text-brand-charcoal border-brand-softsage/20 hover:border-brand-sage"
                              }`}
                            >
                              Shift forward
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {subjects.map(subject => {
                      const entry = getEntry(dayDate, subject);
                      const hasLesson = !!entry;
                      const dotClass = subjectDot[subject] || "bg-gray-400";

                      return (
                        <button
                          key={subject}
                          onClick={() => openModal(dayIndex, subject)}
                          className={`w-full text-left rounded-2xl border p-4 transition-all ${
                            hasLesson
                              ? "bg-brand-white border-brand-softsage/20 hover:border-brand-sage/40 hover:shadow-sm"
                              : "bg-brand-white/60 border-dashed border-brand-softsage/30 hover:bg-brand-white hover:border-brand-sage/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
                            <span className="text-xs font-extrabold text-brand-earth/70 truncate">
                              {subject}
                            </span>
                          </div>

                          {hasLesson ? (
                            <>
                              <p className="text-sm font-bold leading-snug text-brand-charcoal mt-2 line-clamp-2">
                                {entry.lesson.title}
                              </p>

                              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                                {entry.lesson.lesson_url && (
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-cream text-brand-earth">
                                    Lesson link
                                  </span>
                                )}

                                {entry.is_complete && (
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-sage text-white">
                                    Complete
                                  </span>
                                )}

                                {entry.completed_work_url && (
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-gold/20 text-brand-earth">
                                    Work submitted
                                  </span>
                                )}

                                {entry.assigned_to && (
                                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-softsage/15 text-brand-sage">
                                    {children.find(c => c.id === entry.assigned_to)?.username}
                                  </span>
                                )}

                                {entry.completed_work_url && quizResults[entry.completed_work_url] && (
                                  <>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                      Starter {quizResults[entry.completed_work_url].starter_score}/{quizResults[entry.completed_work_url].starter_total ?? 6}
                                    </span>

                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                      Exit {quizResults[entry.completed_work_url].exit_score}/{quizResults[entry.completed_work_url].exit_total ?? 6}
                                    </span>
                                  </>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-xs font-semibold text-brand-earth/45 mt-2">
                              + Add lesson
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Planner legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-earth/60">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-sage" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-gold" />
            Lesson link
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-terracotta" />
            Work submitted
          </span>
          <span className="ml-auto text-brand-earth/45">
            Click any lesson slot to add or edit
          </span>
        </div>

        {/* Weekly Goals */}
        <div className="mt-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-sage">
                Weekly focus
              </p>
              <h2 className="text-xl font-extrabold text-brand-charcoal mt-1">
                Weekly Goals
              </h2>
            </div>

            <span className="text-sm font-semibold text-brand-earth/60">
              {weekLabel}
            </span>
          </div>

          <div className="brand-card p-5">
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddGoal()}
                  placeholder="Add a goal for this week"
                  className="flex-1 text-sm bg-brand-white border border-brand-softsage/30 rounded-xl px-4 py-2.5 text-brand-charcoal placeholder:text-brand-earth/35 focus:outline-none focus:border-brand-sage transition-colors"
                />

                <button
                  onClick={handleAddGoal}
                  disabled={addingGoal || !newGoal.trim()}
                  className="gradient-btn px-5 py-2.5 text-sm disabled:opacity-50"
                >
                  {addingGoal ? "Adding..." : "Add goal"}
                </button>
              </div>

              {children.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-brand-earth/55">
                    Assign to:
                  </span>

                  <button
                    onClick={() => setGoalAssignedTo(null)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-all ${
                      goalAssignedTo === null
                        ? "bg-brand-sage text-white border-brand-sage"
                        : "bg-brand-white border-brand-softsage/25 text-brand-earth hover:border-brand-sage"
                    }`}
                  >
                    Everyone
                  </button>

                  {children.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setGoalAssignedTo(c.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-all ${
                        goalAssignedTo === c.id
                          ? "bg-brand-sage text-white border-brand-sage"
                          : "bg-brand-white border-brand-softsage/25 text-brand-earth hover:border-brand-sage"
                      }`}
                    >
                      {c.username}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {goals.length === 0 ? (
              <div className="rounded-xl bg-brand-cream px-4 py-6 text-center">
                <p className="text-sm font-semibold text-brand-earth/55">
                  No goals set for this week yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                      goal.is_complete
                        ? "bg-brand-softsage/10 border-brand-softsage/20"
                        : "bg-brand-cream/70 border-brand-softsage/15"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleGoal(goal.id)}
                      title={goal.is_complete ? "Mark incomplete" : "Mark complete"}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        goal.is_complete
                          ? "bg-brand-sage border-brand-sage text-white"
                          : "bg-brand-white border-brand-softsage/50 hover:border-brand-sage"
                      }`}
                    >
                      {goal.is_complete && (
                        <span className="text-xs font-extrabold">Done</span>
                      )}
                    </button>

                    <span
                      className={`flex-1 text-sm font-semibold ${
                        goal.is_complete
                          ? "line-through text-brand-earth/45"
                          : "text-brand-charcoal"
                      }`}
                    >
                      {goal.title}
                    </span>

                    {children.length > 0 && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-softsage/15 text-brand-sage">
                        {goal.assigned_to
                          ? children.find(c => c.id === goal.assigned_to)?.username ?? "Unknown"
                          : "Everyone"}
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      title="Delete goal"
                      className="text-xs font-bold text-brand-earth/35 hover:text-brand-terracotta transition-colors px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Quick Add modal */}
      {quickAdd && (
        <div
          className="fixed inset-0 bg-brand-charcoal/45 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setQuickAdd(null)}
        >
          <div className="bg-brand-white rounded-2xl border border-brand-softsage/20 shadow-xl w-full max-w-md p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-sage">
                Quick Import
              </p>
              <h3 className="text-xl font-extrabold text-brand-charcoal mt-1">
                Add to Planner
              </h3>
              <p className="text-xs text-brand-earth/45 truncate mt-1">
                {quickAdd.url}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                  Lesson title
                </label>
                <input
                  autoFocus
                  value={qaTitle}
                  onChange={e => setQaTitle(e.target.value)}
                  className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Day
                  </label>
                  <select
                    value={qaDayIndex}
                    onChange={e => {
                      const nextDayIndex = Number(e.target.value);
                      setQaDayIndex(nextDayIndex);

                      const validSubjects = timetable[DAYS[nextDayIndex]] ?? [];
                      if (qaSubject && !validSubjects.includes(qaSubject)) {
                        setQaSubject("");
                      }
                    }}
                    className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d} {format(weekDates[i], "d MMM")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Subject
                  </label>
                  <select
                    value={qaSubject}
                    onChange={e => setQaSubject(e.target.value)}
                    className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage"
                  >
                    <option value="">Pick subject</option>
                    {(timetable[DAYS[qaDayIndex]] ?? []).map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {children.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Assign to
                  </label>
                  <select
                    value={qaAssignedTo ?? ""}
                    onChange={e => setQaAssignedTo(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage"
                  >
                    <option value="">All children</option>
                    {children.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleQuickAdd}
                disabled={qaSaving || !qaTitle.trim() || !qaSubject}
                className="gradient-btn flex-1 py-2.5 text-sm disabled:opacity-50"
              >
                {qaSaving ? "Adding..." : "Add to Planner"}
              </button>

              <button
                onClick={() => setQuickAdd(null)}
                className="px-4 py-2.5 border border-brand-softsage/30 text-brand-earth rounded-xl font-bold text-sm hover:bg-brand-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shift schedule confirmation */}
      {shiftConfirm && (
        <div
          className="fixed inset-0 bg-brand-charcoal/45 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setShiftConfirm(null)}
        >
          <div className="bg-brand-white rounded-2xl border border-brand-softsage/20 shadow-xl w-full max-w-md p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Schedule change
            </p>

            <h3 className="text-xl font-extrabold text-brand-charcoal mt-1 mb-3">
              {shiftConfirm.direction === "forward"
                ? "Push schedule forward"
                : "Pull schedule back"}
            </h3>

            <p className="text-sm text-brand-earth/75 leading-relaxed">
              Move all lessons from{" "}
              <strong className="text-brand-charcoal">
                {shiftConfirm.fromLabel} onwards
              </strong>{" "}
              {shiftConfirm.direction === "forward" ? "forward" : "back"} to their
              next valid timetable slots?
            </p>

            <div className="bg-brand-gold/10 border border-brand-gold/25 rounded-xl px-4 py-3 mt-4">
              <p className="text-xs font-semibold text-brand-earth leading-relaxed">
                Each lesson stays with the correct subject day in your timetable.
                Days off and weekends are skipped, and future weeks move with the schedule.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleShiftDay}
                disabled={shifting}
                className="gradient-btn flex-1 py-2.5 text-sm disabled:opacity-50"
              >
                {shifting ? "Moving..." : "Move schedule"}
              </button>

              <button
                onClick={() => setShiftConfirm(null)}
                className="px-4 py-2.5 border border-brand-softsage/30 text-brand-earth rounded-xl font-bold text-sm hover:bg-brand-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson slot modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-brand-charcoal/45 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-brand-white rounded-2xl border border-brand-softsage/20 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`w-3 h-3 rounded-full shrink-0 ${
                  subjectDot[modal.subject] || "bg-gray-400"
                }`}
              />

              <div>
                <p className="text-xs font-semibold text-brand-earth/55">
                  {modal.dayName} - {format(modal.dayDate, "d MMMM yyyy")}
                </p>
                <h3 className="text-xl font-extrabold text-brand-charcoal">
                  {modal.subject}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                  Lesson title *
                </label>
                <input
                  autoFocus
                  value={slotTitle}
                  onChange={e => setSlotTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveSlot()}
                  placeholder={`e.g. ${modal.subject} introduction`}
                  className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                  Lesson link
                  <span className="font-medium text-brand-earth/45"> optional</span>
                </label>
                <input
                  value={slotUrl}
                  onChange={e => setSlotUrl(e.target.value)}
                  placeholder="https://www.thenational.academy/..."
                  type="url"
                  className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage"
                />

                {(() => {
                  const url = modal.existingEntry?.lesson.lesson_url;
                  const ws = url ? worksheetCache[url] : undefined;

                  return ws?.has_worksheet && ws.intro_url ? (
                    <a
                      href={ws.intro_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-xs font-bold text-brand-sage border border-brand-softsage/30 rounded-lg px-3 py-1.5 hover:bg-brand-softsage/10 transition-colors"
                    >
                      Open Worksheet
                    </a>
                  ) : null;
                })()}
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                  Notes for child
                  <span className="font-medium text-brand-earth/45"> optional</span>
                </label>
                <textarea
                  value={slotNotes}
                  onChange={e => setSlotNotes(e.target.value)}
                  rows={2}
                  placeholder="Any extra instructions"
                  className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage resize-none"
                />
              </div>

              {children.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-brand-charcoal mb-1.5">
                    Assign to
                  </label>
                  <select
                    value={slotAssignedTo ?? ""}
                    onChange={e => setSlotAssignedTo(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-brand-white border border-brand-softsage/30 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-charcoal focus:outline-none focus:border-brand-sage"
                  >
                    <option value="">All children</option>
                    {children.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleSaveSlot}
                disabled={slotSaving || !slotTitle.trim()}
                className="gradient-btn flex-1 min-w-[140px] py-2.5 text-sm disabled:opacity-50"
              >
                {slotSaving
                  ? "Saving..."
                  : modal.existingEntry
                    ? "Save Changes"
                    : "Add Lesson"}
              </button>

              {modal.existingEntry && (
                <button
                  onClick={handleDeleteSlot}
                  disabled={slotSaving}
                  className="px-4 py-2.5 border border-brand-terracotta/30 text-brand-terracotta rounded-xl font-bold text-sm hover:bg-brand-terracotta/5 transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2.5 border border-brand-softsage/30 text-brand-earth rounded-xl font-bold text-sm hover:bg-brand-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
