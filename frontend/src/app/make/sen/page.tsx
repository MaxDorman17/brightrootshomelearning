"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { useSenRole } from "@/components/SenCards";
import { SEN_TOOLS } from "@/lib/sen";

/** SEN & Signing: visual supports to print, plus where to learn BSL and Makaton. */
export default function SenPage() {
  const role = useSenRole();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="sen" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">For every child</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">SEN & Signing</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Picture cards to help with your day. Pick one and ask a grown-up to print it."
              : "Picture supports that help many children, including those with SEN: timetables, feelings cards, movement breaks and picture stories to print. Plus the best places to learn BSL and Makaton together."}
          </p>
        </PageHero>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SEN_TOOLS.map((t) => (
            <Link key={t.slug} href={`/make/sen/${t.slug}`} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
              <div className="flex aspect-square items-center justify-center border-b border-brand-line bg-brand-cream">
                <Emoji e={t.emoji} className="h-1/2 w-1/2 text-7xl" />
              </div>
              <div className="p-3">
                <h2 className="font-extrabold text-brand-charcoal group-hover:text-brand-sage">{t.name}</h2>
                <p className="mt-0.5 text-sm font-bold text-brand-earth/60">{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        {role !== "child" && (
          <p className="mt-8 max-w-2xl text-xs text-brand-earth/60">
            These are everyday supports for home, not a diagnosis or therapy plan. If your child has an EHCP or works with a speech and language therapist or
            OT, it&apos;s worth showing them what you use so everyone is consistent.
          </p>
        )}
      </div>
    </div>
  );
}
