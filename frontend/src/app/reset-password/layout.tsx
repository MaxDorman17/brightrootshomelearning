import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Choose a new Bright Roots password.",
  // A page people reach from a link we send them: nothing for a search engine to list.
  robots: { index: false, follow: false },
};

export default function Section({ children }: { children: React.ReactNode }) {
  return children;
}
