"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { NewBadge } from "@/components/NewEveryMonth";
import { getRole, isAuthenticated } from "@/lib/auth";
import { useColouring } from "@/lib/useColouring";

/** The colouring themes as square tiles, with anything added in the last week along the top.
 * Themes with no sheets yet show as "Coming soon". */
export default function ColouringPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { themes, sheetsIn, newThisWeek, loaded } = useColouring();
  const row = useRef<HTMLDivElement>(null);
  const scrollRow = (direction: number) => row.current?.scrollBy({ left: direction * row.current.clientWidth * 0.8, behavior: "smooth" });
  const themeName = (slug: string) => themes.find((t) => t.slug === slug)?.name ?? "";

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
        <PageHero art="colouring" tint={4}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Ages 3 to 10</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Colouring &amp; word searches</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Pick a theme, choose a picture you like and ask a grown-up to print it for you."
              : "Bright Roots colouring pictures and word searches to print on A4. Pick a theme, open a sheet, then print it from your browser. Each word search has an answer sheet for grown-ups."}
          </p>
        </PageHero>

        {/* Drawn once the uploaded sheets are in, so the newest aren't added in front of the row after it shows. */}
        {loaded && newThisWeek.length > 0 && (
          <section className="mb-8" aria-labelledby="new-this-week">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 id="new-this-week" className="text-xl font-extrabold text-brand-charcoal">
                New this week
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-brand-earth/60">
                  {newThisWeek.length} new sheet{newThisWeek.length === 1 ? "" : "s"}
                </p>
                {newThisWeek.length > 4 && (
                  <span className="hidden gap-1 sm:flex">
                    <button onClick={() => scrollRow(-1)} aria-label="Scroll back" className="h-8 w-8 rounded-full border border-brand-line bg-white font-extrabold text-brand-earth hover:bg-brand-cream">
                      ‹
                    </button>
                    <button onClick={() => scrollRow(1)} aria-label="Scroll for more" className="h-8 w-8 rounded-full border border-brand-line bg-white font-extrabold text-brand-earth hover:bg-brand-cream">
                      ›
                    </button>
                  </span>
                )}
              </div>
            </div>
            <div ref={row} className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
              {newThisWeek.map((s) => (
                <a
                  key={s.key}
                  href={s.pdf}
                  target="_blank"
                  rel="noopener"
                  className="brand-card group w-36 shrink-0 overflow-hidden transition-shadow hover:shadow-md sm:w-40"
                >
                  <div className="relative border-b border-brand-line bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.picture}
                      alt={`${s.title} ${s.kind === "word-search" ? "word search" : "colouring sheet"}`}
                      loading="lazy"
                      className="aspect-[210/297] w-full object-contain"
                    />
                    <NewBadge className="absolute right-1.5 top-1.5" />
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-sm font-extrabold leading-snug text-brand-charcoal group-hover:text-brand-sage">{s.title}</h3>
                    <p className="mt-0.5 text-xs font-bold text-brand-earth/60">
                      {themeName(s.theme)}
                      {s.kind === "word-search" ? " · Word search" : ""}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {themes.map((t) => {
            const sheets = sheetsIn(t.slug);
            const count = sheets.length;
            const searches = sheets.filter((s) => s.kind === "word-search").length;
            const pictures = count - searches;
            const cover = t.cover;
            const tile = (
              <>
                <div className="relative aspect-square overflow-hidden border-b border-brand-line bg-white">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-cream text-4xl">🖍️</div>
                  )}
                </div>
                <div className="p-3">
                  <h2 className="font-extrabold text-brand-charcoal group-hover:text-brand-sage">{t.name}</h2>
                  <p className="mt-0.5 text-sm font-bold text-brand-earth/60">
                    {count
                      ? [pictures && `${pictures} sheet${pictures === 1 ? "" : "s"}`, searches && `${searches} word search${searches === 1 ? "" : "es"}`]
                          .filter(Boolean)
                          .join(" · ")
                      : "Coming soon"}
                  </p>
                </div>
              </>
            );
            return count ? (
              <Link key={t.slug} href={`/make/colouring/${t.slug}`} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
                {tile}
              </Link>
            ) : (
              <div key={t.slug} className="brand-card overflow-hidden opacity-60" aria-disabled>
                {tile}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
