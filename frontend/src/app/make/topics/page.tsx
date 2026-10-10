"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { NewBadge } from "@/components/NewEveryMonth";
import { getRole, isAuthenticated } from "@/lib/auth";
import { isNew } from "@/lib/newContent";
import { COMING, PACKS, packCover } from "@/lib/topics";

/** The topic packs as tiles. Each one is everything a grown-up needs to teach a topic at home. */
export default function TopicsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="topics" tint={1}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Ready to teach</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Topic Packs</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Pick a topic to find out all about it, with facts, things to make and quizzes to try."
              : "Everything you need to teach a whole topic at home: background notes for you, key facts, a timeline, words to know, step-by-step lessons, activities, books and places to visit, and quizzes with answers. Put the lessons straight into your planner, or print the lot."}
          </p>
        </PageHero>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PACKS.map((p) => {
            const cover = packCover(p);
            return (
              <Link key={p.slug} href={`/make/topics/${p.slug}`} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden border-b border-brand-line" style={{ background: `${p.color}1A` }}>
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <Emoji e={p.emoji} className="h-1/2 w-1/2 text-7xl" />
                  )}
                  {isNew(p.slug) && <NewBadge className="absolute right-2 top-2" />}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: p.color }}>
                    {p.subject} · ages {p.ages}
                  </p>
                  <h2 className="mt-0.5 font-extrabold text-brand-charcoal group-hover:text-brand-sage">{p.title}</h2>
                  <p className="mt-0.5 text-sm font-bold text-brand-earth/60">{p.summary}</p>
                </div>
              </Link>
            );
          })}
          {COMING.map((c) => (
            <div key={c.title} className="brand-card overflow-hidden opacity-60" aria-disabled>
              <div className="flex aspect-square items-center justify-center border-b border-brand-line bg-brand-cream">
                <Emoji e={c.emoji} className="h-1/2 w-1/2 text-7xl" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">{c.subject}</p>
                <h2 className="mt-0.5 font-extrabold text-brand-charcoal">{c.title}</h2>
                <p className="mt-0.5 text-sm font-bold text-brand-earth/60">Coming soon</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
