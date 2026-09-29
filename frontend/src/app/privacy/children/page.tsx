import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";
import ChildPrivacyCards from "@/components/ChildPrivacyCards";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your privacy: a guide for children",
  description: "A simple guide for children about what Bright Roots knows about them and how it keeps it safe.",
};


export default function ChildPrivacyPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">For children</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Your privacy on Bright Roots</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6E5A46]">
          This page tells you what Bright Roots knows about you, and how we keep it safe. If you&apos;re little, ask a
          grown-up to read it with you.
        </p>

        <div className="mt-10">
          <ChildPrivacyCards />
        </div>

        <div className="mt-10 rounded-3xl bg-[#E3E7D9] p-6 text-[#4A3B2C]">
          <p className="font-bold">For grown-ups</p>
          <p className="mt-1 text-sm leading-6">
            This is a simplified version of our <Link href="/privacy" className="font-semibold underline">privacy policy</Link>.
            You can download or delete your family&apos;s information from the Account page, or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
