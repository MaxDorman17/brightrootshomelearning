"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  ReminderBody,
  addReminder,
  deleteReminder,
  getChildren,
  getReminders,
  setSummaryEmail,
  updateReminder,
} from "@/lib/api";

type Reminder = ReminderBody & { id: number; label: string };
type TodayRow = { id: number; label: string; child: string; done: boolean; items: string[] };
type Child = { id: number; username: string; email: string | null };

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SCHOOL_DAYS = WEEKDAYS.slice(0, 5);
const KINDS: { kind: ReminderBody["kind"]; label: string; hint: string }[] = [
  { kind: "spellings", label: "📝 Practise spellings", hint: "Ticks itself off when they do a spelling test or practice that day." },
  { kind: "extra_work", label: "📚 Finish extra work", hint: "Lists unfinished extra work and ticks itself off when it's all done." },
  { kind: "custom", label: "✏️ Something else", hint: "Your own words. They press Done when it's done." },
];
const input = "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function describeDays(days: string[]) {
  if (days.length === 7) return "Every day";
  if (days.length === 5 && SCHOOL_DAYS.every((d) => days.includes(d))) return "Weekdays";
  return days.map((d) => d.slice(0, 3)).join(", ");
}

function ReminderForm({ reminder, childList, onDone, onCancel }: { reminder: Reminder | null; childList: Child[]; onDone: () => void; onCancel: () => void }) {
  const [kind, setKind] = useState<ReminderBody["kind"]>(reminder?.kind ?? "spellings");
  const [text, setText] = useState(reminder?.text ?? "");
  const [childId, setChildId] = useState<number | null>(reminder?.child_id ?? null);
  const [time, setTime] = useState(reminder?.time ?? "09:00");
  const [days, setDays] = useState<string[]>(reminder?.days ?? SCHOOL_DAYS);
  const [emailChild, setEmailChild] = useState(reminder?.email_child ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const emailable = childList.filter((c) => (childId == null || c.id === childId) && c.email);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body: ReminderBody = { kind, text: kind === "custom" ? text : null, child_id: childId, time, days, email_child: emailChild, is_active: reminder?.is_active ?? true };
    try {
      if (reminder) await updateReminder(reminder.id, body);
      else await addReminder(body);
      onDone();
    } catch (err) {
      setError(errorText(err, "Could not save."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-brand-cream p-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {KINDS.map((k) => (
          <button
            key={k.kind}
            type="button"
            onClick={() => setKind(k.kind)}
            className={"rounded-xl border-2 p-3 text-left text-sm font-bold " + (kind === k.kind ? "border-brand-sage bg-white text-brand-charcoal" : "border-transparent bg-white/60 text-[#6E5A46]")}
          >
            {k.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#6E5A46]">{KINDS.find((k) => k.kind === kind)?.hint}</p>
      {kind === "custom" && (
        <input required value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="e.g. Read for 20 minutes" className={input + " w-full"} />
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#6E5A46]">
        <label className="flex items-center gap-2">
          For
          <select value={childId ?? ""} onChange={(e) => setChildId(e.target.value ? Number(e.target.value) : null)} className={input}>
            <option value="">Every child</option>
            {childList.map((c) => (
              <option key={c.id} value={c.id}>{c.username}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          at
          <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={input} />
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {WEEKDAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))}
            className={"rounded-lg border px-2.5 py-1 text-xs font-bold " + (days.includes(d) ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>
      <label className="flex items-start gap-2 text-sm text-[#6E5A46]">
        <input type="checkbox" checked={emailChild} onChange={(e) => setEmailChild(e.target.checked)} className="mt-0.5 accent-brand-sage" />
        <span>
          Also email the reminder if it isn&apos;t done by then
          <span className="block text-xs">
            {emailable.length ? `Goes to: ${emailable.map((c) => c.username).join(", ")}` : "None of these children has an email address, so this only shows in the app."}
          </span>
        </span>
      </label>
      {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="rounded-xl border border-[#D9D1C4] bg-white px-4 py-2 text-sm font-semibold text-[#6E5A46]">Cancel</button>
        <button type="submit" disabled={saving || days.length === 0} className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Saving..." : reminder ? "Save reminder" : "Add reminder"}
        </button>
      </div>
    </form>
  );
}

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [today, setToday] = useState<TodayRow[]>([]);
  const [childList, setChildList] = useState<Child[]>([]);
  const [summaryTime, setSummaryTime] = useState<string | null>(null);
  const [summaryDraft, setSummaryDraft] = useState("17:00");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [editing, setEditing] = useState<{ reminder: Reminder | null } | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await getReminders();
    setReminders(res.data.reminders);
    setToday(res.data.today);
    setSummaryTime(res.data.summary_time);
    if (res.data.summary_time) setSummaryDraft(res.data.summary_time);
    setEmailEnabled(res.data.email_enabled);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load().catch(() => setLoading(false));
    getChildren().then((r) => setChildList(r.data)).catch(() => {});
  }, [load, router]);

  const childName = (id: number | null) => (id == null ? "Every child" : childList.find((c) => c.id === id)?.username ?? "A child");

  const toggleActive = async (r: Reminder) => {
    await updateReminder(r.id, { ...r, is_active: !r.is_active });
    load();
  };

  const remove = async (r: Reminder) => {
    if (!confirm(`Delete the "${r.label}" reminder?`)) return;
    await deleteReminder(r.id);
    load();
  };

  const saveSummary = async (time: string | null) => {
    setMessage("");
    await setSummaryEmail(time);
    setSummaryTime(time);
    setMessage(time ? `Daily summary will arrive at ${time}.` : "Daily summary turned off.");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="reminders" tint={2}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Routine</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Reminders</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
          Daily nudges for your children. They appear on their Today page from the time you choose and tick themselves off when the work is done.
        </p>
        </PageHero>

        {!emailEnabled && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Email isn&apos;t set up on the server, so reminders only show in the app for now.
          </div>
        )}

        {loading && <p className="mt-6 text-sm text-[#6E5A46]">Loading...</p>}

        {!loading && (
          <div className="mt-6 space-y-6">
            {today.length > 0 && (
              <section className="brand-card p-5 sm:p-6">
                <h2 className="text-lg font-extrabold text-brand-charcoal">Today so far</h2>
                <div className="mt-3 divide-y divide-brand-line">
                  {today.map((t, i) => (
                    <div key={i} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                      <span className="text-brand-charcoal">
                        <b>{t.child}</b> · {t.label}
                        {t.items.length > 0 && <span className="text-[#6E5A46]"> ({t.items.length} left)</span>}
                      </span>
                      <span className={"rounded-full px-2.5 py-0.5 text-xs font-bold " + (t.done ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>
                        {t.done ? "Done ✓" : "Not yet"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="brand-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-brand-charcoal">Reminders</h2>
                {!editing && (
                  <button onClick={() => setEditing({ reminder: null })} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">
                    + Add reminder
                  </button>
                )}
              </div>
              {editing && (
                <div className="mt-4">
                  <ReminderForm
                    reminder={editing.reminder}
                    childList={childList}
                    onCancel={() => setEditing(null)}
                    onDone={() => {
                      setEditing(null);
                      load();
                    }}
                  />
                </div>
              )}
              {reminders.length === 0 && !editing ? (
                <p className="mt-3 text-sm text-[#6E5A46]">No reminders yet. Try “Practise spellings” at 9:00 on weekdays.</p>
              ) : (
                <div className="mt-3 divide-y divide-brand-line">
                  {reminders.map((r) => (
                    <div key={r.id} className={"flex flex-wrap items-center gap-3 py-3 " + (r.is_active ? "" : "opacity-50")}>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brand-charcoal">{r.label}</p>
                        <p className="text-xs text-[#6E5A46]">
                          {childName(r.child_id)} · {r.time} · {describeDays(r.days)}
                          {r.email_child ? " · also by email" : ""}
                        </p>
                      </div>
                      <button onClick={() => toggleActive(r)} className="text-xs font-bold text-[#6E5A46] hover:underline">
                        {r.is_active ? "Pause" : "Turn on"}
                      </button>
                      <button onClick={() => setEditing({ reminder: r })} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
                      <button onClick={() => remove(r)} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="brand-card p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Daily summary email for you</h2>
              <p className="mt-1 text-sm text-[#6E5A46]">
                What each child did today (lessons, study time, spellings) and any reminders still undone.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input type="time" value={summaryDraft} onChange={(e) => setSummaryDraft(e.target.value)} className={input} />
                <button onClick={() => saveSummary(summaryDraft)} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">
                  {summaryTime ? "Update" : "Turn on"}
                </button>
                {summaryTime && (
                  <button onClick={() => saveSummary(null)} className="rounded-xl border border-brand-line bg-white px-4 py-2 text-xs font-bold text-[#6E5A46]">
                    Turn off
                  </button>
                )}
                <span className="text-sm text-[#6E5A46]">{summaryTime ? `On, at ${summaryTime}` : "Off"}</span>
              </div>
              {message && <p className="mt-2 text-sm font-semibold text-brand-sage">{message}</p>}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
