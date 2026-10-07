"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import StarIcon from "@/components/StarIcon";
import PageHero from "@/components/PageHero";
import RewardsTabs from "@/components/RewardsTabs";
import EmojiPicker from "@/components/EmojiPicker";
import FamilyBoard, { FamilyOverview } from "@/components/FamilyBoard";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  addRewardItem,
  addRewardRule,
  approveRewardClaim,
  awardStars,
  declineRewardClaim,
  deleteRewardItem,
  deleteRewardRule,
  getFamilyOverview,
  getRewardsSetup,
  updateRewardItem,
  updateRewardRule,
} from "@/lib/api";
import Emoji from "@/components/Emoji";

type Rule = { id: number; kind: string; threshold_pct: number | null; stars: number; is_active: boolean; label: string };
type Reward = { id: number; title: string; emoji: string | null; cost: number; is_active: boolean };
type Claim = { id: number; child_id: number; title: string; emoji: string | null; cost: number; status: string; created_at: string | null };
type ChildStars = {
  child: { id: number; username: string };
  balance: number;
  available: number;
  history: { when: string | null; stars: number; reason: string }[];
};
type Setup = { rules: Rule[]; rewards: Reward[]; children: ChildStars[]; pending: Claim[] };

const KIND_LABELS: Record<string, string> = {
  lesson: "Complete a lesson",
  oak: "Oak exit quiz score",
  oak_starter: "Oak starter quiz score",
  score: "A worksheet score, or a lesson or test you mark",
  spelling: "Spelling test score",
  book: "Finish a book",
  game: "Play a learning game (up to 3 a day)",
};
const HAS_THRESHOLD = new Set(["oak", "oak_starter", "score", "spelling"]);

const inputClass =
  "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function RuleRow({ rule, onSaved }: { rule: Rule; onSaved: () => void }) {
  const [stars, setStars] = useState(String(rule.stars));
  const [threshold, setThreshold] = useState(String(rule.threshold_pct ?? ""));
  const [error, setError] = useState("");
  const changed = stars !== String(rule.stars) || threshold !== String(rule.threshold_pct ?? "");

  const save = async (isActive = rule.is_active) => {
    setError("");
    try {
      await updateRewardRule(rule.id, {
        kind: rule.kind,
        stars: Number(stars),
        threshold_pct: HAS_THRESHOLD.has(rule.kind) ? Number(threshold) : null,
        is_active: isActive,
      });
      onSaved();
    } catch (err) {
      setError(errorText(err, "Could not save."));
    }
  };

  const remove = async () => {
    if (!confirm("Remove this way to earn stars? Stars already earned are kept.")) return;
    await deleteRewardRule(rule.id);
    onSaved();
  };

  return (
    <div className={"py-3 " + (rule.is_active ? "" : "opacity-60")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="min-w-[10rem] flex-1 font-bold text-brand-charcoal">{KIND_LABELS[rule.kind]}</p>
        {HAS_THRESHOLD.has(rule.kind) && (
          <label className="flex items-center gap-1.5 text-sm text-[#6E5A46]">
            of
            <input type="number" min={0} max={100} value={threshold} onChange={(e) => setThreshold(e.target.value)} className={inputClass + " w-16"} />
            % or more
          </label>
        )}
        <label className="flex items-center gap-1.5 text-sm text-[#6E5A46]">
          earns
          <input type="number" min={1} max={100} value={stars} onChange={(e) => setStars(e.target.value)} className={inputClass + " w-16"} />
          <StarIcon />
        </label>
        {changed && (
          <button onClick={() => save()} className="rounded-xl bg-brand-sage px-3 py-2 text-xs font-bold text-white">
            Save
          </button>
        )}
        <button
          onClick={() => save(!rule.is_active)}
          className="rounded-xl border border-brand-line bg-white px-3 py-2 text-xs font-bold text-[#6E5A46]"
        >
          {rule.is_active ? "Turn off" : "Turn on"}
        </button>
        <button onClick={remove} className="text-xs font-bold text-[#A64F42] hover:underline">
          Remove
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-[#A64F42]">{error}</p>}
    </div>
  );
}

function RewardRow({ reward, onSaved }: { reward: Reward; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(reward.title);
  const [emoji, setEmoji] = useState(reward.emoji || "");
  const [cost, setCost] = useState(String(reward.cost));
  const [error, setError] = useState("");

  const save = async (isActive = reward.is_active) => {
    setError("");
    try {
      await updateRewardItem(reward.id, { title, emoji, cost: Number(cost), is_active: isActive });
      setEditing(false);
      onSaved();
    } catch (err) {
      setError(errorText(err, "Could not save."));
    }
  };

  const remove = async () => {
    if (!confirm(`Delete "${reward.title}"? Any waiting requests for it will be cancelled.`)) return;
    await deleteRewardItem(reward.id);
    onSaved();
  };

  if (editing) {
    return (
      <div className="py-3">
        <div className="flex flex-wrap items-center gap-2">
          <EmojiPicker value={emoji} onChange={setEmoji} />
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className={inputClass + " min-w-[12rem] flex-1"} aria-label="Reward" />
          <input type="number" min={1} value={cost} onChange={(e) => setCost(e.target.value)} className={inputClass + " w-20"} aria-label="Star cost" />
          <span className="text-sm"><StarIcon /></span>
          <button onClick={() => save()} className="rounded-xl bg-brand-sage px-3 py-2 text-xs font-bold text-white">Save</button>
          <button onClick={() => setEditing(false)} className="text-xs font-bold text-[#6E5A46]">Cancel</button>
        </div>
        {error && <p className="mt-1 text-xs font-semibold text-[#A64F42]">{error}</p>}
      </div>
    );
  }

  return (
    <div className={"flex flex-wrap items-center gap-3 py-3 " + (reward.is_active ? "" : "opacity-60")}>
      <Emoji e={reward.emoji || "🎁"} className="h-8 w-8 shrink-0" />
      <p className="min-w-[10rem] flex-1 font-bold text-brand-charcoal">{reward.title}</p>
      <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-extrabold text-brand-sage">{reward.cost} <StarIcon /></span>
      <button onClick={() => setEditing(true)} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
      <button onClick={() => save(!reward.is_active)} className="text-xs font-bold text-[#6E5A46] hover:underline">
        {reward.is_active ? "Hide" : "Show"}
      </button>
      <button onClick={remove} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
    </div>
  );
}

function ChildCard({ child, onSaved }: { child: ChildStars; onSaved: () => void }) {
  const [amount, setAmount] = useState("5");
  const [reason, setReason] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState("");

  const give = async (sign: 1 | -1) => {
    setMessage("");
    const stars = Math.abs(Math.round(Number(amount))) * sign;
    if (!stars) return setMessage("Enter a number of stars.");
    try {
      await awardStars(child.child.id, stars, reason.trim());
      setReason("");
      setMessage(sign > 0 ? `Gave ${Math.abs(stars)} ⭐` : `Took away ${Math.abs(stars)} ⭐`);
      onSaved();
    } catch (err) {
      setMessage(errorText(err, "Could not save."));
    }
  };

  return (
    <div className="brand-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-extrabold text-brand-charcoal">{child.child.username}</p>
        <div className="text-right">
          <p className="text-2xl font-black text-brand-sage">{child.balance} <StarIcon /></p>
          {child.available !== child.balance && (
            <p className="text-xs text-[#6E5A46]">{child.available} free, {child.balance - child.available} waiting</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass + " w-16"} aria-label="Stars" />
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={200}
          placeholder="Reason, e.g. Brilliant focus today"
          className={inputClass + " min-w-0 flex-1"}
        />
        <button onClick={() => give(1)} className="rounded-xl bg-brand-sage px-3 py-2 text-xs font-bold text-white">Give</button>
        <button onClick={() => give(-1)} className="rounded-xl border border-brand-line bg-white px-3 py-2 text-xs font-bold text-[#6E5A46]">Take away</button>
      </div>
      {message && <p className="mt-2 text-xs font-semibold text-[#6E5A46]">{message}</p>}

      <button onClick={() => setShowHistory(!showHistory)} className="mt-3 text-xs font-bold text-brand-sage hover:underline">
        {showHistory ? "Hide recent stars" : "Show recent stars"}
      </button>
      {showHistory && (
        <div className="mt-2 divide-y divide-brand-line text-sm">
          {child.history.length === 0 && <p className="py-2 text-[#6E5A46]">No stars yet.</p>}
          {child.history.map((h, i) => (
            <div key={i} className="flex justify-between gap-3 py-2">
              <span className="text-[#6E5A46]">
                {h.when ? format(parseISO(h.when), "d MMM") + " · " : ""}
                {h.reason}
              </span>
              <span className={"shrink-0 font-bold " + (h.stars > 0 ? "text-brand-sage" : "text-[#A64F42]")}>
                {h.stars > 0 ? "+" : ""}
                {h.stars}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RewardsPage() {
  const router = useRouter();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [family, setFamily] = useState<FamilyOverview | null>(null);
  const [newKind, setNewKind] = useState("lesson");
  const [newRuleStars, setNewRuleStars] = useState("2");
  const [newRuleThreshold, setNewRuleThreshold] = useState("80");
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const [newCost, setNewCost] = useState("25");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [res, familyRes] = await Promise.all([getRewardsSetup(), getFamilyOverview()]);
    setSetup(res.data);
    setFamily(familyRes.data);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load().catch(() => setError("Could not load rewards."));
  }, [load, router]);

  const addRule = async () => {
    setError("");
    try {
      await addRewardRule({
        kind: newKind,
        stars: Number(newRuleStars),
        threshold_pct: HAS_THRESHOLD.has(newKind) ? Number(newRuleThreshold) : null,
        is_active: true,
      });
      load();
    } catch (err) {
      setError(errorText(err, "Could not add."));
    }
  };

  const addReward = async () => {
    setError("");
    if (!newTitle.trim()) return setError("Give the reward a name.");
    try {
      await addRewardItem({ title: newTitle.trim(), emoji: newEmoji.trim() || null, cost: Number(newCost), is_active: true });
      setNewTitle("");
      setNewEmoji("");
      load();
    } catch (err) {
      setError(errorText(err, "Could not add."));
    }
  };

  const decide = async (claim: Claim, approve: boolean) => {
    if (approve) await approveRewardClaim(claim.id);
    else await declineRewardClaim(claim.id);
    load();
  };

  const childName = (id: number) => setup?.children.find((c) => c.child.id === id)?.child.username ?? "Your child";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <RewardsTabs role="parent" current="stars" />
        <PageHero art="rewards" tint={1}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Motivation</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Rewards</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
          Children earn stars for the things you choose, then spend them on rewards you set. Stars only come off when you approve a request.
        </p>
        </PageHero>

        {error && (
          <div className="mt-4 rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">{error}</div>
        )}
        {!setup && !error && <p className="mt-6 text-sm text-[#6E5A46]">Loading rewards...</p>}

        {setup && (
          <div className="mt-7 space-y-6">
            {setup.pending.length > 0 && (
              <section className="brand-card border-2 border-brand-softsage p-5 sm:p-6">
                <h2 className="text-lg font-extrabold text-brand-charcoal">Waiting for you ({setup.pending.length})</h2>
                <div className="mt-3 divide-y divide-brand-line">
                  {setup.pending.map((claim) => (
                    <div key={claim.id} className="flex flex-wrap items-center gap-3 py-3">
                      <Emoji e={claim.emoji || "🎁"} className="h-8 w-8 shrink-0" />
                      <p className="min-w-[10rem] flex-1 text-sm text-brand-charcoal">
                        <strong>{childName(claim.child_id)}</strong> would like <strong>{claim.title}</strong> for {claim.cost} <StarIcon />
                      </p>
                      <button onClick={() => decide(claim, true)} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">Approve</button>
                      <button onClick={() => decide(claim, false)} className="rounded-xl border border-brand-line bg-white px-4 py-2 text-xs font-bold text-[#6E5A46]">Decline</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {family && <FamilyBoard data={family} isParent onChanged={load} />}

            <section>
              <h2 className="mb-3 text-lg font-extrabold text-brand-charcoal">Stars</h2>
              {setup.children.length === 0 ? (
                <div className="brand-card p-5 text-sm text-[#6E5A46]">Add a child on the Children page to start giving stars.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {setup.children.map((child) => (
                    <ChildCard key={child.child.id} child={child} onSaved={load} />
                  ))}
                </div>
              )}
            </section>

            <section className="brand-card p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Ways to earn stars</h2>
              <p className="mt-1 text-sm text-[#6E5A46]">
                Stars count from when a rule is added or changed. Stars already earned never change.
              </p>
              <div className="mt-2 divide-y divide-brand-line">
                {setup.rules.map((rule) => (
                  <RuleRow key={rule.id} rule={rule} onSaved={load} />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-brand-cream p-3">
                <select value={newKind} onChange={(e) => setNewKind(e.target.value)} className={inputClass}>
                  {Object.entries(KIND_LABELS).map(([kind, label]) => (
                    <option key={kind} value={kind}>{label}</option>
                  ))}
                </select>
                {HAS_THRESHOLD.has(newKind) && (
                  <label className="flex items-center gap-1.5 text-sm text-[#6E5A46]">
                    of
                    <input type="number" min={0} max={100} value={newRuleThreshold} onChange={(e) => setNewRuleThreshold(e.target.value)} className={inputClass + " w-16"} />
                    % or more
                  </label>
                )}
                <label className="flex items-center gap-1.5 text-sm text-[#6E5A46]">
                  earns
                  <input type="number" min={1} max={100} value={newRuleStars} onChange={(e) => setNewRuleStars(e.target.value)} className={inputClass + " w-16"} />
                  <StarIcon />
                </label>
                <button onClick={addRule} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">Add</button>
              </div>
            </section>

            <section className="brand-card p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Rewards to spend stars on</h2>
              <div className="mt-2 divide-y divide-brand-line">
                {setup.rewards.map((reward) => (
                  <RewardRow key={reward.id} reward={reward} onSaved={load} />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-brand-cream p-3">
                <EmojiPicker value={newEmoji} onChange={setNewEmoji} />
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} maxLength={120} placeholder="e.g. Trip to the park" className={inputClass + " min-w-[12rem] flex-1"} aria-label="New reward" />
                <input type="number" min={1} value={newCost} onChange={(e) => setNewCost(e.target.value)} className={inputClass + " w-20"} aria-label="Star cost" />
                <span className="text-sm"><StarIcon /></span>
                <button onClick={addReward} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">Add reward</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
