"use client";

import StarIcon from "@/components/StarIcon";
import Emoji from "@/components/Emoji";

type Reward = { id: number; title: string; emoji: string | null; cost: number };

/** Works out which reward the jar is filling towards. */
export function jarTarget(available: number, rewards: Reward[]) {
  const sorted = [...rewards].sort((a, b) => a.cost - b.cost);
  const next = sorted.find((r) => r.cost > available);
  const ready = sorted.filter((r) => r.cost <= available);
  const target = next ? next.cost : sorted.length ? sorted[sorted.length - 1].cost : 20;
  return { next, ready, fill: target > 0 ? Math.min(1, Math.max(0, available / target)) : 0 };
}

/** The star jar illustration, with the child's stars and how many more they need for the next reward. */
export default function StarJar({
  name,
  available,
  today,
  rewards,
  size = "md",
}: {
  name?: string;
  available: number;
  today: number;
  rewards: Reward[];
  size?: "sm" | "md";
}) {
  const { next, ready } = jarTarget(available, rewards);

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative shrink-0 ${size === "sm" ? "h-28" : "h-36"}`}
        style={{ aspectRatio: "513 / 520" }}
        role="img"
        aria-label={`Star jar with ${available} stars`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/star-jar.webp" alt="" className="h-full w-auto select-none" draggable={false} />
      </div>

      <div className="min-w-0">
        {name && <p className="text-sm font-extrabold text-[#24452C]">{name}</p>}
        <p className="flex items-center gap-1.5 text-2xl font-black text-[#B7791F]">
          {available} <StarIcon className="h-7 w-7" />
        </p>
        {today > 0 && <p className="text-xs font-bold text-[#2F5D3A]">+{today} today ✨</p>}
        <p className="mt-1 text-xs leading-5 text-[#6E5A46]">
          {ready.length > 0 && (
            <>
              Ready for <Emoji e={ready[ready.length - 1].emoji ?? "🎁"} /> {ready[ready.length - 1].title}!
              <br />
            </>
          )}
          {next
            ? <>{next.cost - available} more for <Emoji e={next.emoji ?? "🎁"} /> {next.title}</>
            : rewards.length === 0
              ? "Add rewards to spend stars on"
              : "Enough for every reward!"}
        </p>
      </div>
    </div>
  );
}
