"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRole } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { EmojiText } from "@/components/Emoji";

/** The printable charts every family gets in Resources. The files live in public/learning-aids. */
const AIDS: Record<string, { title: string; note: string; landscape: boolean }> = {
  "hundred-square": { title: "Hundred Square", note: "Find patterns, practise counting and discover number facts.", landscape: false },
  "number-line-0-20": { title: "Number Line 0 to 20", note: "Count forwards and backwards, add and take away.", landscape: true },
  "times-tables-1-12": { title: "Times Tables 1 to 12", note: "A grid of every times table up to 12 x 12.", landscape: false },
  "periodic-table": { title: "Periodic Table of Elements", note: "A clear reference chart for young scientists.", landscape: true },
};

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors";

export default function LearningAidPage() {
  const { slug } = useParams<{ slug: string }>();
  const aid = AIDS[slug];
  const [back, setBack] = useState("/parent/resources");
  useEffect(() => {
    if (getRole() === "child") setBack("/child/resources");
  }, []);

  if (!aid) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-lg font-bold text-brand-charcoal">We couldn&apos;t find that chart.</p>
          <Link href={back} className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  // ?v= changes when the charts are replaced, so Cloudflare serves the new ones.
  const src = `/learning-aids/${slug}.svg?v=2`;
  return (
    <div className="min-h-screen">
      {/* Print the chart on its own, filling the page the right way round. */}
      <style>{`@media print { @page { size: A4 ${aid.landscape ? "landscape" : "portrait"}; margin: 8mm; } }`}</style>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 print:max-w-none print:p-0">
        <div className="print:hidden">
          <Link href={back} className="text-sm font-bold text-brand-sage hover:underline">
            ← Resources
          </Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Learning aid</p>
              <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal">{aid.title}</h1>
              <p className="mt-1 text-sm text-brand-earth/80">{aid.note}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => window.print()} className={`${btn} bg-brand-sage text-white hover:bg-brand-sagedark`}>
                <EmojiText text="🖨️ Print" />
              </button>
              <a href={src} download={`bright-roots-${slug}.svg`} className={`${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`}>
                Download
              </a>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={aid.title}
          className={`mt-5 w-full rounded-3xl border border-brand-line bg-white print:mt-0 print:rounded-none print:border-0 print:object-contain ${aid.landscape ? "print:max-h-[190mm]" : "print:max-h-[275mm]"}`}
        />
      </div>
    </div>
  );
}
