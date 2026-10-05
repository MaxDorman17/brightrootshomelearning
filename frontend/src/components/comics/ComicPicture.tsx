"use client";

import { useEffect, useState } from "react";
import Emoji from "@/components/Emoji";
import type { Comic } from "@/lib/comics";

/**
 * A comic picture: the panel's own picture if it's been added, else the hero's portrait,
 * else the hero's emoji on their colour. Pass panel to show a panel, or leave it out for the cover.
 * Pictures are checked before showing, so a missing one never flashes a broken image.
 */
export default function ComicPicture({ comic, panel, className = "" }: { comic: Comic; panel?: number; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    setSrc(null);
    const tries = [...(panel ? [`/comics/${comic.slug}/${panel}.jpg`] : []), `/comics/heroes/${comic.slug}.jpg`];
    const attempt = (i: number) => {
      if (i >= tries.length) return;
      const img = new Image();
      img.onload = () => current && setSrc(tries[i]);
      img.onerror = () => current && attempt(i + 1);
      img.src = tries[i];
    };
    attempt(0);
    return () => {
      current = false;
    };
  }, [comic.slug, panel]);

  if (!src) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ background: `${comic.color}22` }}>
        <Emoji e={comic.emoji} className="h-1/2 w-1/2 max-h-28 max-w-28" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      // Hero portraits are tall, full-body pictures, so show all of them; panel pictures fill their frame.
      className={`${src.includes("/heroes/") ? "bg-[#FAF6EC] object-contain p-2" : "object-cover"} ${className}`}
      draggable={false}
    />
  );
}
