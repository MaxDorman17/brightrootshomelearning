"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO, startOfMonth } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji, { EmojiText } from "@/components/Emoji";
import {
  ActivityKind,
  ActivityLogEntry,
  addClub,
  Club,
  ClubIn,
  deleteActivity,
  deleteClub,
  getActivityLog,
  getChildren,
  getClubs,
  logActivity,
  updateClub,
} from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { Child } from "@/types";
import { errorText } from "@/components/make/common";

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-60";
const primary = `${btn} bg-brand-sage text-white hover:bg-brand-sagedark`;
const secondary = `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`;
const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const label = "mb-1.5 block text-sm font-bold text-brand-charcoal";

const QUICK_PICKS: [string, string][] = [
  ["♟️", "Chess"],
  ["⚽", "Football"],
  ["🏊", "Swimming"],
  ["💃", "Dance"],
  ["🤸", "Gymnastics"],
  ["🥋", "Martial arts"],
  ["🎵", "Music lessons"],
  ["🎭", "Drama"],
  ["⛺", "Scouts / Guides"],
  ["🏉", "Rugby"],
  ["🎾", "Tennis"],
  ["🏀", "Basketball"],
  ["🐴", "Horse riding"],
  ["🧗", "Climbing"],
  ["💻", "Coding club"],
  ["🎨", "Art club"],
];

const KIND_BADGE: Record<ActivityKind, { text: string; cls: string }> = {
  club: { text: "Club", cls: "bg-violet-100 text-violet-800" },
  pe: { text: "P.E.", cls: "bg-emerald-100 text-emerald-800" },
  outdoor: { text: "Outdoors", cls: "bg-lime-100 text-lime-800" },
};

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

function KidPicker({ kids, picked, onChange }: { kids: Child[]; picked: number[]; onChange: (ids: number[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {kids.map((k) => {
        const on = picked.includes(k.id);
        return (
          <button
            type="button"
            key={k.id}
            onClick={() => onChange(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
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

export default function ClubsPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [kids, setKids] = useState<Child[]>([]);
  const [who, setWho] = useState<number | "">("");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [log, setLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Club | "new" | null>(null);
  const [logging, setLogging] = useState<{ club?: Club } | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [notice, setNotice] = useState("");

  const isParent = role === "parent";

  const load = useCallback(() => {
    Promise.all([getClubs(), getActivityLog()])
      .then(([c, l]) => {
        setClubs(c.data);
        setLog(l.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const r = getRole() || "";
    setRole(r);
    if (r === "parent") getChildren().then((res) => setKids(res.data)).catch(() => {});
    load();
  }, [load, router]);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const shownClubs = clubs.filter((c) => !who || c.child_ids.includes(who));
  const current = shownClubs.filter((c) => c.is_active);
  const past = shownClubs.filter((c) => !c.is_active);
  const shownLog = log.filter((l) => !who || l.child_id === who);

  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const thisMonth = shownLog.filter((l) => l.done_on >= monthStart);
  const stats = [
    { n: thisMonth.filter((l) => l.kind === "club").length, text: "club sessions", e: "🏅" },
    { n: thisMonth.filter((l) => l.kind === "pe").length, text: "P.E. activities", e: "🏃" },
    { n: thisMonth.filter((l) => l.kind === "outdoor").length, text: "outdoor adventures", e: "🌳" },
  ];
  const activeMinutes = thisMonth.reduce((sum, l) => sum + (l.minutes || 0), 0);

  const months = useMemo(() => {
    const groups: { key: string; label: string; rows: ActivityLogEntry[] }[] = [];
    for (const row of shownLog) {
      const key = row.done_on.slice(0, 7);
      let g = groups.find((x) => x.key === key);
      if (!g) {
        g = { key, label: format(parseISO(`${key}-01`), "MMMM yyyy"), rows: [] };
        groups.push(g);
      }
      g.rows.push(row);
    }
    return groups;
  }, [shownLog]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <PageHero art="clubs" tint={2}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Active</p>
          <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{isParent ? "Clubs & activities" : "My clubs & activities"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-earth/80 sm:text-base">
            {isParent
              ? "Add the clubs your children go to, like chess or football, and tick off each session. P.E., Outdoors and clubs all show in the learning report and the council report."
              : "Your clubs, and everything you've done to keep active. Tick off a session when you've been!"}
          </p>
        </PageHero>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {isParent && (
            <button onClick={() => setEditing("new")} className={primary}>
              + Add a club
            </button>
          )}
          <button onClick={() => setLogging({})} className={secondary}>
            ✓ Log an activity
          </button>
          <Link href="/make/pe" className={secondary}>
            <EmojiText text="🏃 P.E. ideas" />
          </Link>
          <Link href="/make/outdoors" className={secondary}>
            <EmojiText text="🌳 Outdoor ideas" />
          </Link>
          {isParent && kids.length > 1 && (
            <select
              value={who}
              onChange={(e) => setWho(e.target.value ? Number(e.target.value) : "")}
              className="ml-auto rounded-xl border-2 border-brand-line bg-white px-3 py-2 text-sm font-bold text-brand-charcoal"
              aria-label="Show which child"
            >
              <option value="">All children</option>
              {kids.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.username}
                </option>
              ))}
            </select>
          )}
        </div>
        {notice && <p className="mb-4 text-sm font-bold text-brand-sage">{notice}</p>}

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.text} className="brand-card p-4">
              <p className="text-2xl font-extrabold text-brand-charcoal">
                <Emoji e={s.e} className="mr-1.5 inline-block h-[1.2em] w-[1.2em] align-[-0.2em]" />
                {s.n}
              </p>
              <p className="mt-1 text-xs font-semibold text-brand-earth/80">{s.text} this month</p>
            </div>
          ))}
          <div className="brand-card p-4">
            <p className="text-2xl font-extrabold text-brand-sage">
              <Emoji e="⏱️" className="mr-1.5 inline-block h-[1.2em] w-[1.2em] align-[-0.2em]" />
              {minutesText(activeMinutes) || "0 min"}
            </p>
            <p className="mt-1 text-xs font-semibold text-brand-earth/80">active this month</p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-extrabold text-brand-charcoal">{isParent ? "Clubs" : "My clubs"}</h2>
          {loading ? (
            <p className="text-sm text-brand-earth/70">Loading...</p>
          ) : current.length === 0 ? (
            <div className="brand-card p-6 text-sm text-brand-earth/80">
              {isParent ? (
                <>
                  No clubs yet. Add one for anything your children go to outside home learning, like chess, football,
                  swimming or Scouts.
                </>
              ) : (
                <>No clubs yet. Your grown-up can add them.</>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {current.map((c) => (
                <ClubCard key={c.id} club={c} isParent={isParent} onLog={() => setLogging({ club: c })} onEdit={() => setEditing(c)} />
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="mt-4">
              <button onClick={() => setShowPast((v) => !v)} className="text-sm font-bold text-brand-sage hover:underline">
                {showPast ? "Hide" : "Show"} past clubs ({past.length})
              </button>
              {showPast && (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {past.map((c) => (
                    <ClubCard key={c.id} club={c} isParent={isParent} onLog={() => setLogging({ club: c })} onEdit={() => setEditing(c)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-brand-charcoal">Activity diary</h2>
          <p className="mb-3 mt-1 text-sm text-brand-earth/80">
            Club sessions, P.E. and outdoor activities. Tap <b>We did this</b> on any P.E. or Outdoors activity to add it here.
          </p>
          {!loading && shownLog.length === 0 && <div className="brand-card p-6 text-sm text-brand-earth/80">Nothing logged yet.</div>}
          <div className="space-y-6">
            {months.map((m) => (
              <div key={m.key}>
                <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-brand-softsage">{m.label}</h3>
                <ul className="brand-card divide-y divide-brand-line">
                  {m.rows.map((row) => (
                    <li key={row.id} className="flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3">
                      <span className="w-24 shrink-0 text-sm font-bold text-brand-charcoal">{niceDate(row.done_on)}</span>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${KIND_BADGE[row.kind].cls}`}>
                        {KIND_BADGE[row.kind].text}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-brand-charcoal">
                          {row.title}
                          {isParent && <span className="font-semibold text-brand-earth/70"> · {row.child}</span>}
                          {row.minutes ? <span className="font-semibold text-brand-earth/70"> · {row.minutes} min</span> : null}
                        </p>
                        {row.note && <p className="mt-0.5 text-sm text-brand-earth/80">{row.note}</p>}
                      </div>
                      {row.can_remove && (
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Remove "${row.title}" on ${niceDate(row.done_on)} from the diary?`)) return;
                          try {
                            await deleteActivity(row.id);
                            load();
                          } catch (err) {
                            flash(errorText(err, "Could not remove that."));
                          }
                        }}
                        className="text-xs font-bold text-brand-earth/60 hover:text-red-700"
                      >
                        Remove
                      </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editing && (
        <ClubModal
          club={editing === "new" ? null : editing}
          kids={kids}
          onClose={() => setEditing(null)}
          onDone={(text) => {
            setEditing(null);
            flash(text);
            load();
          }}
        />
      )}
      {logging && (
        <LogModal
          club={logging.club}
          clubs={clubs.filter((c) => c.is_active)}
          kids={kids}
          isParent={isParent}
          onClose={() => setLogging(null)}
          onDone={(text) => {
            setLogging(null);
            flash(text);
            load();
          }}
        />
      )}
    </div>
  );
}

function ClubCard({ club, isParent, onLog, onEdit }: { club: Club; isParent: boolean; onLog: () => void; onEdit: () => void }) {
  return (
    <div className={`brand-card flex flex-col p-5 ${club.is_active ? "" : "opacity-80"}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
          <Emoji e={club.emoji || "🏅"} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">{club.activity}</p>
          <h3 className="text-lg font-extrabold leading-tight text-brand-charcoal">{club.name}</h3>
          {(club.schedule || club.place) && (
            <p className="mt-1 text-sm text-brand-earth/80">{[club.schedule, club.place].filter(Boolean).join(" · ")}</p>
          )}
          {isParent && club.children.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {club.children.map((n) => (
                <span key={n} className="rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-bold text-brand-earth">
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-brand-charcoal">
        {club.sessions} session{club.sessions === 1 ? "" : "s"} logged
        {club.session_minutes ? ` · ${minutesText(club.session_minutes)}` : ""}
        {club.last_session && <span className="font-normal text-brand-earth/70"> · last on {niceDate(club.last_session)}</span>}
      </p>
      {!club.is_active && <p className="mt-1 text-xs font-bold text-brand-earth/60">Finished</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {club.is_active && (
          <button onClick={onLog} className={primary}>
            ✓ {isParent ? "Log a session" : "I went!"}
          </button>
        )}
        {isParent && (
          <button onClick={onEdit} className={secondary}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function ClubModal({ club, kids, onClose, onDone }: { club: Club | null; kids: Child[]; onClose: () => void; onDone: (text: string) => void }) {
  const [form, setForm] = useState<ClubIn>(
    club
      ? { name: club.name, activity: club.activity, emoji: club.emoji, schedule: club.schedule, place: club.place, minutes: club.minutes, child_ids: club.child_ids, notes: club.notes, is_active: club.is_active }
      : { name: "", activity: "", emoji: "🏅", schedule: "", place: "", minutes: 60, child_ids: kids.length === 1 ? [kids[0].id] : [], notes: "", is_active: true }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (patch: Partial<ClubIn>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.child_ids.length) {
      setError("Pick who goes to this club.");
      return;
    }
    setSaving(true);
    try {
      if (club) await updateClub(club.id, form);
      else await addClub(form);
      onDone(club ? "Club saved." : `${form.name} added.`);
    } catch (err) {
      setError(errorText(err, "Could not save the club."));
      setSaving(false);
    }
  };

  return (
    <Modal title={club ? `Edit ${club.name}` : "Add a club"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {!club && (
          <div>
            <p className={label}>What kind of club?</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PICKS.map(([e, name]) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => set({ activity: name, emoji: e, name: form.name || `${name} club` })}
                  className={
                    "rounded-full border-2 px-2.5 py-1 text-xs font-bold " +
                    (form.activity === name ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                  }
                >
                  <EmojiText text={`${e} ${name}`} />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-[1fr_5rem] gap-3">
          <div>
            <label className={label} htmlFor="club-activity">Activity</label>
            <input id="club-activity" required value={form.activity} onChange={(e) => set({ activity: e.target.value })} placeholder="e.g. Chess" className={input} />
          </div>
          <div>
            <label className={label} htmlFor="club-emoji">Emoji</label>
            <input id="club-emoji" value={form.emoji || ""} onChange={(e) => set({ emoji: e.target.value })} className={`${input} text-center`} maxLength={8} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="club-name">Club name</label>
          <input id="club-name" required value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Kirkcaldy Chess Club" className={input} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="club-when">When</label>
            <input id="club-when" value={form.schedule || ""} onChange={(e) => set({ schedule: e.target.value })} placeholder="e.g. Tuesdays 4 to 5pm" className={input} />
          </div>
          <div>
            <label className={label} htmlFor="club-where">Where</label>
            <input id="club-where" value={form.place || ""} onChange={(e) => set({ place: e.target.value })} placeholder="e.g. Leisure centre" className={input} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="club-minutes">How long is a session? (minutes)</label>
          <input
            id="club-minutes"
            type="number"
            min={1}
            max={600}
            value={form.minutes ?? ""}
            onChange={(e) => set({ minutes: e.target.value ? Number(e.target.value) : null })}
            className={`${input} max-w-[8rem]`}
          />
        </div>
        {kids.length > 0 && (
          <div>
            <p className={label}>Who goes?</p>
            <KidPicker kids={kids} picked={form.child_ids} onChange={(ids) => set({ child_ids: ids })} />
          </div>
        )}
        <div>
          <label className={label} htmlFor="club-notes">Notes (optional)</label>
          <textarea
            id="club-notes"
            rows={2}
            value={form.notes || ""}
            onChange={(e) => set({ notes: e.target.value })}
            placeholder="e.g. Working towards their first grading. These notes show in the council report."
            className={input}
          />
        </div>
        {club && (
          <label className="flex items-center gap-2 text-sm font-bold text-brand-charcoal">
            <input type="checkbox" checked={!form.is_active} onChange={(e) => set({ is_active: !e.target.checked })} className="h-4 w-4 accent-brand-sage" />
            They&apos;ve finished at this club (keeps its sessions in the reports)
          </label>
        )}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" disabled={saving} className={primary}>
            {saving ? "Saving..." : club ? "Save" : "Add club"}
          </button>
          {club && (
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm(`Delete ${club.name} and all ${club.sessions} of its logged sessions? This can't be undone. To keep the sessions in the reports, tick "finished" instead.`)) return;
                await deleteClub(club.id);
                onDone("Club deleted.");
              }}
              className="ml-auto text-sm font-bold text-red-700 hover:underline"
            >
              Delete club
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

function LogModal({
  club,
  clubs,
  kids,
  isParent,
  onClose,
  onDone,
}: {
  club?: Club;
  clubs: Club[];
  kids: Child[];
  isParent: boolean;
  onClose: () => void;
  onDone: (text: string) => void;
}) {
  const [kind, setKind] = useState<ActivityKind>(club ? "club" : "pe");
  const [clubId, setClubId] = useState<number | "">(club?.id ?? clubs[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(format(new Date(), "yyyy-MM-dd"));
  const picked = clubs.find((c) => c.id === clubId);
  const [minutes, setMinutes] = useState<number | "">(club?.minutes ?? "");
  const [note, setNote] = useState("");
  const [who, setWho] = useState<number[]>(club ? club.child_ids : kids.length === 1 ? [kids[0].id] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (isParent && !who.length) {
      setError("Pick who did it.");
      return;
    }
    if (kind === "club" && !clubId) {
      setError("Pick the club.");
      return;
    }
    setSaving(true);
    try {
      await logActivity({
        kind,
        club_id: kind === "club" ? Number(clubId) : undefined,
        title: kind === "club" ? undefined : title,
        done_on: day,
        minutes: minutes === "" ? null : minutes,
        note: note || undefined,
        child_ids: who,
      });
      onDone("Added to the diary. 🎉");
    } catch (err) {
      setError(errorText(err, "Could not save that."));
      setSaving(false);
    }
  };

  return (
    <Modal title={club ? `Log a session: ${club.name}` : "Log an activity"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {!club && (
          <div>
            <p className={label}>What was it?</p>
            <div className="flex flex-wrap gap-2">
              {(["pe", "outdoor", "club"] as ActivityKind[])
                .filter((k) => k !== "club" || clubs.length > 0)
                .map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => {
                      setKind(k);
                      if (k === "club" && picked) {
                        setMinutes(picked.minutes ?? "");
                        setWho(picked.child_ids);
                      }
                    }}
                    className={
                      "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                      (kind === k ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                    }
                  >
                    <EmojiText text={{ pe: "🏃 P.E.", outdoor: "🌳 Outdoors", club: "🏅 Club session" }[k]} />
                  </button>
                ))}
            </div>
          </div>
        )}
        {kind === "club" && !club && (
          <div>
            <label className={label} htmlFor="log-club">Club</label>
            <select
              id="log-club"
              value={clubId}
              onChange={(e) => {
                const c = clubs.find((x) => x.id === Number(e.target.value));
                setClubId(Number(e.target.value));
                if (c) {
                  setMinutes(c.minutes ?? "");
                  setWho(c.child_ids);
                }
              }}
              className={input}
            >
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {kind !== "club" && (
          <div>
            <label className={label} htmlFor="log-title">What did they do?</label>
            <input
              id="log-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={kind === "pe" ? "e.g. Bike ride, or Beanbag relay" : "e.g. Beach clean, or Bug hunt"}
              className={input}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="log-day">Day</label>
            <input id="log-day" type="date" required value={day} onChange={(e) => setDay(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="log-minutes">Minutes</label>
            <input
              id="log-minutes"
              type="number"
              min={1}
              max={600}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value ? Number(e.target.value) : "")}
              className={input}
            />
          </div>
        </div>
        {isParent && kids.length > 0 && (
          <div>
            <p className={label}>Who did it?</p>
            <KidPicker kids={kids} picked={who} onChange={setWho} />
          </div>
        )}
        <div>
          <label className={label} htmlFor="log-note">Note (optional)</label>
          <textarea
            id="log-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Learned a new opening, or swam 10 lengths"
            className={input}
          />
        </div>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className={primary}>
          {saving ? "Saving..." : "Add to diary"}
        </button>
      </form>
    </Modal>
  );
}
