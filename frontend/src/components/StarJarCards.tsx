"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StarJar from "@/components/StarJar";
import { getMyStars, getStarJars } from "@/lib/api";

type Reward = { id: number; title: string; emoji: string | null; cost: number };
type Summary = { child: { id: number; username: string }; available: number; earned_today: number };

/** The child's own star jar, for their home page. Hidden until the family uses stars. */
export function ChildStarJarCard() {
  const [data, setData] = useState<(Summary & { rewards: Reward[]; rules: unknown[] }) | null>(null);

  useEffect(() => {
    getMyStars()
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  if (!data || (data.rules.length === 0 && data.rewards.length === 0 && data.available === 0)) return null;

  return (
    <Link
      href="/child/stars"
      className="mb-4 block rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-[#FFF8E6] to-[#FDF1D8] px-4 py-3 shadow-sm transition hover:border-amber-300"
    >
      <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-amber-700">⭐ My star jar</p>
      <StarJar available={data.available} today={data.earned_today} rewards={data.rewards} />
    </Link>
  );
}

/** One star jar per child, for the parent home page. Hidden until the family has opened Rewards. */
export function FamilyStarJars() {
  const [data, setData] = useState<{ set_up: boolean; children: Summary[]; rewards: Reward[] } | null>(null);

  useEffect(() => {
    getStarJars()
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  if (!data || !data.set_up || data.children.length === 0) return null;

  return (
    <section className="mb-8 rounded-3xl border border-[#EBDDB8] bg-gradient-to-br from-[#FFF8E6] to-[#FBF3E1] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#24452C]">⭐ Star jars</h2>
        <Link href="/parent/rewards" className="text-sm font-bold text-[#2F5D3A] hover:underline">
          Rewards →
        </Link>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {data.children.map((c) => (
          <StarJar
            key={c.child.id}
            name={c.child.username}
            available={c.available}
            today={c.earned_today}
            rewards={data.rewards}
            size="sm"
          />
        ))}
      </div>
    </section>
  );
}
