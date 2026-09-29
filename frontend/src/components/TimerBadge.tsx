"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { saveStudySession } from "@/lib/api";

// Shares the saved state with StudyTimer (same localStorage key and shape).
const STORAGE_KEY = "study_timer";
type Saved = {
  phase: "idle" | "running" | "paused" | "break" | "done";
  subject: string;
  label: string;
  entryId: number | null;
  plannedMinutes: number;
  endAt: number | null;
  remainingMs: number;
};

declare global {
  interface Window {
    __studyTimerOnPage?: boolean;
  }
}

function read(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

const mmss = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * A small countdown in the child's menu bar while a study timer is going, so it keeps showing on every page.
 * Tapping it goes back to the lesson. If the time runs out on a page without the full timer, it records the
 * session here so the minutes still count.
 */
export default function TimerBadge() {
  const [state, setState] = useState<Saved | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = async () => {
      const s = read();
      const t = Date.now();
      setNow(t);
      if (s && (s.phase === "running" || s.phase === "break") && s.endAt && t >= s.endAt && !window.__studyTimerOnPage) {
        if (s.phase === "running") {
          const done = { ...s, phase: "done" as const, endAt: null, remainingMs: 0 };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
          } catch {}
          setState(done);
          saveStudySession({
            planned_minutes: s.plannedMinutes,
            minutes: s.plannedMinutes,
            completed: true,
            subject: s.subject || null,
            label: s.label || null,
            entry_id: s.entryId,
          }).catch(() => {});
          return;
        }
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        setState(null);
        return;
      }
      setState(s);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!state || !["running", "paused", "break", "done"].includes(state.phase)) return null;

  const href = state.entryId ? `/child/lesson/${state.entryId}#timer` : "/child";
  const text =
    state.phase === "done"
      ? "Time's up! ✓"
      : state.phase === "paused"
        ? `Paused ${mmss(state.remainingMs)}`
        : `${state.phase === "break" ? "Break" : ""} ${mmss((state.endAt ?? 0) - now)}`.trim();

  return (
    <Link
      href={href}
      title="Back to your study timer"
      onClick={() => {
        // A finished timer has already been saved, so tapping it clears the badge.
        if (state.phase === "done") {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {}
          setState(null);
        }
      }}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold tabular-nums ${
        state.phase === "done" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/home/icons/timer.png?v=2" alt="" className="h-5 w-5 object-contain" />
      {text}
    </Link>
  );
}
