"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { STORE_OPEN, useStoreVisible } from "@/lib/store";

const SHELVES: { emoji: string; title: string; what: string }[] = [
  { emoji: "📖", title: "Workbooks", what: "Printed maths, English and topic workbooks to go with the planner." },
  { emoji: "🍳", title: "Cookbooks", what: "The Bright Roots family cookbook, with recipes children can really make." },
  { emoji: "🧺", title: "Life skills book", what: "Everyday skills, from tying laces to cooking a meal, step by step." },
  { emoji: "✍", title: "Stationery", what: "Planners, reading logs, star charts and nature journals." },
];

/** The Bright Roots Store. Hidden from everyone but the site owner until STORE_OPEN is true. */
export default function StorePage() {
  const router = useRouter();
  const visible = useStoreVisible();
  useEffect(() => {
    if (visible === false) router.replace("/");
  }, [visible, router]);
  if (!visible) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {!STORE_OPEN && (
          <p className="mb-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            <Emoji e="🔒" /> Only you can see the Store while it&apos;s being set up. Families don&apos;t see the button or this page yet.
          </p>
        )}
        <PageHero art="shopping" tint={1}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Bright Roots</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Store</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            Workbooks, cookbooks and stationery made for home learning, by the people who make Bright Roots.
          </p>
        </PageHero>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SHELVES.map((s) => (
            <section key={s.title} className="brand-card flex items-start gap-4 p-5">
              <Emoji e={s.emoji} className="h-14 w-14 shrink-0" />
              <div>
                <h2 className="text-lg font-extrabold text-brand-charcoal">{s.title}</h2>
                <p className="mt-1 text-sm text-brand-earth">{s.what}</p>
                <p className="mt-2 inline-block rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-extrabold text-brand-sage">Coming soon</p>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
