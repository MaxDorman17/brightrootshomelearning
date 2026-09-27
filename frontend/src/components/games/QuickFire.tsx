"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { GameHeader, GameResult, NumberPad, randInt, useCountdown } from "./common";

type Question = { text: string; answer: number };

const SECONDS = 60;

/** Shared 60-second quiz used by Times Tables Blast and Maths Sprint. */
function QuickFire({
  game,
  title,
  detail,
  makeQuestion,
  setup,
  onExit,
}: {
  game: string;
  title: string;
  detail: string;
  makeQuestion: () => Question;
  setup: React.ReactNode;
  onExit: () => void;
}) {
  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);

  const left = useCountdown(SECONDS, phase === "play", () => setPhase("done"));

  const start = () => {
    setCorrect(0);
    setWrong(0);
    setAnswer("");
    setQuestion(makeQuestion());
    setPhase("play");
  };

  const submit = useCallback(() => {
    if (!question || answer === "") return;
    const ok = Number(answer) === question.answer;
    if (ok) setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
    setFlash(ok ? "ok" : "no");
    setTimeout(() => setFlash(null), 250);
    setAnswer("");
    setQuestion(makeQuestion());
  }, [answer, question, makeQuestion]);

  // Typing on a keyboard works too.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) setAnswer((a) => (a.length < 5 ? a + e.key : a));
      else if (e.key === "Backspace") setAnswer((a) => a.slice(0, -1));
      else if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, submit]);

  if (phase === "done") {
    return (
      <GameResult
        game={game}
        score={correct}
        detail={detail}
        onAgain={() => setPhase("setup")}
        onExit={onExit}
        summary={<p><b>{correct}</b> right and {wrong} wrong in {SECONDS} seconds ({detail}).</p>}
      />
    );
  }

  if (phase === "setup") {
    return (
      <div>
        <GameHeader title={title} onExit={onExit} />
        <div className="py-4 text-center">
          {setup}
          <button onClick={start} className="mt-6 rounded-2xl bg-brand-sage px-8 py-4 text-lg font-extrabold text-white">▶ Start ({SECONDS} seconds)</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <GameHeader title={title} onExit={onExit} right={<span className={"text-lg font-black " + (left <= 10 ? "text-[#A64F42]" : "text-brand-sage")}>{left}s</span>} />
      <div className="text-center">
        <p className="text-sm font-bold text-[#6E5A46]">✓ {correct} · ✗ {wrong}</p>
        <p className={"mt-3 text-5xl font-black transition-colors " + (flash === "ok" ? "text-green-600" : flash === "no" ? "text-[#A64F42]" : "text-brand-charcoal")}>
          {question?.text} =
        </p>
        <p className="mx-auto mt-3 h-14 max-w-[10rem] rounded-2xl border-2 border-brand-line bg-white py-2 text-3xl font-black text-brand-sage">{answer || " "}</p>
        <div className="mt-4">
          <NumberPad value={answer} onChange={setAnswer} onSubmit={submit} />
        </div>
      </div>
    </div>
  );
}

export function TimesTables({ onExit }: { onExit: () => void }) {
  const [tables, setTables] = useState<number[]>([2, 5, 10]);
  const makeQuestion = useCallback(() => {
    const t = tables[randInt(0, tables.length - 1)];
    const n = randInt(1, 12);
    return Math.random() < 0.5 ? { text: `${t} × ${n}`, answer: t * n } : { text: `${n} × ${t}`, answer: t * n };
  }, [tables]);

  return (
    <QuickFire
      game="times_tables"
      title="✖️ Times Tables Blast"
      detail={`${tables.join(", ")} times tables`}
      makeQuestion={makeQuestion}
      onExit={onExit}
      setup={
        <>
          <p className="text-sm font-bold text-brand-charcoal">Which tables?</p>
          <div className="mx-auto mt-3 grid max-w-sm grid-cols-4 gap-2">
            {Array.from({ length: 11 }, (_, i) => i + 2).map((t) => (
              <button
                key={t}
                onClick={() => setTables((prev) => (prev.includes(t) ? (prev.length > 1 ? prev.filter((x) => x !== t) : prev) : [...prev, t].sort((a, b) => a - b)))}
                className={"rounded-xl border-2 py-2 font-extrabold " + (tables.includes(t) ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")}
              >
                {t}×
              </button>
            ))}
          </div>
        </>
      }
    />
  );
}

const LEVELS = [
  { id: 10, label: "Up to 10" },
  { id: 20, label: "Up to 20" },
  { id: 100, label: "Up to 100" },
];

export function MathsSprint({ onExit }: { onExit: () => void }) {
  const [level, setLevel] = useState(10);
  const makeQuestion = useCallback(() => {
    if (Math.random() < 0.5) {
      const a = randInt(0, level);
      const b = randInt(0, level - a);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    const a = randInt(0, level);
    const b = randInt(0, a);
    return { text: `${a} − ${b}`, answer: a - b };
  }, [level]);

  return (
    <QuickFire
      game="maths_sprint"
      title="➕ Maths Sprint"
      detail={`adding and taking away up to ${level}`}
      makeQuestion={makeQuestion}
      onExit={onExit}
      setup={
        <>
          <p className="text-sm font-bold text-brand-charcoal">Pick a level</p>
          <div className="mt-3 flex justify-center gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={"rounded-xl border-2 px-4 py-2 font-extrabold " + (level === l.id ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      }
    />
  );
}
