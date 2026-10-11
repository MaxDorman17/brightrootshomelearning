"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/worksheets/QuestionCard";
import ReadAloud from "@/components/ReadAloud";
import { finishSheet } from "@/lib/api";
import { plannerTitle, type BrLesson, type LessonUnit } from "@/lib/lessons";
import { isAnswered, isRight, worksheetBySlug, type Answers, type Question } from "@/lib/worksheets";

type StepId = "starter" | "learn" | "practice" | "worksheet" | "task" | "exit" | "done";

const btn = "rounded-xl px-5 py-3 text-base font-extrabold transition-colors disabled:opacity-50";
const primary = `${btn} bg-brand-sage text-white hover:bg-brand-sagedark`;
const quiet = `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`;

const STEP_NAMES: Record<StepId, string> = {
  starter: "Starter quiz",
  learn: "Learn",
  practice: "Try it",
  worksheet: "Worksheet",
  task: "Make it",
  exit: "Exit quiz",
  done: "Finished",
};

/**
 * A Bright Roots lesson done here, one step at a time: starter quiz, learn, try it, make it, exit quiz.
 * Only the exit quiz is saved, and only for a child: it keeps their best score and ticks the lesson off in the planner.
 * A grown-up sees their own notes and can look through every step.
 */
export default function BrightRootsLesson({
  unit,
  lesson,
  number,
  isChild,
  onComplete,
}: {
  unit: LessonUnit;
  lesson: BrLesson;
  number: number;
  isChild: boolean;
  /** Called when a child hands in the exit quiz, which finishes the lesson. */
  onComplete?: () => void;
}) {
  const sheet = lesson.worksheet ? worksheetBySlug(lesson.worksheet) : undefined;
  const steps = useMemo(() => {
    const list: StepId[] = [];
    if (lesson.starter?.length) list.push("starter");
    list.push("learn");
    if (lesson.practice?.questions.length) list.push("practice");
    if (sheet) list.push("worksheet");
    if (lesson.task) list.push("task");
    list.push("exit", "done");
    return list;
  }, [lesson, sheet]);

  const [step, setStep] = useState<StepId>(steps[0]);
  const [doneSteps, setDoneSteps] = useState<Set<StepId>>(new Set());
  const [exitScore, setExitScore] = useState<{ score: number; total: number } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const go = (to: StepId) => {
    setStep(to);
    setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };
  const after = (id: StepId) => steps[Math.min(steps.indexOf(id) + 1, steps.length - 1)];
  const finishStep = (id: StepId) => {
    setDoneSteps((prev) => new Set(prev).add(id));
    go(after(id));
  };

  const saveExit = async (score: number, total: number): Promise<string> => {
    setExitScore({ score, total });
    setDoneSteps((prev) => new Set(prev).add("exit"));
    if (!isChild) return "Nothing was saved, because you're signed in as a grown-up.";
    const res = await finishSheet({ kind: "lesson", slug: lesson.slug, title: plannerTitle(unit, number), subject: unit.subject }, score, total);
    onComplete?.();
    if (res.data.first_time) return res.data.ticked_off ? "Your score is saved, and the lesson is ticked off." : "Your score is saved.";
    return res.data.new_best ? "That's a new best score, and it's saved." : "Your best score is still saved.";
  };

  return (
    <div ref={top} className="scroll-mt-20">
      {!isChild && <GrownUpNotes lesson={lesson} />}

      <ol className="mb-4 flex flex-wrap gap-2" aria-label="Steps in this lesson">
        {steps
          .filter((id) => id !== "done")
          .map((id, i) => {
            const here = id === step;
            const ticked = doneSteps.has(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => go(id)}
                  aria-current={here ? "step" : undefined}
                  className={`flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold ${
                    here ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-brand-earth hover:border-brand-softsage"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold ${
                      here ? "bg-white text-brand-sage" : ticked ? "bg-green-600 text-white" : "bg-brand-cream text-brand-earth"
                    }`}
                    aria-hidden
                  >
                    {ticked ? "✓" : i + 1}
                  </span>
                  {STEP_NAMES[id]}
                </button>
              </li>
            );
          })}
      </ol>

      <section className="rounded-3xl border border-brand-line bg-white p-5 shadow-sm sm:p-6" aria-live="polite">
        {step === "starter" && lesson.starter && (
          <Quiz
            key="starter"
            title="Starter quiz"
            intro="A few questions to warm up. It's fine not to know them all yet."
            seed={`${lesson.slug}-starter`}
            color={unit.color}
            questions={lesson.starter}
            nextLabel={`Next: ${STEP_NAMES[after("starter")]}`}
            onNext={() => finishStep("starter")}
          />
        )}

        {step === "learn" && <Learn lesson={lesson} color={unit.color} nextLabel={`Next: ${STEP_NAMES[after("learn")]}`} onNext={() => finishStep("learn")} />}

        {step === "practice" && lesson.practice && (
          <Quiz
            key="practice"
            title="Try it"
            intro={lesson.practice.intro}
            seed={`${lesson.slug}-practice`}
            color={unit.color}
            questions={lesson.practice.questions}
            nextLabel={`Next: ${STEP_NAMES[after("practice")]}`}
            onNext={() => finishStep("practice")}
          />
        )}

        {step === "worksheet" && sheet && (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-charcoal">Worksheet</h2>
            <p className="mt-1 text-brand-earth">
              Do the &ldquo;{sheet.title}&rdquo; worksheet. It opens in a new tab and saves your score, then come back here.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`/worksheets/${sheet.slug}`} target="_blank" rel="noopener noreferrer" className={primary}>
                Open the worksheet
              </a>
              <button type="button" onClick={() => finishStep("worksheet")} className={quiet}>
                Next: {STEP_NAMES[after("worksheet")]}
              </button>
            </div>
          </div>
        )}

        {step === "task" && lesson.task && (
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand-softsage">Away from the screen</p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal">{lesson.task.title}</h2>
            <p className="mt-1 text-brand-earth">{lesson.task.intro}</p>
            <ReadAloud className="mt-3" text={[lesson.task.title, lesson.task.intro, ...lesson.task.steps].join(" ")} />
            {lesson.task.need && lesson.task.need.length > 0 && (
              <div className="mt-4 rounded-2xl bg-brand-cream p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-softsage">You will need</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-brand-charcoal">
                  {lesson.task.need.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
            <ol className="mt-4 space-y-3">
              {lesson.task.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                    style={{ background: unit.color }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-base leading-relaxed text-brand-charcoal">{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-brand-earth">Show your grown-up what you made when you&apos;ve finished.</p>
            <div className="mt-5">
              <button type="button" onClick={() => finishStep("task")} className={primary}>
                I&apos;ve done it. Next: {STEP_NAMES[after("task")]}
              </button>
            </div>
          </div>
        )}

        {step === "exit" && (
          <Quiz
            key="exit"
            title="Exit quiz"
            intro={isChild ? "Show what you've learned. Handing this in finishes the lesson." : "The child's score is saved when they hand this in."}
            seed={`${lesson.slug}-exit`}
            color={unit.color}
            questions={lesson.exit}
            onCheck={saveExit}
            nextLabel="Finish"
            onNext={() => go("done")}
          />
        )}

        {step === "done" && (
          <div className="text-center">
            <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: unit.color }}>
              {exitScore ? "Lesson finished" : "Nearly there"}
            </p>
            <h2 className="mt-1 text-3xl font-black text-brand-charcoal">{exitScore ? "Well done!" : "Do the exit quiz to finish"}</h2>
            {exitScore && (
              <p className="mt-3 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-800">
                Exit quiz: {exitScore.score} out of {exitScore.total}
              </p>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {!exitScore && (
                <button type="button" onClick={() => go("exit")} className={primary}>
                  Go to the exit quiz
                </button>
              )}
              <Link href={isChild ? "/child" : "/lessons"} className={exitScore ? primary : quiet}>
                {isChild ? "Back to today's lessons" : "Back to Bright Roots Lessons"}
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/** The "Learn" step: picture cards, one at a time, then the words to know. */
function Learn({ lesson, color, nextLabel, onNext }: { lesson: BrLesson; color: string; nextLabel: string; onNext: () => void }) {
  const cards = lesson.learn.cards;
  const [n, setN] = useState(0);
  const card = cards[n];
  const last = n === cards.length - 1;
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-brand-charcoal">Learn</h2>
      <p className="mt-1 text-brand-earth">By the end: {lesson.goal}</p>

      <article className="mt-4 rounded-2xl border-2 border-brand-line p-4 sm:p-5">
        <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color }}>
          Card {n + 1} of {cards.length}
        </p>
        {card.heading && <h3 className="mt-1 text-xl font-extrabold text-brand-charcoal">{card.heading}</h3>}
        {card.picture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.picture} alt={card.alt ?? ""} className="mt-3 aspect-[3/2] w-full rounded-xl object-cover" />
        )}
        <div className="mt-3 space-y-3 text-lg leading-relaxed text-brand-charcoal">
          {card.text.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        <ReadAloud key={n} className="mt-3" text={[card.heading ?? "", ...card.text].join(" ")} />
      </article>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setN(n - 1)} disabled={n === 0} className={quiet}>
          ← Back
        </button>
        {!last ? (
          <button type="button" onClick={() => setN(n + 1)} className={primary}>
            Next card →
          </button>
        ) : (
          <button type="button" onClick={onNext} className={primary}>
            {nextLabel}
          </button>
        )}
      </div>

      {last && lesson.learn.words && lesson.learn.words.length > 0 && (
        <div className="mt-5 rounded-2xl bg-brand-cream p-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-softsage">Words to know</h3>
          <dl className="mt-2 space-y-1.5 text-sm">
            {lesson.learn.words.map((w) => (
              <div key={w.word}>
                <dt className="inline font-extrabold text-brand-charcoal">{w.word}: </dt>
                <dd className="inline text-brand-earth">{w.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

function GrownUpNotes({ lesson }: { lesson: BrLesson }) {
  const g = lesson.grownUp;
  return (
    <details className="mb-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4" open>
      <summary className="cursor-pointer text-sm font-extrabold text-amber-900">For the grown-up (your child doesn&apos;t see this)</summary>
      <div className="mt-3 space-y-3 text-sm text-amber-950">
        <p>
          <span className="font-bold">About {lesson.minutes} minutes.</span> {lesson.goal}
        </p>
        {g.need && g.need.length > 0 && (
          <div>
            <p className="font-bold">You will need</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {g.need.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}
        {g.tips.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
        {g.younger && (
          <p>
            <span className="font-bold">Younger child: </span>
            {g.younger}
          </p>
        )}
        {g.older && (
          <p>
            <span className="font-bold">Older or keen child: </span>
            {g.older}
          </p>
        )}
      </div>
    </details>
  );
}

function Quiz({
  title,
  intro,
  seed,
  color,
  questions,
  onCheck,
  nextLabel,
  onNext,
}: {
  title: string;
  intro: string;
  seed: string;
  color: string;
  questions: Question[];
  /** Saves the score and says what happened. Without it, the quiz is only marked on the page. */
  onCheck?: (score: number, total: number) => Promise<string>;
  nextLabel: string;
  onNext: () => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [marked, setMarked] = useState(false);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");
  const [problem, setProblem] = useState("");
  const result = useRef<HTMLDivElement>(null);
  const total = questions.length;
  const answered = questions.filter((q, i) => isAnswered(q, answers[i])).length;
  const score = questions.filter((q, i) => isRight(q, answers[i])).length;

  const setAnswer = (i: number, value: unknown) =>
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "") delete next[i];
      else next[i] = value;
      return next;
    });

  const check = async () => {
    setProblem("");
    setSending(true);
    try {
      setNote(onCheck ? await onCheck(score, total) : "");
      setMarked(true);
      setTimeout(() => result.current?.focus(), 50);
    } catch {
      setProblem("We couldn't save your answers just now. Check the internet is working, then press the button again. Your answers are still here.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-brand-charcoal">{title}</h2>
      <p className="mt-1 text-brand-earth">{intro}</p>
      <ol className="mt-4 space-y-4">
        {questions.map((q, i) => (
          <QuestionCard key={i} q={q} number={i + 1} seed={`${seed}-${i}`} color={color} value={answers[i]} onChange={(value) => setAnswer(i, value)} marked={marked} />
        ))}
      </ol>
      {problem && (
        <p role="alert" className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          {problem}
        </p>
      )}
      {!marked ? (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" onClick={check} disabled={sending || answered === 0} className={primary}>
            {sending ? "Checking..." : "Check my answers"}
          </button>
          <p className="text-sm font-bold text-brand-earth">{answered === total ? "All answered. Ready when you are!" : `${answered} of ${total} answered.`}</p>
        </div>
      ) : (
        <div ref={result} tabIndex={-1} className="mt-5 rounded-2xl border-2 border-brand-sage bg-brand-cream/50 p-5 text-center focus:outline-none">
          <p className="text-3xl font-black text-brand-charcoal">
            {score} out of {total}
          </p>
          {note && <p className="mt-1 text-sm text-brand-earth">{note}</p>}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onNext} className={primary}>
              {nextLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setMarked(false);
              }}
              className={quiet}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
