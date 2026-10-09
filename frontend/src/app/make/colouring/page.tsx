"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { NewBadge } from "@/components/NewEveryMonth";
import { getRole, isAuthenticated } from "@/lib/auth";
import { isNew } from "@/lib/newContent";
import { COLOURING_SHEETS, KIND_LABEL, kindOf, sheetPdf, sheetPicture, THEMES, type SheetKind } from "@/lib/colouring";

// Only the kinds and themes that have sheets yet get a button.
const KINDS = (Object.keys(KIND_LABEL) as SheetKind[]).filter((k) => COLOURING_SHEETS.some((s) => kindOf(s) === k));
const hasWordSearches = KINDS.includes("word-search");

/** Printable colouring sheets and word searches: pick one, open the A4 PDF and print it. Newest first. */
export default function ColouringPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [kind, setKind] = useState<SheetKind | "">("");
  const [theme, setTheme] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  const q = search.trim().toLowerCase();
  const ofKind = COLOURING_SHEETS.filter((s) => !kind || kindOf(s) === kind);
  const themes = THEMES.filter((t) => ofKind.some((s) => s.theme === t));
  const shown = [...ofKind]
    .reverse()
    .filter((s) => (!theme || s.theme === theme) && (!q || `${s.title} ${s.theme}`.toLowerCase().includes(q)));

  const chip = (active: boolean) =>
    "rounded-full border px-3 py-1.5 text-sm font-bold transition-colors " +
    (active ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-brand-earth hover:border-brand-softsage");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="colouring" tint={4}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Ages 3 to 10</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{hasWordSearches ? "Colouring & word searches" : "Colouring sheets"}</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Pick a picture you like and ask a grown-up to print it for you."
              : `Bright Roots colouring pictures${hasWordSearches ? " and word searches" : ""} to print on A4. Open one, then print it from your browser. New ones are added all the time.`}
          </p>
        </PageHero>

        <div className="space-y-3">
          {COLOURING_SHEETS.length > 9 && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search, e.g. seaside"
              className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-softsage sm:max-w-md"
            />
          )}
          {KINDS.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {(["", ...KINDS] as const).map((k) => (
                <button
                  key={k || "all"}
                  onClick={() => {
                    setKind(k);
                    setTheme("");
                  }}
                  className={
                    "rounded-xl px-4 py-2 text-sm font-extrabold " +
                    (kind === k ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
                  }
                >
                  {k ? KIND_LABEL[k] : "Everything"}
                </button>
              ))}
            </div>
          )}
          {themes.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTheme("")} className={chip(!theme)}>
                All
              </button>
              {themes.map((t) => (
                <button key={t} onClick={() => setTheme(theme === t ? "" : t)} className={chip(theme === t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-brand-line p-8 text-center text-sm text-brand-earth/70">
            Nothing matches that search.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((s) => (
              <a
                key={s.slug}
                href={sheetPdf(s)}
                target="_blank"
                rel="noopener"
                className="brand-card group overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative border-b border-brand-line bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sheetPicture(s)} alt={`${s.title} ${kindOf(s) === "word-search" ? "word search" : "colouring sheet"}`} loading="lazy" className="aspect-[210/297] w-full object-contain" />
                  {isNew(s.slug) && <NewBadge className="absolute right-2 top-2" />}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">
                    {s.theme}
                    {hasWordSearches && ` · ${kindOf(s) === "word-search" ? "Word search" : "Colouring"}`}
                  </p>
                  <h2 className="mt-0.5 font-extrabold text-brand-charcoal group-hover:text-brand-sage">{s.title}</h2>
                  <p className="mt-1 text-sm font-bold text-brand-sage">🖨️ Open to print</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
