"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addDays, format } from "date-fns";
import { getChildren, getMakeItems, planMakeItem } from "@/lib/api";
import type { LittleActivity, LittleTopic } from "@/lib/little-roots-plan";
import type { Term } from "@/lib/terms";
import { MakePhoto, MakeSummary } from "./common";

/** Every Little Roots activity, by slug, for the term and area pages. `null` while loading. */
export function useLittleItems(): Record<string, MakeSummary> | null {
  const [items, setItems] = useState<Record<string, MakeSummary> | null>(null);
  useEffect(() => {
    getMakeItems("little")
      .then((res) => setItems(Object.fromEntries((res.data as MakeSummary[]).filter((i) => i.slug).map((i) => [i.slug as string, i]))))
      .catch(() => setItems({}));
  }, []);
  return items;
}

/** One built activity as a small card. */
export function LittleCard({ item }: { item: MakeSummary }) {
  return (
    <Link href={`/make/${item.id}`} className="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <MakePhoto item={item} className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="min-w-0">
        <p className="font-extrabold text-brand-charcoal group-hover:text-brand-sage">{item.title}</p>
        {item.summary && <p className="line-clamp-2 text-xs text-brand-earth/70">{item.summary}</p>}
      </div>
    </Link>
  );
}

/** A topic's six activities: the built ones as cards, the rest as "coming". */
export function LittleTopicActivities({ activities, items, comingLabel }: { activities: LittleActivity[]; items: Record<string, MakeSummary>; comingLabel: string }) {
  const built = activities.filter((a) => items[a.slug]);
  const coming = activities.filter((a) => !items[a.slug]);
  return (
    <div className="space-y-3">
      {built.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {built.map((a) => (
            <LittleCard key={a.slug} item={items[a.slug]} />
          ))}
        </div>
      )}
      {coming.length > 0 && (
        <div className="rounded-2xl border-2 border-dashed border-brand-line p-4">
          <p className="text-sm font-extrabold text-brand-charcoal">{comingLabel}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {coming.map((a) => (
              <li key={a.slug} className="rounded-full bg-brand-cream px-3 py-1 text-sm text-brand-earth">
                {a.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

type Kid = { id: number; username: string; activity_level?: string | null };
const DAYS = [1, 3, 5]; // Monday, Wednesday and Friday, like the weekly set

/** Monday, Wednesday and Friday dates from `start` on, `count` of them. */
function activityDays(start: Date, count: number): Date[] {
  const days: Date[] = [];
  for (let d = start; days.length < count; d = addDays(d, 1)) if (DAYS.includes(d.getDay())) days.push(d);
  return days;
}

/** The first day to plan a term from: today in the current term, otherwise the 1st of its first month. */
function termStart(term: Term, isNow: boolean): Date {
  if (isNow) return new Date();
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(term.startMonth);
  const now = new Date();
  const year = month > now.getMonth() ? now.getFullYear() : now.getFullYear() + 1;
  return new Date(year, month, 1);
}

/**
 * "Plan this term": the term's built activities into the planner, three a week on Monday, Wednesday and Friday,
 * taking one area after another so each week has a mix.
 */
export function PlanLittleTerm({ topics, items, term, isNow }: { topics: LittleTopic[]; items: Record<string, MakeSummary>; term: Term; isNow: boolean }) {
  const [kids, setKids] = useState<Kid[]>([]);
  const [who, setWho] = useState<Set<number>>(new Set());
  const [planning, setPlanning] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getChildren()
      .then((res) => {
        const all: Kid[] = res.data;
        setKids(all);
        const little = all.filter((k) => k.activity_level === "little");
        setWho(new Set((little.length ? little : all.length === 1 ? all : []).map((k) => k.id)));
      })
      .catch(() => {});
  }, []);

  // Round the areas: each area's first activity, then each area's second, and so on.
  const order: MakeSummary[] = [];
  for (let i = 0; i < 6; i++) for (const t of topics) if (t.activities[i] && items[t.activities[i].slug]) order.push(items[t.activities[i].slug]);
  if (order.length === 0) return null;

  const plan = async () => {
    setPlanning(true);
    setError("");
    try {
      const days = activityDays(termStart(term, isNow), order.length);
      for (let i = 0; i < order.length; i++) {
        await planMakeItem(order[i].id, { scheduled_date: format(days[i], "yyyy-MM-dd"), subject: "", child_ids: Array.from(who) });
      }
      setDone(`${order.length} activities are in the planner, from ${format(days[0], "EEEE d MMMM")} to ${format(days[days.length - 1], "EEEE d MMMM")}.`);
    } catch {
      setError("That didn't all plan. Please check the planner and try again.");
    } finally {
      setPlanning(false);
    }
  };

  if (done) {
    return (
      <p className="text-sm font-bold text-brand-sage">
        ✓ {done}{" "}
        <Link href="/parent" className="underline">
          Open the planner
        </Link>
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {kids.length > 1 &&
        kids.map((k) => (
          <button
            key={k.id}
            onClick={() =>
              setWho((prev) => {
                const next = new Set(prev);
                if (next.has(k.id)) next.delete(k.id);
                else next.add(k.id);
                return next;
              })
            }
            aria-pressed={who.has(k.id)}
            className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${who.has(k.id) ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth"}`}
          >
            {who.has(k.id) ? "✓ " : ""}
            {k.username}
          </button>
        ))}
      <button
        onClick={plan}
        disabled={planning || (kids.length > 1 && !who.size)}
        className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark disabled:opacity-60"
      >
        {planning ? "Planning..." : "Plan this term"}
      </button>
      <span className="text-xs text-brand-earth/60">
        {order.length} activities, three a week on Monday, Wednesday and Friday{isNow ? ", from today" : `, from 1 ${term.startMonth}`}.
      </span>
      {error && <p className="w-full text-sm font-bold text-[#A64F42]">{error}</p>}
    </div>
  );
}
