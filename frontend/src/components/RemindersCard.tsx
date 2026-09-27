"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyReminders, markReminderDone } from "@/lib/api";

type Reminder = { id: number; kind: string; label: string; time: string; done: boolean; items: string[] };

/** Today's reminders on the child's Today page. Hidden when there's nothing left to do. */
export default function RemindersCard() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const load = useCallback(() => {
    getMyReminders()
      .then((res) => setReminders(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    // Pick up reminders whose time arrives while the page is open, and work finished elsewhere.
    const id = setInterval(load, 5 * 60 * 1000);
    window.addEventListener("focus", load);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  const todo = reminders.filter((r) => !r.done);
  if (todo.length === 0) return null;

  const done = async (r: Reminder) => {
    await markReminderDone(r.id).catch(() => {});
    load();
  };

  return (
    <div className="mb-4 rounded-2xl border-2 border-brand-softsage bg-brand-wash px-4 py-3 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-wide text-brand-sage">⏰ Reminders</p>
      <ul className="mt-2 space-y-2">
        {todo.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-brand-charcoal">{r.label}</p>
              {r.items.length > 0 && (
                <p className="text-xs text-[#6E5A46]">Still to finish: {r.items.slice(0, 4).join(", ")}{r.items.length > 4 ? ` and ${r.items.length - 4} more` : ""}</p>
              )}
              {r.kind === "spellings" && <p className="text-xs text-[#6E5A46]">Do a practice or test on the Spellings page.</p>}
            </div>
            {r.kind === "custom" && (
              <button onClick={() => done(r)} className="shrink-0 rounded-xl bg-brand-sage px-3 py-1.5 text-xs font-bold text-white">
                Done ✓
              </button>
            )}
            {r.kind === "spellings" && (
              <a href="/spellings" className="shrink-0 rounded-xl bg-brand-sage px-3 py-1.5 text-xs font-bold text-white">Go →</a>
            )}
            {r.kind === "extra_work" && (
              <a href="/child/extra-work" className="shrink-0 rounded-xl bg-brand-sage px-3 py-1.5 text-xs font-bold text-white">Go →</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
