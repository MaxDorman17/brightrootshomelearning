"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { getRole, isAuthenticated } from "@/lib/auth";
import { kindOf, sheetsIn, themeCover, THEMES } from "@/lib/colouring";

/** The colouring themes as square tiles. Themes with no sheets yet show as "Coming soon". */
export default function ColouringPage() {
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
        <PageHero art="colouring" tint={4}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Ages 3 to 10</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Colouring &amp; word searches</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Pick a theme, choose a picture you like and ask a grown-up to print it for you."
              : "Bright Roots colouring pictures and word searches to print on A4. Pick a theme, open a sheet, then print it from your browser. Each word search has an answer sheet for grown-ups."}
          </p>
        </PageHero>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {THEMES.map((t) => {
            const sheets = sheetsIn(t.slug);
            const count = sheets.length;
            const searches = sheets.filter((s) => kindOf(s) === "word-search").length;
            const pictures = count - searches;
            const cover = themeCover(t);
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
