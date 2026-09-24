"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getWeekEntries, getTimetable, getChildren } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import { useMounted } from "@/lib/useMounted";
import { format, addDays, startOfWeek } from "date-fns";
import Navbar from "@/components/Navbar";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-[#EAF0E7] text-[#3F5D46] border-[#D7E0D3]",
  English: "bg-[#F3ECE8] text-[#765D52] border-[#E5D9D1]",
  Science: "bg-[#E8F0E8] text-[#3F5D46] border-[#D1DED0]",
  History: "bg-[#F8F0DA] text-[#8A6A22] border-[#EADBAE]",
  Geography: "bg-[#EAF2EC] text-[#48654E] border-[#D4E1D6]",
  Computing: "bg-[#ECECF5] text-[#5C607D] border-[#DADCEC]",
  Cooking: "bg-[#F7EDE5] text-[#8A624B] border-[#E9D7C9]",
  "Art & Design": "bg-[#F7E9ED] text-[#8B5968] border-[#E8CCD4]",
  "Design and Technology": "bg-[#F4E9E6] text-[#8A5A52] border-[#E5D2CD]",
  "Life Skills": "bg-[#E7F0ED] text-[#4F6E64] border-[#CFDED8]",
  Languages: "bg-[#F3ECE8] text-[#765D52] border-[#E5D9D1]",
  "RSHE (PSHE)": "bg-[#EEEAF4] text-[#675E7E] border-[#DDD5E8]",
};

function subjectColor(s: string) {
  return SUBJECT_COLORS[s] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

export default function PrintPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const weekDates = DAYS.map((_, i) => addDays(weekStart, i));
  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const res = await getWeekEntries(weekStartStr, selectedChildId ?? undefined);
    setEntries(res.data);
    setLoading(false);
  }, [weekStartStr, selectedChildId]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    getTimetable().then(res => setTimetable(res.data.config)).catch(() => {});
    getChildren().then(res => setChildren(res.data)).catch(() => {});
  }, [router]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const getEntry = (dayDate: Date, subject: string): PlannerEntry | null =>
    entries.find(e =>
      e.scheduled_date === format(dayDate, "yyyy-MM-dd") && e.lesson.subject === subject
    ) ?? null;

  const allSubjects = Array.from(
    new Set([
      ...DAYS.flatMap(d => timetable[d] ?? []),
      ...entries.map(e => e.lesson.subject),
    ])
  );

  const plannedCount = entries.length;
  const completedCount = entries.filter(e => e.is_complete).length;
  const remainingCount = Math.max(0, plannedCount - completedCount);
  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                  More
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Print Week</h1>
                <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                  Review the week, choose a child and print a clean paper or PDF copy.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B]"
              >
                Print / Save PDF
              </button>
            </div>
          </div>

          <div className="brand-card p-4 mb-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekStart(d => addDays(d, -7))}
                  className="w-10 h-10 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#3F5D46] font-bold hover:border-[#8FA382]"
                  aria-label="Previous week"
                >
                  ←
                </button>

                <div className="px-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Week</p>
                  <p className="text-sm font-bold text-[#2E342F] mt-0.5">
                    {format(weekStart, "d MMM")} – {format(addDays(weekStart, 4), "d MMM yyyy")}
                  </p>
                </div>

                <button
                  onClick={() => setWeekStart(d => addDays(d, 7))}
                  className="w-10 h-10 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#3F5D46] font-bold hover:border-[#8FA382]"
                  aria-label="Next week"
                >
                  →
                </button>
              </div>

              {children.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Viewing</span>
                  <select
                    value={selectedChildId ?? ""}
                    onChange={e => setSelectedChildId(e.target.value ? parseInt(e.target.value) : null)}
                    className="border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                  >
                    <option value="">All children</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="brand-card p-4">
              <p className="text-2xl font-bold text-[#2E342F]">{plannedCount}</p>
              <p className="text-xs font-semibold text-[#6E5A46] mt-1">Planned</p>
            </div>
            <div className="brand-card p-4">
              <p className="text-2xl font-bold text-[#3F5D46]">{completedCount}</p>
              <p className="text-xs font-semibold text-[#6E5A46] mt-1">Completed</p>
            </div>
            <div className="brand-card p-4">
              <p className="text-2xl font-bold text-[#D19A32]">{remainingCount}</p>
              <p className="text-xs font-semibold text-[#6E5A46] mt-1">Remaining</p>
            </div>
          </div>

          <div className="brand-card p-5 overflow-x-auto">
            {loading ? (
              <p className="text-sm text-[#8A7A69] py-8 text-center">Loading week…</p>
            ) : (
              <WeeklyTable
                weekDates={weekDates}
                timetable={timetable}
                allSubjects={allSubjects}
                getEntry={getEntry}
              />
            )}
          </div>
        </div>
      </div>

      <div className="hidden print:block p-0">
        <div className="mb-5">
          <div className="flex items-end justify-between gap-4 border-b border-[#D8D1C4] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8FA382]">
                Bright Roots Home Learning
              </p>
              <h1 className="text-2xl font-bold text-[#2E342F] mt-1">
                Week of {format(weekStart, "d MMMM yyyy")}
              </h1>
              {selectedChild && (
                <p className="text-sm text-[#6E5A46] mt-1">{selectedChild.username}&apos;s weekly plan</p>
              )}
            </div>

            <div className="text-right text-xs text-[#6E5A46]">
              <p><span className="font-bold text-[#2E342F]">{completedCount}</span> of {plannedCount} complete</p>
            </div>
          </div>
        </div>

        {!loading && (
          <WeeklyTable
            weekDates={weekDates}
            timetable={timetable}
            allSubjects={allSubjects}
            getEntry={getEntry}
            printMode
          />
        )}

        <div className="mt-5 pt-3 border-t border-[#D8D1C4] text-[10px] text-[#8A7A69] flex justify-between">
          <span>Bright Roots Home Learning</span>
          <span>Printed {mounted ? format(new Date(), "d MMMM yyyy") : ""}</span>
        </div>
      </div>
    </div>
  );
}

function WeeklyTable({
  weekDates,
  timetable,
  allSubjects,
  getEntry,
  printMode = false,
}: {
  weekDates: Date[];
  timetable: Record<string, string[]>;
  allSubjects: string[];
  getEntry: (dayDate: Date, subject: string) => PlannerEntry | null;
  printMode?: boolean;
}) {
  return (
    <table className={`w-full border-collapse ${printMode ? "text-[10px]" : "text-sm"}`}>
      <thead>
        <tr>
          <th className="border border-[#D8D1C4] bg-[#3F5D46] text-white px-3 py-3 text-left font-bold w-[130px]">
            Subject
          </th>
          {DAYS.map((day, i) => (
            <th key={day} className="border border-[#D8D1C4] bg-[#3F5D46] text-white px-3 py-3 text-left font-bold">
              <div>{day}</div>
              <div className="text-[11px] font-normal text-white/70 mt-0.5">
                {format(weekDates[i], "d MMM")}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {allSubjects.map(subject => (
          <tr key={subject}>
            <td className={`border px-3 py-3 font-bold text-xs align-top ${subjectColor(subject)}`}>
              {subject}
            </td>

            {DAYS.map((day, di) => {
              const inDay = timetable[day]?.includes(subject);
              const entry = getEntry(weekDates[di], subject);

              return (
                <td
                  key={day}
                  className="border border-[#E7DFD1] bg-[#FFFDF8] px-3 py-3 align-top min-w-[150px]"
                >
                  {!inDay && !entry ? (
                    <span className="text-[#DDD3C4]">—</span>
                  ) : entry ? (
                    <div>
                      <p className="font-semibold text-[#2E342F] leading-snug">{entry.lesson.title}</p>

                      {!printMode && entry.lesson.description && (
                        <p className="text-xs text-[#8A7A69] mt-1 leading-snug line-clamp-2">
                          {entry.lesson.description}
                        </p>
                      )}

                      <div className="mt-2">
                        {entry.is_complete ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#3F5D46] bg-[#E8F0E8] px-2 py-1 rounded-full">
                            ✓ Complete
                          </span>
                        ) : (
                          <span className="inline-flex text-[10px] font-bold uppercase tracking-wide text-[#8A7A69] bg-[#F0ECE6] px-2 py-1 rounded-full">
                            Planned
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#CFC6B9]">No lesson</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
