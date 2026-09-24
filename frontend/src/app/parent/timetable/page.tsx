"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getTimetable, saveTimetable } from "@/lib/api";
import Navbar from "@/components/Navbar";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DEFAULT_TIMETABLE: Record<string, string[]> = {
  Monday:    ["Maths", "English", "Science", "History", "Computing"],
  Tuesday:   ["Maths", "English", "Science", "Geography", "Cooking"],
  Wednesday: ["Maths", "English", "Science", "Art & Design", "Design and Technology"],
  Thursday:  ["Maths", "English", "Science", "History", "Life Skills"],
  Friday:    ["Maths", "English", "Science", "RSHE (PSHE)"],
};

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-[#EAF0E7] border-[#D7E0D3] text-[#3F5D46]",
  English: "bg-[#F3ECE8] border-[#E5D9D1] text-[#765D52]",
  Science: "bg-[#E8F0E8] border-[#D1DED0] text-[#3F5D46]",
  History: "bg-[#F8F0DA] border-[#EADBAE] text-[#8A6A22]",
  Geography: "bg-[#EAF2EC] border-[#D4E1D6] text-[#48654E]",
  Computing: "bg-[#ECECF5] border-[#DADCEC] text-[#5C607D]",
  Cooking: "bg-[#F7EDE5] border-[#E9D7C9] text-[#8A624B]",
  "Art & Design": "bg-[#F7E9ED] border-[#E8CCD4] text-[#8B5968]",
  "Design and Technology": "bg-[#F4E9E6] border-[#E5D2CD] text-[#8A5A52]",
  "Life Skills": "bg-[#E7F0ED] border-[#CFDED8] text-[#4F6E64]",
  Languages: "bg-[#F3ECE8] border-[#E5D9D1] text-[#765D52]",
  "RSHE (PSHE)": "bg-[#EEEAF4] border-[#DDD5E8] text-[#675E7E]",
};

function subjectColor(subject: string) {
  return SUBJECT_COLORS[subject] ?? "bg-gray-50 border-gray-200 text-gray-700";
}

export default function TimetablePage() {
  const router = useRouter();
  const [timetable, setTimetable] = useState<Record<string, string[]>>(DEFAULT_TIMETABLE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSubjects, setNewSubjects] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    getTimetable()
      .then(res => setTimetable(res.data.config))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const removeSubject = (day: string, index: number) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addSubject = (day: string) => {
    const val = (newSubjects[day] ?? "").trim();
    if (!val) return;
    setTimetable(prev => ({
      ...prev,
      [day]: [...(prev[day] ?? []), val],
    }));
    setNewSubjects(prev => ({ ...prev, [day]: "" }));
    setSaved(false);
  };

  const moveSubject = (day: string, index: number, direction: -1 | 1) => {
    const subjects = [...(timetable[day] ?? [])];
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= subjects.length) return;
    [subjects[index], subjects[newIdx]] = [subjects[newIdx], subjects[index]];
    setTimetable(prev => ({ ...prev, [day]: subjects }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTimetable(timetable);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTimetable(DEFAULT_TIMETABLE);
    setSaved(false);
  };

  const counts = DAYS.map(day => ({
    day,
    count: timetable[day]?.length ?? 0,
  }));
  const totalSubjects = counts.reduce((sum, item) => sum + item.count, 0);
  const busiestDay = counts.reduce((best, item) => item.count > best.count ? item : best, counts[0]);
  const lightestDay = counts.reduce((best, item) => item.count < best.count ? item : best, counts[0]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                More
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Timetable</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Set the subject order for each school day. The planner uses this structure when laying out the week.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-2 rounded-xl text-xs font-bold ${
                saved
                  ? "bg-[#E8F0E8] text-[#3F5D46]"
                  : "bg-[#F8F0DA] text-[#8A6A22]"
              }`}>
                {saved ? "Saved" : "Unsaved changes"}
              </span>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] text-sm font-bold hover:border-[#8FA382]"
              >
                Reset to defaults
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-60"
              >
                {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#2E342F]">{totalSubjects}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Weekly subject slots</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#3F5D46]">{busiestDay.count}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Busiest day · {busiestDay.day}</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#D19A32]">{lightestDay.count}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Lightest day · {lightestDay.day}</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#8FA382]">{DAYS.length}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">School days</p>
          </div>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading timetable…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DAYS.map(day => {
              const subjects = timetable[day] ?? [];

              return (
                <div key={day} className="brand-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                        School day
                      </p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">{day}</h2>
                    </div>

                    <span className="text-xs font-bold text-[#3F5D46] bg-[#E8F0E8] px-2.5 py-1 rounded-full">
                      {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[240px]">
                    {subjects.map((subject, i) => (
                      <div
                        key={`${subject}-${i}`}
                        className={`rounded-xl border p-3.5 flex items-center gap-3 ${subjectColor(subject)}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center text-[11px] font-bold shrink-0">
                          {i + 1}
                        </span>

                        <span className="flex-1 min-w-0 text-sm font-bold leading-snug">
                          {subject}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => moveSubject(day, i, -1)}
                            disabled={i === 0}
                            className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white text-[11px] font-bold disabled:opacity-25"
                            aria-label={`Move ${subject} up`}
                          >
                            ↑
                          </button>

                          <button
                            onClick={() => moveSubject(day, i, 1)}
                            disabled={i === subjects.length - 1}
                            className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white text-[11px] font-bold disabled:opacity-25"
                            aria-label={`Move ${subject} down`}
                          >
                            ↓
                          </button>

                          <button
                            onClick={() => removeSubject(day, i)}
                            className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white text-sm font-bold"
                            aria-label={`Remove ${subject}`}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}

                    {subjects.length === 0 && (
                      <div className="rounded-xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-5 text-center">
                        <p className="text-sm text-[#8A7A69]">No subjects set.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#EEE6D9]">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                      Add subject
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={newSubjects[day] ?? ""}
                        onChange={e => setNewSubjects(prev => ({ ...prev, [day]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && addSubject(day)}
                        className="flex-1 min-w-0 border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-3 py-2.5 text-xs text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                      />

                      <button
                        onClick={() => addSubject(day)}
                        className="w-10 h-10 rounded-xl bg-[#3F5D46] text-white text-lg font-bold hover:bg-[#354F3B]"
                        aria-label={`Add subject to ${day}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
