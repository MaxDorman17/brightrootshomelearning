"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { useSenRole } from "@/components/SenCards";
import SenToolTiles from "@/components/SenToolTiles";
import { SEN_TOOLS } from "@/lib/sen";
import { SEN_SECTIONS } from "@/lib/senSections";

/** SEN Support: picture supports to use on screen or print. */
export default function SenPage() {
  const role = useSenRole();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="sen" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">For every child</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">SEN Support</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Picture cards to help with your day. Pick one and ask a grown-up to print it."
              : "Picture supports that help many children, including those with SEN: visual timetables, Now & Next, feelings cards, movement breaks, picture stories, communication and choice boards, step-by-step task cards, learning-style cards and sensory activities. Use them on screen or print them. For calmer screens, bigger text, an easy-read font and Calm mode, open Family, then Children, and pick a child's profile."}
          </p>
        </PageHero>

        <h2 className="text-xl font-extrabold text-brand-charcoal">Find support by area</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEN_SECTIONS.map((sec) => (
            <Link
              key={sec.slug}
              href={`/make/sen/${sec.slug}`}
              className="brand-card group flex items-center gap-3 p-4 transition-shadow hover:shadow-md"
            >
              <Emoji e={sec.emoji} className="h-12 w-12 shrink-0 text-4xl" />
              <div>
                <h3 className="font-extrabold text-brand-charcoal group-hover:text-brand-sage">{sec.name}</h3>
                <p className="text-sm font-bold text-brand-earth/60">{sec.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-xl font-extrabold text-brand-charcoal">All picture supports</h2>
        <SenToolTiles tools={SEN_TOOLS} />

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
