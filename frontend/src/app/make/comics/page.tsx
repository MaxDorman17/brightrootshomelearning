"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ComicPicture from "@/components/comics/ComicPicture";
import { COMICS } from "@/lib/comics";
import { isAuthenticated } from "@/lib/auth";
import { comic as comicFont } from "@/lib/fonts";

/** Saplings comics: ten heroes, each with a short comic that teaches one thing. */
export default function ComicsPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="comics" tint={3}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Saplings · ages 5 to 10</p>
          <h1 className={`${comicFont.className} mt-1 text-4xl tracking-wide text-brand-charcoal sm:text-5xl`}>Comics</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            Meet ten heroes who make learning fun. Read a comic together, then try the quick quiz and something to do at home.
          </p>
        </PageHero>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COMICS.map((c) => (
            <Link
              key={c.slug}
              href={`/make/comics/${c.slug}`}
              className="group overflow-hidden rounded-2xl border-[3px] border-brand-charcoal bg-white shadow-[4px_4px_0_0_#2E342F] transition hover:-translate-y-0.5"
            >
              <div className="px-3 py-1.5 text-white" style={{ background: c.color }}>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">{c.subject}</p>
              </div>
              <ComicPicture comic={c} className="aspect-[4/5] w-full" />
              <div className="border-t-[3px] border-brand-charcoal p-3">
                <p className={`${comicFont.className} text-xl leading-tight tracking-wide`} style={{ color: c.color }}>
                  {c.hero.name}
                </p>
                <p className="mt-0.5 text-sm font-bold text-brand-charcoal">{c.title}</p>
                <p className="mt-1 text-xs text-brand-earth/70">{c.topic}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
