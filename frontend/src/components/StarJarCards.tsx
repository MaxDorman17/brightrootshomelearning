"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import StarJar from "@/components/StarJar";
import StarIcon from "@/components/StarIcon";
import { approveRewardClaim, declineRewardClaim, getMyStars, getStarJars, markRewardGiven } from "@/lib/api";

type Reward = { id: number; title: string; emoji: string | null; cost: number };
type Claim = {
  id: number;
  title: string;
  emoji: string | null;
  cost: number;
  status: string;
  created_at: string | null;
  decided_at: string | null;
};
type Summary = { child: { id: number; username: string }; available: number; earned_today: number; claims: Claim[] };

// The server sends UTC times without a timezone, so mark them as UTC before reading them.
const utc = (iso: string) => parseISO(/Z|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);
const ago = (iso: string | null) => (iso ? formatDistanceToNowStrict(utc(iso), { addSuffix: true }) : "");
const RECENT_MS = 7 * 24 * 60 * 60 * 1000;

/** The child's own star jar for their home page, with their reward requests beside it. Hidden until the family uses stars. */
export function ChildStarJarCard() {
  const [data, setData] = useState<(Summary & { rewards: Reward[]; rules: unknown[] }) | null>(null);

  useEffect(() => {
    getMyStars()
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  if (!data || (data.rules.length === 0 && data.rewards.length === 0 && data.available === 0)) return null;

  // Waiting and approved requests (until a grown-up ticks them done), plus "not this time" answers from the last week.
  const requests = data.claims
    .filter(
      (c) =>
        c.status === "pending" ||
        c.status === "approved" ||
        (c.status === "declined" && c.decided_at && Date.now() - utc(c.decided_at).getTime() < RECENT_MS)
    )
    .slice(0, 5);

  return (
    <div className="mb-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-[#FFF8E6] to-[#FDF1D8] px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700"><StarIcon /> My star jar</p>
        <Link href="/child/stars" className="text-xs font-bold text-amber-800 hover:underline">
          Spend stars →
        </Link>
      </div>
      <div className="mt-1 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="md:w-1/2">
          <StarJar available={data.available} today={data.earned_today} rewards={data.rewards} />
        </div>
        <div className="md:w-1/2">
          <p className="mb-1.5 text-xs font-extrabold text-amber-800">My reward requests</p>
          {requests.length === 0 ? (
            <p className="text-sm text-[#6E5A46]">
              Nothing asked for yet. <Link href="/child/stars" className="font-bold text-amber-800 underline">Choose a reward</Link> when you&apos;ve got enough stars.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {requests.map((c) => (
                <li
                  key={c.id}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    c.status === "approved"
                      ? "bg-emerald-50 text-emerald-900"
                      : c.status === "declined"
                        ? "bg-gray-50 text-gray-600"
                        : "bg-white/80 text-[#4A3B2C]"
                  }`}
                >
                  <span className="text-xl">{c.emoji || "🎁"}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{c.title}</span>
                  <span className="shrink-0 text-xs font-bold">
                    {c.status === "approved" ? "Yes! 🎉" : c.status === "declined" ? "Not this time" : "Waiting ⏳"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** One star jar per child for the parent home page, with their reward requests to approve beside it.
 * Hidden until the family has opened Rewards. */
export function FamilyStarJars() {
  const [data, setData] = useState<{ set_up: boolean; children: Summary[]; rewards: Reward[] } | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(() => {
    getStarJars()
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  useEffect(load, [load]);

  const decide = async (claim: Claim, action: "approve" | "decline" | "given") => {
    setBusy(claim.id);
    try {
      await (action === "approve"
        ? approveRewardClaim(claim.id)
        : action === "decline"
          ? declineRewardClaim(claim.id)
          : markRewardGiven(claim.id));
      load();
    } finally {
      setBusy(null);
    }
  };

  if (!data || !data.set_up || data.children.length === 0) return null;

  return (
    <section className="mb-8 rounded-3xl border border-[#EBDDB8] bg-gradient-to-br from-[#FFF8E6] to-[#FBF3E1] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#24452C]"><StarIcon /> Star jars</h2>
        <Link href="/parent/rewards" className="text-sm font-bold text-[#2F5D3A] hover:underline">
          Rewards →
        </Link>
      </div>
      <div className="mt-3 divide-y divide-[#EBDDB8]">
        {data.children.map((c) => {
          const pending = c.claims.filter((cl) => cl.status === "pending");
          const approved = c.claims.filter((cl) => cl.status === "approved");
          return (
            <div key={c.child.id} className="flex flex-col gap-4 py-3 md:flex-row md:items-center">
              <div className="md:w-1/2">
                <StarJar name={c.child.username} available={c.available} today={c.earned_today} rewards={data.rewards} size="sm" />
              </div>
              <div className="md:w-1/2">
                <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-[#8A6A22]">Asking for</p>
                {pending.length === 0 ? (
                  <p className="text-sm text-[#6E5A46]">No reward requests right now.</p>
                ) : (
                  <ul className="space-y-2">
                    {pending.map((cl) => (
                      <li key={cl.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white/85 px-3 py-2">
                        <span className="text-xl">{cl.emoji || "🎁"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#2E342F]">{cl.title}</p>
                          <p className="text-xs text-[#8A7A69]">
                            {cl.cost} <StarIcon /> · {ago(cl.created_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => decide(cl, "approve")}
                          disabled={busy === cl.id}
                          className="rounded-lg bg-[#2F5D3A] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-[#24452C] disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => decide(cl, "decline")}
                          disabled={busy === cl.id}
                          className="rounded-lg border border-[#D9D1C4] bg-white px-3 py-1.5 text-xs font-bold text-[#6E5A46] disabled:opacity-50"
                        >
                          Not now
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {approved.length > 0 && (
                  <>
                    <p className="mb-1.5 mt-3 text-xs font-extrabold uppercase tracking-wider text-[#2F5D3A]">Approved, still to enjoy</p>
                    <ul className="space-y-2">
                      {approved.map((cl) => (
                        <li key={cl.id}>
                          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2">
                            <input
                              type="checkbox"
                              checked={busy === cl.id}
                              disabled={busy === cl.id}
                              onChange={() => decide(cl, "given")}
                              className="h-5 w-5 shrink-0 cursor-pointer accent-[#2F5D3A]"
                              aria-label={`Mark ${cl.title} as done`}
                            />
                            <span className="text-xl">{cl.emoji || "🎁"}</span>
                            <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#2E342F]">{cl.title}</span>
                            <span className="shrink-0 text-xs font-semibold text-[#2F5D3A]">Tick when done</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
