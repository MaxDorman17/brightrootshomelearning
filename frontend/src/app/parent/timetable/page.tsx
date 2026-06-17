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
  Maths: "bg-blue-50 border-blue-200 text-blue-700",
  English: "bg-purple-50 border-purple-200 text-purple-700",
  Science: "bg-green-50 border-green-200 text-green-700",
  History: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Geography: "bg-cyan-50 border-cyan-200 text-cyan-700",
  Computing: "bg-indigo-50 border-indigo-200 text-indigo-700",
  Cooking: "bg-orange-50 border-orange-200 text-orange-700",
  "Art & Design": "bg-pink-50 border-pink-200 text-pink-700",
  "Design and Technology": "bg-red-50 border-red-200 text-red-700",
  "Life Skills": "bg-teal-50 border-teal-200 text-teal-700",
  Languages: "bg-rose-50 border-rose-200 text-rose-700",
  "RSHE (PSHE)": "bg-violet-50 border-violet-200 text-violet-700",
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

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2F5D3A]">Timetable</h1>
            <p className="text-gray-500 mt-1">Customise subjects for each day of the week</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#A8C67A]/50 text-[#2F5D3A] hover:bg-[#A8C67A]/10 transition-all">
              Reset to defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-[#2F5D3A] text-white hover:bg-[#6EA76E] transition-all disabled:opacity-60 shadow-sm">
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {DAYS.map(day => (
              <div key={day} className="bg-white rounded-2xl shadow-sm border border-[#A8C67A]/30 overflow-hidden">
                {/* Day header */}
                <div className="bg-[#2F5D3A] px-4 py-3">
                  <h2 className="text-white font-bold text-sm">{day}</h2>
                  <p className="text-white/60 text-xs mt-0.5">{timetable[day]?.length ?? 0} subjects</p>
                </div>

                {/* Subject list */}
                <div className="p-3 space-y-1.5 min-h-[120px]">
                  {(timetable[day] ?? []).map((subject, i) => (
                    <div key={i} className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold ${subjectColor(subject)}`}>
                      <span className="flex-1 truncate">{subject}</span>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moveSubject(day, i, -1)}
                          disabled={i === 0}
                          className="text-current opacity-40 hover:opacity-80 disabled:opacity-20 leading-none text-[10px]">
                          ▲
                        </button>
                        <button
                          onClick={() => moveSubject(day, i, 1)}
                          disabled={i === (timetable[day]?.length ?? 0) - 1}
                          className="text-current opacity-40 hover:opacity-80 disabled:opacity-20 leading-none text-[10px]">
                          ▼
                        </button>
                      </div>
                      <button
                        onClick={() => removeSubject(day, i)}
                        className="text-current opacity-40 hover:opacity-80 ml-1 text-xs leading-none">
                        ✕
                      </button>
                    </div>
                  ))}
                  {(timetable[day]?.length ?? 0) === 0 && (
                    <p className="text-gray-300 text-xs text-center pt-4">No subjects</p>
                  )}
                </div>

                {/* Add subject input */}
                <div className="px-3 pb-3">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Add subject…"
                      value={newSubjects[day] ?? ""}
                      onChange={e => setNewSubjects(prev => ({ ...prev, [day]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && addSubject(day)}
                      className="flex-1 text-xs border border-[#A8C67A]/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#6EA76E] bg-[#F7F9F7]"
                    />
                    <button
                      onClick={() => addSubject(day)}
                      className="bg-[#2F5D3A] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-[#6EA76E] transition-all">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save reminder */}
        {!saved && !loading && (
          <div className="mt-6 text-center">
            <p className="text-sm text-[#7A5C3E]">
              Remember to hit <strong>Save changes</strong> when you&apos;re done.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
