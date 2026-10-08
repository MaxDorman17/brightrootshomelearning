"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import {
  deleteLanguageLog,
  getChildren,
  getLanguageLog,
  getLanguageSummary,
  LanguageLogEntry,
  LanguageSummary,
  logLanguage,
} from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { Child } from "@/types";
import { errorText } from "@/components/make/common";
import StarterPacks from "@/components/languages/StarterPacks";

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-60";
const primary = `${btn} bg-brand-sage text-white hover:bg-brand-sagedark`;
const secondary = `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`;
const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const label = "mb-1.5 block text-sm font-bold text-brand-charcoal";

// Languages UK families most often learn at home. Anything else can be typed in.
const COMMON_LANGUAGES = [
  "French", "Spanish", "German", "Italian", "Polish", "Welsh", "Scottish Gaelic", "Irish",
  "Mandarin", "Japanese", "Arabic", "Urdu", "Portuguese", "Latin", "British Sign Language",
];
const WAYS = ["Duolingo", "Another app", "Lesson", "Tutor", "Book", "Songs or videos", "Speaking practice"];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-brand-white p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold text-brand-charcoal">{title}</h2>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm font-bold text-brand-earth/60 hover:bg-brand-cream" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function niceDate(iso: string) {
  return format(parseISO(iso), "EEE d MMM");
}

function minutesText(total: number) {
  if (!total) return "";
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h} hr${h === 1 ? "" : "s"}${m ? ` ${m} min` : ""}` : `${m} min`;
}

function LogForm({
  kids,
  isParent,
  defaultKid,
  defaultLanguage,
  knownLanguages,
  onDone,
}: {
  kids: Child[];
  isParent: boolean;
  defaultKid: number | "";
  defaultLanguage: string;
  knownLanguages: string[];
  onDone: () => void;
}) {
  const choices = useMemo(() => Array.from(new Set([...knownLanguages, ...COMMON_LANGUAGES])), [knownLanguages]);
  const startsOther = !!defaultLanguage && !choices.includes(defaultLanguage);
  const [language, setLanguage] = useState(startsOther ? "__other" : defaultLanguage || knownLanguages[0] || "");
  const [otherLanguage, setOtherLanguage] = useState(startsOther ? defaultLanguage : "");
  const [doneOn, setDoneOn] = useState(format(new Date(), "yyyy-MM-dd"));
  const [minutes, setMinutes] = useState("");
  const [xp, setXp] = useState("");
  const [how, setHow] = useState("");
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<number[]>(defaultKid ? [defaultKid] : kids.length === 1 ? [kids[0].id] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const chosen = language === "__other" ? otherLanguage.trim() : language;
    if (!chosen) return setError("Pick a language.");
    if (isParent && picked.length === 0) return setError("Pick who practised.");
    setSaving(true);
    setError("");
    try {
      await logLanguage({
        language: chosen,
        done_on: doneOn,
        minutes: minutes ? Number(minutes) : null,
        xp: xp ? Number(xp) : null,
        how: how.trim() || undefined,
        note: note.trim() || undefined,
        child_ids: isParent ? picked : [],
      });
      onDone();
    } catch (err) {
      setError(errorText(err, "That didn't save. Please try again."));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={label} htmlFor="lang">Language</label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className={input}>
          <option value="" disabled>Choose a language</option>
          {choices.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
          <option value="__other">Another language…</option>
        </select>
        {language === "__other" && (
          <input
            autoFocus
            value={otherLanguage}
            onChange={(e) => setOtherLanguage(e.target.value)}
            placeholder="e.g. Norwegian"
            maxLength={60}
            className={`${input} mt-2`}
          />
        )}
      </div>

      {isParent && kids.length > 0 && (
        <div>
          <p className={label}>Who practised?</p>
          <div className="flex flex-wrap gap-2">
            {kids.map((k) => {
              const on = picked.includes(k.id);
              return (
                <button
                  type="button"
                  key={k.id}
                  onClick={() => setPicked(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
                  className={
                    "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                    (on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                  }
                >
                  {on ? "✓ " : ""}
                  {k.username}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={label} htmlFor="day">Day</label>
          <input id="day" type="date" value={doneOn} max={format(new Date(), "yyyy-MM-dd")} onChange={(e) => setDoneOn(e.target.value)} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="mins">Minutes</label>
          <input id="mins" type="number" min={1} max={600} value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="15" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="xp">XP</label>
          <input id="xp" type="number" min={0} value={xp} onChange={(e) => setXp(e.target.value)} placeholder="Optional" className={input} />
        </div>
      </div>

      <div>
        <p className={label}>How?</p>
        <div className="flex flex-wrap gap-2">
          {WAYS.map((w) => (
            <button
              type="button"
              key={w}
              onClick={() => setHow(how === w ? "" : w)}
              className={
                "rounded-full border-2 px-3 py-1 text-xs font-bold " +
                (how === w ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
              }
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={label} htmlFor="note">What did you practise?</label>
        <input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Numbers 1 to 20, ordering food" maxLength={1000} className={input} />
      </div>

      {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className={primary}>
          {saving ? "Saving…" : "Save practice"}
        </button>
        <button type="button" onClick={onDone} className={secondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function LanguagesPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [kids, setKids] = useState<Child[]>([]);
  const [who, setWho] = useState<number | "">("");
  const [summary, setSummary] = useState<LanguageSummary | null>(null);
  const [log, setLog] = useState<LanguageLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState<{ language?: string } | null>(null);
  const isParent = role === "parent";

  const load = useCallback(() => {
    const params = who ? { child_id: who } : {};
    return Promise.all([getLanguageSummary(params), getLanguageLog(params)])
      .then(([s, l]) => {
        setSummary(s.data);
        setLog(l.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [who]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const r = getRole() || "";
    setRole(r);
    if (r === "parent") getChildren().then((res) => setKids(res.data)).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (role) load();
  }, [role, load]);

  const remove = async (id: number) => {
    if (!confirm("Remove this practice from the diary?")) return;
    await deleteLanguageLog(id);
    load();
  };

  const totals = summary?.totals;
  const knownLanguages = summary?.languages.map((l) => l.language) ?? [];
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <PageHero art="languages" tint={4}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Learning</p>
            <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Languages</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
              Learn first words with the starter packs, log practice in any language, keep a streak going and earn language badges. Everything shows in your reports.
            </p>
          </PageHero>
          <div className="flex flex-wrap items-center gap-3">
            {isParent && kids.length > 1 && (
              <select value={who} onChange={(e) => setWho(e.target.value ? Number(e.target.value) : "")} className={`${input} w-auto`} aria-label="Whose practice">
                <option value="">Everyone</option>
                {kids.map((k) => (
                  <option key={k.id} value={k.id}>{k.username}</option>
                ))}
              </select>
            )}
            <button onClick={() => setLogging({})} className={primary}>
              {isParent ? "+ Log practice" : "I practised!"}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm font-semibold text-[#6E5A46]">Loading…</p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([
                [totals?.current_streak ?? 0, "Day streak", "text-brand-sage"],
                [totals?.days ?? 0, "Days practised", "text-[#2E342F]"],
                [minutesText(totals?.minutes ?? 0) || "0 min", "Time practising", "text-[#2E342F]"],
                [totals?.xp ?? 0, "Total XP", "text-[#D19A32]"],
              ] as [number | string, string, string][]).map(([value, text, colour]) => (
                <div key={text} className="brand-card p-4">
                  <p className={`text-2xl font-bold ${colour}`}>{value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6E5A46]">{text}</p>
                </div>
              ))}
            </div>

            <StarterPacks log={log} isParent={isParent} kids={kids} who={who} onLogged={load} />

            {summary && summary.languages.length > 0 ? (
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {summary.languages.map((l) => {
                  const doneToday = log.some((e) => e.language === l.language && e.done_on === today);
                  return (
                    <div key={l.language} className="brand-card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-extrabold text-brand-charcoal">{l.language}</h2>
                          <p className="mt-0.5 text-xs font-semibold text-[#6E5A46]">
                            Last practised {niceDate(l.last)}
                            {isParent && !who && l.children.length > 0 ? ` · ${l.children.join(", ")}` : ""}
                          </p>
                        </div>
                        {l.current_streak > 0 && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                            <Emoji e="🔥" /> {l.current_streak} day{l.current_streak === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {([
                          [l.days, l.days === 1 ? "day" : "days"],
                          [minutesText(l.minutes) || "–", "time"],
                          [l.xp || "–", "XP"],
                        ] as [number | string, string][]).map(([v, t]) => (
                          <div key={t} className="rounded-xl bg-brand-cream p-2">
                            <p className="text-lg font-bold text-[#2E342F]">{v}</p>
                            <p className="text-xs font-semibold text-[#6E5A46]">{t}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-xs text-[#6E5A46]">Best streak: {l.best_streak} day{l.best_streak === 1 ? "" : "s"}</p>
                        <button onClick={() => setLogging({ language: l.language })} className={`${secondary} py-1.5`}>
                          {doneToday ? "Edit today" : "Log today"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="brand-card mb-6 p-6 text-center">
                <p className="text-4xl"><Emoji e="🗣️" /></p>
                <h2 className="mt-3 text-xl font-bold text-[#2E342F]">No language practice yet</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#6E5A46]">
                  Learning French, Welsh, Polish or sign language? Log each day&apos;s practice here, whether it&apos;s an app, a lesson or singing songs.
                </p>
                <button onClick={() => setLogging({})} className={`${primary} mt-4`}>
                  Log the first practice
                </button>
              </div>
            )}

            <div className="brand-card p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Diary</p>
                  <h2 className="mt-1 text-xl font-bold text-[#2E342F]">Practice history</h2>
                </div>
                <div className="flex gap-4 text-sm font-semibold">
                  <Link href="/achievements" className="text-brand-sage hover:underline">Language badges</Link>
                  {isParent && <Link href="/parent/report" className="text-brand-sage hover:underline">Reports</Link>}
                </div>
              </div>
              {log.length === 0 ? (
                <p className="text-sm text-[#6E5A46]">Nothing logged yet.</p>
              ) : (
                <ul className="divide-y divide-brand-line">
                  {log.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#2E342F]">
                          {niceDate(e.done_on)} · {e.language}
                          {isParent && !who && <span className="font-normal text-[#6E5A46]"> · {e.child}</span>}
                        </p>
                        <p className="text-xs text-[#6E5A46]">
                          {[e.minutes ? `${e.minutes} min` : "", e.xp ? `${e.xp} XP` : "", e.how || "", e.note || ""].filter(Boolean).join(" · ") || "Practised"}
                        </p>
                      </div>
                      {e.can_remove && (
                        <button onClick={() => remove(e.id)} className="shrink-0 text-xs font-bold text-[#A64F42] hover:underline">
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {logging && (
        <Modal title={isParent ? "Log language practice" : "I practised!"} onClose={() => setLogging(null)}>
          <LogForm
            kids={kids}
            isParent={isParent}
            defaultKid={who}
            defaultLanguage={logging.language || ""}
            knownLanguages={knownLanguages}
            onDone={() => {
              setLogging(null);
              load();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
