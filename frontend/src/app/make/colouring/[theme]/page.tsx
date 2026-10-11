"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { NewBadge } from "@/components/NewEveryMonth";
import { getRole, isAuthenticated } from "@/lib/auth";
import { KIND_LABEL, LEVEL_LABEL, THEMES, type SheetKind } from "@/lib/colouring";
import { useColouring } from "@/lib/useColouring";

/** One colouring theme's sheets and word searches: pick one, open the A4 PDF and print it. Grown-ups also get the answers. */
export default function ColouringThemePage() {
  const router = useRouter();
  const { theme: slug } = useParams<{ theme: string }>();
  const { themes, sheetsIn, loaded } = useColouring();
  const theme = themes.find((t) => t.slug === slug);
  const sheets = sheetsIn(slug);
  // A theme made on /admin/colouring is only known once the uploaded sheets have loaded.
  const waiting = !theme && !loaded && !THEMES.some((t) => t.slug === slug);
  const [role, setRole] = useState<string | null>(null);
  const [kind, setKind] = useState<SheetKind | "">("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  // Colouring / Word searches buttons only once a theme has both.
  const kinds = (Object.keys(KIND_LABEL) as SheetKind[]).filter((k) => sheets.some((s) => s.kind === k));
  const shown = sheets.filter((s) => !kind || s.kind === kind);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/make/colouring" className="mb-4 inline-block text-sm font-bold text-brand-sage hover:underline">
          ← All colouring themes
        </Link>
        <PageHero art="colouring" tint={4}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">{kinds.length > 1 ? "Colouring & word searches" : "Colouring sheets"}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{theme?.name || (waiting ? "Loading..." : "Theme not found")}</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child" ? "Choose a picture you like and ask a grown-up to print it for you." : "Open a sheet, then print it on A4 from your browser."}
          </p>
        </PageHero>

        {kinds.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {(["", ...kinds] as const).map((k) => (
              <button
                key={k || "all"}
                onClick={() => setKind(k)}
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

        {waiting ? null : !theme || shown.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-brand-line p-8 text-center text-sm text-brand-earth/70">
            {theme ? "No sheets here yet. They're coming soon!" : "We couldn't find that theme."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((s) => {
              const isSearch = s.kind === "word-search";
              return (
                <div key={s.key} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
                  <a href={s.pdf} target="_blank" rel="noopener" className="block">
                    <div className="relative border-b border-brand-line bg-white p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.picture}
                        alt={`${s.title} ${isSearch ? "word search" : "colouring sheet"}`}
                        loading="lazy"
                        className="aspect-[210/297] w-full object-contain"
                      />
                      {s.isNew && <NewBadge className="absolute right-2 top-2" />}
                    </div>
                    <div className="px-3 pt-3">
                      {kinds.length > 1 && (
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">
                          {isSearch ? `Word search${s.level ? ` · ${LEVEL_LABEL[s.level]}` : ""}` : "Colouring"}
                        </p>
                      )}
                      <h2 className="mt-0.5 font-extrabold text-brand-charcoal group-hover:text-brand-sage">{s.title}</h2>
                      <p className="mt-1 text-sm font-bold text-brand-sage">🖨️ Open to print</p>
                    </div>
                  </a>
                  {/* Answers are for grown-ups, so children don't see the link. */}
                  {s.answers && role && role !== "child" ? (
                    <a href={s.answers} target="_blank" rel="noopener" className="mx-3 mb-3 mt-1 inline-block text-sm font-bold text-brand-earth/70 hover:text-brand-sage hover:underline">
                      🔑 Answers
                    </a>
                  ) : (
                    <div className="pb-3" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
