/**
 * "New every month": when each comic, Little Roots book, colouring sheet and topic pack was added, so the latest ones get a
 * "New" badge for a month. When you add a new comic, book or colouring sheet, add its slug and the date here.
 * Anything not listed counts as part of the original set and never shows the badge.
 */
const ADDED: Record<string, string> = {
  // e.g. "snow-day-adventure": "2026-11-01",
  romans: "2026-10-10",
  "roman-soldier": "2026-10-10",
  "roman-villa": "2026-10-10",
  "hadrians-wall": "2026-10-10",
  "roman-baths": "2026-10-10",
  "romans-word-search": "2026-10-10",
  "roman-britain-word-search": "2026-10-10",
  "woodland-animals-word-search": "2026-10-09",
  "into-the-forest-word-search": "2026-10-09",
  "farm-animals-word-search": "2026-10-09",
  "down-on-the-farm-word-search": "2026-10-09",
  "sea-creatures-word-search": "2026-10-09",
  "ocean-explorer-word-search": "2026-10-09",
  "dinosaurs-word-search": "2026-10-09",
  "dino-discovery-word-search": "2026-10-09",
  "into-space-word-search": "2026-10-09",
  "space-explorers-word-search": "2026-10-09",
  "in-the-garden-word-search": "2026-10-09",
  "mini-beasts-word-search": "2026-10-09",
  "fruit-and-veg-word-search": "2026-10-09",
  "spring-and-summer-word-search": "2026-10-09",
  "autumn-and-winter-word-search": "2026-10-09",
  "fairy-tale-friends-word-search": "2026-10-09",
  "once-upon-a-time-word-search": "2026-10-09",
  "things-that-go-word-search": "2026-10-09",
  "building-site-word-search": "2026-10-09",
  "emergency-heroes-word-search": "2026-10-09",
};

const NEW_FOR_DAYS = 31;

/** True for a month after the slug's added date. */
export function isNew(slug: string | null | undefined, today = new Date()): boolean {
  const added = slug ? ADDED[slug] : undefined;
  if (!added) return false;
  const days = (today.getTime() - new Date(`${added}T00:00:00`).getTime()) / 86_400_000;
  return days >= 0 && days < NEW_FOR_DAYS;
}

/** The name of next month, for "next one coming in November". */
export function nextMonthName(today = new Date()): string {
  return new Date(today.getFullYear(), today.getMonth() + 1, 1).toLocaleDateString("en-GB", { month: "long" });
}
