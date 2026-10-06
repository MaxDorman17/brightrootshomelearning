"use client";

import { useEffect, useState } from "react";
import { getMomentPhoto } from "@/lib/api";

// Moment photos are behind login, so they're fetched once per page load and kept in memory.
const cache = new Map<number, Promise<string | null>>();

export function loadMomentPhoto(photoId: number): Promise<string | null> {
  if (!cache.has(photoId)) {
    cache.set(
      photoId,
      getMomentPhoto(photoId)
        .then((res) => URL.createObjectURL(res.data as Blob))
        .catch(() => null)
    );
  }
  return cache.get(photoId)!;
}

type Props = {
  photoId: number;
  alt: string;
  className?: string;
  onClick?: () => void;
};

export default function MomentImage({ photoId, alt, className = "", onClick }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMomentPhoto(photoId).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  if (!src) return <div className={`animate-pulse bg-brand-cream ${className}`} aria-label={alt} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      // A photo that opens when clicked is a button for keyboard and screen reader users too.
      {...(onClick
        ? {
            role: "button",
            tabIndex: 0,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            },
          }
        : {})}
      className={`object-cover ${onClick ? "cursor-zoom-in" : ""} ${className}`}
    />
  );
}
