"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/worksheets/QuestionCard";
import WorksheetPicture from "@/components/worksheets/WorksheetPicture";
import { finishSheet, getMySheet, saveSheetProgress, type SheetRef } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { comicBySlug } from "@/lib/comics";
import { isAnswered, isRight, nextSheet, setOfSheet, worksheetBySlug, type Answers } from "@/lib/worksheets";

const btn = "rounded-xl px-5 py-3 text-base font-extrabold transition-colors";

/** One worksheet, filled in on screen. A child's answers save as they go, and the sheet marks itself. */
export default function WorksheetPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const sheet = worksheetBySlug(slug);
  const [isChild, setIsChild] = useState(false);
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [marked, setMarked] = useState(false);
  const [best, setBest] = useState<{ score: number; total: number } | null>(null);
  const [result, setResult] = useState<{ firstTime: boolean; newBest: boolean; saved: boolean } | null>(null);
  const [notSaved, setNotSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const unsaved = useRef(false);

  const ref: SheetRef | null = useMemo(
    () => (sheet ? { kind: "worksheet", slug: sheet.slug, title: sheet.title, subject: sheet.subject } : null),
    [sheet]
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const child = getRole() === "child";
    setIsChild(child);
    if (!child || !sheet) {
      setReady(true);
      return;
    }
    getMySheet("worksheet", sheet.slug)
      .then((res) => {
        if (res.data?.answers) setAnswers(res.data.answers);
        if (res.data?.score != null && res.data.total != null) setBest({ score: res.data.score, total: res.data.total });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [router, sheet]);

  // Save a half-done sheet a moment after the last change, so a child can stop and come back.
  useEffect(() => {
    if (!isChild || !ref || !unsaved.current || marked) return;
    const timer = setTimeout(() => {
      unsaved.current = false;
      saveSheetProgress(ref, answers)
        .then(() => setNotSaved(false))
        .catch(() => setNotSaved(true));
    }, 800);
    return () => clearTimeout(timer);
  }, [answers, isChild, ref, marked]);

  if (!sheet || !ref) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <p className="text-brand-earth">We couldn&apos;t find that worksheet.</p>
          <Link href="/worksheets" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to the worksheets
          </Link>
        </main>
      </div>
    );
  }

  const total = sheet.questions.length;
  const answered = sheet.questions.filter((q, i) => isAnswered(q, answers[i])).length;
  const score = sheet.questions.filter((q, i) => isRight(q, answers[i])).length;
  const comic = sheet.comic ? comicBySlug(sheet.comic) : undefined;
  const set = setOfSheet(sheet.slug);
  const following = nextSheet(sheet.slug);

  const setAnswer = (i: number, value: unknown) => {
    unsaved.current = true;
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "") delete next[i];
      else next[i] = value;
      return next;
    });
  };

  const check = () => {
    setMarked(true);
    setTimeout(() => resultRef.current?.focus(), 50);
    if (!isChild) {
      setResult({ firstTime: false, newBest: false, saved: false });
      return;
    }
    finishSheet(ref, score, total)
      .then((res) => {
        setResult({ firstTime: res.data.first_time, newBest: res.data.new_best, saved: true });
        if (res.data.score != null && res.data.total != null) setBest({ score: res.data.score, total: res.data.total });
        setNotSaved(false);
      })
      .catch(() => {
        setResult({ firstTime: false, newBest: false, saved: false });
        setNotSaved(true);
      });
  };

  /** Keep the right answers and have another go at the rest. */
  const retry = (keepRight: boolean) => {
    const kept: Answers = {};
    if (keepRight) sheet.questions.forEach((q, i) => isRight(q, answers[i]) && (kept[i] = answers[i]));
    unsaved.current = true;
    setAnswers(kept);
    setMarked(false);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/worksheets" className="text-sm font-bold text-brand-sage hover:underline">
          ← All worksheets
        </Link>

        <header className="mt-3 overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm sm:flex">
          <WorksheetPicture sheet={sheet} className="h-36 w-full shrink-0 sm:h-auto sm:w-52" />
          <div className="min-w-0 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: sheet.color }}>
              {sheet.subject}
              {set && ` · ${set.title}`} · ages {sheet.ages}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight text-brand-charcoal">{sheet.title}</h1>
            <p className="mt-2 text-base text-brand-earth">{sheet.intro}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold">
              <Link href={`/worksheets/${sheet.slug}/print`} className="text-brand-sage hover:underline">
                Print this sheet
              </Link>
              {comic && (
                <Link href={`/make/comics/${comic.slug}`} className="text-brand-sage hover:underline">
                  Read the comic first: {comic.hero.name}
                </Link>
              )}
              {best && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                  Best score: {best.score} out of {best.total}
                </span>
              )}
            </div>
          </div>
        </header>

        {ready && !isChild && (
          <p className="mt-4 rounded-2xl border border-brand-line bg-brand-cream px-4 py-3 text-sm text-brand-earth">
            You&apos;re looking at this as a grown-up, so you can try it but nothing is saved. When your child does it from their own
            login, their answers save as they go and the score appears in their Test Results.
          </p>
        )}

        <ol className="mt-6 space-y-4">
          {sheet.questions.map((q, i) => (
            <QuestionCard
              key={i}
              q={q}
              number={i + 1}
              seed={`${sheet.slug}-${i}`}
              color={sheet.color}
              value={answers[i]}
              onChange={(value) => setAnswer(i, value)}
              marked={marked}
            />
          ))}
        </ol>

        {notSaved && (
          <p role="alert" className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            We couldn&apos;t save just now. Check the internet is working, then carry on. Your answers are still here.
          </p>
        )}

        {!marked ? (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={check} disabled={answered === 0} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark disabled:opacity-50`}>
              Check my answers
            </button>
            <p className="text-sm font-bold text-brand-earth" aria-live="polite">
              {answered === total
                ? "All answered. Ready when you are!"
                : `${answered} of ${total} answered. You can check now, or finish the rest first.`}
            </p>
          </div>
        ) : (
          <div
            ref={resultRef}
            tabIndex={-1}
            aria-live="polite"
            className="mt-6 rounded-3xl border-2 bg-white p-6 text-center focus:outline-none"
            style={{ borderColor: sheet.color }}
          >
            <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: sheet.color }}>
              {score === total ? "Every one right!" : score >= total * 0.8 ? "Great work!" : score >= total / 2 ? "Good going!" : "Good try!"}
            </p>
            <p className="mt-1 text-4xl font-black text-brand-charcoal">
              {score} out of {total}
            </p>
            <p className="mt-2 text-sm text-brand-earth">
              {result?.saved
                ? result.firstTime
                  ? "Your score is saved for your grown-up to see."
                  : result.newBest
                    ? "That's a new best score, and it's saved."
                    : "Your best score is still saved."
                : isChild
                  ? ""
                  : "Nothing was saved, because you're signed in as a grown-up."}
              {score < total && " Look at the ones marked “Not yet”, then have another go."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {score < total && (
                <button type="button" onClick={() => retry(true)} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark`}>
                  Try the ones I missed
                </button>
              )}
              {/* One clear thing to do next: fix the misses, or move on to the next sheet. */}
              {score === total && following && (
                <Link href={`/worksheets/${following.slug}`} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark`}>
                  Next: {following.title}
                </Link>
              )}
              <button type="button" onClick={() => retry(false)} className={`${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`}>
                Start again
              </button>
              <Link href="/worksheets" className={`${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`}>
                Back to worksheets
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
