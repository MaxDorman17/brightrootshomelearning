"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import MomentImage from "@/components/MomentImage";
import {
  checkSession,
  getAllEntries,
  getChildren,
  getMoments,
  getPendingRewardCount,
  getReminders,
  getTimetable,
} from "@/lib/api";
import Emoji from "@/components/Emoji";

const HIDE_KEY = "getting_started_hidden";

type Step = { done: boolean; title: string; text: string; href: string; cta: string };
type Moment = { id: number; note: string | null; moment_date: string; children: string[]; photo_ids: number[] };

/** Parent Home: a getting-started checklist for new families, then "needs you today" tiles. */
export default function HomeOverview() {
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [hidden, setHidden] = useState(false);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [remindersLeft, setRemindersLeft] = useState<number | null>(null);
  const [latestMoment, setLatestMoment] = useState<Moment | null>(null);

  useEffect(() => {
    try {
      setHidden(localStorage.getItem(HIDE_KEY) === "1");
    } catch {}

    const safe = <T,>(p: Promise<{ data: T }>, fallback: T) => p.then((r) => r.data).catch(() => fallback);

    Promise.all([
      safe(getChildren(), [] as unknown[]),
      safe(getTimetable(), { updated_at: null } as { updated_at: string | null }),
      safe(getAllEntries(), [] as unknown[]),
      safe(checkSession(), { rewards_set_up: false } as { rewards_set_up: boolean }),
      safe(getReminders(), { reminders: [], today: [] } as { reminders: unknown[]; today: { done: boolean }[] }),
      safe(getMoments(), [] as Moment[]),
      safe(getPendingRewardCount(), { pending: 0 }),
    ]).then(([children, timetable, entries, me, reminders, moments, pending]) => {
      setSteps([
        { done: children.length > 0, title: "Add your children", text: "Each child gets their own login and Today page.", href: "/parent/children", cta: "Add a child" },
        { done: !!timetable.updated_at, title: "Set your weekly timetable", text: "Choose which subjects happen on which days.", href: "/parent/timetable", cta: "Open timetable" },
        { done: entries.length > 0, title: "Plan your first lesson", text: "Add a lesson to the planner, or build one in My Lessons.", href: "/parent", cta: "Open planner" },
        { done: me.rewards_set_up, title: "Set up rewards", text: "Pick how children earn stars and what they can spend them on.", href: "/parent/rewards", cta: "Set up rewards" },
        { done: reminders.reminders.length > 0, title: "Add a daily reminder", text: "A gentle nudge for spellings or extra work.", href: "/parent/reminders", cta: "Add a reminder" },
        { done: moments.length > 0, title: "Share a learning moment", text: "A photo or note of something you did together.", href: "/moments", cta: "Add a moment" },
      ]);
      setPendingRewards(pending.pending);
      setRemindersLeft(reminders.today.filter((t: { done: boolean }) => !t.done).length);
      setLatestMoment(moments[0] ?? null);
    });
  }, []);

  const doneCount = steps?.filter((s) => s.done).length ?? 0;
  const showChecklist = steps && !hidden && doneCount < steps.length;

  const hide = () => {
    setHidden(true);
    try {
      localStorage.setItem(HIDE_KEY, "1");
    } catch {}
  };

  return (
    <div className="mb-8 space-y-5">
      {showChecklist && (
        <section className="brand-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-softsage">Getting started</p>
              <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">
                {doneCount} of {steps.length} done
              </h2>
            </div>
            <button onClick={hide} className="text-xs font-bold text-[#6E5A46] hover:underline">Hide this</button>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-cream">
            <div className="h-full rounded-full bg-brand-leaf transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          </div>
          <ul className="mt-4 divide-y divide-brand-line">
            {steps.map((step) => (
              <li key={step.title} className="flex flex-wrap items-center gap-3 py-3">
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black " +
                    (step.done ? "bg-brand-leaf text-white" : "border-2 border-brand-line text-transparent")
                  }
                  aria-label={step.done ? "Done" : "Not done yet"}
                >
                  ✓
                </span>
                <div className="min-w-0 flex-1">
                  <p className={"font-bold " + (step.done ? "text-[#8A7A69] line-through" : "text-brand-charcoal")}>{step.title}</p>
                  {!step.done && <p className="text-sm text-[#6E5A46]">{step.text}</p>}
                </div>
                {!step.done && (
                  <Link href={step.href} className="shrink-0 rounded-xl bg-brand-sage px-3 py-1.5 text-xs font-bold text-white">
                    {step.cta}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/parent/rewards" className="brand-card block p-4 transition-shadow hover:shadow-md">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-earth/55">Reward requests</p>
          <p className="mt-2 text-3xl font-extrabold text-brand-sage">{pendingRewards}</p>
          <p className="text-sm font-semibold text-brand-earth/65">{pendingRewards ? "Waiting for you to approve" : "Nothing waiting"}</p>
        </Link>
        <Link href="/parent/reminders" className="brand-card block p-4 transition-shadow hover:shadow-md">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-earth/55">Reminders today</p>
          <p className="mt-2 text-3xl font-extrabold text-brand-sage">{remindersLeft ?? "–"}</p>
          <p className="text-sm font-semibold text-brand-earth/65">{remindersLeft ? "Still to do" : "All done, or none due yet"}</p>
        </Link>
        <Link href="/moments" className="brand-card flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
          {latestMoment?.photo_ids[0] ? (
            <MomentImage photoId={latestMoment.photo_ids[0]} alt="Latest moment" className="h-16 w-16 shrink-0 rounded-xl" />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-2xl"><Emoji e="📸" className="h-10 w-10" /></span>
          )}
          <span className="min-w-0">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-brand-earth/55">Latest moment</span>
            {latestMoment ? (
              <>
                <span className="block truncate text-sm font-bold text-brand-charcoal">{latestMoment.note || "A new photo"}</span>
                <span className="block text-xs text-brand-earth/65">{format(parseISO(latestMoment.moment_date), "d MMM")}</span>
              </>
            ) : (
              <span className="block text-sm font-semibold text-brand-earth/65">Share your first one</span>
            )}
          </span>
        </Link>
      </section>
    </div>
  );
}
