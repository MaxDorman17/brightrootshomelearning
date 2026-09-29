"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveStudySession } from "@/lib/api";
import Emoji from "@/components/Emoji";

type Phase = "idle" | "running" | "paused" | "done" | "break";

type TimerState = {
  phase: Phase;
  plannedMinutes: number;
  endAt: number | null; // when running: the moment the countdown hits zero
  remainingMs: number; // when paused: time left
  subject: string;
  label: string;
  entryId: number | null;
};

type Props = {
  subject: string;
  label: string;
  entryId: number | null;
  /** Lets the page show or lock its subject picker. */
  onPhaseChange?: (phase: Phase) => void;
};

const STORAGE_KEY = "study_timer";
const PRESETS = [10, 15, 20, 25, 30, 45, 60];
const BREAK_MINUTES = 5;

function load(): TimerState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TimerState) : null;
  } catch {
    return null;
  }
}

function store(state: TimerState | null) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function chime() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.25;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  } catch {}
}

function mmss(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function StudyTimer({ subject, label, entryId, onPhaseChange }: Props) {
  const [state, setState] = useState<TimerState>({
    phase: "idle",
    plannedMinutes: 20,
    endAt: null,
    remainingMs: 0,
    subject,
    label,
    entryId,
  });
  const [customMinutes, setCustomMinutes] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [message, setMessage] = useState("");
  const finishing = useRef(false);
  const baseTitle = useRef<string | null>(null);

  // While the full timer is on the page it records sessions itself, so the menu-bar badge stands back.
  useEffect(() => {
    window.__studyTimerOnPage = true;
    return () => {
      window.__studyTimerOnPage = false;
    };
  }, []);

  // Pick up a timer that was running before a refresh or page change.
  useEffect(() => {
    const saved = load();
    if (saved && saved.phase !== "idle") setState(saved);
  }, []);

  // Keep the chosen lesson/subject in sync while nothing is running.
  useEffect(() => {
    setState((prev) => (prev.phase === "idle" ? { ...prev, subject, label, entryId } : prev));
  }, [subject, label, entryId]);

  useEffect(() => {
    onPhaseChange?.(state.phase);
  }, [state.phase, onPhaseChange]);

  const update = useCallback((next: TimerState) => {
    setState(next);
    store(next.phase === "idle" ? null : next);
  }, []);

  const remaining =
    state.phase === "running" || state.phase === "break"
      ? Math.max(0, (state.endAt ?? 0) - now)
      : state.phase === "paused"
        ? state.remainingMs
        : state.phase === "idle"
          ? state.plannedMinutes * 60000
          : 0;

  const save = useCallback(async (s: TimerState, minutes: number, completed: boolean) => {
    if (minutes < 1) return;
    try {
      await saveStudySession({
        planned_minutes: s.plannedMinutes,
        minutes,
        completed,
        subject: s.subject || null,
        label: s.label || null,
        entry_id: s.entryId,
      });
    } catch {
      setMessage("Your time couldn't be saved. Check your connection.");
    }
  }, []);

  // Tick, and finish when the countdown reaches zero (even if the tab was in the background).
  useEffect(() => {
    if (state.phase !== "running" && state.phase !== "break") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if ((state.phase === "running" || state.phase === "break") && state.endAt && now >= state.endAt && !finishing.current) {
      finishing.current = true;
      chime();
      if (state.phase === "running") {
        const done = { ...state, phase: "done" as Phase, endAt: null, remainingMs: 0 };
        update(done);
        save(state, state.plannedMinutes, true).finally(() => (finishing.current = false));
      } else {
        update({ ...state, phase: "idle", endAt: null, remainingMs: 0 });
        setMessage("Break's over. Ready for the next one?");
        finishing.current = false;
      }
    }
  }, [now, state, save, update]);

  // Show the time left in the browser tab.
  useEffect(() => {
    if (baseTitle.current === null) baseTitle.current = document.title;
    document.title =
      state.phase === "running" || state.phase === "break"
        ? `${mmss(remaining)} ${state.phase === "break" ? "break" : "study"} · Bright Roots`
        : baseTitle.current;
  }, [remaining, state.phase]);

  useEffect(
    () => () => {
      if (baseTitle.current !== null) document.title = baseTitle.current;
    },
    []
  );

  const start = (minutes: number) => {
    setMessage("");
    const clamped = Math.min(240, Math.max(1, Math.round(minutes)));
    setNow(Date.now());
    update({ ...state, subject, label, entryId, phase: "running", plannedMinutes: clamped, endAt: Date.now() + clamped * 60000, remainingMs: 0 });
  };

  const pause = () => update({ ...state, phase: "paused", remainingMs: remaining, endAt: null });
  const resume = () => {
    setNow(Date.now());
    update({ ...state, phase: "running", endAt: Date.now() + state.remainingMs, remainingMs: 0 });
  };

  const stop = async () => {
    const studiedMs = state.plannedMinutes * 60000 - remaining;
    const minutes = Math.floor(studiedMs / 60000);
    update({ ...state, phase: "idle", endAt: null, remainingMs: 0 });
    if (minutes >= 1) {
      await save(state, minutes, false);
      setMessage(`Saved ${minutes} minute${minutes === 1 ? "" : "s"} of study.`);
    } else {
      setMessage("Stopped. Less than a minute, so nothing was saved.");
    }
  };

  const takeBreak = () => {
    setNow(Date.now());
    update({ ...state, phase: "break", endAt: Date.now() + BREAK_MINUTES * 60000, remainingMs: 0 });
  };

  const finish = () => update({ ...state, phase: "idle", endAt: null, remainingMs: 0 });

  const total = state.phase === "break" ? BREAK_MINUTES * 60000 : state.plannedMinutes * 60000;
  const fraction = state.phase === "done" ? 1 : total ? 1 - remaining / total : 0;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="brand-card p-6 text-center sm:p-8">
      {(state.phase === "running" || state.phase === "paused") && (state.label || state.subject) && (
        <p className="mb-2 text-sm font-bold text-[#6E5A46]">
          {state.subject}
          {state.label && state.label !== state.subject ? ` · ${state.label}` : ""}
        </p>
      )}

      <div className="relative mx-auto h-56 w-56">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="14" className="stroke-brand-cream" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            className={state.phase === "break" ? "stroke-brand-lime" : state.phase === "done" ? "stroke-brand-leaf" : "stroke-brand-sage"}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {state.phase === "done" ? (
            <>
              <Emoji e="🎉" className="h-16 w-16" />
              <span className="mt-1 text-lg font-black text-brand-sage">Well done!</span>
            </>
          ) : (
            <>
              <span className="text-5xl font-black tabular-nums text-brand-charcoal" role="timer" aria-live="off">
                {mmss(remaining)}
              </span>
              <span className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-softsage">
                {state.phase === "break" ? "Break time" : state.phase === "paused" ? "Paused" : state.phase === "running" ? "Studying" : "Ready"}
              </span>
            </>
          )}
        </div>
      </div>

      {state.phase === "idle" && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-bold text-brand-charcoal">How long?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => setState({ ...state, plannedMinutes: m })}
                className={
                  "rounded-xl border px-4 py-2 text-sm font-bold " +
                  (state.plannedMinutes === m ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")
                }
              >
                {m} min
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={240}
              value={customMinutes}
              onChange={(e) => {
                setCustomMinutes(e.target.value);
                const v = Number(e.target.value);
                if (v >= 1 && v <= 240) setState({ ...state, plannedMinutes: Math.round(v) });
              }}
              placeholder="Other"
              aria-label="Other number of minutes"
              className="w-20 rounded-xl border border-brand-line bg-white px-3 py-2 text-center text-sm"
            />
          </div>
          <button onClick={() => start(state.plannedMinutes)} className="mt-5 rounded-2xl bg-brand-sage px-8 py-3.5 text-base font-extrabold text-white hover:bg-brand-sagedark">
            ▶ Start {state.plannedMinutes} minutes
          </button>
        </div>
      )}

      {state.phase === "running" && (
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={pause} className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white">⏸ Pause</button>
          <button onClick={stop} className="rounded-xl border border-brand-line bg-white px-6 py-3 text-sm font-bold text-[#6E5A46]">■ Stop</button>
        </div>
      )}

      {state.phase === "paused" && (
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={resume} className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white">▶ Resume</button>
          <button onClick={stop} className="rounded-xl border border-brand-line bg-white px-6 py-3 text-sm font-bold text-[#6E5A46]">■ Stop</button>
        </div>
      )}

      {state.phase === "done" && (
        <div className="mt-6">
          <p className="text-sm text-[#6E5A46]">You studied for {state.plannedMinutes} minutes. It&apos;s been saved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button onClick={takeBreak} className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white">☕ Take a {BREAK_MINUTES}-minute break</button>
            <button onClick={finish} className="rounded-xl border border-brand-line bg-white px-6 py-3 text-sm font-bold text-[#6E5A46]">Done</button>
          </div>
        </div>
      )}

      {state.phase === "break" && (
        <div className="mt-6">
          <button onClick={finish} className="rounded-xl border border-brand-line bg-white px-6 py-3 text-sm font-bold text-[#6E5A46]">Skip break</button>
        </div>
      )}

      {message && <p className="mt-4 text-sm font-semibold text-brand-sage">{message}</p>}
    </div>
  );
}
