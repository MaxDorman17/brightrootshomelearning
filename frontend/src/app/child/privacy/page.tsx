"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ChildPrivacyCards from "@/components/ChildPrivacyCards";
import { getRole, isAuthenticated } from "@/lib/auth";

/** The children's privacy notice, inside the children's area so they stay logged in and in their own menus. */
export default function MyPrivacyPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") router.replace("/privacy/children");
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="account" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Just for you</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">My privacy</h1>
          <p className="mt-2 text-sm text-brand-earth/70">
            What Bright Roots knows about you, and how we keep it safe. If you&apos;re little, ask a grown-up to read it with you.
          </p>
        </PageHero>
        <ChildPrivacyCards />
      </div>
    </div>
  );
}
