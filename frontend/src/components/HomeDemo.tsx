"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Emoji from "@/components/Emoji";

/**
 * The demo on the home page: one made-up family's day, to click through from breakfast to bedtime.
 * Everything a visitor does (ticking lessons, logging a walk, OK-ing a child's note, giving a score)
 * carries through to the last step, where the day's record has written itself.
 */

type Child = "Sam" | "Ava";
type Lesson = { id: string; child: Child; subject: string; title: string; scheme?: string };
type StepId = "morning" | "sam" | "log" | "ava" | "score" | "record";

const SUBJECT_STYLE: Record<string, string> = {
  Maths: "bg-blue-50 text-blue-800 border-blue-200",
  English: "bg-purple-50 text-purple-800 border-purple-200",
  Science: "bg-green-50 text-green-800 border-green-200",
  History: "bg-amber-50 text-amber-800 border-amber-200",
  Art: "bg-pink-50 text-pink-800 border-pink-200",
};
const subjectStyle = (subject: string) => SUBJECT_STYLE[subject] ?? "bg-[#F0ECE6] text-[#6E6256] border-[#DDD3C4]";

// Example family used only for this demo. Sam is 8 and Ava is 5.
const LESSONS: Lesson[] = [
  { id: "s1", child: "Sam", subject: "Maths", title: "Adding fractions", scheme: "White Rose Maths" },
  { id: "s2", child: "Sam", subject: "English", title: "Writing a persuasive letter", scheme: "Twinkl" },
  { id: "s3", child: "Sam", subject: "History", title: "The Romans in Britain", scheme: "Oak National Academy" },
  { id: "a1", child: "Ava", subject: "Maths", title: "Counting in 2s", scheme: "White Rose Maths" },
  { id: "a2", child: "Ava", subject: "English", title: "Phonics: 'ai' and 'ay'" },
];

const STEPS: { id: StepId; time: string; label: string; who: string }[] = [
  { id: "morning", time: "8:45", label: "The plan", who: "Parent's home page" },
  { id: "sam", time: "9:15", label: "Sam gets going", who: "Sam's own page" },
  { id: "log", time: "11:30", label: "An unplanned walk", who: "Parent's home page" },
  { id: "ava", time: "2:00", label: "Ava's own idea", who: "Ava's page, then yours" },
  { id: "score", time: "3:30", label: "A quick score", who: "Parent's planner" },
  { id: "record", time: "Bedtime", label: "The record", who: "Your records" },
];

const SUBJECT_CHOICES = ["Science", "Art", "History", "Cooking", "PE"];
const input = "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const primary = "rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50";

function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={"rounded-full border px-2 py-0.5 text-[10px] font-extrabold " + className}>{children}</span>;
}

export default function HomeDemo() {
  const [step, setStep] = useState<StepId>("morning");
  const [done, setDone] = useState<string[]>([]);
  const [logTitle, setLogTitle] = useState("Pond dipping at the park");
  const [logSubject, setLogSubject] = useState("Science");
  const [logged, setLogged] = useState<{ title: string; subject: string }[]>([]);
  const [avaTold, setAvaTold] = useState(false);
  const [avaOk, setAvaOk] = useState(false);
  const [score, setScore] = useState("8");
  const [scoreSaved, setScoreSaved] = useState<number | null>(null);

  const toggle = (id: string) => setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const index = STEPS.findIndex((s) => s.id === step);
  const current = STEPS[index];
  const next = STEPS[index + 1];

  const samLessons = LESSONS.filter((l) => l.child === "Sam");
  const samDone = samLessons.filter((l) => done.includes(l.id)).length;

  // Stars follow the example rules: one for each thing finished, three for a score of 80% or more.
  const stars = useMemo(() => {
    const forChild = (child: Child) =>
      LESSONS.filter((l) => l.child === child && done.includes(l.id)).length + logged.length + (child === "Ava" && avaOk ? 1 : 0);
    return { Sam: forChild("Sam") + (scoreSaved !== null && scoreSaved >= 8 ? 3 : 0), Ava: forChild("Ava") };
  }, [done, logged, avaOk, scoreSaved]);

  // Everything recorded today, as it would appear in the family's records.
  const record = useMemo(() => {
    const rows: { who: string; subject: string; title: string; extra?: string }[] = [];
    LESSONS.filter((l) => done.includes(l.id)).forEach((l) =>
      rows.push({ who: l.child, subject: l.subject, title: l.title, extra: l.id === "s1" && scoreSaved !== null ? `${scoreSaved}/10` : l.scheme })
    );
    logged.forEach((l) => rows.push({ who: "Sam and Ava", subject: l.subject, title: l.title, extra: "Logged by you" }));
    if (avaOk) rows.push({ who: "Ava", subject: "Design and Technology", title: "Made a marble run", extra: "Her own idea" });
    return rows;
  }, [done, logged, avaOk, scoreSaved]);

  const saveLog = (e: FormEvent) => {
    e.preventDefault();
    const title = logTitle.trim();
    if (!title) return;
    setLogged((prev) => [...prev, { title, subject: logSubject }]);
    setLogTitle("");
  };

  const saveScore = (e: FormEvent) => {
    e.preventDefault();
    const n = Math.max(0, Math.min(10, Math.round(Number(score))));
    if (Number.isNaN(n)) return;
    setScoreSaved(n);
    if (!done.includes("s1")) setDone((prev) => [...prev, "s1"]);
  };

  return (
    <div className="rounded-[2rem] border border-brand-line bg-white p-4 shadow-2xl shadow-brand-sage/10 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">One day with an example family · all made up</p>
        <p className="text-xs font-extrabold text-[#8A6A22]">
          ⭐ Sam {stars.Sam} · Ava {stars.Ava}
        </p>
      </div>

      <div role="tablist" aria-label="Steps in the day" className="mt-3 flex gap-1 overflow-x-auto rounded-2xl bg-brand-cream p-1">
        {STEPS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={step === s.id}
            onClick={() => setStep(s.id)}
            className={
              "whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-extrabold transition-colors " +
              (step === s.id ? "bg-brand-sage text-white" : "text-[#6E5A46] hover:bg-white")
            }
          >
            <span className="block text-[10px] font-bold opacity-75">{s.time}</span>
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#6E5A46]/70">{current.who}</p>

      {step === "morning" && (
        <div className="mt-2">
          <h3 className="text-lg font-extrabold">Good morning. Here is today.</h3>
          <p className="mt-1 text-sm text-[#6E5A46]">
            The week was planned on Sunday evening, using the schemes this family already owns. Each lesson keeps a link to where it lives.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["Sam", "Ava"] as Child[]).map((child) => (
              <div key={child} className="rounded-2xl bg-brand-cream p-4">
                <p className="text-sm font-extrabold">
                  {child} <span className="font-bold text-[#6E5A46]/70">· age {child === "Sam" ? 8 : 5}</span>
                </p>
                <div className="mt-2 space-y-2">
                  {LESSONS.filter((l) => l.child === child).map((l) => (
                    <div key={l.id} className={"rounded-xl border p-2.5 text-xs " + subjectStyle(l.subject)}>
                      <span className="block font-extrabold">{done.includes(l.id) ? "✓ " : ""}{l.subject}</span>
                      <span className="block">{l.title}</span>
                      {l.scheme && <span className="mt-1 block text-[10px] font-bold opacity-75">{l.scheme}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#6E5A46]/70">Nothing to do here but have your coffee. The children have their own pages.</p>
        </div>
      )}

      {step === "sam" && (
        <div className="mt-2">
          <h3 className="text-lg font-extrabold">Good morning, Sam!</h3>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-brand-cream">
            <div className="h-full rounded-full bg-brand-leaf transition-all" style={{ width: `${(samDone / samLessons.length) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs font-bold text-[#6E5A46]">{samDone} of {samLessons.length} done today · tap to tick them off as Sam would</p>
          <div className="mt-4 space-y-3">
            {samLessons.map((l) => {
              const isDone = done.includes(l.id);
              return (
                <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl border border-brand-line p-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5">
                      <Tag className={subjectStyle(l.subject)}>{l.subject}</Tag>
                      {l.scheme && <Tag className="border-brand-line bg-white text-[#6E5A46]">Opens on {l.scheme}</Tag>}
                    </div>
                    <p className={"mt-1.5 font-extrabold " + (isDone ? "text-[#6E5A46]/60 line-through" : "")}>{l.title}</p>
                  </div>
                  <button onClick={() => toggle(l.id)} className={"shrink-0 rounded-xl px-4 py-2 text-sm font-extrabold " + (isDone ? "bg-brand-tint text-brand-sage" : "bg-brand-sage text-white")}>
                    {isDone ? "Done ✓" : "Mark done"}
                  </button>
                </div>
              );
            })}
          </div>
          {samDone === samLessons.length && (
            <div className="mt-4 rounded-2xl bg-brand-tint p-4 text-center">
              <Emoji e="🎉" className="mx-auto h-10 w-10" />
              <p className="font-extrabold text-brand-sage">All done for today! A star for each one.</p>
            </div>
          )}
        </div>
      )}

      {step === "log" && (
        <div className="mt-2">
          <h3 className="text-lg font-extrabold">What did you do today?</h3>
          <p className="mt-1 text-sm text-[#6E5A46]">
            The sun came out, so everyone went to the park. That was never in the plan, and it still counts. Jot it down, or type something of your own.
          </p>
          <form onSubmit={saveLog} className="mt-4 grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
            <input value={logTitle} onChange={(e) => setLogTitle(e.target.value)} maxLength={80} placeholder="e.g. Baked flapjacks" aria-label="What you did" className={input} />
            <select value={logSubject} onChange={(e) => setLogSubject(e.target.value)} aria-label="Subject" className={input}>
              {SUBJECT_CHOICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button type="submit" disabled={!logTitle.trim()} className={primary}>Save as done</button>
          </form>
          {logged.length > 0 ? (
            <div className="mt-4 rounded-2xl bg-brand-cream p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#6E5A46]">Done today</p>
              <ul className="mt-2 space-y-1.5">
                {logged.map((l, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-extrabold">{l.title}</span>
                    <span className="text-[#6E5A46]"> · {l.subject} · Sam and Ava</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3 text-xs text-[#6E5A46]/70">Some families plan nothing and log everything this way.</p>
          )}
        </div>
      )}

      {step === "ava" && (
        <div className="mt-2 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-line p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-brand-softsage">On Ava&apos;s page</p>
            <h3 className="mt-1 font-extrabold">Did something else today?</h3>
            <p className="mt-1 text-sm text-[#6E5A46]">Ava spent an hour building in the living room and wants you to know.</p>
            <div className="mt-3 rounded-xl bg-brand-cream p-3 text-sm font-bold">I made a marble run</div>
            <button onClick={() => setAvaTold(true)} disabled={avaTold} className={primary + " mt-3"}>
              {avaTold ? "Sent ✓" : "Tell them"}
            </button>
          </div>
          <div className={"rounded-2xl border p-4 " + (avaTold ? "border-[#EBD9A8] bg-[#FBF4DF]" : "border-dashed border-brand-line")}>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#8A6A22]">On your home page</p>
            <h3 className="mt-1 font-extrabold">Waiting for your OK</h3>
            {!avaTold ? (
              <p className="mt-1 text-sm text-[#6E5A46]">Nothing yet. Press &quot;Tell them&quot; as Ava.</p>
            ) : avaOk ? (
              <p className="mt-2 text-sm font-extrabold text-brand-sage">OK&apos;d. It is in Ava&apos;s record, and she has a star for it.</p>
            ) : (
              <>
                <p className="mt-2 text-sm font-extrabold">Made a marble run</p>
                <p className="text-xs text-[#6E5A46]">Ava · her own idea · today</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setAvaOk(true)} className={primary}>OK</button>
                  <button onClick={() => setAvaTold(false)} className="rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-extrabold text-[#A64F42]">Remove</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {step === "score" && (
        <div className="mt-2">
          <h3 className="text-lg font-extrabold">Sam&apos;s fractions worksheet</h3>
          <p className="mt-1 text-sm text-[#6E5A46]">
            You marked it over a cup of tea. Type in the score and it sits with the lesson, whichever scheme it came from.
          </p>
          <form onSubmit={saveScore} className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6E5A46]">
            <Tag className={subjectStyle("Maths")}>Maths</Tag>
            <span className="font-extrabold text-[#2E342F]">Adding fractions</span>
            <input type="number" min={0} max={10} value={score} onChange={(e) => setScore(e.target.value)} aria-label="Score out of 10" className={input + " w-20 text-center font-bold"} />
            <span>out of 10</span>
            <button type="submit" className={primary}>Save score</button>
          </form>
          {scoreSaved !== null && (
            <div className="mt-4 rounded-2xl bg-brand-tint p-4">
              <p className="font-extrabold text-brand-sage">
                Saved: {scoreSaved} out of 10 ({scoreSaved * 10}%).
              </p>
              <p className="mt-1 text-sm text-[#6E5A46]">
                {scoreSaved >= 8 ? "That is 80% or more, so Sam's star rule gives him 3 extra stars." : "Under 80% this time, so no bonus stars. You set that rule yourself."}
              </p>
            </div>
          )}
        </div>
      )}

      {step === "record" && (
        <div className="mt-2">
          <h3 className="text-lg font-extrabold">Today, written down for you</h3>
          <p className="mt-1 text-sm text-[#6E5A46]">
            Nobody filled in a diary. This is simply what was ticked, logged and OK&apos;d as you clicked through. Over a term it becomes the report you can hand to your council.
          </p>
          {record.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-brand-line p-6 text-center text-sm text-[#6E5A46]">
              Nothing recorded yet. Go back and tick a lesson, log the walk or OK Ava&apos;s marble run, then look again.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-line">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-brand-cream text-xs text-[#6E5A46]">
                  <tr>
                    <th className="px-3 py-2 font-bold">Who</th>
                    <th className="px-3 py-2 font-bold">Subject</th>
                    <th className="px-3 py-2 font-bold">What</th>
                    <th className="px-3 py-2 font-bold">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line">
                  {record.map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-bold">{r.who}</td>
                      <td className="px-3 py-2">{r.subject}</td>
                      <td className="px-3 py-2">{r.title}</td>
                      <td className="px-3 py-2 text-[#6E5A46]">{r.extra ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              [String(record.length), "Things recorded"],
              [String(new Set(record.map((r) => r.subject)).size), "Subjects covered"],
              [String(stars.Sam + stars.Ava), "Stars earned"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-brand-line p-3 text-center">
                <p className="text-2xl font-black text-brand-sage">{value}</p>
                <p className="mt-1 text-xs font-bold text-[#6E5A46]/70">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#6E5A46]">
            <Link href="/sample-report" className="font-extrabold text-brand-sage underline">See a sample council report</Link>, built from eight weeks of days like this one.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-brand-line pt-4">
        <button onClick={() => setStep(STEPS[Math.max(0, index - 1)].id)} disabled={index === 0} className="rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-extrabold text-brand-sage disabled:opacity-40">
          ← Back
        </button>
        {next ? (
          <button onClick={() => setStep(next.id)} className={primary}>
            Next: {next.time} · {next.label} →
          </button>
        ) : (
          <Link href="/signup" className={primary}>Start your free trial →</Link>
        )}
      </div>
    </div>
  );
}
