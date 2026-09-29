"use client";

type Reward = { id: number; title: string; emoji: string | null; cost: number };

const SLOTS = 36; // how many stars fit in a full jar

// Fixed star positions inside the jar, filled from the bottom up, with a little wobble so it looks hand-packed.
const POSITIONS = Array.from({ length: SLOTS }, (_, i) => {
  const row = Math.floor(i / 6);
  const col = i % 6;
  const wobble = ((i * 37) % 7) - 3;
  return { x: 30 + col * 12 + (row % 2 ? 6 : 0) + wobble * 0.6, y: 118 - row * 13 + ((i * 17) % 5) - 2, r: ((i * 53) % 40) - 20 };
});

function Star({ x, y, r, glow }: { x: number; y: number; r: number; glow: boolean }) {
  return (
    <path
      d="M0,-6 L1.8,-1.9 L6.2,-1.9 L2.7,0.9 L3.9,5.3 L0,2.7 L-3.9,5.3 L-2.7,0.9 L-6.2,-1.9 L-1.8,-1.9 Z"
      transform={`translate(${x} ${y}) rotate(${r})`}
      fill={glow ? "#F4B63F" : "#E9A23B"}
      stroke={glow ? "#FFF3C4" : "#C98522"}
      strokeWidth={glow ? 1.2 : 0.6}
    />
  );
}

/** Works out which reward the jar is filling towards. */
export function jarTarget(available: number, rewards: Reward[]) {
  const sorted = [...rewards].sort((a, b) => a.cost - b.cost);
  const next = sorted.find((r) => r.cost > available);
  const ready = sorted.filter((r) => r.cost <= available);
  const target = next ? next.cost : sorted.length ? sorted[sorted.length - 1].cost : 20;
  return { next, ready, fill: target > 0 ? Math.min(1, Math.max(0, available / target)) : 0 };
}

/**
 * A glass jar that fills with stars as a child earns them, towards the next reward they can spend them on.
 * Stars earned today sparkle brighter.
 */
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
  const { next, ready, fill } = jarTarget(available, rewards);
  const shown = Math.round(fill * SLOTS);
  const todayShown = Math.min(shown, Math.round((today / Math.max(1, available)) * shown));

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 150" className={size === "sm" ? "h-28 w-auto shrink-0" : "h-36 w-auto shrink-0"} role="img" aria-label={`Star jar with ${available} stars`}>
        {/* lid and string */}
        <rect x="30" y="8" width="60" height="14" rx="4" fill="#B8875A" />
        <rect x="34" y="11" width="52" height="3" rx="1.5" fill="#D1A57A" />
        <path d="M26 30 Q60 24 94 30" stroke="#8C6A4A" strokeWidth="2" fill="none" />
        {/* glass */}
        <path d="M34 22 L86 22 L86 30 Q104 36 104 58 L104 128 Q104 142 90 142 L30 142 Q16 142 16 128 L16 58 Q16 36 34 30 Z" fill="#FFFFFF" fillOpacity="0.55" stroke="#C9D3CC" strokeWidth="2.5" />
        <clipPath id="jar-inside">
          <path d="M36 32 L84 32 Q100 38 100 58 L100 128 Q100 138 90 138 L30 138 Q20 138 20 128 L20 58 Q20 38 36 32 Z" />
        </clipPath>
        <g clipPath="url(#jar-inside)">
          {POSITIONS.slice(0, shown).map((p, i) => (
            <Star key={i} {...p} glow={i >= shown - todayShown} />
          ))}
        </g>
        {/* shine */}
        <path d="M26 60 Q24 90 28 120" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" fill="none" />
      </svg>

      <div className="min-w-0">
        {name && <p className="text-sm font-extrabold text-[#24452C]">{name}</p>}
        <p className="text-2xl font-black text-[#B7791F]">
          {available} <span aria-hidden>⭐</span>
        </p>
        {today > 0 && <p className="text-xs font-bold text-[#2F5D3A]">+{today} today ✨</p>}
        <p className="mt-1 text-xs leading-5 text-[#6E5A46]">
          {ready.length > 0 && (
            <>
              Ready for {ready[ready.length - 1].emoji ?? "🎁"} {ready[ready.length - 1].title}!
              <br />
            </>
          )}
          {next
            ? `${next.cost - available} more for ${next.emoji ?? "🎁"} ${next.title}`
            : rewards.length === 0
              ? "Add rewards to spend stars on"
              : "Enough for every reward!"}
        </p>
      </div>
    </div>
  );
}
