"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import FamilyBoard, { FamilyOverview } from "@/components/FamilyBoard";
import { isAuthenticated, getRole } from "@/lib/auth";
import { cancelRewardRequest, getFamilyOverview, getMyStars, requestReward } from "@/lib/api";

type Rule = { id: number; kind: string; stars: number; label: string };
type Reward = { id: number; title: string; emoji: string | null; cost: number };
type Claim = { id: number; reward_id: number | null; title: string; emoji: string | null; cost: number; status: string; created_at: string | null };
type MyStars = {
  child: { id: number; username: string };
  balance: number;
  available: number;
  earned_total: number;
  history: { when: string | null; stars: number; reason: string }[];
  claims: Claim[];
  rules: Rule[];
  rewards: Reward[];
};

const STATUS_TEXT: Record<string, string> = {
  pending: "Waiting for a grown-up",
  approved: "Yes! Enjoy it",
  declined: "Not this time",
  cancelled: "Cancelled",
};

export default function MyStarsPage() {
  const router = useRouter();
  const [data, setData] = useState<MyStars | null>(null);
  const [family, setFamily] = useState<FamilyOverview | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    const [res, familyRes] = await Promise.all([getMyStars(), getFamilyOverview()]);
    setData(res.data);
    setFamily(familyRes.data);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") {
      router.replace("/login");
      return;
    }
    load().catch(() => setMessage("Could not load your stars."));
  }, [load, router]);

  const ask = async (reward: Reward) => {
    setMessage("");
    setBusy(reward.id);
    try {
      await requestReward(reward.id);
      setMessage(`Asked for "${reward.title}". A grown-up will say yes or no.`);
      await load();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setMessage(typeof detail === "string" ? detail : "Could not send that request.");
    } finally {
      setBusy(null);
    }
  };

  const cancel = async (claim: Claim) => {
    await cancelRewardRequest(claim.id);
    load();
  };

  const nextReward = data?.rewards.find((r) => r.cost > data.available) ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {!data && <p className="text-sm text-[#6E5A46]">{message || "Loading your stars..."}</p>}

        {data && (
          <div className="space-y-6">
            <section className="brand-card overflow-hidden p-6 text-center sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">My Stars</p>
              <p className="mt-2 text-6xl font-black text-brand-sage">{data.balance} ⭐</p>
              {data.available !== data.balance && (
                <p className="mt-2 text-sm text-[#6E5A46]">{data.balance - data.available} ⭐ saved for a request that&apos;s waiting</p>
              )}
              {nextReward && (
                <div className="mx-auto mt-5 max-w-sm">
                  <div className="h-3 overflow-hidden rounded-full bg-brand-cream">
                    <div
                      className="h-full rounded-full bg-brand-leaf"
                      style={{ width: `${Math.max(0, Math.min(100, (data.available / nextReward.cost) * 100))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#6E5A46]">
                    {nextReward.cost - Math.max(0, data.available)} more ⭐ for {nextReward.emoji} {nextReward.title}
                  </p>
                </div>
              )}
            </section>

            {message && (
              <div className="rounded-xl border border-brand-softsage bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-sage">{message}</div>
            )}

            <section>
              <h2 className="mb-3 text-lg font-extrabold text-brand-charcoal">Rewards</h2>
              {data.rewards.length === 0 ? (
                <div className="brand-card p-5 text-sm text-[#6E5A46]">No rewards yet. Ask a grown-up to add some!</div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.rewards.map((reward) => {
                    const canAfford = data.available >= reward.cost;
                    return (
                      <div key={reward.id} className="brand-card flex items-center gap-4 p-4">
                        <span className="text-4xl">{reward.emoji || "🎁"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-brand-charcoal">{reward.title}</p>
                          <p className="text-sm font-bold text-brand-sage">{reward.cost} ⭐</p>
                        </div>
                        <button
                          onClick={() => ask(reward)}
                          disabled={!canAfford || busy === reward.id}
                          className="shrink-0 rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white disabled:bg-brand-mist disabled:text-[#6E5A46]"
                        >
                          {canAfford ? "Ask for this" : "Keep going"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {family && <FamilyBoard data={family} myId={data.child.id} onChanged={load} />}

            <section className="brand-card p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-brand-charcoal">How to earn stars</h2>
              {data.rules.length === 0 ? (
                <p className="mt-2 text-sm text-[#6E5A46]">A grown-up can give you stars for great work.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {data.rules.map((rule) => (
                    <li key={rule.id} className="flex items-center justify-between gap-3 rounded-xl bg-brand-cream px-4 py-3 text-sm">
                      <span className="font-semibold text-brand-charcoal">{rule.label}</span>
                      <span className="shrink-0 font-extrabold text-brand-sage">+{rule.stars} ⭐</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {data.claims.length > 0 && (
              <section className="brand-card p-5 sm:p-6">
                <h2 className="text-lg font-extrabold text-brand-charcoal">My requests</h2>
                <div className="mt-2 divide-y divide-brand-line">
                  {data.claims.map((claim) => (
                    <div key={claim.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                      <span className="text-2xl">{claim.emoji || "🎁"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brand-charcoal">{claim.title}</p>
                        <p className="text-xs text-[#6E5A46]">{STATUS_TEXT[claim.status] ?? claim.status}</p>
                      </div>
                      <span className="font-bold text-brand-sage">{claim.cost} ⭐</span>
                      {claim.status === "pending" && (
                        <button onClick={() => cancel(claim)} className="text-xs font-bold text-[#6E5A46] hover:underline">
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="brand-card p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Recent stars</h2>
              {data.history.length === 0 ? (
                <p className="mt-2 text-sm text-[#6E5A46]">Finish some learning to earn your first stars!</p>
              ) : (
                <div className="mt-2 divide-y divide-brand-line text-sm">
                  {data.history.map((h, i) => (
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
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
