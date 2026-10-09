/**
 * "New every month": when each comic, Little Roots book and colouring sheet was added, so the latest ones get a
 * "New" badge for a month. When you add a new comic, book or colouring sheet, add its slug and the date here.
 * Anything not listed counts as part of the original set and never shows the badge.
 */
const ADDED: Record<string, string> = {
  // e.g. "snow-day-adventure": "2026-11-01",
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
