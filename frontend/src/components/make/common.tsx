"use client";

import { useEffect, useState } from "react";
import { getMakePhoto, MakeKind, MakeMaterial, MakeStep } from "@/lib/api";
import { EmojiText } from "@/components/Emoji";

export type MakeSummary = {
  id: number;
  kind: MakeKind;
  title: string;
  emoji: string | null;
  summary: string | null;
  category: string | null;
  minutes: number | null;
  difficulty: string | null;
  age_from: number | null;
  serves: string | null;
  has_photo: boolean;
  slug?: string | null;
  is_own: boolean;
  wished_by: string[];
  material_count?: number;
};

export type MakeDetail = MakeSummary & { materials: MakeMaterial[]; steps: MakeStep[]; tips: string | null };

export const KIND_INFO: Record<MakeKind, { name: string; one: string; path: string; materials: string; subject: string; tint: string }> = {
  recipe: { name: "Cookbook", one: "recipe", path: "/make/cookbook", materials: "Ingredients", subject: "Cooking", tint: "bg-amber-50" },
  craft: { name: "Craft Corner", one: "craft", path: "/make/crafts", materials: "You'll need", subject: "Art", tint: "bg-sky-50" },
  pe: { name: "P.E.", one: "activity", path: "/make/pe", materials: "You'll need", subject: "PE", tint: "bg-emerald-50" },
  outdoor: { name: "Outdoors", one: "activity", path: "/make/outdoors", materials: "You'll need", subject: "Outdoor Learning", tint: "bg-lime-50" },
  life: { name: "Life skills", one: "life skill", path: "/make/life-skills", materials: "You'll need", subject: "Life Skills", tint: "bg-orange-50" },
};

/** Cookbook, Craft Corner and Life skills sit together; P.E. and Outdoors are the "Active" pair. */
export const KIND_FAMILY: Record<MakeKind, MakeKind[]> = {
  recipe: ["recipe", "craft", "life"],
  craft: ["recipe", "craft", "life"],
  pe: ["pe", "outdoor"],
  outdoor: ["pe", "outdoor"],
  life: ["recipe", "craft", "life"],
};

export type AgeBand = "little" | "junior" | "teen";

export const AGE_BANDS: { id: AgeBand; label: string }[] = [
  { id: "little", label: "Little ones (3–6)" },
  { id: "junior", label: "Juniors (7–10)" },
  { id: "teen", label: "Teens (11–16)" },
];

/** Whether a recipe or craft suits an age band, going by its "from age". */
export function inAgeBand(item: { age_from: number | null }, band: AgeBand | ""): boolean {
  if (!band) return true;
  const age = item.age_from ?? 3;
  if (band === "little") return age <= 6;
  if (band === "junior") return age >= 4 && age <= 10;
  return age >= 10;
}

/**
 * Who a page is for. The Make and Active menus show the younger activities; the Teens menu shows the
 * 11 to 16 ones. Things marked "from age 10" suit both, so they appear in each.
 */
export type Audience = "young" | "teen";

export function inAudience(item: { age_from: number | null; is_own?: boolean }, audience: Audience): boolean {
  // A family's own activity with no age set could be for anyone, so it shows in both.
  if (item.age_from == null) return audience === "young" || !!item.is_own;
  return audience === "teen" ? item.age_from >= 10 : item.age_from <= 10;
}

/** The Teens menu: the same four kinds of activity, at their own addresses. */
export const TEEN_TABS: { kind: MakeKind; label: string; name: string; path: string }[] = [
  { kind: "recipe", label: "🍳 Cooking", name: "Teen cooking", path: "/teens/cooking" },
  { kind: "craft", label: "🎨 Projects", name: "Teen projects", path: "/teens/projects" },
  { kind: "pe", label: "🏃 P.E.", name: "Teen P.E.", path: "/teens/pe" },
  { kind: "outdoor", label: "🌳 Outdoors", name: "Teen outdoors", path: "/teens/outdoors" },
  { kind: "life", label: "🧺 Life skills", name: "Life skills", path: "/teens/life-skills" },
];

/** Where an activity's list lives: the teen page for 11+ activities, otherwise the usual one. */
export function listPathFor(item: { kind: MakeKind; age_from: number | null }): string {
  if ((item.age_from ?? 0) >= 11) return TEEN_TABS.find((t) => t.kind === item.kind)!.path;
  return KIND_INFO[item.kind].path;
}

export const DIFFICULTY_LABEL: Record<string, string> = { easy: "Easy", medium: "A bit trickier", tricky: "Tricky" };

// Photos are behind login, so they're fetched once and kept for the page's lifetime.
const cache = new Map<number, Promise<string | null>>();

export function MakePhoto({ item, className = "", big = false }: { item: MakeSummary; className?: string; big?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);
  const [stockFailed, setStockFailed] = useState(false);

  useEffect(() => {
    if (!item.has_photo) {
      setSrc(null);
      return;
    }
    let cancelled = false;
    if (!cache.has(item.id)) {
      cache.set(
        item.id,
        getMakePhoto(item.id)
          .then((res) => URL.createObjectURL(res.data as Blob))
          .catch(() => null)
      );
    }
    cache.get(item.id)!.then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [item.id, item.has_photo]);

  // A family's own uploaded photo wins; starter recipes and crafts have a stock photo.
  const shown = src || (!item.has_photo && item.slug && !stockFailed ? `/make-photos/${item.slug}.jpg` : null);
  if (shown) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={shown}
        alt={item.title}
        loading="lazy"
        onError={() => setStockFailed(true)}
        // The P.E. illustrations are whole scenes, so show all of each one rather than cropping heads off.
        className={`${!src && (item.kind === "pe" || item.kind === "outdoor" || item.kind === "life") ? "bg-[#FAF6EC] object-contain" : "object-cover"} ${className}`}
      />
    );
  }
  return (
    <div className={`flex items-center justify-center ${KIND_INFO[item.kind].tint} ${className}`} aria-hidden>
      <span className={big ? "text-7xl sm:text-8xl" : "text-5xl"}>{item.emoji || ({ recipe: "🍽️", craft: "✂️", pe: "🏃", outdoor: "🌳", life: "🧺" } as const)[item.kind]}</span>
    </div>
  );
}

/** Drop the cached photo after it changes. */
export function forgetMakePhoto(id: number) {
  cache.delete(id);
}

export function MetaChips({ item }: { item: MakeSummary }) {
  const servesIcon = item.kind === "pe" || item.kind === "outdoor" ? "🧒" : "🍽️";
  const chips = [
    item.minutes ? `⏱️ ${item.minutes} min` : null,
    item.difficulty ? `💪 ${DIFFICULTY_LABEL[item.difficulty] || item.difficulty}` : null,
    item.age_from ? `🧒 Ages ${item.age_from}+` : null,
    item.serves ? `${servesIcon} ${item.serves}` : null,
  ].filter(Boolean) as string[];
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span key={c} className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-bold text-brand-earth">
          <EmojiText text={c} />
        </span>
      ))}
    </div>
  );
}

export function errorText(err: unknown, fallback: string) {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}
