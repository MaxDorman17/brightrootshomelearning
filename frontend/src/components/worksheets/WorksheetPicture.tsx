"use client";

import { useEffect, useState } from "react";
import Visual from "@/components/worksheets/Visual";
import type { Worksheet } from "@/lib/worksheets";

/**
 * A worksheet's cover: its own picture from /public/worksheet-covers/<slug>.jpg if one has been added,
 * else the sheet's maths drawing on its colour. Checked before showing, so a missing picture never
 * flashes a broken image.
 */
export default function WorksheetPicture({ sheet, className = "" }: { sheet: Worksheet; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    setSrc(null);
    const img = new Image();
    img.onload = () => current && setSrc(img.src);
    img.src = `/worksheet-covers/${sheet.slug}.jpg`;
    return () => {
      current = false;
    };
  }, [sheet.slug]);

  if (!src) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`} style={{ background: `${sheet.color}1F` }}>
        <Visual visual={sheet.cover} color={sheet.color} className="h-full max-h-28 w-auto max-w-full" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={`object-cover ${className}`} draggable={false} />;
}
