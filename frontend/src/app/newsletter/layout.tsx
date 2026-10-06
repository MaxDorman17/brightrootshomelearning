import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Your Bright Roots newsletter choices.",
  // A page people reach from a link we send them: nothing for a search engine to list.
  robots: { index: false, follow: false },
};

export default function Section({ children }: { children: React.ReactNode }) {
  return children;
}
