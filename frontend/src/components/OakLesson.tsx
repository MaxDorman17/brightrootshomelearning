"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/worksheets/QuestionCard";
import { getOakCaptions, oakWorksheetUrl, submitOakQuiz, type OakLessonPage, type OakQuizScores } from "@/lib/api";
import { isAnswered, isRight, type Answers, type Question } from "@/lib/worksheets";

type Lesson = Extract<OakLessonPage, { available: true }>;
type StepId = "starter" | "watch" | "worksheet" | "exit" | "done";

const COLOR = "#287C5B";
const btn = "rounded-xl px-5 py-3 text-base font-extrabold transition-colors disabled:opacity-50";
const primary = `${btn} bg-brand-sage text-white hover:bg-brand-sagedark`;
const quiet = `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`;

const STEP_NAMES: Record<StepId, string> = {
  starter: "Starter quiz",
  watch: "Watch",
  worksheet: "Worksheet",
  exit: "Exit quiz",
  done: "Finished",
};

/**
 * An Oak National Academy lesson done here, one step at a time: starter quiz, video, worksheet, exit quiz.
 * A step Oak has nothing for is left out. Only a child's quizzes are saved; a grown-up can look through.
 */
export default function OakLesson({
  entryId,
  lesson,
  isChild,
  onComplete,
}: {
  entryId: number;
  lesson: Lesson;
  isChild: boolean;
  /** Called when the exit quiz is handed in, which finishes the lesson. */
  onComplete: () => void;
}) {
  const steps = useMemo(() => {
    const list: StepId[] = [];
    if (lesson.starter.length) list.push("starter");
    if (lesson.video_url) list.push("watch");
    if (lesson.has_worksheet) list.push("worksheet");
    if (lesson.exit.length) list.push("exit");
    list.push("done");
    return list;
  }, [lesson]);

  const [scores, setScores] = useState<OakQuizScores>(lesson.attempt);
  // Start where they left off: past a starter quiz already done.
  const [step, setStep] = useState<StepId>(() =>
    lesson.attempt.exit_total ? "done" : lesson.attempt.starter_total && steps[0] === "starter" ? steps[1] : steps[0]
  );
  const top = useRef<HTMLDivElement>(null);
  const go = (to: StepId) => {
    setStep(to);
    setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };
  const next = () => go(steps[Math.min(steps.indexOf(step) + 1, steps.length - 1)]);
  const stepDone = (id: StepId) => (id === "starter" && !!scores.starter_total) || (id === "exit" && !!scores.exit_total);

  return (
    <div ref={top} className="scroll-mt-20">
      {/* Where am I? */}
      <ol className="mb-4 flex flex-wrap gap-2" aria-label="Steps in this lesson">
        {steps
          .filter((id) => id !== "done")
          .map((id, i) => {
            const here = id === step;
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
                      here ? "bg-white text-brand-sage" : stepDone(id) ? "bg-green-600 text-white" : "bg-brand-cream text-brand-earth"
                    }`}
                    aria-hidden
                  >
                    {stepDone(id) ? "✓" : i + 1}
                  </span>
                  {STEP_NAMES[id]}
                </button>
              </li>
            );
          })}
      </ol>

      <section className="rounded-3xl border border-brand-line bg-white p-5 shadow-sm sm:p-6" aria-live="polite">
        {step === "starter" && (
          <Quiz
            key="starter"
            title="Starter quiz"
            intro="A few questions to warm up. It's fine not to know them all yet."
            entryId={entryId}
            which="starter"
            questions={lesson.starter}
            isChild={isChild}
            onScores={setScores}
            nextLabel={`Next: ${STEP_NAMES[steps[steps.indexOf("starter") + 1]]}`}
            onNext={next}
          />
        )}

        {step === "watch" && lesson.video_url && (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-charcoal">Watch the lesson</h2>
            {lesson.outcome && <p className="mt-1 text-brand-earth">By the end: {lesson.outcome}</p>}
            <Video entryId={entryId} src={lesson.video_url} captions={lesson.has_captions} title={lesson.title} />
            {lesson.keywords.length > 0 && (
              <div className="mt-4 rounded-2xl bg-brand-cream p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-softsage">Words to listen for</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  {lesson.keywords.map((k) => (
                    <div key={k.word}>
                      <dt className="inline font-extrabold text-brand-charcoal">{k.word}: </dt>
                      <dd className="inline text-brand-earth">{k.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <div className="mt-5">
              <button type="button" onClick={next} className={primary}>
                I&apos;ve watched it. Next: {STEP_NAMES[steps[steps.indexOf("watch") + 1]]}
              </button>
            </div>
          </div>
        )}

        {step === "worksheet" && (
          <div>
            <h2 className="text-2xl font-extrabold text-brand-charcoal">Worksheet</h2>
            <p className="mt-1 text-brand-earth">
              Open the worksheet to do on screen or print out. Ask your grown-up if you&apos;re not sure whether to do it today.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={oakWorksheetUrl(entryId)} target="_blank" rel="noopener noreferrer" className={primary}>
                Open or print worksheet
              </a>
              <button type="button" onClick={next} className={quiet}>
                Next: {STEP_NAMES[steps[steps.indexOf("worksheet") + 1]]}
              </button>
            </div>
          </div>
        )}

        {step === "exit" && (
          <Quiz
            key="exit"
            title="Exit quiz"
            intro="Show what you've learned. Handing this in finishes the lesson."
            entryId={entryId}
            which="exit"
            questions={lesson.exit}
            isChild={isChild}
            onScores={(s) => {
              setScores(s);
              onComplete();
            }}
            nextLabel="Finish"
            onNext={next}
          />
        )}

        {step === "done" && (
          <div className="text-center">
            <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: COLOR }}>
              {scores.exit_total || !lesson.exit.length ? "Lesson finished" : "Nearly there"}
            </p>
            <h2 className="mt-1 text-3xl font-black text-brand-charcoal">
              {scores.exit_total ? "Well done!" : lesson.exit.length ? "Do the exit quiz to finish" : "That's everything for this lesson"}
            </h2>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm font-bold">
              {scores.starter_total ? (
                <span className="rounded-full bg-brand-cream px-4 py-1.5 text-brand-charcoal">
                  Starter quiz: {scores.starter_score} out of {scores.starter_total}
                </span>
              ) : null}
              {scores.exit_total ? (
                <span className="rounded-full bg-green-100 px-4 py-1.5 text-green-800">
                  Exit quiz: {scores.exit_score} out of {scores.exit_total}
                </span>
              ) : null}
            </div>
            {!lesson.exit.length && isChild && (
              <p className="mt-3 text-sm text-brand-earth">Press “Mark Done” at the top when you&apos;ve finished.</p>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {!scores.exit_total && lesson.exit.length > 0 && (
                <button type="button" onClick={() => go("exit")} className={primary}>
                  Go to the exit quiz
                </button>
              )}
              <Link href={isChild ? "/child" : "/parent"} className={scores.exit_total || !lesson.exit.length ? primary : quiet}>
                {isChild ? "Back to today's lessons" : "Back to the planner"}
              </Link>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-6 rounded-2xl border border-brand-line bg-brand-cream/60 p-4 text-xs leading-relaxed text-brand-earth">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-brand-softsage">Source and licence</h2>
        <p className="mt-1">
          Based on{" "}
          <a href={lesson.oak_url} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-sage underline">
            {lesson.title}
          </a>
          , a {lesson.subject ? `${lesson.subject} ` : ""}lesson by Oak National Academy, licensed under{" "}
          <a href={lesson.licence_url} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-sage underline">
            Open Government Licence v3.0 (OGL)
          </a>
          . Adapted for Bright Roots Home Learning.
        </p>
      </footer>
    </div>
  );
}

function Video({ entryId, src, captions, title }: { entryId: number; src: string; captions: boolean; title: string }) {
  // Captions are fetched with the child's own login, then handed to the player from the page itself.
  const [track, setTrack] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!captions) return;
    let url: string | null = null;
    let current = true;
    getOakCaptions(entryId)
      .then((res) => {
        if (!current) return;
        url = URL.createObjectURL(new Blob([res.data], { type: "text/vtt" }));
        setTrack(url);
      })
      .catch(() => {});
    return () => {
      current = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [entryId, captions]);

  if (failed) {
    return (
      <p role="alert" className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-900">
        The video won&apos;t play just now. Check the internet is working and try again in a moment.
      </p>
    );
  }
  return (
    <video
      key={track ?? "no-captions"}
      controls
      // Oak's videos are for watching, not keeping.
      controlsList="nodownload"
      playsInline
      preload="metadata"
      aria-label={`Lesson video: ${title}`}
      onError={() => setFailed(true)}
      className="mt-4 aspect-video w-full rounded-2xl bg-black"
    >
      <source src={src} type="video/mp4" />
      {track && <track kind="captions" src={track} srcLang="en" label="English" />}
    </video>
  );
}

function Quiz({
  title,
  intro,
  entryId,
  which,
  questions,
  isChild,
  onScores,
  nextLabel,
  onNext,
}: {
  title: string;
  intro: string;
  entryId: number;
  which: "starter" | "exit";
  questions: Question[];
  isChild: boolean;
  onScores: (scores: OakQuizScores) => void;
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
    if (!isChild) {
      setNote("Nothing was saved, because you're signed in as a grown-up.");
      setMarked(true);
      return;
    }
    setSending(true);
    try {
      const res = await submitOakQuiz(entryId, which, answers);
      onScores(res.data.attempt);
      setNote(res.data.first_time ? "Your score is saved." : res.data.new_best ? "That's a new best score, and it's saved." : "Your best score is still saved.");
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
          <QuestionCard
            key={i}
            q={q}
            number={i + 1}
            seed={`oak-${entryId}-${which}-${i}`}
            color={COLOR}
            value={answers[i]}
            onChange={(value) => setAnswer(i, value)}
            marked={marked}
          />
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
          <p className="text-sm font-bold text-brand-earth">
            {answered === total ? "All answered. Ready when you are!" : `${answered} of ${total} answered.`}
          </p>
        </div>
      ) : (
        <div ref={result} tabIndex={-1} className="mt-5 rounded-2xl border-2 border-brand-sage bg-brand-cream/50 p-5 text-center focus:outline-none">
          <p className="text-3xl font-black text-brand-charcoal">
            {score} out of {total}
          </p>
          <p className="mt-1 text-sm text-brand-earth">{note}</p>
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
