"use client";

import { useEffect, useState } from "react";
import { getChildPhoto } from "@/lib/api";
import { AVATAR_BACKGROUNDS, AVATAR_FRAMES, AvatarChoice } from "@/lib/avatar";

// Photos are behind login, so they're fetched once per page load and shown from memory.
const photoCache = new Map<number, Promise<string | null>>();

export function forgetPhoto(childId: number) {
  photoCache.delete(childId);
}

function loadPhoto(childId: number): Promise<string | null> {
  if (!photoCache.has(childId)) {
    photoCache.set(
      childId,
      getChildPhoto(childId)
        .then((res) => URL.createObjectURL(res.data as Blob))
        .catch(() => null)
    );
  }
  return photoCache.get(childId)!;
}

const SIZES = {
  sm: { box: "h-8 w-8", text: "text-base", initial: "text-xs" },
  md: { box: "h-12 w-12", text: "text-2xl", initial: "text-sm" },
  lg: { box: "h-24 w-24", text: "text-5xl", initial: "text-2xl" },
};

type Props = {
  username: string;
  avatar?: AvatarChoice | null;
  hasPhoto?: boolean;
  childId?: number;
  size?: keyof typeof SIZES;
  /** Bumped by the parent page after uploading a new photo, to reload it. */
  photoVersion?: number;
};

export default function Avatar({ username, avatar, hasPhoto, childId, size = "md", photoVersion = 0 }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const s = SIZES[size];

  useEffect(() => {
    let cancelled = false;
    setPhoto(null);
    if (hasPhoto && childId != null) {
      loadPhoto(childId).then((url) => {
        if (!cancelled) setPhoto(url);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [hasPhoto, childId, photoVersion]);

  const frame = avatar ? AVATAR_FRAMES[avatar.frame]?.className ?? "" : "";

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt={username} className={`${s.box} shrink-0 rounded-full object-cover ${frame}`} />
    );
  }

  if (avatar) {
    const bg = AVATAR_BACKGROUNDS[avatar.bg]?.className ?? "bg-sky-200";
    return (
      <span className={`${s.box} ${bg} ${frame} ${s.text} flex shrink-0 items-center justify-center rounded-full`} role="img" aria-label={username}>
        {avatar.emoji}
      </span>
    );
  }

  return (
    <span className={`${s.box} ${s.initial} flex shrink-0 items-center justify-center rounded-full bg-brand-gold font-extrabold text-brand-charcoal`}>
      {username[0]?.toUpperCase()}
    </span>
  );
}
