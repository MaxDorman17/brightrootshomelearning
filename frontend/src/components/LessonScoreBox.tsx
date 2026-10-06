"use client";

import { useEffect, useState } from "react";
import { clearLessonScore, setLessonScore } from "@/lib/api";
import { LessonScore } from "@/types";

type Props = {
  entryId: number;
  childId: number;
  /** Shown before the boxes when a lesson is shared by more than one child. */
  childName?: string;
  score?: LessonScore;
  onChanged: () => void;
};

const box =
  "w-16 rounded-xl border border-[#D9D1C4] bg-white px-2.5 py-2 text-center text-sm font-semibold text-brand-charcoal outline-none focus:border-brand-softsage";

/** Lets a parent type in a score for a planned lesson, e.g. 8 out of 10. Saves on its own button. */
export default function LessonScoreBox({ entryId, childId, childName, score, onChanged }: Props) {
  const [got, setGot] = useState(score ? String(score.score) : "");
  const [outOf, setOutOf] = useState(score ? String(score.total) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setGot(score ? String(score.score) : "");
    setOutOf(score ? String(score.total) : "");
  }, [score?.score, score?.total]);

  const changed = got !== (score ? String(score.score) : "") || outOf !== (score ? String(score.total) : "");
  const percent = score && score.total > 0 ? Math.round((score.score / score.total) * 100) : null;

  const save = async () => {
    const s = Number(got);
    const t = Number(outOf);
    if (got.trim() === "" || outOf.trim() === "" || Number.isNaN(s) || Number.isNaN(t)) return setError("Type the score and what it was out of.");
    if (t <= 0) return setError("The total must be more than 0.");
    if (s < 0 || s > t) return setError("The score should be between 0 and the total.");
    setSaving(true);
    setError("");
    try {
      await setLessonScore(entryId, { child_id: childId, score: s, total: t });
      onChanged();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not save the score.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    setError("");
    try {
      await clearLessonScore(entryId, childId);
      onChanged();
    } catch {
      setError("Could not remove the score.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E5A46]">
        {childName && <span className="min-w-[4.5rem] font-bold text-brand-charcoal">{childName}</span>}
        <input
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
          value={got}
          onChange={(e) => setGot(e.target.value)}
          aria-label={`Score${childName ? ` for ${childName}` : ""}`}
          placeholder="8"
          className={box}
        />
        <span>out of</span>
        <input
          type="number"
          min={1}
          step="any"
          inputMode="decimal"
          value={outOf}
          onChange={(e) => setOutOf(e.target.value)}
          aria-label={`Total${childName ? ` for ${childName}` : ""}`}
          placeholder="10"
          className={box}
        />
        {percent != null && !changed && <span className="font-bold text-brand-sage">{percent}%</span>}
        {(changed || !score) && (
          <button
            type="button"
            onClick={save}
            disabled={saving || got.trim() === "" || outOf.trim() === ""}
            className="rounded-xl bg-brand-sage px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save score"}
          </button>
        )}
        {score && !changed && (
          <button type="button" onClick={remove} disabled={saving} className="text-xs font-bold text-[#A64F42] underline disabled:opacity-40">
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-[#A64F42]">{error}</p>}
    </div>
  );
}
