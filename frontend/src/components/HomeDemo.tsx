"use client";

import { useMemo, useState } from "react";

type Child = "Sam" | "Ava";
type Lesson = { id: string; child: Child; day: string; subject: string; title: string };
type Tab = "planner" | "today" | "progress";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SUBJECT_STYLE: Record<string, string> = {
  Maths: "bg-blue-50 text-blue-800 border-blue-200",
  English: "bg-purple-50 text-purple-800 border-purple-200",
  Science: "bg-green-50 text-green-800 border-green-200",
  History: "bg-amber-50 text-amber-800 border-amber-200",
  Art: "bg-pink-50 text-pink-800 border-pink-200",
};

// Example family used only for this demo.
const LESSONS: Lesson[] = [
  { id: "s-mon-1", child: "Sam", day: "Monday", subject: "Maths", title: "Equivalent fractions" },
  { id: "s-mon-2", child: "Sam", day: "Monday", subject: "English", title: "Persuasive letters" },
  { id: "s-mon-3", child: "Sam", day: "Monday", subject: "Science", title: "Forces and friction" },
  { id: "s-tue-1", child: "Sam", day: "Tuesday", subject: "Maths", title: "Adding fractions" },
  { id: "s-tue-2", child: "Sam", day: "Tuesday", subject: "History", title: "The Romans in Britain" },
  { id: "s-wed-1", child: "Sam", day: "Wednesday", subject: "English", title: "Speech marks" },
  { id: "s-wed-2", child: "Sam", day: "Wednesday", subject: "Art", title: "Mosaic patterns" },
  { id: "s-thu-1", child: "Sam", day: "Thursday", subject: "Maths", title: "Fractions of amounts" },
  { id: "s-thu-2", child: "Sam", day: "Thursday", subject: "Science", title: "Air resistance" },
  { id: "s-fri-1", child: "Sam", day: "Friday", subject: "English", title: "Write your own letter" },
  { id: "a-mon-1", child: "Ava", day: "Monday", subject: "Maths", title: "Counting in 2s" },
  { id: "a-mon-2", child: "Ava", day: "Monday", subject: "English", title: "Phonics: 'ai' and 'ay'" },
  { id: "a-tue-1", child: "Ava", day: "Tuesday", subject: "Science", title: "Parts of a plant" },
  { id: "a-wed-1", child: "Ava", day: "Wednesday", subject: "Maths", title: "Halves and quarters" },
  { id: "a-wed-2", child: "Ava", day: "Wednesday", subject: "Art", title: "Leaf printing" },
  { id: "a-thu-1", child: "Ava", day: "Thursday", subject: "English", title: "Story sequencing" },
  { id: "a-fri-1", child: "Ava", day: "Friday", subject: "History", title: "Toys from the past" },
];

const STARTING_DONE = ["s-mon-1", "a-mon-1"];

const TABS: { id: Tab; label: string; who: string }[] = [
  { id: "planner", label: "Weekly planner", who: "Parent view" },
  { id: "today", label: "Child's day", who: "Child view" },
  { id: "progress", label: "Progress", who: "Parent view" },
];

export default function HomeDemo() {
  const [tab, setTab] = useState<Tab>("planner");
  const [child, setChild] = useState<Child>("Sam");
  const [done, setDone] = useState<string[]>(STARTING_DONE);

  const toggle = (id: string) =>
    setDone((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const childLessons = useMemo(() => LESSONS.filter((lesson) => lesson.child === child), [child]);
  const doneCount = childLessons.filter((lesson) => done.includes(lesson.id)).length;
  const todayLessons = childLessons.filter((lesson) => lesson.day === "Monday");
  const todayDone = todayLessons.filter((lesson) => done.includes(lesson.id)).length;

  const subjects = Array.from(new Set(childLessons.map((lesson) => lesson.subject)));

  return (
    <div className="rounded-[2rem] border border-brand-line bg-white p-4 shadow-2xl shadow-brand-sage/10 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Demo views" className="flex gap-1 overflow-x-auto rounded-2xl bg-brand-cream p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={
                "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-extrabold transition-colors " +
                (tab === item.id ? "bg-brand-sage text-white" : "text-[#6E5A46] hover:bg-white")
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#6E5A46]/70">Child</span>
          {(["Sam", "Ava"] as Child[]).map((name) => (
            <button
              key={name}
              onClick={() => setChild(name)}
              aria-pressed={child === name}
              className={
                "rounded-full border px-3 py-1 text-xs font-extrabold " +
                (child === name ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line text-[#6E5A46]")
              }
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-softsage">
        {TABS.find((item) => item.id === tab)?.who} · example family
      </p>

      {tab === "planner" && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">{child}&apos;s week</h3>
            <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-extrabold text-brand-sage">
              {doneCount} of {childLessons.length} done
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {DAYS.map((day) => (
              <div key={day} className="rounded-2xl bg-brand-cream p-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#6E5A46]">{day.slice(0, 3)}</p>
                <div className="mt-2 space-y-2">
                  {childLessons.filter((lesson) => lesson.day === day).map((lesson) => {
                    const isDone = done.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => toggle(lesson.id)}
                        className={
                          "w-full rounded-xl border p-2 text-left text-xs transition-opacity " +
                          SUBJECT_STYLE[lesson.subject] +
                          (isDone ? " opacity-60" : "")
                        }
                      >
                        <span className="block font-extrabold">{isDone ? "✓ " : ""}{lesson.subject}</span>
                        <span className={"block " + (isDone ? "line-through" : "")}>{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#6E5A46]/70">Tap a lesson to mark it done.</p>
        </div>
      )}

      {tab === "today" && (
        <div className="mt-4">
          <h3 className="text-lg font-extrabold">Good morning, {child}!</h3>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-brand-cream">
            <div
              className="h-full rounded-full bg-brand-leaf transition-all"
              style={{ width: `${todayLessons.length ? (todayDone / todayLessons.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-[#6E5A46]">
            {todayDone} of {todayLessons.length} lessons done today
          </p>

          <div className="mt-4 space-y-3">
            {todayLessons.map((lesson) => {
              const isDone = done.includes(lesson.id);
              return (
                <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-brand-line p-4">
                  <div>
                    <span className={"rounded-full border px-2 py-0.5 text-[10px] font-extrabold " + SUBJECT_STYLE[lesson.subject]}>
                      {lesson.subject}
                    </span>
                    <p className={"mt-1.5 font-extrabold " + (isDone ? "text-[#6E5A46]/60 line-through" : "")}>{lesson.title}</p>
                  </div>
                  <button
                    onClick={() => toggle(lesson.id)}
                    className={
                      "shrink-0 rounded-xl px-4 py-2 text-sm font-extrabold " +
                      (isDone ? "bg-brand-tint text-brand-sage" : "bg-brand-sage text-white")
                    }
                  >
                    {isDone ? "Done ✓" : "Mark done"}
                  </button>
                </div>
              );
            })}
          </div>

          {todayLessons.length > 0 && todayDone === todayLessons.length && (
            <div className="mt-4 rounded-2xl bg-brand-tint p-4 text-center">
              <p className="text-2xl">🎉</p>
              <p className="font-extrabold text-brand-sage">All done for today! Badge unlocked.</p>
            </div>
          )}
        </div>
      )}

      {tab === "progress" && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-brand-cream p-4">
            <h3 className="font-extrabold">{child}&apos;s lessons this week</h3>
            <div className="mt-3 space-y-3">
              {subjects.map((subject) => {
                const lessons = childLessons.filter((lesson) => lesson.subject === subject);
                const complete = lessons.filter((lesson) => done.includes(lesson.id)).length;
                return (
                  <div key={subject}>
                    <div className="flex justify-between text-xs font-bold text-[#6E5A46]">
                      <span>{subject}</span>
                      <span>{complete}/{lessons.length}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-brand-sage transition-all" style={{ width: `${(complete / lessons.length) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              [child === "Sam" ? "84%" : "91%", "Oak quiz average"],
              [child === "Sam" ? "9/10" : "6/6", "Latest spelling test"],
              [child === "Sam" ? "3" : "5", "Books finished"],
              [String(doneCount), "Lessons done"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-brand-line p-4 text-center">
                <p className="text-2xl font-black text-brand-sage">{value}</p>
                <p className="mt-1 text-xs font-bold text-[#6E5A46]/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
