"use client";

import StarIcon from "@/components/StarIcon";
import { FormEvent, useState } from "react";
import { addDays, differenceInCalendarDays, endOfMonth, format, parseISO, startOfWeek } from "date-fns";
import { addChallenge, removeChallenge, tickChallenge, untickChallenge } from "@/lib/api";
import Avatar from "@/components/Avatar";
import { AvatarChoice } from "@/lib/avatar";
import Emoji, { EmojiText } from "@/components/Emoji";

type ChildProgress = { child_id: number; username: string; progress: number; completed_at: string | null };

export type FamilyChallenge = {
  id: number;
  title: string;
  kind: string;
  target: number;
  threshold_pct: number | null;
  mode: "each" | "team";
  start_date: string;
  end_date: string;
  bonus_stars: number;
  children: ChildProgress[];
  team_progress: number | null;
  team_completed_at: string | null;
};

export type FamilyOverview = {
  leaderboard: {
    week_start: string;
    week_end: string;
    family_total: number;
    children: {
      child_id: number;
      username: string;
      avatar?: AvatarChoice | null;
      has_photo?: boolean;
      stars_week: number;
      lessons_week: number;
      streak: number;
    }[];
  };
  challenges: FamilyChallenge[];
  today: string;
};

type Props = {
  data: FamilyOverview;
  /** Parent view: create, remove and tick challenges. */
  isParent?: boolean;
  /** Child view: highlight this child. */
  myId?: number;
  onChanged: () => void;
};

const MEDALS = ["🥇", "🥈", "🥉"];

const KIND_OPTIONS: { kind: string; label: string; unit: string }[] = [
  { kind: "lessons", label: "Complete lessons", unit: "lessons" },
  { kind: "spelling", label: "Spelling tests at a score", unit: "tests" },
  { kind: "oak", label: "Oak quizzes at a score", unit: "quizzes" },
  { kind: "books", label: "Finish books", unit: "books" },
  { kind: "stars", label: "Earn stars", unit: "stars" },
  { kind: "custom", label: "Something else (you tick it off)", unit: "times" },
];

const unitFor = (kind: string) => KIND_OPTIONS.find((k) => k.kind === kind)?.unit ?? "";

function describe(c: FamilyChallenge) {
  const score = c.threshold_pct != null ? ` at ${c.threshold_pct}%+` : "";
  return `${c.target} ${unitFor(c.kind)}${score}${c.mode === "team" ? " together" : " each"}`;
}

function ProgressBar({ value, target, done }: { value: number; target: number; done: boolean }) {
  const width = Math.min(100, (value / target) * 100);
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-brand-cream">
      <div className={"h-full rounded-full transition-all " + (done ? "bg-brand-leaf" : "bg-brand-sage")} style={{ width: `${width}%` }} />
    </div>
  );
}

function timing(c: FamilyChallenge, today: string) {
  const t = parseISO(today);
  const start = parseISO(c.start_date);
  const end = parseISO(c.end_date);
  if (t < start) return `Starts ${format(start, "d MMM")}`;
  const left = differenceInCalendarDays(end, t);
  if (left < 0) return `Ended ${format(end, "d MMM")}`;
  if (left === 0) return "Last day today";
  return `${left} day${left === 1 ? "" : "s"} left`;
}

function NewChallengeForm({ today, onDone }: { today: string; onDone: () => void }) {
  const t = parseISO(today);
  const weekStart = startOfWeek(t, { weekStartsOn: 1 });
  const presets = {
    week: { start: format(weekStart, "yyyy-MM-dd"), end: format(addDays(weekStart, 6), "yyyy-MM-dd") },
    month: { start: format(t, "yyyy-MM-dd"), end: format(endOfMonth(t), "yyyy-MM-dd") },
  };
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("lessons");
  const [target, setTarget] = useState("10");
  const [threshold, setThreshold] = useState("90");
  const [mode, setMode] = useState<"each" | "team">("each");
  const [start, setStart] = useState(presets.week.start);
  const [end, setEnd] = useState(presets.week.end);
  const [bonus, setBonus] = useState("10");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const input = "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await addChallenge({
        title: title.trim() || `${KIND_OPTIONS.find((k) => k.kind === kind)?.label}: ${target}`,
        kind,
        target: Number(target),
        threshold_pct: kind === "spelling" || kind === "oak" ? Number(threshold) : null,
        mode,
        start_date: start,
        end_date: end,
        bonus_stars: Number(bonus) || 0,
      });
      setTitle("");
      onDone();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string" ? detail : Array.isArray(detail) ? String(detail[0]?.msg ?? "").replace(/^Value error, /, "") : "Could not add."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl bg-brand-cream p-4">
      <p className="text-sm font-extrabold text-brand-charcoal">New challenge</p>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Name, e.g. Reading week" className={input + " w-full"} />
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E5A46]">
        <select value={kind} onChange={(e) => setKind(e.target.value)} className={input}>
          {KIND_OPTIONS.map((k) => (
            <option key={k.kind} value={k.kind}>{k.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5">
          target
          <input type="number" min={1} value={target} onChange={(e) => setTarget(e.target.value)} className={input + " w-20"} />
          {unitFor(kind)}
        </label>
        {(kind === "spelling" || kind === "oak") && (
          <label className="flex items-center gap-1.5">
            at
            <input type="number" min={0} max={100} value={threshold} onChange={(e) => setThreshold(e.target.value)} className={input + " w-16"} />
            % or more
          </label>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E5A46]">
        <select value={mode} onChange={(e) => setMode(e.target.value as "each" | "team")} className={input}>
          <option value="each">Each child on their own</option>
          <option value="team">Whole family as a team</option>
        </select>
        <label className="flex items-center gap-1.5">
          bonus
          <input type="number" min={0} max={1000} value={bonus} onChange={(e) => setBonus(e.target.value)} className={input + " w-20"} />
          <StarIcon />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6E5A46]">
        <button type="button" onClick={() => { setStart(presets.week.start); setEnd(presets.week.end); }} className="rounded-lg border border-brand-line bg-white px-3 py-1.5 text-xs font-bold">This week</button>
        <button type="button" onClick={() => { setStart(presets.month.start); setEnd(presets.month.end); }} className="rounded-lg border border-brand-line bg-white px-3 py-1.5 text-xs font-bold">Rest of this month</button>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={input} aria-label="Start date" />
        to
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={input} aria-label="End date" />
      </div>
      {error && <p className="text-xs font-semibold text-[#A64F42]">{error}</p>}
      <button type="submit" disabled={saving} className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {saving ? "Adding..." : "Add challenge"}
      </button>
    </form>
  );
}

export default function FamilyBoard({ data, isParent, myId, onChanged }: Props) {
  const [showForm, setShowForm] = useState(false);
  const board = data.leaderboard;

  const remove = async (c: FamilyChallenge) => {
    if (!confirm(`Remove "${c.title}"? Bonus stars already won are kept.`)) return;
    await removeChallenge(c.id);
    onChanged();
  };

  const tick = async (c: FamilyChallenge, childId: number, add: boolean) => {
    try {
      if (add) await tickChallenge(c.id, childId);
      else await untickChallenge(c.id, childId);
    } catch {}
    onChanged();
  };

  return (
    <div className="space-y-6">
      <section className="brand-card p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-extrabold text-brand-charcoal">Family leaderboard</h2>
          <p className="text-xs font-bold text-[#6E5A46]">
            This week · {format(parseISO(board.week_start), "d MMM")} to {format(parseISO(board.week_end), "d MMM")}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-brand-tint p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-sage">Family total this week</p>
          <p className="mt-1 text-3xl font-black text-brand-sage">{board.family_total} <StarIcon /></p>
        </div>

        {board.children.length === 0 ? (
          <p className="mt-4 text-sm text-[#6E5A46]">Add a child to start the leaderboard.</p>
        ) : (
          <div className="mt-4 divide-y divide-brand-line">
            {board.children.map((row, i) => (
              <div
                key={row.child_id}
                className={"flex items-center gap-3 py-3 " + (row.child_id === myId ? "rounded-xl bg-brand-wash px-2" : "")}
              >
                <span className="w-8 text-center text-xl">{row.stars_week > 0 ? MEDALS[i] ?? `${i + 1}` : "·"}</span>
                <Avatar username={row.username} avatar={row.avatar} hasPhoto={row.has_photo} childId={row.child_id} size="sm" />
                <p className="min-w-0 flex-1 truncate font-extrabold text-brand-charcoal">
                  {row.username}
                  {row.child_id === myId && <span className="ml-1 text-xs font-bold text-brand-softsage">(you)</span>}
                </p>
                <span className="hidden text-xs text-[#6E5A46] sm:inline">{row.lessons_week} lessons</span>
                {row.streak > 1 && <span className="text-xs font-bold text-[#B98224]"><Emoji e="🔥" /> {row.streak}</span>}
                <span className="w-16 text-right font-black text-brand-sage">{row.stars_week} <StarIcon /></span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="brand-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-brand-charcoal">Challenges</h2>
          {isParent && (
            <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">
              {showForm ? "Close" : "+ New challenge"}
            </button>
          )}
        </div>

        {isParent && showForm && (
          <NewChallengeForm
            today={data.today}
            onDone={() => {
              setShowForm(false);
              onChanged();
            }}
          />
        )}

        {data.challenges.length === 0 && !showForm && (
          <p className="mt-3 text-sm text-[#6E5A46]">
            {isParent ? "No challenges yet. Set one for this week!" : "No challenges right now. Ask a grown-up to set one!"}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {data.challenges.map((c) => {
            const running = c.start_date <= data.today && data.today <= c.end_date;
            const rows = isParent || c.mode === "team" ? c.children : c.children.filter((r) => r.child_id === myId);
            return (
              <div key={c.id} className="rounded-2xl border border-brand-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-extrabold text-brand-charcoal">{c.title}</p>
                    <p className="text-xs text-[#6E5A46]">
                      {describe(c)} · {timing(c, data.today)}
                      {c.bonus_stars > 0 ? ` · +${c.bonus_stars} ⭐ bonus` : ""}
                    </p>
                  </div>
                  {isParent && (
                    <button onClick={() => remove(c)} className="text-xs font-bold text-[#A64F42] hover:underline">
                      Remove
                    </button>
                  )}
                </div>

                {c.mode === "team" && c.team_progress != null && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs font-bold text-[#6E5A46]">
                      <span>{c.team_completed_at ? <EmojiText text="🎉 Team challenge complete!" /> : "Team progress"}</span>
                      <span>{Math.min(c.team_progress, c.target)}/{c.target}</span>
                    </div>
                    <ProgressBar value={c.team_progress} target={c.target} done={!!c.team_completed_at} />
                  </div>
                )}

                <div className="mt-3 space-y-2">
                  {rows.map((r) => (
                    <div key={r.child_id} className="flex items-center gap-3">
                      <span className={"w-24 shrink-0 truncate text-xs font-bold " + (r.child_id === myId ? "text-brand-sage" : "text-[#6E5A46]")}>
                        {r.username}
                      </span>
                      <div className="min-w-0 flex-1">
                        {c.mode === "each" ? (
                          <ProgressBar value={r.progress} target={c.target} done={!!r.completed_at} />
                        ) : (
                          <p className="text-xs text-[#6E5A46]">added {r.progress}</p>
                        )}
                      </div>
                      {c.mode === "each" && (
                        <span className="w-16 shrink-0 text-right text-xs font-bold text-brand-charcoal">
                          {r.completed_at ? <EmojiText text="🎉 Done" /> : `${r.progress}/${c.target}`}
                        </span>
                      )}
                      {isParent && c.kind === "custom" && running && (
                        <span className="flex shrink-0 gap-1">
                          <button onClick={() => tick(c, r.child_id, true)} className="rounded-lg bg-brand-sage px-2 py-1 text-xs font-bold text-white" aria-label={`Tick for ${r.username}`}>+1</button>
                          <button onClick={() => tick(c, r.child_id, false)} disabled={r.progress === 0} className="rounded-lg border border-brand-line px-2 py-1 text-xs font-bold text-[#6E5A46] disabled:opacity-40" aria-label={`Undo for ${r.username}`}>−1</button>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
