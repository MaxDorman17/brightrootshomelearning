"use client";

import { useEffect, useState } from "react";
import { Sprig } from "@/components/Decor";
import { serif } from "@/lib/fonts";

/**
 * Each page's own illustration. The page asks for /home/icons/<name>.png; until that exists,
 * the closest picture we already have is shown instead.
 */
const FALLBACK: Record<string, string> = {
  account: "/home/family.png",
  badges: "/home/progress.png",
  membership: "/home/family.png",
  "extra-work": "/home/plan.png",
  games: "/home/children.png",
  progress: "/home/progress.png",
  review: "/home/parents.png",
  report: "/home/books.png",
  results: "/home/progress.png",
  resources: "/home/books.png",
  timer: "/home/plan.png",
  coding: "/home/learn.png",
  shopping: "/home/learn.png",
  moments: "/home/parents.png",
  children: "/home/family.png",
  council: "/home/books.png",
  journal: "/home/learn.png",
  lessons: "/home/learn.png",
  print: "/home/plan.png",
  reminders: "/home/plan.png",
  rewards: "/home/children.png",
  timetable: "/home/plan.png",
  languages: "/home/books.png",
  reading: "/home/learn.png",
  spellings: "/home/books.png",
  oak: "/home/progress.png",
  clubs: "/home/children.png",
  exams: "/home/books.png",
  trips: "/home/icons/moments.png?v=2",
  newsletter: "/home/parents.png",
};

// A soft background per page family, so pages feel related but not identical.
const TINTS = ["#E3E7D9", "#F3EAD7", "#E3EAF0", "#F6E6DF", "#EDE6F3"];

function useArt(name: string) {
  // ?v= changes when pictures are replaced, so Cloudflare serves the new ones.
  const own = `/home/icons/${name}.png?v=2`;
  const [src, setSrc] = useState(FALLBACK[name] || "/home/plan.png");
  useEffect(() => {
    let current = true;
    setSrc(FALLBACK[name] || "/home/plan.png");
    const img = new Image();
    img.onload = () => current && setSrc(own);
    img.src = own;
    return () => {
      current = false;
    };
  }, [own, name]);
  return src;
}

/**
 * The illustrated banner at the top of a page. The page's own eyebrow, title and description
 * go inside as children; titles pick up the serif font from the .page-hero styles.
 */
export default function PageHero({
  art,
  tint = 0,
  className = "",
  children,
}: {
  art: string;
  tint?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const src = useArt(art);
  return (
    <div
      className={`page-hero ${serif.variable} relative mb-6 flex min-w-0 flex-1 items-center gap-5 overflow-hidden rounded-3xl border border-[#E4DCCD] p-5 sm:p-7 print:mb-4 print:border-0 print:bg-transparent print:p-0 ${className}`}
      style={{ background: TINTS[tint % TINTS.length] }}
    >
      <Sprig className="pointer-events-none absolute -left-3 bottom-0 hidden h-20 w-auto opacity-60 md:block print:hidden" />
      <div className="relative min-w-0 flex-1 md:pl-6">{children}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="relative hidden h-24 w-auto shrink-0 object-contain sm:block lg:h-28 print:hidden" />
    </div>
  );
}
