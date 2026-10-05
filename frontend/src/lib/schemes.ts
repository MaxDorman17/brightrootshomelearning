// The scheme or website a lesson comes from. Bright Roots only ever keeps the name and the link,
// never the scheme's own material.
export const OAK_SCHEME = "Oak National Academy";

// Offered as suggestions; parents can type any other name.
export const SCHEME_OPTIONS = [
  OAK_SCHEME,
  "White Rose Maths",
  "Twinkl",
  "BBC Bitesize",
  "CGP",
  "Khan Academy",
  "Our own",
];

const OAK_HOST_RE = /^https?:\/\/(?:[a-z0-9-]+\.)*thenational\.academy(?:[/?#]|$)/i;

/** The scheme to show for a lesson or unit: the one the parent chose, or Oak when the link is an Oak one. */
export function schemeOf(scheme?: string | null, url?: string | null): string | null {
  const chosen = scheme?.trim();
  if (chosen) return chosen;
  return url && OAK_HOST_RE.test(url) ? OAK_SCHEME : null;
}
