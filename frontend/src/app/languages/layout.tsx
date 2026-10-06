import type { Metadata } from "next";

// A private part of the site, for families who are logged in. It is drawn fresh for each visit,
// so "today" is always today, and search engines are asked to leave it out.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PrivateSection({ children }: { children: React.ReactNode }) {
  return children;
}
