import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Bright Roots Home Learning to plan your week and see how your children are getting on.",
};

export default function Section({ children }: { children: React.ReactNode }) {
  return children;
}
