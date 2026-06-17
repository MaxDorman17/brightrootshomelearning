"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getWeekEntries, getTimetable, getChildren } from "@/lib/api";
import { PlannerEntry, Child } from "@/types";
import { format, addDays, startOfWeek } from "date-fns";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-blue-50 text-blue-800 border-blue-200",
  English: "bg-purple-50 text-purple-800 border-purple-200",
  Science: "bg-green-50 text-green-800 border-green-200",
  History: "bg-yellow-50 text-yellow-800 border-yellow-200",
  Geography: "bg-cyan-50 text-cyan-800 border-cyan-200",
  Computing: "bg-indigo-50 text-indigo-800 border-indigo-200",
  Cooking: "bg-orange-50 text-orange-800 border-orange-200",
  "Art & Design": "bg-pink-50 text-pink-800 border-pink-200",
  "Design and Technology": "bg-red-50 text-red-800 border-red-200",
  "Life Skills": "bg-teal-50 text-teal-800 border-teal-200",
  Languages: "bg-rose-50 text-rose-800 border-rose-200",
};

function subjectColor(s: string) {
  return SUBJECT_COLORS[s] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

export default function PrintPage() {
  const router = useRouter();
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

  const allSubjects = Array.from(new Set(DAYS.flatMap(d => timetable[d] ?? [])));

  return (
    <div className="min-h-screen bg-white">
      {/* Controls — hidden when printing */}
      <div className="print:hidden bg-[#F7F9F7] border-b border-[#A8C67A]/30 px-4 py-3 flex flex-wrap items-center gap-3">
        <span className="font-extrabold text-[#2F5D3A] text-lg">Print week</span>

        {/* Week nav */}
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(d => addDays(d, -7))}
            className="px-3 py-1.5 rounded-lg border border-[#A8C67A]/40 text-[#2F5D3A] font-bold text-sm hover:bg-[#A8C67A]/10">←</button>
          <span className="text-sm font-semibold text-gray-700">
            {format(weekStart, "d MMM")} – {format(addDays(weekStart, 4), "d MMM yyyy")}
          </span>
          <button onClick={() => setWeekStart(d => addDays(d, 7))}
            className="px-3 py-1.5 rounded-lg border border-[#A8C67A]/40 text-[#2F5D3A] font-bold text-sm hover:bg-[#A8C67A]/10">→</button>
        </div>

        {/* Child selector */}
        {children.length > 0 && (
          <select
            value={selectedChildId ?? ""}
            onChange={e => setSelectedChildId(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-[#A8C67A]/40 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#2F5D3A] focus:outline-none focus:border-[#6EA76E] bg-white">
            <option value="">All children</option>
            {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
          </select>
        )}

        <button onClick={() => window.print()}
          className="ml-auto px-5 py-2 bg-[#2F5D3A] text-white font-bold rounded-xl text-sm hover:bg-[#6EA76E] transition-all shadow-sm">
          🖨️ Print
        </button>
      </div>

      {/* Printable content */}
      <div className="p-6 max-w-[1100px] mx-auto">
        {/* Print header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Bright Roots — Week of {format(weekStart, "d MMMM yyyy")}
          </h1>
          {selectedChildId && (
            <p className="text-gray-500 mt-1 font-semibold">
              {children.find(c => c.id === selectedChildId)?.username}&apos;s lesson plan
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-gray-400 print:hidden">Loading…</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-[#2F5D3A] text-white px-3 py-2 text-left font-bold w-[120px] rounded-tl-lg">Subject</th>
                {DAYS.map((day, i) => (
                  <th key={day} className="border border-gray-200 bg-[#2F5D3A] text-white px-3 py-2 text-left font-bold">
                    <div>{day}</div>
                    <div className="text-xs font-normal text-white/70">{format(weekDates[i], "d MMM")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSubjects.map((subject, si) => (
                <tr key={subject} className={si % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className={`border border-gray-200 px-3 py-2.5 font-semibold text-xs ${subjectColor(subject)}`}>
                    {subject}
                  </td>
                  {DAYS.map((day, di) => {
                    const inDay = timetable[day]?.includes(subject);
                    const entry = inDay ? getEntry(weekDates[di], subject) : null;
                    return (
                      <td key={day} className="border border-gray-200 px-3 py-2.5 align-top">
                        {!inDay ? (
                          <span className="text-gray-200 text-xs">—</span>
                        ) : entry ? (
                          <div>
                            <p className="font-semibold text-gray-800 leading-snug">{entry.lesson.title}</p>
                            {entry.lesson.description && (
                              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{entry.lesson.description}</p>
                            )}
                            {entry.is_complete && (
                              <span className="text-xs text-emerald-600 font-bold">✓ Done</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Print footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 hidden print:block text-xs text-gray-400">
          Bright Roots Home Learning · Printed {format(new Date(), "d MMMM yyyy")}
        </div>
      </div>
    </div>
  );
}
