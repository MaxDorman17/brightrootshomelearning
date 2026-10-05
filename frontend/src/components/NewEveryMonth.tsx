"use client";

import { useEffect, useState } from "react";
import { nextMonthName } from "@/lib/newContent";

/** A small banner: "A new comic every month · next one coming in November". */
export default function NewEveryMonth({ what }: { what: string }) {
  // Worked out in the browser, so the month is right whatever time the page was built.
  const [next, setNext] = useState("");
  useEffect(() => setNext(nextMonthName()), []);
  return (
    <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border-2 border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-900">
      <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white">New</span>
      A new {what} every month{next && <span className="font-semibold text-amber-800/80">· next one coming in {next}</span>}
    </div>
  );
}

/** The "New" corner badge for a card. */
export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`rounded-full bg-amber-400 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow ${className}`}>
      New
    </span>
  );
}
