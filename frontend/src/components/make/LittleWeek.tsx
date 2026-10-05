"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addDays, format, parseISO } from "date-fns";
import { getChildren, getLittleWeek, planLittleWeek } from "@/lib/api";
import { MakePhoto, MakeSummary } from "./common";

type Week = { week: number; weeks: number; monday: string; items: MakeSummary[] };
type Kid = { id: number; username: string; activity_level?: string | null };

const DAYS = ["Monday", "Wednesday", "Friday", "Monday"];

/** Little Roots "This week": three activities and a rhyme, planned into the week with one button. */
export default function LittleWeek() {
  const [offset, setOffset] = useState(0);
  const [week, setWeek] = useState<Week | null>(null);
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

  useEffect(() => {
    setWeek(null);
    setDone("");
    setError("");
    getLittleWeek(offset)
      .then((res) => setWeek(res.data))
      .catch(() => {});
  }, [offset]);

  if (!week || !week.items.length) return null;
  const monday = parseISO(week.monday);

  const plan = async () => {
    setPlanning(true);
    setError("");
    try {
      const res = await planLittleWeek(week.monday, Array.from(who));
      setDone(`Done! ${res.data.planned} Little Roots activities are in the planner for the week of ${format(monday, "d MMMM")}.`);
    } catch {
      setError("That didn't plan. Please try again.");
    } finally {
      setPlanning(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-[#E9DDBF] bg-[#FDF9F0] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">
            {offset === 0 ? "This week" : "Next week"} · week of {format(monday, "d MMMM")}
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">Three activities and a rhyme</h2>
          <p className="mt-1 text-sm text-brand-earth/70">A different set every week, covering talk, maths, sounds, moving, creating and the world around us.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOffset(0)}
            aria-pressed={offset === 0}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${offset === 0 ? "bg-brand-sage text-white" : "bg-white text-brand-earth"}`}
          >
            This week
          </button>
          <button
            onClick={() => setOffset(1)}
            aria-pressed={offset === 1}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${offset === 1 ? "bg-brand-sage text-white" : "bg-white text-brand-earth"}`}
          >
            Next week
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {week.items.map((item, i) => (
          <Link key={item.id} href={`/make/${item.id}`} className="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm hover:shadow-md">
            <MakePhoto item={item} className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand-softsage">
                {format(addDays(monday, [0, 2, 4, 0][i] ?? 0), "EEE")} · {item.category}
              </p>
              <p className="truncate font-extrabold text-brand-charcoal group-hover:text-brand-sage">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {done ? (
        <p className="mt-4 text-sm font-bold text-brand-sage">
          ✓ {done}{" "}
          <Link href="/parent" className="underline">
            Open the planner
          </Link>
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
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
            {planning ? "Planning..." : "🗓️ Plan this week"}
          </button>
          <span className="text-xs text-brand-earth/60">{DAYS.slice(0, 3).join(", ")}, with the rhyme on Monday.</span>
        </div>
      )}
      {error && <p className="mt-2 text-sm font-bold text-[#A64F42]">{error}</p>}
    </section>
  );
}
