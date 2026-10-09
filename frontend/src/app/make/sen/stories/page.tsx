"use client";

import { useState } from "react";
import { PrintButton, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import Emoji from "@/components/Emoji";
import { STORIES } from "@/lib/sen";

/** Short social stories: pick one, read it a page at a time, or print it as a little book. */
export default function StoriesPage() {
  useSenRole();
  const [slug, setSlug] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const story = STORIES.find((s) => s.slug === slug);

  const open = (s: string) => {
    setSlug(s);
    setPage(0);
  };

  return (
    <SenFrame
      printable={
        story && (
          <div className="p-6">
            <PrintTitle title={story.title} />
            <div className="grid grid-cols-2 gap-4">
              {story.pages.map((p, i) => (
                <div
                  key={i}
                  className="flex break-inside-avoid flex-col items-center justify-center rounded-xl border-[3px] border-black p-4 text-center"
                  style={{ minHeight: "8cm" }}
                >
                  <Emoji e={p.emoji} className="h-20 w-20 text-6xl" />
                  <p className="mt-3 text-xl font-bold leading-snug">{p.label}</p>
                  <p className="mt-2 text-xs">{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }
    >
      <SenPage
        title="Social stories"
        intro="Calm, simple stories that explain something new or tricky before it happens. Read one together a few times in the days before."
      >
        <div className="flex flex-wrap gap-2">
          {STORIES.map((s) => (
            <button
              key={s.slug}
              onClick={() => open(s.slug)}
              className={
                "rounded-xl px-4 py-2 text-sm font-extrabold " +
                (slug === s.slug ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
              }
            >
              <Emoji e={s.emoji} /> {s.title}
            </button>
          ))}
        </div>

        {story ? (
          <div className="brand-card mx-auto mt-6 max-w-xl p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">
              {story.title} · {page + 1} of {story.pages.length}
            </p>
            <div key={page} className="storybook-page storybook-next mt-4">
              <Emoji e={story.pages[page].emoji} className="h-28 w-28 text-8xl" />
              <p className="mt-4 text-2xl font-bold leading-snug text-brand-charcoal">{story.pages[page].label}</p>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage disabled:opacity-40"
              >
                ← Back
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === story.pages.length - 1}
                className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-extrabold text-white disabled:opacity-40"
              >
                Next →
              </button>
              <PrintButton label="🖨️ Print story" />
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-line p-8 text-center text-sm text-brand-earth/70">
            Pick a story above to start reading.
          </div>
        )}
      </SenPage>
    </SenFrame>
  );
}
