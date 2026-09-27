"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StudyTimer from "@/components/StudyTimer";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getTimetable } from "@/lib/api";
import { subjectsInTimetable } from "@/lib/subjects";

export default function TimerPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [label, setLabel] = useState("");
  const [entryId, setEntryId] = useState<number | null>(null);
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") {
      router.replace("/login");
      return;
    }
    // Opened from a lesson: /child/timer?entry=12&subject=Maths&label=Fractions
    const params = new URLSearchParams(window.location.search);
    const entry = Number(params.get("entry"));
    if (entry) setEntryId(entry);
    if (params.get("subject")) setSubject(params.get("subject") || "");
    if (params.get("label")) setLabel(params.get("label") || "");

    getTimetable()
      .then((res) => setSubjects(subjectsInTimetable(res.data.config || {})))
      .catch(() => {});
  }, [router]);

  const choices = subject && !subjects.includes(subject) ? [...subjects, subject] : subjects;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Focus</p>
        <h1 className="mt-1 text-3xl font-bold text-brand-charcoal">Study timer</h1>

        {phase === "idle" && (
          <div className="mt-5 space-y-3">
            {entryId && label ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-line bg-brand-white px-4 py-3">
                <p className="text-sm text-brand-charcoal">
                  <span className="font-bold">{subject}</span> · {label}
                </p>
                <button
                  onClick={() => {
                    setEntryId(null);
                    setLabel("");
                  }}
                  className="text-xs font-bold text-[#6E5A46] hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="mb-2 text-sm font-bold text-brand-charcoal">What are you working on?</p>
                  <div className="flex flex-wrap gap-2">
                    {[...choices, "Other"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubject(s === "Other" ? "" : s)}
                        className={
                          "rounded-xl border px-3 py-1.5 text-sm font-semibold " +
                          ((s === "Other" ? subject === "" : subject === s)
                            ? "border-brand-sage bg-brand-tint text-brand-sage"
                            : "border-brand-line bg-white text-[#6E5A46]")
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={255}
                  placeholder="What exactly? e.g. Times tables practice (optional)"
                  className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage"
                />
              </>
            )}
          </div>
        )}

        <div className="mt-6">
          <StudyTimer subject={subject} label={label} entryId={entryId} onPhaseChange={setPhase} />
        </div>
      </div>
    </div>
  );
}
