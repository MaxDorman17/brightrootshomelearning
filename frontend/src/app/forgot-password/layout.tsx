import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot your password",
  description: "Get a link to choose a new Bright Roots password.",
  // A page people reach from a link we send them: nothing for a search engine to list.
  robots: { index: false, follow: false },
};

export default function Section({ children }: { children: React.ReactNode }) {
  return children;
}
