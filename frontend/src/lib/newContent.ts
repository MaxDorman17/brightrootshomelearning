/**
 * "New every month": when each comic, Little Roots book, colouring sheet and topic pack was added, so the latest ones get a
 * "New" badge for a month. When you add a new comic, book or static colouring sheet, add its slug and the date here.
 * Colouring sheets uploaded on /admin/colouring don't need listing: they use the date they were uploaded.
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

/** When this slug was added, or null for the original set. */
export function addedOn(slug: string | null | undefined): Date | null {
  const added = slug ? ADDED[slug] : undefined;
  return added ? new Date(`${added}T00:00:00`) : null;
}

/** True if the date is within the last `days` days (and not in the future). */
export function addedWithin(added: Date | null, days: number, today = new Date()): boolean {
  if (!added || Number.isNaN(added.getTime())) return false;
  const ago = (today.getTime() - added.getTime()) / 86_400_000;
  return ago >= 0 && ago < days;
}

/** True for a month after the slug's added date. */
export function isNew(slug: string | null | undefined, today = new Date()): boolean {
  return addedWithin(addedOn(slug), NEW_FOR_DAYS, today);
}

/** The same "New for a month" rule for something uploaded on the site (an ISO date from the API). */
export function isNewSince(createdAt: string | null | undefined, today = new Date()): boolean {
  return addedWithin(createdAt ? new Date(createdAt) : null, NEW_FOR_DAYS, today);
}

/** The name of next month, for "next one coming in November". */
export function nextMonthName(today = new Date()): string {
  return new Date(today.getFullYear(), today.getMonth() + 1, 1).toLocaleDateString("en-GB", { month: "long" });
}
