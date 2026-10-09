"use client";

import { useEffect, useState } from "react";
import { getChildren } from "@/lib/api";
import ReadingComfort from "@/components/ReadingComfort";

type Kid = { id: number; username: string };

/**
 * A grown-up's reading settings with a "Who is this for?" picker, so each child (and the grown-up) gets
 * their own text size, font, Calm mode and One thing at a time. Changing one child leaves the others alone.
 */
export default function ReadingComfortPicker() {
  const [kids, setKids] = useState<Kid[]>([]);
  // A child's id, or "me" for the grown-up's own screens.
  const [who, setWho] = useState<number | "me">("me");

  useEffect(() => {
    getChildren()
      .then((res) => {
        const list: Kid[] = res.data;
        setKids(list);
        if (list.length) setWho(list[0].id);
      })
      .catch(() => {});
  }, []);

  const kid = kids.find((k) => k.id === who);
  const chip = (on: boolean) =>
    "rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors " +
    (on ? "border-brand-softsage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]");

  return (
    <div>
      {kids.length > 0 && (
        <>
          <p className="text-sm font-bold text-brand-charcoal">Who is this for?</p>
          <div className="mb-4 mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Who these settings are for">
            {kids.map((k) => (
              <button key={k.id} type="button" role="radio" aria-checked={who === k.id} onClick={() => setWho(k.id)} className={chip(who === k.id)}>
                {k.username}
              </button>
            ))}
            <button type="button" role="radio" aria-checked={who === "me"} onClick={() => setWho("me")} className={chip(who === "me")}>
              Me
            </button>
          </div>
          <p className="mb-4 text-xs text-[#6E5A46]">
            {kid ? `These settings only change ${kid.username}'s screens. Your other children keep their own.` : "These settings only change your own screens."}
          </p>
        </>
      )}
      {kid ? <ReadingComfort key={kid.id} childId={kid.id} childName={kid.username} /> : <ReadingComfort key="me" showFocus={false} />}
    </div>
  );
}
