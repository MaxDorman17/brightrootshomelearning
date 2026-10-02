"use client";

import { useEffect, useState } from "react";
import { calendarFeedUrl, getCalendarLink, makeCalendarLink, removeCalendarLink } from "@/lib/api";

const STEPS: { app: string; steps: string[] }[] = [
  {
    app: "Google Calendar",
    steps: [
      "On a computer, open calendar.google.com.",
      "Next to \"Other calendars\" on the left, press + then \"From URL\".",
      "Paste the address and press \"Add calendar\". It shows on your phone too.",
    ],
  },
  {
    app: "iPhone, iPad or Mac",
    steps: [
      "On the iPhone, iPad or Mac itself, press \"Add to Apple Calendar\" above, or",
      "Go to Settings, Calendar, Accounts, Add Account, Other, Add Subscribed Calendar, and paste the address.",
    ],
  },
  {
    app: "Outlook",
    steps: [
      "In Outlook on the web, open the calendar and choose \"Add calendar\".",
      "Pick \"Subscribe from web\", paste the address, give it a name and press Import.",
    ],
  },
];

/** Account page: switch on a private calendar feed of lessons, exams and days off. */
export default function CalendarSyncCard() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);

  useEffect(() => {
    getCalendarLink()
      .then((res) => setToken(res.data.token))
      .catch(() => setToken(null));
  }, []);

  const run = async (job: () => Promise<string | null>) => {
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      setToken(await job());
    } catch {
      setError("That didn't work. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const turnOn = () => run(async () => (await makeCalendarLink()).data.token);
  const replace = () => {
    if (!confirm("Make a new address? The old one will stop working, so you'll need to add the new one to your calendar again.")) return;
    turnOn();
  };
  const turnOff = () => {
    if (!confirm("Turn off calendar sync? Your calendar app will stop getting updates.")) return;
    run(async () => {
      await removeCalendarLink();
      return null;
    });
  };

  const url = token ? calendarFeedUrl(token) : "";
  const webcal = url.replace(/^https?:/, "webcal:");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setError("Couldn't copy. Select the address and copy it yourself.");
    }
  };

  if (token === undefined) return null;

  return (
    <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
      <h2 className="text-lg font-extrabold text-brand-charcoal">Calendar sync</h2>
      <p className="mt-1 text-sm text-brand-earth/70">
        See your planned lessons, exams and days off in Google, Apple or Outlook calendar. Changes you make here show up there
        on their own, usually within a few hours.
      </p>

      {!token ? (
        <button onClick={turnOn} disabled={busy} className="mt-4 rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50">
          {busy ? "Turning on..." : "Turn on calendar sync"}
        </button>
      ) : (
        <>
          <p className="mt-4 text-sm font-semibold text-brand-charcoal">Your private calendar address</p>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
            <input readOnly value={url} onFocus={(e) => e.target.select()} className="min-w-0 flex-1 rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 font-mono text-xs text-brand-charcoal" />
            <button onClick={copy} className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white hover:bg-brand-sagedark">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-brand-earth/70">
            Keep this address to yourselves: anyone who has it can see your plans. If it gets shared by mistake, make a new one.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
            <a href={webcal} className="rounded-xl border border-brand-line bg-white px-3 py-2 text-brand-charcoal hover:border-brand-softsage">
              Add to Apple Calendar
            </a>
            <a
              href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-brand-line bg-white px-3 py-2 text-brand-charcoal hover:border-brand-softsage"
            >
              Add to Google Calendar
            </a>
            <button onClick={() => setHelp((v) => !v)} className="rounded-xl px-3 py-2 text-brand-sage hover:underline">
              {help ? "Hide help" : "How do I add it?"}
            </button>
          </div>
          {help && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.app} className="rounded-xl bg-white p-3 text-sm">
                  <p className="font-bold text-brand-charcoal">{s.app}</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-4 text-brand-earth/80">
                    {s.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold">
            <button onClick={replace} disabled={busy} className="text-brand-sage hover:underline">Make a new address</button>
            <button onClick={turnOff} disabled={busy} className="text-[#A64F42] hover:underline">Turn off</button>
          </div>
        </>
      )}
      {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
    </div>
  );
}
