/**
 * Bright Roots follows four seasonal terms rather than school terms, so topics can follow
 * what is happening outside. The site works out the current term from today's date.
 */
export type TermSlug = "autumn" | "winter" | "spring" | "summer";
export type Term = { slug: TermSlug; name: string; months: string; startMonth: string; emoji: string };

export const TERMS: Term[] = [
  { slug: "autumn", name: "Autumn Exploration", months: "September to November", startMonth: "September", emoji: "🍂" },
  { slug: "winter", name: "Winter Learning", months: "December to February", startMonth: "December", emoji: "❄️" },
  { slug: "spring", name: "Spring Growth", months: "March to May", startMonth: "March", emoji: "🌱" },
  { slug: "summer", name: "Summer Adventures", months: "June to August", startMonth: "June", emoji: "☀️" },
];

// January is month 0: December to February is Winter, March to May Spring, June to August Summer.
const BY_MONTH: TermSlug[] = ["winter", "winter", "spring", "spring", "spring", "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter"];

export const termBySlug = (slug?: string | null) => TERMS.find((t) => t.slug === slug);
export const termFor = (date: Date): Term => termBySlug(BY_MONTH[date.getMonth()])!;
export const currentTerm = () => termFor(new Date());

/** The four terms starting with `first`, in the order a family meets them. */
export function termsFrom(first: Term): Term[] {
  const i = TERMS.indexOf(first);
  return [...TERMS.slice(i), ...TERMS.slice(0, i)];
}
