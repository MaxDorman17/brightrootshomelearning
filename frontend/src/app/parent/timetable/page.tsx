"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { checkSession, getChildren, getTimetable, resetChildTimetable, saveFamilySchemes, saveTimetable } from "@/lib/api";
import SchemePicker from "@/components/SchemePicker";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DEFAULT_TIMETABLE: Record<string, string[]> = {
  Monday:    ["Maths", "English", "Science", "History", "Computing"],
  Tuesday:   ["Maths", "English", "Science", "Geography", "Cooking"],
  Wednesday: ["Maths", "English", "Science", "Art & Design", "Design and Technology"],
  Thursday:  ["Maths", "English", "Science", "History", "Life Skills"],
  Friday:    ["Maths", "English", "Science", "RSHE (PSHE)"],
};

const SUBJECT_COLORS: Record<string, string> = {
  Maths: "bg-brand-tint border-brand-mist text-brand-sage",
  English: "bg-[#F3ECE8] border-[#E5D9D1] text-[#765D52]",
  Science: "bg-brand-tint border-brand-mist text-brand-sage",
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
  // The schemes the family uses (Twinkl, White Rose Maths...), offered first when a lesson is given a scheme.
  const [schemes, setSchemes] = useState<string[]>([]);
  const [schemesState, setSchemesState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    checkSession()
      .then(res => { if (Array.isArray(res.data.family_schemes)) setSchemes(res.data.family_schemes); })
      .catch(() => {});
  }, []);

  const changeSchemes = async (next: string[]) => {
    setSchemes(next);
    setSchemesState("saving");
    try {
      await saveFamilySchemes(next);
      setSchemesState("saved");
    } catch {
      setSchemesState("error");
    }
  };

  // Whose timetable is on screen: the family's (null) or one child's.
  const [kids, setKids] = useState<{ id: number; username: string }[]>([]);
  const [who, setWho] = useState<number | null>(null);
  // False when the chosen child has no timetable of their own yet and is following the family's.
  const [own, setOwn] = useState(true);
  const whoName = kids.find(k => k.id === who)?.username ?? "";

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    getChildren().then(res => setKids(res.data || [])).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") return;
    setLoading(true);
    getTimetable(who ?? undefined)
      .then(res => {
        setTimetable(res.data.config);
        setOwn(who === null ? true : res.data.own !== false);
        setSaved(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [who]);

  const chooseWho = (next: number | null) => {
    if (!saved && !confirm("You have changes that aren't saved. Leave them and switch?")) return;
    setWho(next);
  };

  const backToFamily = async () => {
    if (who === null) return;
    if (!confirm(`Remove ${whoName}'s own timetable? ${whoName} will follow the family timetable again. Lessons already planned stay where they are.`)) return;
    await resetChildTimetable(who);
    const res = await getTimetable(who);
    setTimetable(res.data.config);
    setOwn(false);
    setSaved(true);
  };

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
      await saveTimetable(timetable, who ?? undefined);
      if (who !== null) setOwn(true);
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
              <PageHero art="timetable" tint={0}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage mb-2">
                More
              </p>
              <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Timetable</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Set the subjects for each school day. The planner lays out the week from this. Children can share one timetable or each have their own.
              </p>
              </PageHero>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-2 rounded-xl text-xs font-bold ${
                saved
                  ? "bg-brand-tint text-brand-sage"
                  : "bg-[#F8F0DA] text-[#8A6A22]"
              }`}>
                {saved ? "Saved" : "Unsaved changes"}
              </span>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-[#D8D1C4] bg-brand-white text-[#6E5A46] text-sm font-bold hover:border-brand-softsage"
              >
                Reset to defaults
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark disabled:opacity-60"
              >
                {saving ? "Saving…" : saved ? "Saved ✓" : who !== null && !own ? `Save as ${whoName}'s own` : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {kids.length > 0 && (
          <div className="brand-card mb-6 p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Whose timetable?</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Whose timetable">
              {[{ id: null as number | null, username: "Whole family" }, ...kids].map(k => {
                const on = who === k.id;
                return (
                  <button
                    key={k.id ?? "family"}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => chooseWho(k.id)}
                    className={
                      "rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors " +
                      (on ? "border-brand-softsage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46] hover:border-brand-softsage")
                    }
                  >
                    {k.username}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 max-w-3xl text-sm text-[#6E5A46]">
              {who === null
                ? "This is the family timetable. Every child follows it unless you give them one of their own: pick a child above to do that."
                : own
                  ? `${whoName} has their own timetable. The planner, ${whoName}'s own page and new units all use it.`
                  : `${whoName} is following the family timetable, shown below. Change anything and press Save to give ${whoName} a timetable of their own. The family one stays as it is.`}
            </p>
            {who !== null && own && (
              <button type="button" onClick={backToFamily} className="mt-3 rounded-xl border border-[#D8D1C4] bg-brand-white px-4 py-2 text-sm font-bold text-[#A64F42] hover:border-brand-softsage">
                Go back to the family timetable
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#2E342F]">{totalSubjects}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Weekly subject slots</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-brand-sage">{busiestDay.count}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Busiest day · {busiestDay.day}</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#D19A32]">{lightestDay.count}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Lightest day · {lightestDay.day}</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-brand-softsage">{DAYS.length}</p>
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
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
                        School day
                      </p>
                      <h2 className="text-lg font-bold text-[#2E342F] mt-1">{day}</h2>
                    </div>

                    <span className="text-xs font-bold text-brand-sage bg-brand-tint px-2.5 py-1 rounded-full">
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
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-softsage mb-2">
                      Add subject
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={newSubjects[day] ?? ""}
                        onChange={e => setNewSubjects(prev => ({ ...prev, [day]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && addSubject(day)}
                        className="flex-1 min-w-0 border border-[#D8D1C4] bg-brand-white rounded-xl px-3 py-2.5 text-xs text-[#2E342F] focus:outline-none focus:border-brand-softsage"
                      />

                      <button
                        onClick={() => addSubject(day)}
                        className="w-10 h-10 rounded-xl bg-brand-sage text-white text-lg font-bold hover:bg-brand-sagedark"
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

        <div className="brand-card mt-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-[#2E342F]">What you use for lessons</h2>
            <p className="text-xs font-semibold text-[#6E5A46]" aria-live="polite">
              {schemesState === "saving" ? "Saving…" : schemesState === "saved" ? "Saved" : schemesState === "error" ? "Could not save. Try again." : ""}
            </p>
          </div>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-[#6E5A46]">
            Tick the schemes you use. They are offered first when you give a lesson or unit a scheme. Changes save straight away.
          </p>
          <SchemePicker value={schemes} onChange={changeSchemes} />
        </div>
      </div>
    </div>
  );
}
