"use client";

import { useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { addDayOff } from "@/lib/api";
import type { DayOff } from "@/types";

export type HolidayRange = { label: string; start: string; end: string; group?: string; inservice?: boolean };

/** Every Monday to Friday between two dates (inclusive), as yyyy-MM-dd. */
export function eachWeekday(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  while (cur <= e) {
    const d = cur.getDay();
    if (d >= 1 && d <= 5) dates.push(format(cur, "yyyy-MM-dd"));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

/** Reads the events out of a calendar (.ics) file, as councils and schools publish them. */
function parseIcs(text: string): HolidayRange[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
  const events: HolidayRange[] = [];
  let cur: { summary?: string; start?: string; end?: string; allDay?: boolean } | null = null;
  const toDate = (v: string) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) cur = {};
    else if (line.startsWith("END:VEVENT") && cur) {
      if (cur.start) {
        let end = cur.end || cur.start;
        // All-day events end on the day after, so step back one day.
        if (cur.allDay && cur.end && cur.end > cur.start) end = format(addDays(parseISO(cur.end), -1), "yyyy-MM-dd");
        events.push({ label: (cur.summary || "Holiday").slice(0, 100), start: cur.start, end: end < cur.start ? cur.start : end });
      }
      cur = null;
    } else if (cur) {
      const idx = line.indexOf(":");
      if (idx < 0) continue;
      const key = line.slice(0, idx);
      const value = line.slice(idx + 1).trim();
      if (key.startsWith("SUMMARY")) cur.summary = value.replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/gi, " ");
      else if (key.startsWith("DTSTART") && /^\d{8}/.test(value)) {
        cur.start = toDate(value);
        cur.allDay = key.includes("VALUE=DATE") || value.length === 8;
      } else if (key.startsWith("DTEND") && /^\d{8}/.test(value)) cur.end = toDate(value);
    }
  }
  return events.sort((a, b) => a.start.localeCompare(b.start));
}

const REGIONS = [
  ["scotland", "Scotland"],
  ["england-and-wales", "England and Wales"],
  ["northern-ireland", "Northern Ireland"],
] as const;

type Tab = "own" | "bank" | "file" | "fife";

const inputCls =
  "w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-softsage";

export default function HolidayImporter({
  existingDates,
  fife,
  onAdded,
  onClose,
}: {
  existingDates: Set<string>;
  fife: HolidayRange[];
  onAdded: (row: DayOff) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("own");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // Add your own
  const [ownName, setOwnName] = useState("");
  const [ownStart, setOwnStart] = useState("");
  const [ownEnd, setOwnEnd] = useState("");

  // Lists to tick from (bank holidays, calendar file, Fife)
  const [list, setList] = useState<HolidayRange[]>([]);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [region, setRegion] = useState<string>("scotland");
  const [fileName, setFileName] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");

  const choose = (t: Tab) => {
    setTab(t);
    setMessage("");
    setList([]);
    setPicked(new Set());
    setFileName("");
    if (t === "fife") showList(fife);
  };

  const showList = (items: HolidayRange[]) => {
    const upcoming = items.filter((h) => h.end >= today);
    setList(upcoming);
    setPicked(new Set(upcoming.map((_, i) => i)));
    if (!upcoming.length) setMessage("There are no upcoming dates in this list.");
  };

  const loadBank = async (r: string) => {
    setRegion(r);
    setMessage("Loading…");
    try {
      const res = await fetch("https://www.gov.uk/bank-holidays.json");
      const data = await res.json();
      const events = (data?.[r]?.events || []) as { title: string; date: string }[];
      setMessage("");
      showList(events.map((e) => ({ label: e.title.replace("’", "'"), start: e.date, end: e.date })));
    } catch {
      setMessage("Couldn't load the bank holidays just now. Please try again.");
    }
  };

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setMessage("");
    const events = parseIcs(await file.text());
    if (!events.length) {
      setList([]);
      setMessage("We couldn't find any dates in that file. Make sure it's a calendar (.ics) file.");
      return;
    }
    showList(events);
  };

  const addRanges = async (ranges: HolidayRange[]) => {
    setBusy(true);
    setMessage("");
    let added = 0;
    try {
      const seen = new Set(existingDates);
      for (const r of ranges) {
        for (const date of eachWeekday(r.start, r.end)) {
          if (seen.has(date)) continue;
          const res = await addDayOff({ date, reason: r.label.slice(0, 100) });
          onAdded(res.data);
          seen.add(date);
          added++;
        }
      }
      setMessage(added ? `Added ${added} day${added === 1 ? "" : "s"} off.` : "Those days were already marked off.");
    } catch {
      setMessage(`Something went wrong after adding ${added} day${added === 1 ? "" : "s"}. Please try again.`);
    } finally {
      setBusy(false);
    }
  };

  const ownDays = useMemo(
    () => (ownStart && (ownEnd || ownStart) >= ownStart ? eachWeekday(ownStart, ownEnd || ownStart).length : 0),
    [ownStart, ownEnd]
  );

  const tabBtn = (t: Tab, label: string) => (
    <button
      key={t}
      onClick={() => choose(t)}
      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
        tab === t ? "bg-brand-sage text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mb-4 rounded-2xl border border-brand-line bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-extrabold text-gray-800">Add holidays</p>
          <p className="text-xs text-gray-500">Holiday days show as days off in the planner, so lessons aren&apos;t planned on them.</p>
        </div>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-50" aria-label="Close">
          ✕
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tabBtn("own", "✏️ Add your own")}
        {tabBtn("bank", "🏦 Bank holidays")}
        {tabBtn("file", "📅 Council calendar file")}
        {tabBtn("fife", "Fife Council")}
      </div>

      <div className="mt-4">
        {tab === "own" && (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
            <label className="text-xs font-bold text-gray-600">
              Name
              <input value={ownName} onChange={(e) => setOwnName(e.target.value)} placeholder="e.g. October break" className={`${inputCls} mt-1`} />
            </label>
            <label className="text-xs font-bold text-gray-600">
              First day
              <input type="date" value={ownStart} onChange={(e) => setOwnStart(e.target.value)} className={`${inputCls} mt-1`} />
            </label>
            <label className="text-xs font-bold text-gray-600">
              Last day
              <input type="date" value={ownEnd} min={ownStart} onChange={(e) => setOwnEnd(e.target.value)} className={`${inputCls} mt-1`} />
            </label>
            <button
              onClick={async () => {
                await addRanges([{ label: ownName.trim() || "Holiday", start: ownStart, end: ownEnd || ownStart }]);
                setOwnName("");
                setOwnStart("");
                setOwnEnd("");
              }}
              disabled={busy || !ownDays}
              className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50"
            >
              {busy ? "Adding…" : ownDays ? `Add ${ownDays} day${ownDays === 1 ? "" : "s"}` : "Add"}
            </button>
            <p className="text-xs text-gray-500 sm:col-span-4">
              Leave the last day empty for a single day. Weekends are skipped. Add each holiday in turn.
            </p>
          </div>
        )}

        {tab === "bank" && (
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(([r, label]) => (
              <button
                key={r}
                onClick={() => loadBank(r)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  list.length && region === r ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {tab === "file" && (
          <div>
            <p className="text-sm text-gray-600">
              Most councils publish their school holidays as a calendar you can download. Look for &quot;add to calendar&quot;
              or an <strong>.ics</strong> file on your council&apos;s term dates page, then choose it here.
            </p>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand-line px-4 py-2 text-sm font-bold text-brand-sage hover:bg-brand-cream">
              📂 {fileName || "Choose a calendar file"}
              <input type="file" accept=".ics,text/calendar" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
            </label>
            <p className="mt-2 text-xs text-gray-500">No file? Use &quot;Add your own&quot; and type in the dates from your council&apos;s website.</p>
          </div>
        )}

        {tab === "fife" && <p className="text-xs text-gray-500">Fife Council school holidays and in-service days.</p>}

        {list.length > 0 && tab !== "own" && (
          <div className="mt-3">
            <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
              {list.map((h, i) => {
                const showHeader = h.group && (i === 0 || list[i - 1].group !== h.group);
                return (
                  <div key={`${h.start}-${i}`}>
                    {showHeader && (
                      <p className={`pb-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-sage ${i > 0 ? "mt-2 border-t border-gray-100 pt-3" : ""}`}>
                        {h.group}
                      </p>
                    )}
                    <label className="group flex cursor-pointer items-center gap-2.5 py-0.5">
                      <input
                        type="checkbox"
                        checked={picked.has(i)}
                        onChange={(e) =>
                          setPicked((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(i);
                            else next.delete(i);
                            return next;
                          })
                        }
                        className="h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-sage"
                      />
                      <span className="min-w-0 truncate text-sm font-semibold text-gray-800">{h.label}</span>
                      {h.inservice && (
                        <span className="shrink-0 rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-600">in-service</span>
                      )}
                      <span className="ml-auto shrink-0 text-xs text-gray-400">
                        {h.start === h.end
                          ? format(parseISO(h.start), "d MMM yyyy")
                          : `${format(parseISO(h.start), "d MMM")} – ${format(parseISO(h.end), "d MMM yyyy")}`}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => addRanges(list.filter((_, i) => picked.has(i)))}
                disabled={busy || picked.size === 0}
                className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50"
              >
                {busy ? "Adding…" : `Add ${picked.size} selected`}
              </button>
              <button onClick={() => setPicked(new Set(list.map((_, i) => i)))} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                Select all
              </button>
              <button onClick={() => setPicked(new Set())} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                Clear
              </button>
            </div>
          </div>
        )}

        {message && <p className="mt-3 text-sm font-semibold text-brand-sage">{message}</p>}
      </div>
    </div>
  );
}
