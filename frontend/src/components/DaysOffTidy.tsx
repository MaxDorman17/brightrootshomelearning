"use client";

import { useEffect, useState } from "react";
import { getLessonsOnDaysOff, moveLessonsOffDaysOff } from "@/lib/api";

/**
 * A quiet notice in the planner when lessons still to do are sitting on a day off, for example after a
 * holiday is added over a unit that was already planned. One press moves them, and the lessons of
 * that subject after them, on to the next free days in the same order.
 * `watch` is anything that changes when lessons or days off change, so the count is checked again.
 */
export default function DaysOffTidy({ watch, onMoved }: { watch: unknown; onMoved: () => void }) {
  const [count, setCount] = useState(0);
  const [moving, setMoving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    let current = true;
    getLessonsOnDaysOff()
      .then((res) => current && setCount(res.data.count))
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [watch]);

  const move = async () => {
    setMoving(true);
    setNote("");
    try {
      const res = await moveLessonsOffDaysOff();
      setCount(0);
      setNote(`Moved ${res.data.moved} lesson${res.data.moved === 1 ? "" : "s"} on to free days.`);
      onMoved();
    } catch {
      setNote("We couldn't move them just now. Please try again.");
    } finally {
      setMoving(false);
    }
  };

  if (!count && !note) return null;
  return (
    <div role="status" className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {count > 0 ? (
        <>
          <p className="min-w-0 flex-1">
            <b>
              {count} lesson{count === 1 ? " is" : "s are"} on a day off.
            </b>{" "}
            Move {count === 1 ? "it" : "them"} to the next free days? Later lessons in the same subject shuffle along too, so everything stays in order.
          </p>
          <button
            type="button"
            onClick={move}
            disabled={moving}
            className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-sagedark disabled:opacity-60"
          >
            {moving ? "Moving..." : "Move them"}
          </button>
        </>
      ) : (
        <p className="flex-1 font-bold">{note}</p>
      )}
    </div>
  );
}
