"use client";

import { useState } from "react";
import QuestionCard from "@/components/worksheets/QuestionCard";
import { isAnswered, isRight, type Answers } from "@/lib/worksheets";
import type { TopicSheet } from "@/lib/topics";

const btn = "rounded-xl px-5 py-3 text-base font-extrabold transition-colors";

/** A topic pack's quiz, done on screen. It marks itself like a worksheet, but nothing is saved. */
export default function TopicQuiz({ sheet, color, seed }: { sheet: TopicSheet; color: string; seed: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [marked, setMarked] = useState(false);

  const total = sheet.questions.length;
  const answered = sheet.questions.filter((q, i) => isAnswered(q, answers[i])).length;
  const score = sheet.questions.filter((q, i) => isRight(q, answers[i])).length;

  const setAnswer = (i: number, value: unknown) =>
    setAnswers((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "") delete next[i];
      else next[i] = value;
      return next;
    });

  const retry = (keepRight: boolean) => {
    const kept: Answers = {};
    if (keepRight) sheet.questions.forEach((q, i) => isRight(q, answers[i]) && (kept[i] = answers[i]));
    setAnswers(kept);
    setMarked(false);
  };

  return (
    <div>
      <ol className="space-y-4">
        {sheet.questions.map((q, i) => (
          <QuestionCard
            key={i}
            q={q}
            number={i + 1}
            seed={`${seed}-${sheet.slug}-${i}`}
            color={color}
            value={answers[i]}
            onChange={(value) => setAnswer(i, value)}
            marked={marked}
          />
        ))}
      </ol>
      {!marked ? (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => setMarked(true)} disabled={answered === 0} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark disabled:opacity-50`}>
            Check my answers
          </button>
          <p className="text-sm font-bold text-brand-earth" aria-live="polite">
            {answered === total ? "All answered. Ready when you are!" : `${answered} of ${total} answered.`}
          </p>
        </div>
      ) : (
        <div aria-live="polite" className="mt-5 rounded-3xl border-2 bg-white p-6 text-center" style={{ borderColor: color }}>
          <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color }}>
            {score === total ? "Every one right!" : score >= total * 0.8 ? "Great work!" : score >= total / 2 ? "Good going!" : "Good try!"}
          </p>
          <p className="mt-1 text-4xl font-black text-brand-charcoal">
            {score} out of {total}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {score < total && (
              <button type="button" onClick={() => retry(true)} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark`}>
                Try the ones I missed
              </button>
            )}
            <button type="button" onClick={() => retry(false)} className={`${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`}>
              Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
