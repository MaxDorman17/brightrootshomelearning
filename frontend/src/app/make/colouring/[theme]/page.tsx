"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { NewBadge } from "@/components/NewEveryMonth";
import { getRole, isAuthenticated } from "@/lib/auth";
import { isNew } from "@/lib/newContent";
import { KIND_LABEL, kindOf, sheetPdf, sheetPicture, sheetsIn, THEMES, type SheetKind } from "@/lib/colouring";

/** One colouring theme's sheets: pick one, open the A4 PDF and print it. */
export default function ColouringThemePage() {
  const router = useRouter();
  const { theme: slug } = useParams<{ theme: string }>();
  const theme = THEMES.find((t) => t.slug === slug);
  const sheets = sheetsIn(slug);
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
  const kinds = (Object.keys(KIND_LABEL) as SheetKind[]).filter((k) => sheets.some((s) => kindOf(s) === k));
  const shown = sheets.filter((s) => !kind || kindOf(s) === kind);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/make/colouring" className="mb-4 inline-block text-sm font-bold text-brand-sage hover:underline">
          ← All colouring themes
        </Link>
        <PageHero art="colouring" tint={4}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Colouring sheets</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{theme?.name || "Theme not found"}</h1>
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

        {!theme || shown.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-brand-line p-8 text-center text-sm text-brand-earth/70">
            {theme ? "No sheets here yet. They're coming soon!" : "We couldn't find that theme."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((s) => (
              <a key={s.slug} href={sheetPdf(s)} target="_blank" rel="noopener" className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative border-b border-brand-line bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sheetPicture(s)}
                    alt={`${s.title} ${kindOf(s) === "word-search" ? "word search" : "colouring sheet"}`}
                    loading="lazy"
                    className="aspect-[210/297] w-full object-contain"
                  />
                  {isNew(s.slug) && <NewBadge className="absolute right-2 top-2" />}
                </div>
                <div className="p-3">
                  {kinds.length > 1 && (
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">{kindOf(s) === "word-search" ? "Word search" : "Colouring"}</p>
                  )}
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
